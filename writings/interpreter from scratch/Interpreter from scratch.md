---
id: Interpreter from scratch
aliases: []
tags: []
date: 2026-05-20
---
The Language name is Giggles, and the file extension is .gg .
Its made with Go and the syntax is kind of inspired by [lua](https://www.lua.org/).

References i used:
- [Crafting interpreters book](https://craftinginterpreters.com)
-  [Cool video bout grammars and parser](https://youtu.be/ENKT0Z3gldE?si=qL2AxzWbKFLekSV6)
- [Another one i watched on parsers](https://www.youtube.com/watch?v=SToUyjAsaFk)
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
Compilation and interpretation are methods of language implementations. Its a little more complex than line by line code execute is interpreted while the whole program code execute is compiled. 

I dont feel like writing it so go read the chapter 2 on the book



