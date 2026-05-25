The Language name is Giggle, and the file extension is .gg .
Its made with Go and the syntax is kind of inspired by [lua](https://www.lua.org/).

References i used:
- [Crafting interpreters book](https://craftinginterpreters.com)
-  [Cool video bout grammars and parser](https://youtu.be/ENKT0Z3gldE?si=qL2AxzWbKFLekSV6)
- [Another one i watched on parsers](https://www.youtube.com/watch?v=SToUyjAsaFk)
- [The Dragon Book ](https://dpvipracollege.ac.in/wp-content/uploads/2023/01/Alfred-V.-Aho-Monica-S.-Lam-Ravi-Sethi-Jeffrey-D.-Ullman-Compilers-Principles-Techniques-and-Tools-Pearson_Addison-Wesley-2007.pdf) (This was too complex for me or prolly for anyone thats doing these kinda stuff for the 1st time. But it has everything you need and its considered the gold standard when it comes to building compilers)
- [r/compilers](https://www.reddit.com/r/Compilers/) 
## How a programming language works

![[Interpreter from scratch-1779703370444.webp|579]]

#### Scanning
The code you write is just a long string of characters. Scanning breaks that string into meaningful chunks — like how you'd break a sentence into individual words. White space and comments get thrown away since they don't mean anything to the language.
#### Parsing
Once you have those chunks, parsing arranges them into a tree shape that shows how everything relates to each other — which parts are nested inside which. It also catches mistakes in your code's structure, like missing brackets or wrong syntax.
#### Static Analysis
This is where the language figures out what your code actually means. It looks up what every variable name refers to, where it was defined, and whether you're using it correctly. For typed languages, it also checks that your types make sense. All the findings get saved somewhere — either attached to the tree, in a lookup table, or in a whole new structure — so later stages can use them.
#### Intermediate Representation (IR)
The code gets converted into a middle format that isn't tied to any specific language or machine. This makes it easy to support many different languages and devices without rewriting everything from scratch — you just plug in different front and back ends.
#### Optimization
Once the meaning of the code is understood, it can be swapped out for a leaner version that does the exact same thing but faster. For example, math that never changes can just be pre-calculated so the program doesn't waste time doing it at runtime.
#### Code Generation
The code gets translated into something the machine can actually run — very low-level instructions the CPU understands. You can either target a real chip (fast but tied to one device) or a made-up "virtual" one called bytecode (slower but works anywhere).
#### Virtual Machine
If bytecode was produced, something needs to actually run it since no real chip understands it. A virtual machine is basically a program that pretends to be that imaginary chip, running the bytecode step by step. It's slower than native code but much more portable.

Even after the program is compiled and running, the language still needs to provide some services in the background — like cleaning up unused memory or keeping track of what type each object is. All of that behind-the-scenes work happening while the program runs is called the runtime.

> This is just a summery, if this is even a little interesting, please go read [the whole chapter](https://craftinginterpreters.com/a-map-of-the-territory.html) (chapter 2) on the actual book. The author goes in depth on all the components, gives examples on how they work, why they exist  and other alternative implementations for these as well. ALSO THE BOOK IS FREE.
### Compiled vs Interpreted
Compilation and interpretation are methods of language implementations. Its a little more complex than line by line code execute is interpreted while the whole program code execute is compiled. 

I dont feel like writing it so go read the chapter 2 on the book
