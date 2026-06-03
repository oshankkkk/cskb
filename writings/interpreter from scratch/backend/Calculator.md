---
Title: Calculator
Date: 2026-06-02
---
So we are going to make our Virtual Machine execute

```
(1+3)*3/4
```

Since we already made the grammar for this, the parser will make a AST. we just have to walk that AST and turn the nodes into bytecode and pass it into the VM. Then in the VM we manually add the stack operations for each arithmetic operation.


