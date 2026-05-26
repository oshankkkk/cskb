---
title: Parser
date: 2026-05-24
modified: 2026-05-26
---
Notes on building the language parser from scratch.
## Language grammar
A language grammars are rules used for producing and recognizing language. In English you can divide a sentence into 3 parts with its grammar.

```
Sentence:= <Subject> <Verb> <Object>
```

Taking the language understanding its structure and breaking it down to its bones layer by layer according to the grammar is called parsing. This means to build one 1st one should actually understand how the grammar works in that language. This gets hard depending on the complexity of the language and how big it is (obviously).
#### Different types of grammars. 
These systems of rules all can be divide into 3 types.
###### Regular Grammars
Regular Grammars are set of rules used for languages thats just a flat set of characters like a license number or a phone number, yk Each character or characters in that string according to its grammar has a meaning and thats bout it.  
The important point is that there is not nesting, you cant nest numbers inside brackets in a phone number ryt. Thats the point, a regular grammar is grammar used for languages thats a FLAT characters.  
###### Context free grammars
Unlike regular grammar this grammar is for languages that have nesting. 

>Regular expressions(Regex) even tho they work on regular languages are itself not a regular language lol.
 
It describes which sequences of tokens are valid and how they can be grouped hierarchically. 
A CFG does not care about surrounding context when applying grammar, each rule works independently.
(which means each grammar rule is independent)
###### Context sensitive grammars
CSG means based on the context grammar will apply or not. Things like, a variable can only be assigned a value of the same type if its already declared in that type.
All of these are actually used when making a programming language
The lexer uses regular grammar to distinguish the source code into tokens. 
The parser uses CFG to generate the AST
The static analysis done in the AST uses CSG concepts to find compile time errors

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

```
	LHS                      RHS 
Non terminals only := terminals | Non terminals
```

```

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
``

Language grammar design first this seems easy but its actually kinda hard, you can create different combos, you have to test them and see how stuff works recursively. Also there can be multiple correct grammar sets for a language.
We are going to make the grammar and represent it with BNF

```
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
#### Recursive Decent Parser
Recursive decent is a top down parser. Its a very common and standard parsing algorithm and used in compilers like C, Rust and Go. Also javascript V8 uses this as well. 

> This is real shit bn, i wish more ppl where into these stuff

When making a grammar for a arithmetic expression something you have to keep in mind is BODMAS. yk that Brackets,Of,Division,Multiplication,Addition thing. The order of operations. So since we are using a top down parser we need the stuff to be done 1st be implemented at the bottom cause thats how top down recursion works.

```
Expression 2:

Each layer goes down and wraps the result in a node object (cause its a syntax TREE we are making) and sends it up

equality() receives BinaryNodes → sees == → wraps in BinaryNode
    ↑
term() receives BinaryNodes → sees + → wraps in BinaryNode
    ↑
factor() receives NumberNodes → sees * → wraps in BinaryNode
    ↑
primary() finds raw tokens → wraps in NumberNode
```
##### Parsing a arithmetic expression

```
(1 + 2 + 3) * 4
```
###### How it works
The parser fibonaccies its down and bubbles up the AST. I generated a stack trace on how the recursion happends step by step. if you dont get this just follow the recursion and write it down with pen and paper idk

