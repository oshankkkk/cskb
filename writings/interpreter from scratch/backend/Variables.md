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

Notice `SET_GLOBAL` usually doesn't pop in clox.

This allows assignments to behave as expressions:
 
```
print x = 10;
```

The value remains on the stack.

---

# Where Does The Variable Name Go?

Bytecode is just numbers, so variable names are stored in the **constant pool**.

Example:

```text
Constants:
0 -> "x"
1 -> 5

Bytecode:
OP_CONSTANT 1
OP_DEFINE_GLOBAL 0
```

The opcode uses an index into the constants table.
