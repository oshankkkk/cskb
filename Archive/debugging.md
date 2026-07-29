 Force yourself to read character-by-character. Assume your code is wrong and the computer is right. 
#### Debugging Workflow
#####  Reproduce Reliably
Find the absolute smallest piece of code that causes the bug. 
* Instead of running a 500-line `.ggs` script, write a 2-line script (like your `lol.ggs`) that triggers the exact same failure.
##### Divide and Conquer (Binary Search)
If you don't know where the bug is, split your program in half.
* *Is the bug in the Lexer?* Dump the tokens. If they look good, the Lexer is fine.
* *Is the bug in the Parser?* Dump the AST (you already built a great `prettyprinter` for this!). If the AST is right, the Parser is fine.
* *Is the bug in the Compiler?* Dump the Bytecode.
* *Is the bug in the VM?* Trace the execution.
##### Step 3: Trace the State
Once you isolate the phase (e.g., the Compiler), trace the variables leading up to the failure. Use a debugger or high-quality logging to inspect the exact state at that exact moment.
##### Step 4: Fix and Assert
Once you fix the bug, add a guardrail so it never happens again (like the `panic("main not found")` we added).
### Tips
- Learn how to use a debugger
-  Make your own debug functions  
- Better Printf Debugging
