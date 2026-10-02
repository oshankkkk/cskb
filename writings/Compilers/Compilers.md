---
date: 2026-09-30
Title: Understanding Compilers
tags:
  - C
  - systems-programming
  - low-level
---
Compiler Frontend = Preprocessing | Lexeing | Parsing | AST | Semantic analysis
Intermediate Representation	
Compiler Backend = Optimization | Code Gen 
Outside the compiler = Assembler | Linker | Object files | Executable

A language is a set of characters with grammer. Grammer is a set of a rules that we should follow when those characters to get a meaning out of this. In English you can divide a sentence into 3 parts with its grammar.

```
Sentence:= <Subject> <Verb> <Object>
```

These systems of rules all can be divide into 3 types.

Regular Grammars are set of rules used for languages thats just a flat set of characters like a license number or a phone number. Each character or characters in that string according to its grammar has a meaning and thats bout it. The important point is that there is not nesting, you cant nest numbers inside brackets in a phone number ryt. Thats the point, a regular grammar is grammar used for languages thats a FLAT characters.  

> Regular expressions(Regex) even tho they work on regular languages are itself not a regular language. 

Context free grammar is for languages that have nesting. It describes which sequences of tokens are valid and how they can be grouped hierarchically. A CFG does not care about surrounding context when applying grammar, each rule works independently.

Context Sensitive Grammer means based on the context grammar will apply or not. Things like, a variable can only be assigned a value of the same type if its already declared in that type. All of these are actually used when making a programming language The lexer uses regular grammar to distinguish the source code into tokens. The parser uses CFG to generate the AST. The static analysis done in the AST uses CSG concepts to find compile time errors

> There is something bout CSG being computationally expensive to implement directly so ppl uses different methods for that. im still building the parser so ill update this part when im done with the static analysis part.

#### Creating grammar and the Backus-Naur format
BNF is a notation used to design CFG grammar of a language. 
[This is guy on youtube explains BNF beautifully](https://youtu.be/MMxMeX5emUA?si=0bnDadT-yWteg96t)
If your dont wanna watch that heres the summery 
###### Terminals
Terminals are the basic symbols of a language. They come directly from the lexer as tokens and cannot be broken down further by grammar rules. They represent the actual pieces of text written in the source code.

```txt
Expression:
x = 5 + 3

Terminals:
IDENTIFIER  =  NUMBER  +  NUMBER (so basically tokens)
```
###### Non-terminals
Non-terminals are just made up of terminals, like terminals are the atoms and they come together to build a non terminal

```txt
expression, term, factor, statement
```
###### Productions (Grammar Rules)
The productions are the written notation thing on how non terminals are made from terminals

```txt
factor -> NUMBER
expression -> NUMBER  OPERATOR NUMBER
```

```txt
expression → term + expression
expression → term
term → factor * term
term → factor
factor → NUMBER
factor → ( expression )
```
###### Notation rule

```txt
	LHS                      RHS 
Non terminals only := terminals | Non terminals
```

```txt

> Thats how Backus-Naur comes together, terminals, non-terminals and productions 
###### Derivations
A derivation is the step-by-step process of applying grammar rules to generate a valid sequence of terminals. It shows how the parser can produce a string starting from the start symbol. Like math workings yk step by step simplification of these grammar rules to get the terminals, or adding terminals to get the expression.

```txt
Expression:
NUMBER + NUMBER 

Derivation:
expression → expression + term
expression → term
term → NUMBER
```

Language grammar design first this seems easy but its actually kinda hard, you can create different combos, you have to test them and see how stuff works recursively. Also there can be multiple correct grammar sets for a language.
We are going to make the grammar and represent it with BNF

```txt
##### Grammar
```text
Expression 1:
	1+2
BNF Grammar:
	start:= expression
	expression:=number operator expression
	number:= digit|digit number
	digit:= 1 2 3 4 5 6 7 8 9 0 
	operator:= "=" "+" "-" "/"
	
Expression 2:
	( 1 + 2 )* 3 - 4 + 2
BNF Grammar:
	start:= expression
	expression:=expression operator expression | number | order 
	(expression:=number operator number| number operator expression | order operator expression)
	order:="(" expression ")"
	number:= digit|digit number
	digit:= 1 2 3 4 5 6 7 8 9 0 
	operator:= "=" "+" "-" "/"
	
Expression 3:
hello@mail.com
hello@org.ac.uk
john.doe@gmail.com
BNF Grammar:
	<email>   ::= <local> "@" <domain>
	<local>   ::= <word> | <word> "." <local>
	<domain>  ::= <word> | <word> "." <domain>
	<word>    ::= <letter> | <letter> <word>
	<letter>  ::= a | b | c | d | e | f | g | h | i | j | k | l | m
	            | n | o | p | q | r | s | t | u | v | w | x | y | z
```

