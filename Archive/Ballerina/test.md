This document maps out the exact sequence of function calls and file transitions when you execute a Ballerina file using the CLI (`go run ./cli/cmd run path/to/file.bal`). 

The diagram captures the flow from the initial CLI invocation, through the various compilation stages, and finally to the interpreter execution.

## Execution Flowchart

```mermaid
graph TD
    %% CLI and Project Loading Phase
    Start((Start: bal run)) --> RunBallerina["runBallerina(cmd, args)\n(/home/oshankodagoda/Projects/ballerina-lang-go/cli/cmd/run.go)"]
    RunBallerina --> ProjLoad["projects.Load(fsys, loadPath)\n(/home/oshankodagoda/Projects/ballerina-lang-go/projects/project.go)"]
    ProjLoad --> PkgCompilation["pkg.Compilation()\n(/home/oshankodagoda/Projects/ballerina-lang-go/projects/package.go)"]
    
    %% Package Compilation Setup
    PkgCompilation --> GetPkgComp["p.packageCtx.getPackageCompilation()\n(/home/oshankodagoda/Projects/ballerina-lang-go/projects/package_context.go)"]
    GetPkgComp --> NewPkgComp["newPackageCompilation()\n(/home/oshankodagoda/Projects/ballerina-lang-go/projects/package_compilation.go)"]
    NewPkgComp --> CompileInternal["compilation.compileModulesInternal()\n(/home/oshankodagoda/Projects/ballerina-lang-go/projects/package_compilation.go)"]
    
    %% Compilation Phase 1 (Sequential across modules)
    subgraph "Phase 1: Parse & Resolve Top-Level (Sequential)"
        CompileInternal --> ResolveTpl["resolveTypesAndSymbols(moduleCtx)\n(/home/oshankodagoda/Projects/ballerina-lang-go/projects/module_context.go)"]
        ResolveTpl --> StageParse["parseDocumentsParallel()\n- StageParse: Generates Syntax Trees"]
        StageParse --> StageAST["buildBLangPackage()\n- StageASTBuild: Generates AST"]
        StageAST --> StageImp["semantics.ResolveImports()\n- StageImportResolution"]
        StageImp --> StageSym["semantics.ResolveSymbols()\n- StageSymbolResolution"]
        StageSym --> StageTyp["semantics.ResolveTopLevelNodes()\n- StageTopLevelTypeResolution"]
    end
    
    %% Compilation Phase 2 (Parallel across modules)
    subgraph "Phase 2: Local Analyze & Desugar (Parallel)"
        StageTyp --> AnalyzeDesugar["analyzeAndDesugar(moduleCtx)\n(/home/oshankodagoda/Projects/ballerina-lang-go/projects/module_context.go)"]
        AnalyzeDesugar --> StageLocal["semantics.ResolveLocalNodes()\n- StageLocalNodeResolution"]
        StageLocal --> StageSem["semantics.NewSemanticAnalyzer().Analyze()\n- StageSemanticAnalysis"]
        StageSem --> StageCFG["semantics.CreateControlFlowGraph()\n- StageCFGCreation"]
        StageCFG --> StageCFGAn["semantics.AnalyzeCFG()\n- StageCFGAnalysis (Reachability, etc)"]
        StageCFGAn --> StageDesugar["desugar.DesugarPackage()\n- StageDesugaring"]
    end
    
    %% Backend & BIR Generation
    StageDesugar -. Return to .-> RunBallerina
    RunBallerina --> NewBackend["projects.NewBallerinaBackend(compilation)\n(/home/oshankodagoda/Projects/ballerina-lang-go/projects/ballerina_backend.go)"]
    
    subgraph "Phase 3: BIR Generation"
        NewBackend --> PerformCodeGen["backend.performCodeGen()\n(/home/oshankodagoda/Projects/ballerina-lang-go/projects/ballerina_backend.go)"]
        PerformCodeGen --> GenCodeInternal["generateCodeInternal(moduleCtx)\n(/home/oshankodagoda/Projects/ballerina-lang-go/projects/module_context.go)"]
        GenCodeInternal --> GenBir["bir.GenBir(compilerCtx, bLangPkg)\n- StageBIRGeneration"]
    end
    
    %% Interpretation
    GenBir -. Return to .-> RunBallerina
    RunBallerina --> GetBirPkgs["backend.BIRPackages()\n(/home/oshankodagoda/Projects/ballerina-lang-go/projects/ballerina_backend.go)"]
    GetBirPkgs --> NewRuntime["runtime.NewRuntime(pal, typeEnv)\n(/home/oshankodagoda/Projects/ballerina-lang-go/runtime/runtime.go)"]
    
    subgraph "Phase 4: Execution"
        NewRuntime --> Interpret["rt.Interpret(*birPkg)\n(/home/oshankodagoda/Projects/ballerina-lang-go/runtime/runtime.go)"]
        Interpret --> PrintOutput["Output Printed to Console"]
    end
    
    PrintOutput --> End((End))

    %% Styles for better readability
    classDef file fill:#f9f9f9,stroke:#333,stroke-width:2px;
    class RunBallerina,ProjLoad,PkgCompilation,GetPkgComp,NewPkgComp,CompileInternal,ResolveTpl,AnalyzeDesugar,NewBackend,PerformCodeGen,GenCodeInternal,GetBirPkgs,NewRuntime,Interpret file;
```

