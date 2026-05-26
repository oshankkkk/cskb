---
id: Interpreter from scratch
aliases: []
tags: []
date: 2026-05-20
---
The Language name is [Giggles](https://github.com/oshankkkk/Giggles), and the file extension is .gg. Its made with Go and the syntax is kind of inspired by [lua](https://www.lua.org/).
References i used:
- [Crafting interpreters book](https://craftinginterpreters.com)
-  [Cool video bout grammars and parser](https://youtu.be/ENKT0Z3gldE?si=qL2AxzWbKFLekSV6)
- [Another one i watched on parsers](https://www.youtube.com/watch?v=SToUyjAsaFk)
- [Another one, this one explains how a interpreter works](https://www.youtube.com/watch?v=LCslqgM48D4)
- [The Dragon Book ](https://dpvipracollege.ac.in/wp-content/uploads/2023/01/Alfred-V.-Aho-Monica-S.-Lam-Ravi-Sethi-Jeffrey-D.-Ullman-Compilers-Principles-Techniques-and-Tools-Pearson_Addison-Wesley-2007.pdf) (This was too complex for me or prolly for anyone thats doing these kinda stuff for the 1st time. But it has everything you need and its considered the gold standard when it comes to building compilers)
- [r/compilers](https://www.reddit.com/r/Compilers/) 
## How a programming language works

![[Interpreter from scratch-1779703370444.webp|579]]
### Frontend
#### Lexical Analysis
The code you write is just a long list of characters. Lexing/Lexical/Scanning analysis breaks that string into tokens. Token are the stuff that the compiler/interpeter actually reads.So tokenization cleans your code and only gets out the actual code. The tokens are also called lexemes 
#### Parsing
##### Abstract Syntax Tree (AST)
Once you have those tokens, the parser takes them and creates the structure of your program. So stuff like scopes works correctly and how everything related to each other. This is called a Abstract Syntax Tree

> If your using neovim, you can go :TreeInspect and you can actually see the live syntax tree of your code 
#### Static Analysis
This is where type checking and compiler errors stuff happen. It checks the Abstract Syntax Tree.
#### Intermediate Representation (IR)
The code gets converted into a middle format, not bytecode and not the highlevel language.
This is like acts interface. this is made so you can plugin in different compilers/interpreters thats made for different architectures like arm and x64. 
### Backend
#### Optimization
Once the language actually works you can make it fast and all. Thats what this phase is for  
#### Code Generation
The code gets translated into something the machine can actually run very low-level instructions the CPU understands. You can either target a real chip (fast but tied to one device) or a made-up "virtual" one called bytecode (slower but works anywhere).
#### Virtual Machine
If bytecode was produced, something needs to actually run it since no real chip understands it. A virtual machine is basically a program that pretends to be that imaginary chip, running the bytecode step by step. It's slower than native code but much more portable.
#### Runtime
Even after the program is compiled and running, the language still needs to provide some services in the background like cleaning up unused memory or keeping track of what type each object is. All of that behind-the-scenes work happening while the program runs is called the runtime.

> This is just a summery, if this is even a little interesting, please go read [the whole chapter](https://craftinginterpreters.com/a-map-of-the-territory.html) (chapter 2) on the actual book. The author goes in depth on all the components, gives examples on how they work, why they exist  and other alternative implementations for these as well. ALSO THE BOOK IS FREE.
### Compiled vs Interpreted
Compilation and interpretation are methods of language implementations, like one can make a [C interpreter](https://github.com/jpoirier/picoc) or a compiler for some originally interpreted language. 
But the difference is little more complex than the traditional line by line code execute is interpreted while the whole program code execute is compiled thing. Modern languages like of blurs the line of compiled and interpreted implementations. Specially when it comes to "interpreted" stuff.

> Like java is technically both compiled and interpreted, cause it compiled to java bytecode and then runs inside of the JVM. The JVM interprets the code. And then theres tsc(Typescript Compiler), but ts is not compiled! (its transpiled into js and gets JIT compiled in V8)
#### How to see the difference of the two 
A compiler basically turns 1 form of code to another form of code, usually something more lower level that what it was originally. Thats it when it comes to a compiler. Its just a translator.
But interpreters  converts the code into some intermediate representation and runs that instead of converting it to machine code.

> In languages like python  it 1st compiles python code to bytecode(intermediate representation) and runs that through a Virtual Machine

> Theres also stuff like transpilers and JIT compilers which the book explains really well.



