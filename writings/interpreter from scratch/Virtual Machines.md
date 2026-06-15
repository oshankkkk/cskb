---
Titles: Virtual Machines
date: 2026-05-31
---
Notes on building a virtual machine for a interpreter from scratch

So we are building our own virtual "computer" to run our language code. (we make our own little "RAM" and stuff yk). A VM is a program emulating the inner workings on the computer. But we can make that computer specific to this language. yk like we can make a computer that only can execute our programming instructions instead of just executing everything. Thats kind of language VMs in a nutshell. 
#### Bytecode
The syntax tree is very complex structure and is bout the representation of the code, it shows a lot of info like line numbers and precedence stuff that you dont really need for the direct execution of it. So we are not parsing the AST into the virtual machine directly, we are converting into a more workable parsable data structure called bytecode. It is basically a array to instructions that the VM is going to execute. The instructions are usually 1 byte long, hence its called bytecode.
#### Memory
So a computer stores instructions in its memory. So since we are technically making our own computer to execute our instructions, it needs a memory as well. Memory is just a big flat array of bytes and every byte has an address. Each program gets their own piece of memory allocated by the OS. Inside that "chunck" of memory theres 2 data structures called the stack and the heap. 
###### Stack 
The stack follows the LIFO method and stuff inside the stack is called stack frames.
###### Heap
The stuff init live longer than the stack, This is where the memory leaks happen.
###### Code Segment
In the RAM theres code segments as well. Thats where the native code (the instructions) is saved.
###### Data segment
This is where all the global variables are saved apperently, i dont know how yet.

![[Virtual Machines-1780550075063.webp]]
#### Running out of memory
So the stack and heap grows downward and upwards the memory addresses. They are in the opposite ends of the memory chunck and eats it away from both sides. Depending on who eats the most and runs into the other you can either get a stack overflow error or a out of memory error. 
#### Registers
Here's the problem: RAM, even though it's fast, is still outside the CPU. The RAM is physically outside the CPU so their is still a latency. Registers are RAM thats built into the CPU circuitry. This is very very fast compared to the RAM. Its used as a cache. Theres bunch of small registers in a CPU in different levels of caches.

```txt
Registers  → a sticky note on your desk       (instant)
L1 Cache   → your desk drawer                 (very fast)
L2/L3 Cache→ filing cabinet in the room       (fast)
RAM        → storage room down the hall       (slow-ish)
Disk       → a warehouse across town          (very slow)
```

> Stack VMs are easier to build so im gonna go with that.
#### Opcodes and Operands
An opcode (operation code) is the numeric identifier that tells the virtual‑machine (VM) which operation to perform. We use memonics to understand opcodes, they are human readable names given for the opcodes, (kinda like assembly). The memonics are in a hashmap and we just get keys for them which are opcodes. The opcodes goes in the bytearray, taking the memonic instructions and turning them into bytecode is the compilation part in this language.

After the opcode there are the oprands (opcode arguments) for those opcodes, not all opcodes has them, they are just the next value in the bytecode. Just like opcodes they are also stored in a separate data structure like a array and put into bytecode through the compilation process.
#### What are 
what are words, it what crafting interpreters calls chucks i think. 

> https://andreabergia.com/series/stack-based-virtual-machines/ A very very good resource

