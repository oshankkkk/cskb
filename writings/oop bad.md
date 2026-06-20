---
Title: oop bad
date: 2026-06-17
---
## Notes on why OOP is bad by Brian Will

[The video on youtube](https://www.youtube.com/watch?v=QM1iUe6IofM)

- Procedural imperative, Procedural functional, OOP and imperative programming
- Whats Data oriented programming?
- The guy explains why ppl loved java in the 90s really nicely
- Why and how OOP was made and why it work 
 - When programming in C in windows, you HAVE to use win32 API? is it a SDK thingy. what happend to syscalls and shit? idk i dont use windows 
- Java dont have header files? whats import then, i has a shit ton of them.
- So its that OOP demands a strict structure, but sometimes to maintain that hierarchy, we have to add more abstractions and generalizations. 
- Too many generalizations suck and most of the time ppl break them and half implement shit which also suck 
- Thats the problem of OOP
- I personally have not felt this because i haven't worked on that big of a codebase, but i do hate when you have to gd multiple files to get to the actual code. Also in java i have to think on how this relate than to actually start coding sucks and like having multiple ways to structure it cause class names should feel like english
- At the end the guy gives some advice on how to make procedural programming more scalable. These advice are really simple and makes sense super quickly. The heart of the video is not about that tho, Its more on how OOP came to be this popular and why it sucks.

> The code looking nice does not mean its Scalable. Those 2 are not the same thing
##### How to write good procedural code
- Do not be afraid of long functions. if the function is really long, use private helper functions or anonymous functions so that things are still separate.
- Parameterize as the default way of passing stuff 
 
 ##### Topics discussed on the video based on the top comment
- Definition of Terms (Procedural, Imperative, Functional)
- Why does OOP dominate the industry? (Java)
-  What is the appeal of OOP?
-  The One True Way to do OOP (Bandaids)
-  What's wrong with OOP (Encapsulation)
-  Shared State (Not too different than a global variable)
-  Encapsulation requires direct hierarchy (Problems.)
-  Premature erected wall building = cool-aide man solutions (OOoooH YeaaaaH!) 
-  When starting bad structure is worse than an absence of structure 
-  The mind games of OOP (Unnatural data types, kingdom of nouns, Manager classes)
-  Stupid questions you have to ask yourself (Analysis paralysis)
-  Abstractions hide complexity (The princess is in another castle)
-  Spreading your code out unhelpfully (Increases the surface area of code)
-  Solution! Good procedural code:
-  What to do about shared state? 
-  Parameterize! Try not to use globals. 
-  Bundle globals you do use into a single datatype
-  Prefer pure functions
-  Use namespaces / packages / modules
-  Long functions are fine! Logic in sequence = code in sequence. Use "section comments"
-  Use nested functions. (Functions inside a function, so you know it only gets used multiple times there.)
-  Constrain scope of local variables (Anonymous functions, use blocks, Jai programming language)
-  Conclusion - liberate yourself. 
