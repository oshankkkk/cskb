### chat hash  
```

agy --conversation=6ed768d0-941a-48bf-8274-64c077696e92

```
# Ballerina Lang Go: Developer Onboarding & Codebase Learning Path

Welcome! If you want to understand this interpreter codebase and eventually contribute (especially to the standard library, TCP, or HTTP modules), do not try to read everything at once. Instead, follow this structured, layer-by-layer onboarding guide.

---

## Phase 1: Run it first, read later

Before reading any code, get a feel for what the interpreter *does*.

**1. Run a simple Ballerina file:**
```bash
go run ./cli/cmd run corpus/bal/hello1-v.bal
```

**2. Run one that errors:**
```bash
go run ./cli/cmd run corpus/bal/type-narrow1-e.bal
```

---

## Phase 2: Trace the simplest possible path

The single best way to understand any interpreter is to trace one tiny program through the entire pipeline. Pick `io:println("hello")` and follow it.

**Read in this exact order:**

| Step | File Path / Link | What you'll learn |
|------|-------------|-------------------|
| 1 | [AGENTS.md](file:///home/oshankodagoda/Projects/ballerina-lang-go/AGENTS.md) | The rules of the project — pipeline stages, testing conventions, architectural constraints. Read this fully. |
| 2 | [projects/module_context.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/projects/module_context.go) | The orchestrator. Skim the struct and the method that drives stages 1→10. You don't need to understand every line — just see *what calls what* in what order. |
| 3 | [lib/io/compile/io.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/lib/io/compile/io.go) | How a stdlib function is *declared* to the compiler. This is tiny and readable. |
| 4 | [lib/io/runtime/io.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/lib/io/runtime/io.go) | How the same function is *implemented* in Go. Notice the `init()` → `RegisterModuleInitializer` → `RegisterExternFunction` chain. |
| 5 | [runtime/extern/extern.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/runtime/extern/extern.go) | The `NativeFunc` signature and the `Context`/`Env` structs your runtime code receives. |
| 6 | [runtime/runtime.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/runtime/runtime.go) | How the Runtime boots up, calls module initializers, and dispatches to the BIR interpreter. |
| 7 | [platform/pal/platform.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/platform/pal/platform.go) | The PAL interface — the wall between your code and the OS. |
| 8 | [platform/palnative/pal.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/platform/palnative/pal.go) | The native implementation — `os.Stdout.Write`, `os.ReadFile`, etc. |

**After these 8 files (~500 lines total), you'll understand how a Ballerina function call goes from source code → compiler symbol → BIR instruction → Go function → OS syscall.** That's the core mental model.

---

## Phase 3: Understand the values system

When you write runtime code, you're constantly converting between Ballerina values and Go values. Skim these:

| File | What it teaches |
|------|----------------|
| [values/values.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/values/values.go) | The `BalValue` interface and basic types |
| [values/map.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/values/map.go) | How Ballerina records/maps work in Go |
| [values/list.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/values/list.go) | How Ballerina arrays work in Go |
| [values/object.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/values/object.go) | How Ballerina objects/classes work in Go |

---

## Phase 4: Study the complex reference — HTTP

Now that you understand the simple `io` path, read the HTTP module to see how a *real* stdlib module works with classes, records, TLS config, and PAL:

1. [lib/http/client-support.md](file:///home/oshankodagoda/Projects/ballerina-lang-go/lib/http/client-support.md) — The design spec. Read this first so you know *what* the HTTP module aims to support.
2. [lib/http/compile/http.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/lib/http/compile/http.go) — How complex types (records, classes with methods) are declared to the compiler.
3. [lib/http/runtime/http.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/lib/http/runtime/http.go) — The actual HTTP implementation. Focus on `initHttpModule` and `execBody` to see the pattern.
4. [platform/palnative/http.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/platform/palnative/http.go) — The native HTTP client implementation behind PAL.

---

## Phase 5: Understand the test system by running it

Don't just read about tests — run them:

```bash
# Run all corpus tests
go test ./...

# Run just the HTTP integration tests
go test ./corpus/ -run TestHTTP -v

# Run corpus tests and update golden files
go test ./... -update
```

Then open a test file like [corpus/http_client_test.go](file:///home/oshankodagoda/Projects/ballerina-lang-go/corpus/http_client_test.go) and read how it sets up a test server, runs Ballerina code against it, and asserts output.

---

## Phase 6: Only now look at the compiler internals

You only need this if you're modifying type signatures or adding new language constructs. For pure stdlib work, Phases 1–5 are sufficient. But if you're curious:

| Directory | When you'd touch it |
|-----------|-------------------|
| `parser/` | Adding new syntax |
| `ast/` | New AST node types |
| `semantics/` | Type checking, scoping, CFG analysis |
| `desugar/` | Simplifying syntax sugar before BIR |
| `bir/` | The intermediate representation |
| `semtypes/` | The semantic type system |
| `model/` | Core data structures (Symbol, SymbolRef, PackageID) |

---

## The trick that makes it click

**Grep-trace a function call.** Pick `println` and grep for it across the repo:

```bash
grep -r "println" --include="*.go" lib/io/ runtime/ 
```

You'll see it defined in `compile/`, implemented in `runtime/`, registered via `RegisterExternFunction`, and dispatched by the BIR executor. That one grep session connects every layer in your head.

Do the same for `http:Client` or `http:get` when you're ready for the complex version.
