Told antigravity to explain the repo :)
## Ballerina go interpreter
Instead of running ballerina in the VM, its making our own VM and the compiler for .bal files, so we can compile them into a ballerina IR and run in native ballerina VM written in go.
#### Interpreter 
##### Key dirs and their phases
- **`parser`**: Phase 1 of the compiler pipeline Contains code to parse Ballerina source code and transform it into a Syntax Tree.
- **`ast`**: Phase 2 of the compiler pipeline. Defines the Abstract Syntax Tree (AST) structures for Ballerina nodes and the logic to generate them from the syntax tree.
- **`semantics`**: Phases 3 to 8 of the compiler pipeline. Contains the core logic for semantic analysis, including symbol resolution, type resolution, type narrowing, reachability analysis, and explicit return analysis.
- **`desugar`**: Phase 9 of the compiler pipeline. Responsible for "desugaring" the AST, which means simplifying complex syntactic constructs into simpler, core representations before generating the intermediate representation.
- **`bir`**: Phase 10 of the compiler pipeline. Deals with the Ballerina Intermediate Representation (BIR). This phase translates the desugared AST into BIR, which the interpreter ultimately executes.
- **`runtime`**: Phase 11 (Execution). This is the interpreter itself, responsible for executing the generated BIR instructions.
- **`context`**: Contains the compiler's compilation context (e.g., `module_context.go`). It tracks the sequence of interpreter stages, holds symbol/type registries for modules, and manages error boundaries preventing compilation progression if errors are detected.
##### Utils used by them 
  • Before the pipeline even starts, projects gathers and organizes all the source files and dependencies.
  • As the pipeline runs, it uses the shared vocabulary defined in model so the Parser and the Semantic Analyzer are speaking the same language.
  • When the Semantic Analyzer needs to verify if your code is legally allowed (e.g., assigning a JSON object to a specific Record), it outsources that complex logic to the  semtypes  type engine.              
  • Finally, when the Runtime Interpreter executes the program, it stores your variables in memory using the structures defined in values and performs exact, error-free financial calculations using decimal .
###### Projects (The Organizer)
*   **What it means:** When you write Ballerina code, you usually don't just write one file. You create a "project" with multiple modules, dependencies, and configuration files (like `Ballerina.toml`).
*   **What it does:** Before the compiler even tries to understand your code, the `projects` package reads your folders, figures out which files belong to which modules, and downloads any external packages your code depends on. It organizes the raw files into a structure the compiler can process.
###### Model (The Shared Vocabulary)
*   **What it means:** A compiler has many different stages (the parser, the type-checker, the runtime). They all need a common way to talk about the things in your code.
*   **What it does:** It holds the blueprints for shared concepts. For example, if you write `int age = 10;`, the compiler needs to track the name `age`. It stores this as a `Symbol`. The `model` package defines what a `Symbol` is, so the type-checker and the interpreter agree on what `age` means.
###### Semtypes (The Type System )
*   **What it means:** Ballerina has a very advanced "Semantic Type System" (structural typing, unions, etc.).
*   **What it does:** This is the logic engine that enforces the rules of types. If you try to do `string name = 5;`, the `semtypes` package is responsible for doing the math to realize that the type `int` does not fit into the type `string`. It calculates relationships between types—for example, figuring out if a specific JSON shape is allowed to be passed to a function that expects a specific Record type.
###### Values (The Memory Managers)
*   **What it means:** There is a big difference between code on paper (which is what the compiler sees) and code while it is running (which is what the interpreter sees).
*   **What it does:** When your program actually runs and executes `int age = 10;`, the number `10` has to exist in the computer's memory. Because this interpreter is written in Go, the `values` package defines how a Ballerina array, map, or string is represented in Go's memory. It dictates how these values behave while the program is actively executing.
###### Decimal (The Financial Calculator)
*   **What it means:** Standard computers use "floating-point" math (like `float` or `double`), which can cause weird rounding errors (like `0.1 + 0.2 = 0.30000000000000004`). Ballerina has a built-in `decimal` type designed specifically to fix this, which is crucial for financial calculations.
*   **What it does:** Go (the language this interpreter is built in) doesn't have a built-in `decimal` type that matches Ballerina's exact specifications. Therefore, this package is a custom calculator built from scratch to handle arithmetic (`+`, `-`, `/`, `*`) for `decimal` numbers exactly as the Ballerina language promises.
#### Orther parts of the interpreter thats not really the core
##### CLI (The Command Center)
*   **What it means:** When you open your terminal and type `bal run my_script.bal`, the system needs to understand what you're asking it to do.
*   **What it does:** It acts as the "front desk." It parses your command-line inputs, flags (like `--help` or `--prof`), and file paths. Once it figures out what you want, it wakes up the rest of the system (the compiler and interpreter), hands them your project, and tells them to get to work.
##### Platform (The OS Translator)
*   **What it means:** A programming language constantly needs to interact with the physical computer—reading files, printing to the screen, or making network requests. But Windows, macOS, and Linux all handle these things differently.
*   **What it does:** This is the **Platform Adaptation Layer (PAL)**. Instead of the compiler trying to talk directly to Windows or Linux, it talks exclusively to the `platform` package. The `platform` package translates those generic requests into the correct OS-specific commands. This keeps the core compiler code clean and platform-independent.
##### Corpus (The Proving Grounds)
*   **What it means:** When building a compiler, you have to be absolutely sure that fixing one bug doesn't accidentally break ten other things. A "corpus" is a massive library of test code.
*   **What it does:** It acts as the central testing infrastructure. It holds hundreds of `.bal` files designed to test every edge case.
    *   `-v.bal` files are **valid** code that must run perfectly.
    *   `-e.bal` files have intentional mistakes to test if the compiler catches the **error**.
    *   `-p.bal` files are designed to cause a runtime **panic** to ensure the interpreter handles crashes safely.
