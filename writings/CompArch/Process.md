---
Title: Understanding a process
date: 2026-07-05
---
So the basic idea is that a "program" is the exe. It is this passive blob of instructions thats in stored in the disk. A process is a execution of that instructions, a instance of it. Like a object to a class yk.
## Understanding a process
A process is what a program becomes once its load into the memory, that instant it becomes a process.
The process may then need additional memory along the way to hold user input, temporary results, and other runtime data.
The operating system hands out that memory as needed, and the full block of memory assigned to a process called its address space.

## One CPU, Many Processes

Modern operating systems run far more processes than they have CPUs to run them on. The trick is concurrency, processes take turns using the CPU, switching in and out of a queue so quickly that it feels like everything is happening at once. At any given moment, though, only one process is actually executing on a given CPU core everyone else is waiting.

The CPU stores  a copy state when each process is bout to switch so once they come back you can reload that state and start from there. This is called context switching.

Security, A process could read sensitive leftover data from whatever ran before it. If the prior process was hashing a password, for example, fragments of that password might still be sitting in the registers — free for the next process to read.

Correctness, Even a well-behaved process that has no interest in snooping on prior data still has to use the registers to do its own work, which means overwriting whatever was there. When the original process eventually gets the CPU back, the exact state it was in when it got interrupted is gone.

> Process is the execution of instructions and its execution context.
## A Process Is a Context

At this point it's fair to ask: what asstually makes up a process, besides the address space and the CPU state described above? The answer is: quite a lot more. A process typically also owns a list of open files and any I/O devices allocated to it.

Put it all together and a process stops looking like a single, simple thing. It's better described as an entire **context** — a bundle of state that's isolated from every other process running on the machine. That's also a tidy explanation for why the mechanism we just covered is called a *context* switch: switching processes means swapping out the entire context the system is currently operating in.

It also explains something that might otherwise seem strange: two processes can run the exact same executable and still produce completely different results, because the outcome doesn't depend only on the instructions — it depends on the context those instructions run in. It's a bit like answering "in what context?" when someone asks you an ambiguous question. The same instructions, in a different context, can mean something different.

Process are stores in a data structure called the **Process Control Block**, or **PCB**. Every process gets one, and it typically includes:

- A unique **process ID**
- The process's current **state** (more on this below)
- Its **CPU state** — program counter, general-purpose registers, instruction register, flags, and (depending on the hardware) things like a stack pointer, index registers, or accumulators. This is exactly the data captured and restored during a context switch.
- **Memory management information** — at minimum, the boundaries of the process's address space, so the OS can prevent one process from reading or writing into another's memory, and so it knows which memory regions are free when a new process needs one.
- Other allocated resources, such as open files and I/O devices.

The PCB isn't the process itself — it's a representation of the process. It's the repository of everything the OS needs to start a process for the first time or resume it later, plus some bookkeeping information on top. And it's this representation, not the process itself, that actually sits in the scheduling queue.












References: [Core dummped OS explaintions series](https://youtu.be/7ge7u5VUSbE?si=bzpH-FSRue8z1jw4)