---
date: 2026-09-30
Title: Compiled vs Interpetered
tags: []
---
Preprocessing(Marcros, conditional compilation) - Lexer - Parser - AST - Semantic analysis(Type checking and stuff) - IR - Optimisation - Code Generator - Assembler-Linker

> We are just reading from the file and translating what we read into something else based on our needs. A programming language is technically a fansy config language for a code generator

Compilation and interpretation are methods of language implementations, like one can make a [C interpreter](https://github.com/jpoirier/picoc) or a compiler for some originally interpreted language. But the difference is little more complex than the traditional line by line code execute is interpreted while the whole program code execute is compiled thing. Modern languages like of blurs the line of compiled and interpreted implementations. Specially when it comes to "interpreted" stuff.
A compiler basically turns 1 form of code to another form of code, usually something more lower level that what it was originally.( emphasis on the usually part) Thats it when it comes to a compiler. Its just a translator. But interpreters  converts the code into some intermediate representation and runs that instead of converting it to machine code.

> Java being compiled and interpreted, cause it compiled to java bytecode and then runs inside the JVM where they use JIT compilation. And then theres tsc(Typescript Compiler), but ts is not even compiled (its transpiled into js and gets JIT compiled in V8)
