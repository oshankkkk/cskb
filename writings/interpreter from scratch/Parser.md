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
###### Context-free grammars
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

```
	LHS                      RHS 
Non terminals only := terminals | Non terminals
```

| Concept                     | Description                                                                                                                                                                                                                                                 | Examples                                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Terminals                   | Terminals are the basic symbols of the language. They come directly from the lexer as tokens. Terminals cannot be broken down further by grammar rules. They represent the actual input elements.                                                           | NUMBER, IDENTIFIER, +, -, *, /, (, ), =                         |
| Non-Terminals               | Non-terminals are abstract grammar symbols used to describe structure. They do not appear in the final program text. Instead, they define how terminals and other non-terminals combine.                                                                    | expression, term, factor, statement                             |
| Productions (Grammar Rules) | A production (or rule) defines how a non-terminal expands into other symbols. Every production has: * A head (the non-terminal being defined/factor) * A body (the sequence it expands into/statement). Productions are the building blocks of the grammar. | factor → NUMBER; statement → IDENTIFIER = expression            |
| Derivations                 | A derivation is the step-by-step process of applying grammar rules to produce a sequence of terminals. It shows how a string can be generated from the start symbol.                                                                                        | expression → expression + term → term → NUMBER (example: 2 + 3) |
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

Another thing is association, which is kind of automatically handled by recursive decent

```
expression is:
  a term
  followed by zero or more of:
    (a + or -) then another term

term        → 1
(+ term)    → + 2
(- term)    → - 3

term is:
  a primary
  followed by zero or more of:
    (a * or /) then another primary

a raw number    → 2, 3, 42
OR
an order        → (expression)   ← i.e. something in brackets

expression sees:
  term → (1+2)*3       ← term handles the * part
  - term → - 4
  + term → + 2

but how does term get (1+2)*3?
  term sees:
    primary → (1+2)    ← primary handles the brackets
    * primary → * 3

but how does primary get (1+2)?
  primary sees ( → calls expression again!
    expression resolves 1+2 inside the brackets
  primary wraps it in Grouping(1+2)
  
expression    handles + -        (weakest, last)
    ↓
term          handles * /
    ↓
primary       handles numbers and ()   (strongest, first)
```




#### Terminals
Terminals are the basic symbols of the language. They come directly from the lexer as tokens. Terminals cannot be broken down further by grammar rules. They represent the actual input elements.

```text
NUMBER
IDENTIFIER
+
-
*
/
(
)
=
```
In a parse tree, terminals appear as the leaf nodes.
#### Non-Terminals
Non-terminals are abstract grammar symbols used to describe structure. They do not appear in the final program text. Instead, they define how terminals and other non-terminals combine.

```text
expression
term
factor
statement
```
Non-terminals are expanded using productions. They represent higher-level concepts in the language.

#### Productions (Grammar Rules)
A production (or rule) defines how a non-terminal expands into other symbols. Every production has:
* A head (the non-terminal being defined/factor)
* A body (the sequence it expands into/statement)

```text
factor → NUMBER
statement → IDENTIFIER = expression
```
This rule says a statement consists of an identifier, an equals sign, and an expression. Productions are the building blocks of the grammar.

#### Derivations
A derivation is the step-by-step process of applying grammar rules to produce a sequence of terminals. It shows how a string can be generated from the start symbol.

```text
2 + 3

Grammer: 
expression → expression + term
expression → term
term → NUMBER
```

