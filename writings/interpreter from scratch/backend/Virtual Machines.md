## What is bytecode
A bytecode format is just a sequence of bytes — raw numbers — that your program stores and reads. Think of it like a recipe written in a secret numeric code instead of English.
Each instruction in that sequence starts with one byte: the opcode. That single number tells your interpreter what to do. That's it. The opcode is just an ID number for an operation.
Your interpreter reads a byte, sees 1, and thinks "oh, this is an add instruction." Reads 2, thinks "subtract." And so on.
The word opcode is just short for operation code — the number that encodes which operation to perform. 
 (In many bytecode formats, each instruction is only a single byte long, hence “bytecode”.)