```
parse() called
│
└── calls term()
    │
    └── term() called
        │
        └── calls factor()
            │
            └── factor() called
                │
                ├── calls primary()
                │   │
                │   └── primary() called
                │       │
                │       ├── sees LEFT_PAREN "("
                │       │   └── advance() 👆 pointer moves past "("
                │       │
                │       ├── parses inside grouping
                │       │   │
                │       │   └── calls inner term()
                │       │       │
                │       │       └── inner term() called
                │       │           │
                │       │           ├── calls factor()
                │       │           │   │
                │       │           │   └── factor() called
                │       │           │       │
                │       │           │       ├── calls primary()
                │       │           │       │   │
                │       │           │       │   └── primary() called
                │       │           │       │       │
                │       │           │       │       ├── sees INTEGER "1"
                │       │           │       │       │   └── advance() 👆 past "1"
                │       │           │       │       │
                │       │           │       │       └── returns NumberNode(1)
                │       │           │       │
                │       │           │       ├── factor() checks "*" or "/"
                │       │           │       │   └── sees PLUS "+"
                │       │           │       │       └── not mine ❌
                │       │           │       │
                │       │           │       └── returns NumberNode(1)
                │       │           │
                │       │           ├── term() checks "+" or "-"
                │       │           │   │
                │       │           │   └── sees PLUS "+"
                │       │           │       └── advance() 👆 past "+"
                │       │           │
                │       │           ├── parses right side of "+"
                │       │           │   │
                │       │           │   └── calls factor()
                │       │           │       │
                │       │           │       └── factor() called
                │       │           │           │
                │       │           │           ├── calls primary()
                │       │           │           │   │
                │       │           │           │   └── primary() called
                │       │           │           │       │
                │       │           │           │       ├── sees INTEGER "2"
                │       │           │           │       │   └── advance() 👆 past "2"
                │       │           │           │       │
                │       │           │           │       └── returns NumberNode(2)
                │       │           │           │
                │       │           │           ├── factor() checks "*" or "/"
                │       │           │           │   └── sees PLUS "+"
                │       │           │           │       └── not mine ❌
                │       │           │           │
                │       │           │           └── returns NumberNode(2)
                │       │           │
                │       │           ├── builds
                │       │           │   │
                │       │           │   └── BinaryNode(
                │       │           │         NumberNode(1)
                │       │           │         +
                │       │           │         NumberNode(2)
                │       │           │       )
                │       │           │
                │       │           ├── term() checks again
                │       │           │   │
                │       │           │   └── sees PLUS "+"
                │       │           │       └── advance() 👆 past "+"
                │       │           │
                │       │           ├── parses right side again
                │       │           │   │
                │       │           │   └── calls factor()
                │       │           │       │
                │       │           │       └── factor() called
                │       │           │           │
                │       │           │           ├── calls primary()
                │       │           │           │   │
                │       │           │           │   └── primary() called
                │       │           │           │       │
                │       │           │           │       ├── sees INTEGER "3"
                │       │           │           │       │   └── advance() 👆 past "3"
                │       │           │           │       │
                │       │           │           │       └── returns NumberNode(3)
                │       │           │           │
                │       │           │           ├── factor() checks "*" or "/"
                │       │           │           │   └── sees RIGHT_PAREN ")"
                │       │           │           │       └── not mine ❌
                │       │           │           │
                │       │           │           └── returns NumberNode(3)
                │       │           │
                │       │           ├── builds
                │       │           │   │
                │       │           │   └── BinaryNode(
                │       │           │         BinaryNode(1 + 2)
                │       │           │         +
                │       │           │         NumberNode(3)
                │       │           │       )
                │       │           │
                │       │           ├── term() checks again
                │       │           │   └── sees RIGHT_PAREN ")"
                │       │           │       └── stop parsing additions
                │       │           │
                │       │           └── returns BinaryNode(1 + 2 + 3)
                │       │
                │       ├── expects RIGHT_PAREN ")"
                │       │   └── advance() 👆 pointer moves past ")"
                │       │
                │       ├── wraps into
                │       │   │
                │       │   └── GroupingNode(
                │       │         BinaryNode(1 + 2 + 3)
                │       │       )
                │       │
                │       └── returns GroupingNode
                │
                ├── factor() checks "*" or "/"
                │   │
                │   └── sees STAR "*"
                │       └── advance() 👆 pointer moves past "*"
                │
                ├── parses right side of "*"
                │   │
                │   └── calls primary()
                │       │
                │       └── primary() called
                │           │
                │           ├── sees INTEGER "4"
                │           │   └── advance() 👆 pointer moves past "4"
                │           │
                │           └── returns NumberNode(4)
                │
                └── builds
                    │
                    └── BinaryNode(
                          GroupingNode(1 + 2 + 3)
                          *
                          NumberNode(4)
                        )

term() returns final AST 
```
###### Final AST

```
BinaryNode(
  GroupingNode(
    BinaryNode(
      BinaryNode(1 + 2)
      +
      NumberNode(3)
    )
  )
  *
  NumberNode(4)
)

```

> Another thing is association, which is kind of automatically handled by recursive decent. 


