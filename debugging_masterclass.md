# Debugging Masterclass: From Printf to Pro

Becoming a pro at debugging isn't just about knowing the tools; it's about adopting a specific **mindset** and **workflow**. When you write complex systems like an interpreter, language, or VM, bugs will hide in the smallest of gaps (like `"main"` vs `"MAIN"`). 

Here is a blueprint to level up your debugging skills, tools, and workflows.

---

## 1. The Core Skills & Mindset

### Read Code Literally, Not Intentionally
When we read our own code, our brain tricks us. We read *what we intended to write*, not *what is actually written*. 
* **Skill:** Force yourself to read character-by-character. Assume your code is wrong and the computer is right. 

### The Scientific Method
Treat every bug like a science experiment:
1. **Observe:** The program loops infinitely.
2. **Hypothesize:** "I think the program counter (PC) is resetting to 0 because `Entrypoint` is 0."
3. **Experiment:** "If I initialize `Entrypoint` to `-1` and panic if it's still `-1`, the program should panic instead of looping."
4. **Analyze:** It panicked. Hypothesis confirmed! Now, *why* is it `-1`? Repeat the process.

### Trust, but Verify (Types & Exact Values)
In Go, string comparisons or interface conversions are classic hiding spots for bugs. 
* **Skill:** Don't just print values; print their exact representations. 
* If you had used `fmt.Printf("Comparing %q with %q\n", value.Name, string(lexer.MAIN))`, the terminal would have printed: 
  `Comparing "main" with "MAIN"`. The bug would have been instantly visible!

---

## 2. The Pro Debugging Workflow

When a bug hits, don't just start changing code randomly. Follow this loop:

### Step 1: Reproduce Reliably
Find the absolute smallest piece of code that causes the bug. 
* Instead of running a 500-line `.ggs` script, write a 2-line script (like your `lol.ggs`) that triggers the exact same failure.

### Step 2: Divide and Conquer (Binary Search)
If you don't know where the bug is, split your program in half.
* *Is the bug in the Lexer?* Dump the tokens. If they look good, the Lexer is fine.
* *Is the bug in the Parser?* Dump the AST (you already built a great `prettyprinter` for this!). If the AST is right, the Parser is fine.
* *Is the bug in the Compiler?* Dump the Bytecode.
* *Is the bug in the VM?* Trace the execution.

### Step 3: Trace the State
Once you isolate the phase (e.g., the Compiler), trace the variables leading up to the failure. Use a debugger or high-quality logging to inspect the exact state at that exact moment.

### Step 4: Fix and Assert
Once you fix the bug, add a guardrail so it never happens again (like the `panic("main not found")` we added).

---

## 3. Tools of the Trade

### 1. Delve (dlv) - The Go Debugger
This is the most important tool you can learn as a Go developer. Delve allows you to pause your program while it's running, step through it line-by-line, and look inside variables.
* **Install:** `go install github.com/go-delve/delve/cmd/dlv@latest`
* **How to use it via CLI:** `dlv debug cmd/main.go -- new.ggs`
* **Commands to know:**
  * `break main.go:73` (Set a breakpoint at line 73)
  * `continue` (Run until you hit the breakpoint)
  * `print value.Name` (Look at the variable's exact value)
  * `next` (Go to the next line)
  * `step` (Step inside a function call)

### 2. IDE Integrated Debuggers (VS Code / GoLand)
Instead of using the terminal, VS Code and GoLand have Delve built-in. You can literally click the side of your code to place a red dot (breakpoint), hit "Debug", and watch your program execute line-by-line while hovering over variables with your mouse. **Start doing this immediately—it will change your life.**

### 3. Hex Dumps / Bytecode Disassemblers
For VMs, raw numbers are hard to read. Write a function that takes your `bytearray` and `counterTable` and prints them out beautifully before the VM runs:
```text
0000: JMP [0000]
0002: PUSH 1
0004: PUSH 3
0006: ADD
```
If you can read the bytecode, you can spot compiler bugs instantly.

### 4. Better Printf Debugging
If you must use prints, use Go's `%+v` and `%q` verbs:
* `fmt.Printf("Node: %+v\n", astNode)` prints struct field names and values.
* `fmt.Printf("String: %q\n", str)` prints strings with quotes around them, revealing hidden spaces or case issues.

---

## Your Next Steps for this Project:
1. **Un-comment `g.debugPrint(opcode)`:** You already wrote a great debug function in your VM! Hook it up so it prints the instruction, the Stack Pointer, and the Stack contents *before* every cycle.
2. **Setup VS Code Debugging:** Set up a `launch.json` in VS Code so you can run your compiler in debug mode with the click of a button.
3. **Write a Bytecode Printer:** Before you send the `Buff` to the VM, print it out instruction by instruction. 

Mastering these will make you unstoppable!
