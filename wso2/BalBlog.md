# Hacking the Ballerina-Go Interpreter: A Contributor's Guide

So, you want to contribute to `ballerina-lang-go` — maybe add a new stdlib module like TCP, or extend the existing HTTP client? This guide is for you. It won't explain what an AST is. Instead, it will show you exactly how this codebase is wired together, the architectural rules you must follow, and the fastest path to getting a PR merged.

---

## 1. Start Here: The Mental Model

The codebase has two distinct halves, and understanding which half you're working in changes everything:

1. **The Compiler Pipeline** (Stages 1–10): Takes `.bal` source → produces BIR (Ballerina Internal Representation). This is the `parser/`, `ast/`, `semantics/`, `desugar/`, and `bir/` packages, orchestrated by `projects/module_context.go`.
2. **The Runtime** (Stage 11): Takes BIR → executes it. This is the `runtime/` package.

**If you're doing stdlib work (HTTP, TCP, IO), you straddle both halves.** You define compile-time type signatures in `lib/<module>/compile/` and implement the actual Go logic in `lib/<module>/runtime/`. Your functions are bridged to BIR via the extern function registry.

### The Pipeline Stages at a Glance

```
Source (.bal) 
  → [1] Syntax Tree (parser/)
  → [2] AST (ast/)
  → [3] Symbol Resolution (semantics/)     ─┐
  → [4] Top-Level Type Resolution           ─┤ Sequential, topologically sorted
                                              │ across modules. HALT if errors.
  → [5] Local Type Resolution               ─┤
  → [6] Semantic Analysis                    │ Concurrent per module.
  → [7] CFG Generation                      │ No cross-module deps.
  → [8] CFG Analysis (reachability, returns) │
  → [9] Desugar AST (desugar/)              │
  → [10] Generate BIR (bir/)               ─┘ If ANY errors → skip Stage 11.
  → [11] Interpret BIR (runtime/)
```

