---
Title: Calculator
Date: 2026-06-02
---
Notes on implementing basic arithmetic functions for the VM

So we are going to make our Virtual Machine execute

```
(1+3)*3/4
```

Since we already made the grammar for this, the parser will make a AST. we just have to walk that AST and turn the nodes into bytecode and pass it into the VM. Then in the VM we manually add the code the stack operations (yk pushing and poping vars to and from) for each arithmetic operation.

> See at the start this sound really interesting but after i built it, it seems soo simple i lowkey dont really wanna explain it.