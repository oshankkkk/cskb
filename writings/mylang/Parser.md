# Building the Parser for sprinklelang (--placeholder-name)
## Language grammar
### Backus-Naur Format of writing language grammar
Grammar is a set of rules used for producing and recognizing, a set of strings.
##### Different types of grammars. 
###### Regular Grammars
###### Context-free grammars
###### Context sensitive grammars

https://www.youtube.com/watch?v=SToUyjAsaFk
https://youtu.be/0c8b7YfsBKs?t=186
https://en.wikipedia.org/wiki/Compilers:_Principles,_Techniques,_and_Tools
#### Writing grammar and building a AST 

We are going to make the grammar and represent it with BNF
```
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

It's like a bubble up effect:

```
primary() finds raw tokens → wraps in NumberNode
    ↑
factor() receives NumberNodes → sees * → wraps in BinaryNode
    ↑
term() receives BinaryNodes → sees + → wraps in BinaryNode
    ↑
equality() receives BinaryNodes → sees == → wraps in BinaryNode
```

Each layer:
1. **goes down** to get stuff
2. **wraps it** in a node
3. **sends it up** to whoever called it

So for `(1+2+3)*4`:

```
primary() → NumberNode(1)  ┐
primary() → NumberNode(2)  ├→ term() wraps → BinaryNode(1+2+3)
primary() → NumberNode(3)  ┘       ↓
                               GroupingNode(1+2+3)
                                       ↓
primary() → NumberNode(4)  →  factor() wraps → BinaryNode(Group * 4)
```

The tree literally **builds itself bottom up** as the recursion unwinds back up the call stack.

And that's why it's called an **Abstract Syntax TREE** — because what you end up with is literally a tree:

```
        *
       / \
      ( ) 4
       |
       +
      / \
     +   3
    / \
   1   2
```

The interpreter then just walks this tree from top to bottom and computes. You nailed it man!
#### Coding the parser
We make objects of these grammars. 

Taking in the tokens made by the lexer and converting it into a AST( Abstract Syntax Tree ). For that first we have to design how the language grammar will work. 

```
Lexer output:

IF, LPAREN, IDENT(x), GT, NUMBER(3), RPAREN,
IDENT(y), ASSIGN, NUMBER(5), SEMICOLON
```
- No scope among tokens for local, global and nesting code blocks
- Stuff like BODMAS in math operations
#### Understanding grammer in a programming language 
A context-free grammar is a formal system used to define the structure of a programming language. It describes which sequences of tokens are valid and how they can be grouped hierarchically. A CFG does not care about surrounding context when applying rules; each rule works independently.
 
```text
expression → expression + term
expression → term
term → NUMBER
```
This grammar defines how arithmetic expressions are structured. It says an `expression` can be another `expression` followed by `+` and a `term`, or it can simply be a `term`.
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

Basic flow:

```
expression

expression → expression + term

term + term

NUMBER + NUMBER

```

This sequence of rule applications is a derivation.
#### Abstract Syntax Tree

A parse tree represents the hierarchical structure created by a derivation. It visually shows how the grammar rules were applied.
* Internal nodes are non-terminals.
* Leaves are terminals.
* The structure reflects the grammar rules.







- 🍅 (pomodoro::WORK) (duration:: 30m) (begin:: 2026-05-18 10:27) - (end:: 2026-05-18 10:57)
- 🥤 (pomodoro::BREAK) (duration:: 10m) (begin:: 2026-05-18 11:00) - (end:: 2026-05-18 11:10)
- 🍅 (pomodoro::WORK) (duration:: 30m) (begin:: 2026-05-18 14:06) - (end:: 2026-05-18 14:36)