**Key rule:** Stages 1–4 are sequential and topologically sorted across modules (a module's symbol resolution depends on its dependencies). If any module errors in Stages 1–4, **nothing** proceeds to Stage 5. Stages 5–10 run **concurrently per module** with zero cross-module dependencies. Stage 11 is skipped entirely if any errors exist.

---

## 2. The Stdlib Architecture: The Part You Actually Need

If you want to build or extend a stdlib module (like HTTP, or a new TCP module), here's the layered architecture you'll work with. The existing `io` and `http` modules are your reference implementations.

### Layer 1: The PAL (Platform Adaptation Layer)

**Every platform interaction (IO, HTTP, filesystem) MUST go through PAL.** This is the most important architectural rule for stdlib contributors. You never call `os.Stdout`, `net/http`, or `net.Dial` directly from your library code.

PAL is defined as an interface in `platform/pal/platform.go`:

```go
type Platform struct {
    IO   IO        // Stdout, Stderr
    FS   FS        // ReadFile
    HTTP HTTP      // NewClient
}
```

The native CLI implementation lives in `platform/palnative/`. If you're adding TCP support, you'd:
1. Add a `TCP` field to `pal.Platform` (e.g., `TCP TCP` with a `Dial` or `Listen` function).
2. Implement it in `palnative/` using Go's `net` package.
3. Your stdlib runtime code calls `ctx.Env.Platform.TCP.Dial(...)`, never `net.Dial(...)` directly.

This indirection exists so the interpreter can run on different platforms (native CLI, web editor/WASM) by swapping the PAL implementation.

### Layer 2: Compile-Time Type Definitions (`lib/<module>/compile/`)

This is where you tell the **compiler** about your module's types and function signatures. The compiler needs to type-check Ballerina code that imports your module, but it doesn't know how to execute your functions — it just needs the shapes.

Look at `lib/io/compile/io.go` as the simplest example:

```go
func GetIoSymbols(ctx *context.CompilerContext) model.ExportedSymbolSpace {
    pkg := model.NewPackageID(...)
    space := ctx.NewSymbolSpace(*pkg)
    
    // Define println: function(any...) returns ()
    printLnSignature := model.FunctionSignature{
        RestParamType: semtypes.VAL,
        ReturnType:    semtypes.NIL,
        Flags:         model.FuncSymbolFlagIsolated,
    }
    printLnSymbol := model.NewFunctionSymbol("println", printLnSignature, true)
    space.AddSymbol("println", printLnSymbol)
    // ...set the semtype on the symbol ref...
    return model.NewExportedSymbolSpace(space, nil)
}
```

For HTTP, `lib/http/compile/http.go` is significantly more complex — it defines record types (`ClientConfiguration`, `CertKey`, `SecureSocket`), class types (`Client`, `Response`), and function signatures (`get`, `post`, `parseHeader`). This is where the compile-time model of the Ballerina API surface is built.

**Key pattern:** You create `model.FunctionSignature` structs using `semtypes` for parameter/return types, wrap them in `model.FunctionSymbol`, and add them to a `model.SymbolSpace`. The compiler uses these during symbol resolution (Stage 3) and type checking (Stages 4-5).

### Layer 3: Runtime Implementation (`lib/<module>/runtime/`)

This is where you implement the actual Go logic behind the extern functions. Every extern function has this signature:

```go
type NativeFunc func(ctx *extern.Context, args []values.BalValue) (values.BalValue, error)
```

You receive Ballerina values (`values.BalValue` — which can be `string`, `int64`, `*values.Map`, `*values.List`, `*values.Object`, etc.), do your work, and return a Ballerina value.

The registration follows a consistent pattern using Go's `init()`:

```go
func init() {
    runtime.RegisterModuleInitializer(initMyModule)
}

func initMyModule(rt *runtime.Runtime) {
    runtime.RegisterExternFunction(rt, "ballerina", "mymodule", "myFunc", myFuncImpl(rt))
}
```

When the BIR interpreter encounters a call to `ballerina/mymodule:myFunc`, it looks up the registered `NativeFunc` and invokes it.

### Layer 4: The Values System (`values/`)

When you're in the runtime layer, you're working with Ballerina values represented as Go types:

| Ballerina Type | Go Representation |
|---|---|
| `string` | `string` |
| `int` | `int64` |
| `float` | `float64` |
| `boolean` | `bool` |
| `()` (nil) | `nil` |
| `byte[]`, `any[]` | `*values.List` |
| `map<T>`, records | `*values.Map` |
| `object/class` | `*values.Object` |
| `error` | `*values.Error` |

Look at `lib/http/runtime/http.go` lines 126–158 to see this in action — the `execBody` function unpacks `args[0]` as a `*values.Object` (the `self` Client), `args[1]` as a `string` (the path), serializes the body, calls through PAL to make the HTTP request, and then constructs a `*values.Map` response to return.

### Putting It All Together: The Full Lifecycle of `io:println`

1. **Ballerina source:** `io:println("hello");`
2. **Compile time (Stage 3):** The compiler resolves `io:println` by calling `GetIoSymbols()` from `lib/io/compile/io.go`, finding the `println` symbol with signature `function(any...) returns ()`.
3. **Type check (Stage 4-5):** The compiler verifies `"hello"` is assignable to `any`.
4. **BIR generation (Stage 10):** The compiler emits a BIR `call` instruction targeting the extern function `ballerina/io:println`.
5. **Runtime init:** When `runtime.NewRuntime()` is called, Go's `init()` in `lib/io/runtime/io.go` fires, registering `printlnExtern` as the native handler for `ballerina/io:println`.
6. **Execution (Stage 11):** The BIR interpreter hits the `call` instruction, looks up the registered `NativeFunc`, and invokes it with `args = [BalValue("hello")]`.
7. **PAL:** `printlnExtern` calls `rt.Platform().IO.Stdout([]byte("hello\n"))`, which (on native CLI) calls `os.Stdout.Write(...)`.

---

## 3. How to Add a New Stdlib Module (e.g., TCP)

Based on the patterns above, here's the concrete checklist:

### Step 1: Extend the PAL
Add your platform abstraction to `platform/pal/platform.go`:
```go
type Platform struct {
    IO   IO
    FS   FS
    HTTP HTTP
    TCP  TCP    // ← new
}
```
Implement it in `platform/palnative/` using Go's standard library.

### Step 2: Create `lib/tcp/compile/`
Define the Ballerina-visible types and function signatures. Look at `lib/http/compile/http.go` for complex examples (record types, class types with methods).

### Step 3: Create `lib/tcp/runtime/`
Implement the actual Go logic. Register your extern functions via `runtime.RegisterExternFunction` in an `init()` function. All platform access goes through `ctx.Env.Platform.TCP`.

### Step 4: Wire Compile-Time Symbols
Your `GetTcpSymbols()` function needs to be called during module resolution. Look at how `GetHttpSymbols` and `GetIoSymbols` are wired into the compiler's symbol resolution process.

### Step 5: Write Tests
- Add corpus tests in `corpus/bal/` using the naming convention (`*-v.bal`, `*-e.bal`, `*-p.bal`).
- For integration-style tests involving real network I/O, look at `corpus/http_client_test.go` and `corpus/extern_test.go` as reference.

---

## 4. Architectural Rules That Will Save Your PR

### Never bypass PAL
```go
// ✗ WRONG — direct platform call
conn, _ := net.Dial("tcp", addr)

// ✓ CORRECT — go through PAL
conn, _ := ctx.Env.Platform.TCP.Dial(addr)
```

### Never use `model.Symbol` as a map key
```go
// ✗ WRONG
symbolMap := map[model.Symbol]bool{}

// ✓ CORRECT — always use SymbolRef
symbolMap := map[model.SymbolRef]bool{}
```

### Always operate on symbols via compiler context
Don't call methods on symbols directly. Route operations through `context.CompilerContext`.

### Struct composition for shared behavior
Use private `*Base` structs with type inclusion for shared fields and methods, rather than duplicating code across multiple structs.

### Initialize maps in constructors
Map fields in structs must always be initialized to empty maps, never left as nil.

### No line-by-line comments
If code needs explanation, extract it into a function with a meaningful name.

---

## 5. Testing: The Golden File System

### Corpus Tests
Test cases live in `corpus/bal/` and use file-name suffixes to indicate test type:
- `*-v.bal` — Valid: runs end-to-end, asserts output via `@output` markers
- `*-e.bal` — Error: expected compile errors marked with `@error`
- `*-p.bal` — Panic: runtime panics marked with `@panic`
- `*-f{v|e|p}.bal` — Future: valid scope but intentionally unsupported

Each compiler stage has golden output directories (`corpus/ast/`, `corpus/bir/`, `corpus/cfg/`, etc.). Don't write expected output by hand — run with `-update`:
```bash
go test ./... -update
```

### Integration Tests for Stdlib
For HTTP/TCP-style tests that need real network interaction, look at:
- `corpus/http_client_test.go` — HTTP client integration tests
- `corpus/extern_test.go` — General extern function tests
- `corpus/extern/` — Test fixtures for extern modules

### Naming
Never use leading zeros: `call2-v.bal` not `call02-v.bal`.

---

## 6. Debugging & Profiling

### Debug build (verbose type errors)
```bash
go build -tags debug -o bal-debug ./cli/cmd
./bal-debug run <file.bal>
```

### Profiling
```bash
go build -tags debug -o bal-debug ./cli/cmd
./bal-debug -prof <file.bal>
go tool pprof -http=:8080 http://localhost:6060/debug/pprof/profile?seconds=30
```

---

## 7. Recommended Reading Order for New Contributors

If you're contributing to stdlib (HTTP/TCP), read the code in this order:

1. **`lib/io/`** — The simplest stdlib module. Read both `compile/io.go` and `runtime/io.go` end-to-end. This is your "hello world" for understanding the extern bridge.
2. **`runtime/extern/extern.go`** — The `NativeFunc` signature and `Context`/`Env` types. Understand what's available to your runtime code.
3. **`runtime/runtime.go`** — How modules register themselves (`RegisterExternFunction`, `RegisterModuleInitializer`, `RegisterModuleGlobals`).
4. **`platform/pal/platform.go`** + **`platform/palnative/`** — The PAL abstraction and native implementation. Understand the boundary.
5. **`values/`** — The Ballerina value types in Go. Skim `values.go`, `map.go`, `list.go`, `object.go`.
6. **`lib/http/`** — The complex reference implementation. Start with `compile/http.go` to see how record types and class types are defined at compile time, then `runtime/http.go` to see how HTTP requests are actually made. Also read `client-support.md` for the design spec.
7. **`corpus/http_client_test.go`** — How HTTP integration tests are structured.
8. **`AGENTS.md`** — The project's own rules document. Read it cover to cover.

---

## TL;DR

| I want to... | Go here |
|---|---|
| Add a new stdlib function | `lib/<module>/compile/` (types) + `lib/<module>/runtime/` (impl) |
| Add platform I/O (network, fs) | `platform/pal/` (interface) + `platform/palnative/` (impl) |
| Fix a type-checking bug | `semantics/` |
| Fix a parser bug | `parser/` |
| Add a new AST node | `ast/` |
| Understand the pipeline | `projects/module_context.go` |
| Write a test | `corpus/bal/` (golden) or `corpus/*_test.go` (integration) |
| Debug type errors | `go build -tags debug` |
