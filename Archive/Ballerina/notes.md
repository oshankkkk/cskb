---
id: notes
aliases: []
tags: []
---
## Notes
### Type resolution
- Its basically your compiler/interpreter understanding the types of the variables.
##### Type inference
- The language finds the type of the variable for you, like in python or in js.
##### Explict type  
- Like in go,typecript or java where you have to actually mention the type.

Symbol resolution - Connects identifiers to their declarations (e.g., finding where foo is defined)
Type resolution - Determines the actual types of those resolved symbols/expressions (e.g., knowing foo is an int)
In compiler terminology, symbols are identifiers for program entities. They include:
- Types (int, string, custom classes/structs)
- Variables (their names and what they refer to)
- Functions (names and signatures)
- Modules/packages (imported references)
So symbols are not just types - they're the compiler's way of tracking all named declarations. A symbol table maps names to their definitions, enabling the compiler to resolve what x or SomeType actually refers to when it encounters them.

### notes
- you build the compiler cli tool and then run the executable with a cmd 
```

go build -o .cli/cmd
./bal help
./bal run heloworld.bal

```
- what is a listner in this
- what is the executable
- why is there nothing in the ./bal --help
- whats corpus
- the tests pass now what
- whats profling

### Possible issue
1. No gracefull shutdown 
```
oshankodagoda@fedora:~/Projects/wso2/ballerina-lang-go$ ./bal run -help
oshankodagoda@fedora:~/Projects/wso2/ballerina-lang-go$ ./bal run jdslkfj;flkjsaz
ballerina: stat jdslkfj: no such file or directory

USAGE:
    run [<source-file.bal> | <package-dir> | .]
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x18 pc=0xd3709c]

goroutine 1 [running]:
main.runBallerina(0xdcd460eec00?, {0xdcd463102e0, 0x1, 0xf7d220?})
	/home/oshankodagoda/Projects/wso2/ballerina-lang-go/cli/cmd/run.go:158 +0x85c
github.com/spf13/cobra.(*Command).execute(0x195e540, {0xdcd463102b0, 0x1, 0x1})
	/home/oshankodagoda/Projects/wso2/.gopath/pkg/mod/github.com/spf13/cobra@v1.10.2/command.go:1015 +0xb14
github.com/spf13/cobra.(*Command).ExecuteC(0x195ce40)
	/home/oshankodagoda/Projects/wso2/.gopath/pkg/mod/github.com/spf13/cobra@v1.10.2/command.go:1148 +0x465
github.com/spf13/cobra.(*Command).Execute(...)
	/home/oshankodagoda/Projects/wso2/.gopath/pkg/mod/github.com/spf13/cobra@v1.10.2/command.go:1071
main.main()
	/home/oshankodagoda/Projects/wso2/ballerina-lang-go/cli/cmd/bal.go:38 +0xb1
bash: flkjsaz: command not found...

```






