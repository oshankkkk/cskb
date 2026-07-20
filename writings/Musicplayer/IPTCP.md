##### Serialization and deserialization
Serialization is the process of converting an object or data structure into a sequence of bytes so it can be saved to a file, database or shared between processes or networks. Later, those bytes can be converted back into the original object. This reverse process is called deserialization.

<iframe title="Serialization - A Crash Course" src="https://www.youtube.com/embed/uS37TujnLRw?feature=oembed" height="113" width="200" allowfullscreen="" allow="fullscreen" style="aspect-ratio: 1.76991 / 1; width: 40%; height: 40%;"></iframe>

All serialization produces bytes.

The difference is what those bytes represent.

There are two broad categories:

Text serialization: the bytes represent human-readable characters.
Binary serialization: the bytes represent the data directly in a machine-oriented format.

So it's called text serialization because the serialized bytes are valid text.

We build our own json like format that does not represet text n utf 8 thats binary serrialization

serialization exists because objects only exist in your program's memory. Memory disappears when the program exits, and another program or computer cannot directly understand your program's memory layout.

Why can't we just send memory?

Because memory is not portable.

For example:

typedef struct {
    char *title;
    int duration;
} Song;

Suppose:

title pointer = 0x7ffe12345678

If you send those bytes to another computer:

0x7ffe12345678

that address means absolutely nothing there.

Pointers are only valid inside the process that created them.

Serialization replaces pointers with the actual data they point to.

Serialization is used whenever data needs to leave your program's memory—whether that's to be:

saved to disk,
sent over a network,
stored in a database,
cached,
or passed to another process.

As soon as data crosses the boundary of your process's RAM, it almost always needs to be serialized first.

Then what is serialization really?

Serialization is simply:

Converting an in-memory representation into a sequence of bytes.

Deserialization is:

Converting those bytes back into an in-memory representation.

Not every sequence of bytes on a disk is the result of serializing an object in your program. For example:

A random binary blob is just bytes.
A compiled executable (.exe, ELF binary) is machine code and metadata, not a serialized C struct.

But whenever you're taking structured data (objects, structs, arrays, maps, etc.) and storing or transmitting it, you're using some form of serialization.

<iframe title="RPC from scratch in C" src="https://www.youtube.com/embed/PIqHAythNO4?feature=oembed" height="113" width="200" allowfullscreen="" allow="fullscreen" style="aspect-ratio: 1.76991 / 1; width: 40%; height: 40%;"></iframe>

