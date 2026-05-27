### whats bytecode
Structurally, bytecode resembles machine code. It’s a dense, linear sequence of binary instructions. That keeps overhead low and plays nice with the cache. However, it’s a much simpler, higher-level instruction set than any real chip out there. (In many bytecode formats, each instruction is only a single byte long, hence “bytecode”.)

It retains the portability of a tree-walker—we won’t be getting our hands dirty with assembly code in this book. It sacrifices _some_ simplicity to get a performance boost in return, though not as fast as going fully native.

And then again, a compiler doesn’t even have to be a tool you run on the command line, that
reads in source code and outputs code in a file, like gcc or go. It can just as well be a single
function that takes in an AST and returns a string. That’s also a compiler. A compiler can be
written in a few hundred lines of code or have millions of them.