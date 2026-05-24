All my notes on building the language parser from scratch.
## Language grammar
A language grammars are rules used for producing and recognizing it. In English you can divide a sentence into 3 parts with its grammar.

```
Sentence:= <Subject> <Verb> <Object>
```

Taking the language and breaking it down to its bones layer by layer according to the grammar is called parsing. This means to build one 1st one should actually understand how the grammar works in that language. This gets hard depending on the complexity of the language and how big it is (obviously).
#### Different types of grammars. 
These systems of rules all can be divide into 3 types.
###### Regular Grammars

###### Context-free grammars
This type of grammar in langauges 
It describes which sequences of tokens are valid and how they can be grouped hierarchically. 
A CFG does not care about surrounding context when applying rules; each rule works independently.
###### Context sensitive grammars

https://www.youtube.com/watch?v=SToUyjAsaFk
https://youtu.be/0c8b7YfsBKs?t=186
https://en.wikipedia.org/wiki/Compilers:_Principles,_Techniques,_and_Tools
https://www.youtube.com/watch?v=WgEsPTAL55Q
#### Creating grammar and the Backus-Naur format
BNF is a notation used to design the grammar of a language.  
At first this seems easy but its actually kinda hard, you can create different combos, you have to test them and how stuff works recursively. Also there is no one single correct grammar for a language.
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
> Precedence is important

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


Okay let me break each one down!

**Rule 1: `expression := term (("+"|"-") term)*`**

Read it as:
```
expression is:
  a term
  followed by zero or more of:
    (a + or -) then another term
```

So for `1 + 2 - 3` it reads as:
```
term        → 1
(+ term)    → + 2
(- term)    → - 3
```

The `*` at the end just means **zero or more times**. So a single `1` with no `+` or `-` is also a valid expression — it just has zero repetitions.

**Rule 2: `term := primary (("*"|"/") primary)*`**

Same idea but one level down:
```
term is:
  a primary
  followed by zero or more of:
    (a * or /) then another primary
```

So for `2 * 3 / 4`:
```
primary      → 2
(* primary)  → * 3
(/ primary)  → / 4
```

**Rule 3: `primary := number | order`**

This one is simple — primary is either:
```
a raw number    → 2, 3, 42
OR
an order        → (expression)   ← i.e. something in brackets
```

**Now see how they chain together:**

For `(1 + 2) * 3 - 4 + 2`:
```
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
```

**The key insight is:**

Each rule only calls the rule below it, which is why `*` and `/` always get resolved before `+` and `-`. `term` is below `expression` so it always finishes first — just like our worker chain!

```
expression    handles + -        (weakest, last)
    ↓
term          handles * /
    ↓
primary       handles numbers and ()   (strongest, first)
```

The grammar rules ARE the worker chain, just written on paper instead of code!


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
