---
id: Interpreter from scratch
date: 2026-05-20
title: Creating a interpreter from scratch
---
The Language name is [Giggles](https://github.com/oshankkkk/Giggles), and the file extension is .gg. Its made with Go and the syntax is kind of inspired by [lua](https://www.lua.org/).

References:
- [Crafting interpreters book](https://craftinginterpreters.com)
- [Another one, this one explains how a interpreter works](https://www.youtube.com/watch?v=LCslqgM48D4)
- [The Dragon Book ](https://dpvipracollege.ac.in/wp-content/uploads/2023/01/Alfred-V.-Aho-Monica-S.-Lam-Ravi-Sethi-Jeffrey-D.-Ullman-Compilers-Principles-Techniques-and-Tools-Pearson_Addison-Wesley-2007.pdf) (This was too complex for me or prolly for anyone thats doing these kinda stuff for the 1st time. But it has everything you need and its considered the gold standard when it comes to building compilers)
- [r/compilers](https://www.reddit.com/r/Compilers/) 
- I also added more references on the indivitual notes

## How a programming language works

![[Interpreter from scratch-1779703370444.webp|579]]
### Frontend
#### Lexical Analysis
It takes you text and removes the noise. The code you write is just a long list of characters. Lexing/Lexical analysis/Scanning breaks that string into tokens according to your languages syntax, Its what separates your variables from the keywords, yk it identifies each of them and converts them into their respective tokens. Token are the stuff that the compiler/interpeter actually reads. The tokens are also called lexemes 
#### Parsing
##### Abstract Syntax Tree (AST)
The "Parser" takes the long array of tokens from the lexer and makes tree data structure out of it according to the language grammer rules. (kinda like the DOM). This is called a Abstract Syntax Tree

> If your using neovim, you can go :InspectTree and you can actually see the live syntax tree of your code 
#### Static Analysis
This is where type checking and compiler errors stuff happen. It checks the Abstract Syntax Tree.
### Backend
#### Intermediate Representation (IR)
Some kind of a representation of the AST maybe bytecode or maybe something else. It depends on the implementation. Bytecode is the most common with interpreters i think. In compilers this acts as a interface, so you can plugin in at  compilers/interpreters thats made for different architectures like arm and x64 to the same frontend
#### Code Generation / Compilation
The code gets translated into something low-level instructions the CPU understands. So turning the AST into bytecode happens in this stage as well

> I think depending on the implementation this can be in the frontend as well. 
#### Virtual Machine
Simulation of how the internals work in a computer, our bytecode/intermediate representation runs in this. I could say this is only used for interpeters but then again the java JIT compiles their bytecode so at this point im just gonna say it depends.
#### Runtime
Everything that needed for your code to run, the VM, the libs, the garbage collector (if you have one) and any more. Bascially everything that should run so your code than keep running until it stops.
#### Optimization
Once the language actually works you can make it fast and all. This part can happen in anyway of the whole process i think.

> This is just a summery, if this is even a little interesting, please go read [the whole chapter](https://craftinginterpreters.com/a-map-of-the-territory.html) (chapter 2) on the actual book. The author goes in depth on all the components, gives examples on how they work, why they exist  and other alternative implementations for these as well. ALSO THE BOOK IS FREE.
### Compiled vs Interpreted
Compilation and interpretation are methods of language implementations, like one can make a [C interpreter](https://github.com/jpoirier/picoc) or a compiler for some originally interpreted language. 
But the difference is little more complex than the traditional line by line code execute is interpreted while the whole program code execute is compiled thing. Modern languages like of blurs the line of compiled and interpreted implementations. Specially when it comes to "interpreted" stuff.

> Java being compiled and interpreted, cause it compiled to java bytecode and then runs inside the JVM where they use JIT compilation. And then theres tsc(Typescript Compiler), but ts is not even compiled (its transpiled into js and gets JIT compiled in V8)

### What i know for sure
We are just reading from the file and translating what we read into something else based on our needs ryt. There different are common methods and concepts of doing that and ppl uses them in different ways to fit their needs.
#### How to see the difference of the two 
A compiler basically turns 1 form of code to another form of code, usually something more lower level that what it was originally.( emphasis on the usually part) Thats it when it comes to a compiler. Its just a translator.
But interpreters  converts the code into some intermediate representation and runs that instead of converting it to machine code.

> In languages like python  it 1st compiles python code to bytecode(intermediate representation) and runs that through a Virtual Machine

> Theres also stuff like transpilers and JIT compilers which the book explains really well.