## Detailed Flow Breakdown and Absolute File Paths

### 1. CLI and Project Loading Phase
- **`runBallerina(cmd, args)`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/cli/cmd/run.go`
- **`projects.Load(fsys, loadPath)`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/projects/project.go`
- **`pkg.Compilation()`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/projects/package.go`
- **`p.packageCtx.getPackageCompilation()`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/projects/package_context.go`
- **`newPackageCompilation()`** & **`compilation.compileModulesInternal()`**
  `/home/oshankodagoda/Projects/ballerina-lang-go/projects/package_compilation.go`

### 2. Compilation Phase 1 (Sequential)
*Orchestrated primarily inside `/home/oshankodagoda/Projects/ballerina-lang-go/projects/module_context.go` via `resolveTypesAndSymbols()`:*
- **`parseDocumentsParallel()`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/projects/module_context.go`
- **`buildBLangPackage()`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/projects/module_context.go`
- **`semantics.ResolveImports()`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/semantics/symbol_resolver.go`
- **`semantics.ResolveSymbols()`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/semantics/symbol_resolver.go`
- **`semantics.ResolveTopLevelNodes()`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/semantics/type_resolver.go`

### 3. Compilation Phase 2 (Parallel / Goroutines)
*Orchestrated primarily inside `/home/oshankodagoda/Projects/ballerina-lang-go/projects/module_context.go` via `analyzeAndDesugar()`:*
- **`semantics.ResolveLocalNodes()`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/semantics/type_resolver.go`
- **`semantics.NewSemanticAnalyzer().Analyze()`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/semantics/semantic_analyzer.go`
- **`semantics.CreateControlFlowGraph()`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/semantics/control_flow_analyzer.go`
- **`semantics.AnalyzeCFG()`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/semantics/cfg_analyzer.go`
- **`desugar.DesugarPackage()`** 
  `/home/oshankodagoda/Projects/ballerina-lang-go/desugar/desugar.go`

### 4. BIR (Bytecode) Generation Phase
- **`projects.NewBallerinaBackend()`** & **`backend.performCodeGen()`**
  `/home/oshankodagoda/Projects/ballerina-lang-go/projects/ballerina_backend.go`
- **`generateCodeInternal()`**
  `/home/oshankodagoda/Projects/ballerina-lang-go/projects/module_context.go`
- **`bir.GenBir()`**
  `/home/oshankodagoda/Projects/ballerina-lang-go/bir/bir_gen.go`

### 5. Runtime / Execution Phase
- **`backend.BIRPackages()`**
  `/home/oshankodagoda/Projects/ballerina-lang-go/projects/ballerina_backend.go`
- **`runtime.NewRuntime()`** & **`rt.Interpret()`**
  `/home/oshankodagoda/Projects/ballerina-lang-go/runtime/runtime.go`