##### Test_util (The Testing Toolkit)
*   **What it means:** The engineers writing the automated tests for this project often have to perform the exact same setup and teardown tasks over and over again.
*   **What it does:** It holds shared helper functions specifically for the test suites. For example, if a test needs to compare the interpreter's output against a "golden" expected result, the logic to read and compare those files lives here.
##### Common (The Utility Belt)
*   **What it means:** There are small, generic programming tasks that almost every part of the codebase needs to perform (like manipulating strings, formatting standard errors, or working with standard Go data structures).
*   **What it does:** It acts as a shared junk drawer of highly useful, reusable code. If the Parser, the Type-Checker, and the Runtime all need to do the exact same minor task, they import it from `common` so the code only has to be written once.
##### Compiler-tools (The Factory Equipment)
*   **What it means:** The process of compiling code requires highly specialized internal mechanisms to move data from one phase (like the AST) to the next (like the BIR).
*   **What it does:** While `common` holds generic helpers, `compiler-tools` holds utilities that are strictly related to the heavy lifting of the compiler lifecycle. It provides the internal toolchains used to transform and analyze your code as it moves down the assembly line.
##### Tools (The Builder's Scripts)
*   **What it means:** To build, test, and release the `ballerina-lang-go` project itself, the core developers need automation.
*   **What it does:** This folder contains external scripts (like Bash or Go scripts) and configuration files used by the developers for continuous integration, code generation, or automating the build pipelines. It’s tooling for the people *building* the interpreter, not code used *by* the interpreter.
##### Lib (The Standard Library)
*   **What it means:** A language isn't very useful if you have to build everything from scratch. It needs built-in capabilities like math functions, string manipulation, or basic data structures out-of-the-box.
*   **What it does:** It houses the core implementations of Ballerina's standard libraries. These are the built-in capabilities that are bundled directly into the runtime so that you can use them immediately when writing Ballerina code.
##### Doc (The Instruction Manuals)
*   **What it means:** Because this Go interpreter is being built incrementally (milestone by milestone, supporting specific "subsets" of the language at a time), developers need a clear record of what currently works and what doesn't.
*   **What it does:** It contains the official language documentation, design decisions, and strict specifications for each subset. It is the reference guide that tells you exactly which features of the full Ballerina language are currently supported by this Go implementation.
