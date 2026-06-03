---
Title: Variables
date: 2026-06-02
---
## Why not keep variables in the stack?

## Heap (i think)
We implement variables in a hashmap, it stores: 

```
x -> 10
name -> "bob"
pi -> 3.14
```
## Opcodes

```
OP_DEFINE_GLOBAL
OP_GET_GLOBAL
OP_SET_GLOBAL
```
## Variable Declaration

```
Code: 
x = 5; (right now we dont implement types)

Bytecode: 
PUSH 5
DEFINE_GLOBAL "x"

Stack operations:
stack: [5]

DEFINE_GLOBAL:
    value = pop()
    globals["x"] = value
```
## Variable Access

```
Code:
x + 2

Binary:
GET_GLOBAL "x"
PUSH 2
ADD

Stack Operations:
GET_GLOBAL:
    push(globals["x"])
```
## Variable Assignment

```
x = 10;

PUSH 10
SET_GLOBAL "x"

globals["x"] = peek()
```

