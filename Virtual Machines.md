## What is bytecode
A bytecode format is just a sequence of bytes — raw numbers — that your program stores and reads. Think of it like a recipe written in a secret numeric code instead of English.
Each instruction in that sequence starts with one byte: the opcode. That single number tells your interpreter what to do. That's it. The opcode is just an ID number for an operation.
Your interpreter reads a byte, sees 1, and thinks "oh, this is an add instruction." Reads 2, thinks "subtract." And so on.
The word opcode is just short for operation code — the number that encodes which operation to perform. 
 (In many bytecode formats, each instruction is only a single byte long, hence “bytecode”.)

--

**"Bytecode is a series of instructions"**

Think of bytecode as a long list of numbers sitting in memory, one after another. Each number is either an opcode ("do this thing") or extra data that the opcode needs. That's it — just a flat sequence of bytes.

---

**"We'll store some other data along with the instructions"**

Later, you'll need to store more than just opcodes — like the actual numbers/values used in the program (constants), and debug info like line numbers. So rather than keeping these in separate random places, the book wraps everything neatly into one `struct` called a **Chunk**.

```c
typedef struct {
  uint8_t* code;  // the actual bytes (instructions)
} Chunk;
```

Think of `Chunk` as a box that holds your bytecode program — and later, other stuff too.

---

**Why a dynamic array?**

When you're compiling code, you don't know ahead of time how many instructions there'll be. So you can't just say "give me 100 bytes of space." You need an array that grows as you add more instructions — a **dynamic array**.

The book adds two extra fields to track this:

```c
int count;     // how many bytes are actually in use right now
int capacity;  // how many bytes of space we've reserved total
```

Imagine a parking lot. `capacity` is the total number of spaces. `count` is how many cars are actually parked. When the lot is full, you build a bigger lot, move all the cars, and tear down the old one.

---

**How growing works**

When you try to write a new byte and there's no room left (`count == capacity`), it:

1. Calculates a new, bigger capacity (doubles the old one)
2. Allocates a new bigger array
3. Copies everything over
4. Frees the old array
5. Continues writing

This sounds expensive, but on average each write is still super fast — the book mentions "amortized O(1)" which just means: yes, occasionally you pay a big cost to grow, but spread across all writes, each one is cheap.

---

**The `initChunk`, `writeChunk`, `freeChunk` functions**

These are just the three basic operations on your Chunk:

- `initChunk` — sets everything to zero/empty to start fresh
- `writeChunk` — adds a byte to the array (growing it if needed)
- `freeChunk` — releases all the memory when you're done

Since this is C (not Java/Python), memory doesn't clean itself up. You have to manually free it when you're done — that's what `freeChunk` does.

---

**The big picture so far**

You've got a growable array of bytes. You write opcodes into it one by one. Later, a VM will read through them one by one and execute them. That's the whole model. Everything else in the chapter is just building the infrastructure to support that.

Want me to keep going and explain the Constants or Line Information sections too?