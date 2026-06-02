Here is an explanation of every directory present in the `ballerina-lang-go` workspace based on the project's structure, which implements the Ballerina interpreter in Go:
### Compiler Pipeline & Interpreter Stages
- **`parser`**: Phase 1 of the compiler pipeline Contains code to parse Ballerina source code and transform it into a Syntax Tree.
- **`ast`**: Phase 2 of the compiler pipeline. Defines the Abstract Syntax Tree (AST) structures for Ballerina nodes and the logic to generate them from the syntax tree.
- **`semantics`**: Phases 3 to 8 of the compiler pipeline. Contains the core logic for semantic analysis, including symbol resolution, type resolution, type narrowing, reachability analysis, and explicit return analysis.
- **`desugar`**: Phase 9 of the compiler pipeline. Responsible for "desugaring" the AST, which means simplifying complex syntactic constructs into simpler, core representations before generating the intermediate representation.
- **`bir`**: Phase 10 of the compiler pipeline. Deals with the Ballerina Intermediate Representation (BIR). This phase translates the desugared AST into BIR, which the interpreter ultimately executes.
- **`runtime`**: Phase 11 (Execution). This is the interpreter itself, responsible for executing the generated BIR instructions.
- **`context`**: Contains the compiler's compilation context (e.g., `module_context.go`). It tracks the sequence of interpreter stages, holds symbol/type registries for modules, and manages error boundaries preventing compilation progression if errors are detected.

### Project & Type System Models
- **`projects`**: Contains logic for handling and resolving Ballerina projects, modules, package structures, and dependencies.
- **`model`**: Provides common foundational data models shared across different compilation phases, such as `Symbol` and `SymbolRef` structures.
- **`semtypes`**: Implementation of Ballerina's semantic type system, representing structures like singleton types, shapes, and complex structural types used during type-checking.
- **`values`**: Defines the runtime representations of Ballerina values (e.g., how strings, integers, maps, arrays, and objects behave in the interpreter's memory).
- **`decimal`**: Implements Ballerina's built-in Decimal types and their arithmetic operations according to the language specification.

### Infrastructure & Tooling
- **`cli`**: The Command-Line Interface package (which gets compiled via `go run ./cli/cmd run`). It handles parsing flags, loading user projects, and triggering the compiler/interpreter.
- **`platform`**: The Platform Adaptation Layer (PAL). Abstracts underlying operating system operations (like IO, HTTP, FileSystem) so the compiler and runtime interact solely through the PAL instead of invoking OS platforms directly.
- **`corpus`**: The central testing infrastructure. Contains golden test files (`.bal`), integration drivers for the CLI and package resolution, expected outputs (`-v.bal`, `-e.bal`, `-p.bal`), and specific integration fixtures (`testdata`).
- **`test_util`**: Common helper libraries and utilities used by various Go test suites across the project.
- **`common`**: General-purpose utilities and shared helper routines used broadly across multiple packages in the codebase.
- **`compiler-tools`**: Specialized toolchains and utilities supporting the compiler lifecycle or internal compiler tasks.
- **`tools`**: Contains scripts and external tooling configurations, potentially used for build pipelines or code generation.
- **`lib`**: Typically designated for providing standard libraries, core implementations, or bundled Ballerina runtime capabilities.
- **`doc`**: Contains language documentation, feature subset specifications, and design or restriction documentation for each implemented milestone.

### Environment & Tool Configurations (Hidden Directories)
- **`.agents`**: Configuration and specific instructions/skills (`AGENTS.md`) for AI agents interacting with this repository.
- **`.antigravitycli`**: Configuration data for the Antigravity CLI and environment metadata.
- **`.git`**: The standard directory housing the local Git version control repository.
- **`.github`**: Contains GitHub Actions workflow definitions, issue templates, and CI/CD setup for the repository.
- **`.vscode`**: Contains workspace settings, debug configurations, and extension recommendations for developers using Visual Studio Code.
