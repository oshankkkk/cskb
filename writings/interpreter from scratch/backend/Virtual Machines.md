---
Titles: Virtual Machines
date: 2026-05-31
---
So we are building our own virtual "computer" to run our language code. (we make our own little "RAM" and stuff yk).
A VM is a program emulating the inner workings on the computer. But we can make that computer specific to this language. yk like we can make a computer that only can execute our programming instructions instead of just executing everything. Thats kind of language VMs in a nutshell. 
#### Bytecode
The syntax tree is very complex structure and is bout the representation of the code, it shows a lot of info like line numbers and precedence stuff that you dont really need for the direct execution of it. So we are not parsing the AST into the virtual machine directly, we are converting into a more workable parsable data structure called bytecode. It is basically a array to instructions that the VM is going to execute. The instructions are usually 1 byte long, hence its called bytecode.
#### Memory
So a computer stores instructions in its memory. So since we are technically making our own computer to execute our instructions, it needs a memory as well. In a computers memory there is a place called "The Stack". It is basically a place in the RAM assigned for each program by the OS, that is used for store its instructions in a stack data structure.  
> Is the PCs RAM just filled with bunch of stacks of the programs thats running, is thats whats its for?
> What are the registers do then?
> What are the L3 caches? 

#### Registers

> Stack VMs are easier to build so im gonna go with that.




 