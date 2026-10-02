## Phase 0: Decisions and scaffolding

1. **Pick your target architecture.** The paper targets 32-bit x86. You'll likely want x86-64 (System V calling convention) or ARM64 if you're on an M-series Mac. This choice affects register names, calling convention, and tag/word sizes, so decide it first.
- amd64
1. **Pick your output strategy.** Follow the paper: your compiler emits assembly text, and `gcc` or `as` assembles and links it with a C runtime file. You don't write an assembler or linker.
- assmeber as
1. **Build a test harness before any compiler code.** Each test is a Scheme expression plus its expected printed output. A shell or Makefile script compiles each one, runs it, and diffs the result. Every later step adds tests to this suite.
- i need a test sweat, corpus??
1. **Decide the shape of your C code.** The paper leans on Scheme's pattern matching and lists, so in C you need replacements:
   - an S-expression data type (a tagged union for ints, symbols, pairs, etc.)
   - an arena or bump allocator for compiler-side memory, since you'll never free individual nodes
   - a symbol-interning table
   - a string-builder or `fprintf`-style emitter for assembly output
1. **Write an S-expression reader in C.** The paper uses Scheme's built-in `read` for the front end and defers writing your own reader to the end. In C you need one immediately, so write a minimal one now (integers, symbols, lists, quote) and extend it as the language grows.
2. **Write the C runtime stub** (`runtime.c`). It has a `main` that calls your generated entry point and prints the returned value. This grows as the language does.
## Phase 1: The core language (paper §3.1–3.12)

Each step is one small feature, compiled and tested before moving on.

7. **Integers.** Compile a program that returns a constant. Introduce your **tagged value representation** here: low bits are type tags, so fixnums are shifted integers.
8. **Immediate constants.** Booleans, characters, and the empty list, each with its own tag.
9. **Unary primitives.** `add1`, `sub1`, `zero?`, `null?`, `not`, `integer?`, and so on. This establishes the pattern for how an expression leaves its result in a register.
10. **Binary primitives.** `+`, `-`, `*`, `=`, `<`, etc. This forces you to introduce a **stack-based temporary scheme**: stack index `si` passing, so intermediate values go in stack slots and not just registers.
11. **Local variables.** `let` and variable references. You'll need an **environment** (variable → stack slot) as a compile-time structure.
12. **Conditionals.** `if`, with label generation and the tag-based truthiness test. Add `and`/`or` as simple extensions when convenient.
13. **Heap allocation.** `cons`, `car`, `cdr`, vectors, and strings. The runtime allocates a region (via `malloc`/`mmap`) and passes its pointer into your generated code. Maintain an allocation pointer in a dedicated register and tag pointers by object type.
14. **Procedure calls.** Define your calling convention: where arguments go, how return addresses work, and how stack frames are laid out. Start with top-level `labels` (a form for defining named procedures) before general lambdas.
15. **Closures.** This step involves the most compiler machinery, and it's done in layers:
    - free-variable analysis
    - closure conversion
    - code generation for closure creation and indirect calls
16. **Proper tail calls.** Scheme requires them. They are a code-generation change in how you emit calls in tail position, and you need a test that would overflow the stack without them.
17. **Complex constants.** Quoted lists, strings, and vectors as literals, which means static data emitted into the assembly.
18. **Assignment.** `set!`, handled via **assignment conversion**. Variables that are mutated and captured get boxed on the heap.

## Phase 2: Making it a real Scheme (paper §3.13 onward)

19. **Extended syntax by desugaring.** Implement `let*`, `letrec`, `begin`, `cond`, `case`, `when`, `unless`, `do`, and named `let` as rewrites into your core forms. Add a dedicated desugaring pass before your analyses.
20. **Symbols and libraries.** Symbol objects and a Scheme-level standard library written in Scheme itself, compiled by your compiler. This begins to bootstrap your language.
21. **Foreign function interface.** Calling into your C runtime from Scheme, which gives you a path to I/O without hand-writing everything in assembly.
22. **Error checking and safe primitives.** Type checks on primitives, arity checks on calls, and a runtime error routine. The paper deliberately delays this until the language is rich enough to be worth protecting.
23. **Variable-arity procedures and `apply`.** Rest arguments, `case-lambda` if you want it, and `apply`.
24. **I/O.** Output ports, then `write`/`display`, then input ports.
25. **Self-hosted reader (optional).** Rewrite your reader in Scheme and compile it with your own compiler. Your C reader remains the bootstrap.
26. **Interpreter (optional).** Write `eval` in Scheme and compile it. The paper treats this as the capstone, since it gives you an `eval` and a REPL.

## Phase 3: Beyond the basics (paper §4)

Pick from these once the core works:

- **Garbage collection.** This is the biggest missing piece in a C runtime. A copying collector (Cheney's algorithm) is the natural first choice and uses your tagged representation.
- **Optimizations:** inlining, constant folding, copy propagation, known-call optimization, and eliminating unnecessary closures.
- **Better register allocation** instead of the stack-slot scheme.
- **Better compiler structure:** converting to a nanopass-style pipeline of small, single-purpose passes, which suits C well when each pass is a function from tree to tree.
- **Continuations**, if you want `call/cc`.

## Habits that make this work

- **Never skip the tests.** Each step should add tests before or alongside the feature.
- **Inspect the generated assembly** often, since it's the quickest way to catch tagging and stack-offset bugs.
- **Resist implementing steps early.** Don't add a garbage collector or register allocation before the basic language works.
- **Read the paper's step in full before each step**, since each section is short and the design hints are compact.

If you tell me which architecture you're targeting, I can adapt the tagging scheme, calling convention, and register roles for it.