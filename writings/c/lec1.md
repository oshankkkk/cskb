# Lecture Notes: Bits, Bytes, and Integers
### Base 2 and bits
The term **"bit"** was coined around 1948 by Claude Shannon, founder of information theory, who defined it as the most primitive unit of information. (Shannon didn't invent binary computing itself.)
ENIAC, one of the first large scale computers, represented numbers in decimal, using 10 vacuum tubes per digit.

```
          Hundreds
Value: 0 1 2 3 4 5 6 7 8 9
Tube:  . . . . . ● . . . .

            Tens
Value: 0 1 2 3 4 5 6 7 8 9
Tube:  . ● . . . . . . . .

            Ones
Value: 0 1 2 3 4 5 6 7 8 9
Tube:  . . ● . . . . . . .
```

  Real electrical signals are noisy not clean square waves. Circuit components are small and imperfect. Representing only two states (0/1) gives you a large margin for noise/variation while still reliably distinguishing the two values. Storage circuits (e.g., feedback loops) can stably hold a 0 or a 1; more discrete levels are much more vulnerable to decay/noise/corruption.
  
  > A bit pattern has no inherent meaning*on its own. It isn't "a number" or "a string" or "an instruction" by itself meaning comes entirely from how we choose to interpret* it.
  
### Floating point numbers 
scientific notation. significant digits.
floating points is scientific notation and it is very fast and efficient for computers (even us to work with)


### Hexadecimal notation
- Writing out long bit strings (e.g., 64 bits) is unwieldy, so we **group bits into 4-bit chunks** (nibbles), each representing a value 0–15, written as a single **hex digit**.
- C-style notation: prefix with **`0x`** (case-insensitive `x`), digits `0–9` then `A–F` (case-insensitive).
- **Example: 15213 in hex**
  - Binary grouped in nibbles: `0011 1011 0110 1101`
  - Hex: `0x3B6D`
- **Memorization trick** (instructor's own method): memorize 0–9 directly, know `A = 10`, `C = 12`, `F = 15` as anchors, and interpolate `B, D, E` in between.

| Hex | Binary | Dec | Hex | Binary | Dec |
| --- | ------ | --- | --- | ------ | --- |
| 0   | 0000   | 0   | 8   | 1000   | 8   |
| 1   | 0001   | 1   | 9   | 1001   | 9   |
| 2   | 0010   | 2   | A   | 1010   | 10  |
| 3   | 0011   | 3   | B   | 1011   | 11  |
| 4   | 0100   | 4   | C   | 1100   | 12  |
| 5   | 0101   | 5   | D   | 1101   | 13  |
| 6   | 0110   | 6   | E   | 1110   | 14  |
| 7   | 0111   | 7   | F   | 1111   | 15  |

---

## 3. Word Size: "32-bit" vs "64-bit" Is Fuzzy

- There is **no single standard** for what "the machine's word size" means.
- A modern Intel-style processor's hardware supports **64-bit** operations (integers, addresses) natively, but can also run in a **32-bit compatibility mode** dating back to the early 1990s.
- So a single physical machine can effectively be "both" — whether code is generated as 32-bit or 64-bit depends on the **combination of OS, compiler, and compile-time flags**, not just the hardware.
- Most **C data types are unaffected** by 32-bit vs 64-bit mode, with key exceptions:
  - `long`: 4 bytes (32-bit mode) vs 8 bytes (64-bit mode).
  - **Pointers/addresses**: 4 bytes on 32-bit (max ~4 GB addressable — once "a lot," now often insufficient) vs 8 bytes on 64-bit (vastly larger range). This is a major reason the industry shifted to 64-bit.

---

## 4. Boolean Algebra → Digital Logic

- **George Boole** (19th century) formalized propositional logic (true/false reasoning) as an algebra.
- **Claude Shannon's 1937/38 master's thesis** (often called one of the most influential master's theses ever) connected Boolean algebra to the design of digital/switching circuits — originally built from **electromechanical relays** (e.g., telephone switching networks), not transistors. Before this connection was made, such circuits were designed without a systematic algebraic method.

### Basic Boolean operators (0 = false, 1 = true)
- **AND**: true only if both inputs are true.
- **OR** (inclusive): true if either or both inputs are true.
- **NOT**: flips true/false.
- **XOR (exclusive or)**: true if exactly one input is true, not both.
  - Note: everyday English "or" is often ambiguous between inclusive and exclusive ("would you like your left or right hand cut off?" implies exclusive; other uses are inclusive). In logic/programming we distinguish them explicitly.

### Extending to bit vectors
- These operators generalize from single bits to entire **bit vectors** (e.g., a 32- or 64-bit word), applied **bitwise** (position by position).

### Practical use: sets as bit vectors
- A bit vector of length *N* can represent a subset of *N* possible elements (1 = element present, 0 = absent).
- Under this interpretation:
  - **AND** ↔ set **intersection**
  - **OR** ↔ set **union**
  - **XOR** ↔ set **symmetric difference**
- Real-world use: e.g., tracking which of many network connections are active/being listened to (bit masks). Libraries exist to manipulate these sets, but underneath they're just bitwise operations on words.
- A bit pattern used to select/ignore certain positions is often called a **mask** (1 = "care about this bit," 0 = "ignore it"), used with AND to isolate bits of interest.
- **Stone Representation Theorem**: there is a formal one-to-one correspondence between an arbitrary countable set and a bit-vector representation of that set.

---

## 5. Bitwise Operators in C

C uses the **same symbols** as the mathematical bitwise operators:

| Operation | C operator |
|---|---|
| AND | `&` |
| OR | `\|` |
| NOT | `~` |
| XOR | `^` |

- Example (1-byte values): complement of `0x4` is `0xB` — invert `0100` → `1011` = `B`. Complement of `0xD` (`1101`) → `0010` = `2`.
- **Trick**: complementing all-ones (`0xF`) gives all-zeros (`0x0`), same idea as subtracting from all-1s having no borrows — a useful mental shortcut, since complement of all-1s = all-0s and vice versa.

### ⚠️ Gotcha: Bitwise vs. Logical operators
C has a **separate, very different** family of operators:

| Logical | C operator | Behavior |
|---|---|---|
| AND | `&&` | |
| OR | `\|\|` | |
| NOT | `!` | |

- These operate under a **different logic**: only two logical values exist — **false = the value 0**, and **anything nonzero counts as true**. The *result* of these operators is always exactly `0` or `1`.
- Example: `!0x41` → `0x41` is nonzero → "true" → negated → `0`.
  `!0x00` → `0x00` is "false" → negated → `1`.
- **Double-negation idiom**: `!!x` converts any nonzero value to exactly `1`, and `0` stays `0`. Useful for normalizing a value to a strict boolean 0/1. (Used in Lab 1.)
- **Short-circuit evaluation**: `&&` and `||` only evaluate as much of the expression (left to right) as needed to determine the result.
  - Example: `p && *p` — if `p` is a null pointer, the whole expression is `0` without ever evaluating `*p` (which would otherwise crash). This is a common and important safety idiom.
- **Practical warning**: mixing up `&`/`&&` or `|`/`||` is a very common bug — sometimes from not knowing the difference, sometimes just from mistyping (per the lecturer, this is his own most common mistake).

---

## 6. Shift Operations

- **Left shift (`<<`)**: bits slide left by *n* positions; vacated positions on the right are filled with **0**s; bits shifted off the left end are discarded.
- **Right shift** has **two different conventions**:
  - **Logical right shift**: fill vacated left positions with **0**s (the "natural"/straightforward version).
  - **Arithmetic right shift**: fill vacated left positions by **replicating the original leftmost (sign) bit**.
    - If the leftmost bit was 0, logical and arithmetic shifts give identical results.
    - If the leftmost bit was 1, arithmetic shift fills with 1s — this seems unintuitive in isolation, but becomes meaningful once bit patterns represent **negative** two's-complement numbers: arithmetic right shift approximates **division by a power of two** for signed values (details next lecture).
- C notation: `<<` for left shift; `>>` for right shift — **whether `>>` behaves as logical or arithmetic depends on context** (covered further next time).
- **Undefined behavior warnings**:
  - Shifting by a **negative amount** is not defined to behave like shifting the other direction (e.g., `x << -1` ≠ `x >> 1` in general — don't rely on this).
  - Shifting by an amount **≥ the word size** (e.g., shifting a 32-bit value left by 32 or 100) is **not guaranteed** to produce all zeros — behavior is implementation-defined/undefined.
  - **General theme**: C leaves many behaviors **undefined**, meaning compiler writers choose the implementation, and behavior may differ across machines/compilers. (Contrast: Java was explicitly designed to define such behaviors for full portability — this course uses C, so we live with its quirks.)

---

## 7. Encoding Integers: Unsigned vs. Two's Complement

Two major classes of integers in this course:
- **Unsigned**: values ≥ 0 only.
- **Signed**: can be positive or negative. Many encodings are possible in principle, but the overwhelmingly standard one (and the one used on essentially all modern machines) is **two's complement**.

### Bit weighting
- **Unsigned**: ordinary binary — every bit `i` contributes $+2^i$.
- **Two's complement**: identical, **except** the most-significant (leftmost) bit contributes a **negative** weight, $-2^{w-1}$ (where *w* = word size in bits). All other bits keep their normal positive weight.

### Worked examples (5-bit words, illustrative)
- `10` (positive): sign bit = 0; ordinary positive weighting.
- `-10`: start from the sign bit's weight $-2^{4} = -16$ (most negative available), then **add back** positive powers of 2 to reach the desired value, e.g., $-16 + 4 + 2 = -10$.
- General mental model for two's complement: **"start very negative, add back positive powers of two to reach your target value."**

### 16-bit example
- $15213$ or $-15213$ representable by choosing the sign bit's weight of $2^{15} = 32768$ appropriately, plus the remaining lower bits.

### Range of values

| | Smallest | Largest |
|---|---|---|
| **Unsigned**, *w* bits | $0$ | $2^w - 1$ (all bits = 1) |
| **Two's complement**, *w* bits | $-2^{w-1}$ (sign bit only = 1, `TMin`) | $2^{w-1} - 1$ (sign bit = 0, rest = 1, `TMax`) |

- **All-ones bit pattern** = `-1` in two's complement (sign bit "very negative," plus all positive bits "add back" to exactly cancel to $-1$).
- **All-zeros bit pattern** = `0` in either representation.
- **Rule of thumb**: a hex value that's mostly `F`s (e.g., `0xFFFF...`) is very likely a **negative** two's complement number.
- **Asymmetry**: the most-negative two's complement value has **no positive counterpart** of equal magnitude (e.g., for 4 bits: range is $-8$ to $7$, not $-8$ to $8$). This is because the encoding must also reserve a pattern for **zero** — there's no "extra" pattern to give the positive side.

### Concrete bit-width examples (16-bit)
- Unsigned max: $2^{16} - 1 = 65535$.
- Two's complement max: $2^{15} - 1 = 32767$; min: $-2^{15} = -32768$.

### Order-of-magnitude estimation trick
- Rule of thumb: $2^{10} = 1024 \approx 1000 = 10^3$.
- Example: $2^{32} = 2^{30} \cdot 2^2 \approx (10^9)(4) = 4{,}000{,}000{,}000$ (~4 billion). (Joke: some claim Microsoft moved to 64-bit because 32 bits couldn't hold Bill Gates's net worth — we have a long way to go before 64-bit numbers become insufficient.)

### Range asymmetry between signed/unsigned
- For a given word size, **unsigned** can represent roughly **twice** the magnitude of positive values that **two's complement** can, since unsigned devotes all bits to magnitude.
- **Caveat**: C does **not guarantee** two's complement or any particular ranges are portable across all possible machines — use `<limits.h>` (defines `INT_MAX`, `INT_MIN`, `UINT_MAX`, etc.) for machine/compiler-correct bounds rather than hardcoding assumptions (though many programmers casually assume standard values anyway).

---

## 8. Relating Unsigned and Two's Complement Bit Patterns

- For a **fixed bit pattern**, its unsigned interpretation and its two's-complement interpretation are **identical** whenever the sign bit is 0 (nonnegative range).
- When the sign bit is 1, the unsigned value and the two's-complement value differ by exactly $2^w$ (e.g., differ by 16 for a 5-bit example) — i.e., interpreting the same bits as unsigned vs. signed shifts large "negative-looking" numbers into large positive ones, or vice versa.
- Visually: the "small magnitude" numbers (sign bit 0) stay the same between interpretations; numbers that were very negative under two's complement become very large positive numbers under the unsigned interpretation, and vice versa.

---

## 9. Casting Between Signed and Unsigned in C

- **Key fact**: casting between signed (`int`) and unsigned (`unsigned int`) in C **does not change the underlying bits at all**. Only the *interpretation* of the high-order bit's weight (positive vs. negative) changes.
  - This is fundamentally different from casting **float → int**, where the actual bit pattern *does* change (covered next week).
- Example: `int x = -1; unsigned u = (unsigned) x;`
  - Common wrong guess: "should give 0, off by one, partial credit-worthy." **Not what happens.**
  - Correct answer: `u` becomes **`UINT_MAX`**, i.e., $2^{32} - 1$ (all bits = 1), because `-1` is *already* the all-ones bit pattern — the cast just reinterprets those same bits as a large positive unsigned number.
- This bit-preserving reinterpretation applies to **explicit casts** and also to **implicit casts** — e.g., assigning an `unsigned` value to a signed `int` variable, or vice versa, or passing/returning values of mismatched signedness through functions — all trigger this silent reinterpretation without any obvious syntax marking it.

### Implicit conversion rule in mixed-signedness expressions
- **C rule**: if an operation (arithmetic *or* comparison, e.g. `<`, `>`) has one signed and one unsigned operand, the **signed operand is implicitly converted to unsigned** before the operation proceeds.
- **Literal suffix note**: an integer literal like `0` is signed by default; appending `u`/`U` (e.g., `0u`) makes it unsigned.

### Surprising comparison examples
| Expression | Result | Why |
|---|---|---|
| `0 == 0u` | true | Both are all-zero bits; near zero, signed/unsigned agree. |
| `-1 < 0` | true | Ordinary signed comparison. |
| `-1 < 0u` | **false** (`-1` is "greater") | `-1` is implicitly cast to unsigned → becomes `UINT_MAX`, a huge positive number → greater than `0`. |
| `TMax > TMin` (both signed) | true | Ordinary signed comparison: positive > negative. |
| `TMax > (unsigned) TMin` | **false** | `TMin`'s bit pattern (`1000...0`) reinterpreted as unsigned is a **huge** positive number, larger than `TMax`. |
| `(unsigned)(0 followed by all 1s)` vs `(1 followed by all 0s)`, unsigned compare | first is smaller | Straightforward unsigned magnitude comparison. |
| Same patterns, **signed** compare | first is **larger** | First pattern (sign bit 0) is positive; second (sign bit 1) is negative. |

---

## 10. Real Bugs Caused by Unsigned Arithmetic

### Bug 1: Unsigned loop counter going below zero
```c
unsigned i;
for (i = length - 1; i >= 0; i--) {
    // sum array backward
}
```
- **Problem**: `i` is `unsigned`, so `i >= 0` is **always true** — infinite loop (logically).
- When `i` reaches 0 and is decremented, it doesn't go negative — it **wraps around** to `UINT_MAX` (all ones).
- The array index `A[i]` then accesses a wildly out-of-bounds address, which in practice usually causes a **segmentation fault** (crash) rather than a true infinite loop — but either way, not the intended behavior.

### Bug 2: Subtler version via `size_t`
```c
size_t delta = sizeof(...);   // some positive constant
int i;
...
while (i - delta >= 0) {  // intent: stop once close to zero
    ...
}
```
- **`sizeof`** always returns a value of type **`size_t`**, which is **always unsigned** on every machine (large enough to span the full addressable range, e.g. up to $2^{32}$ or $2^{64}$).
- Even though `i` starts out as a signed `int`, subtracting an unsigned `delta` from it **implicitly converts the whole expression to unsigned** (per the mixed-signedness rule above).
- Result: `i - delta` is **never** interpreted as negative, so the loop again never terminates as intended — same underlying failure mode as Bug 1, but much harder to spot because nothing in the code *looks* unsigned at first glance.
- **Takeaway**: these are notoriously hard bugs — the code can look completely reasonable and the unsigned-conversion rule is easy to forget even when you know it exists.

---

## 11. Sign Extension (Expanding Bit Width, Signed)

- **Goal**: convert a signed value from a smaller word size to a larger one **while preserving its numeric value**.
- **Rule**: replicate the original **sign bit** (the leftmost/most-significant bit) into all the new, wider positions.
- **Why it works (intuition)**: in two's complement, a string of identical bits with weights that sum to the same total as the single original sign bit's weight leaves the overall value unchanged. Formally, extending a negative number's sign bit (weight $-2^{w-1}$) into two bits (new weights $-2^{w}$ and $+2^{w-1}$) nets out to the same $-2^{w-1}$ contribution, and this generalizes to extending arbitrarily far left.
- Example (5-bit → 6-bit): `10110` (−10 in 5 bits: $-16+4+2=-10$) sign-extends to `110110` (still −10 in 6 bits: $-32+16+4+2=-10$).
- This is exactly what happens in C when casting a smaller signed type to a larger one (e.g., `char` → `int`, or `short` → `long`) — the compiler automatically sign-extends to preserve the value.

---

## 12. Truncation (Reducing Bit Width, Signed)

- **Goal (unavoidable tradeoff)**: going from a larger representation to a smaller one **discards information** (consistent with Shannon's information theory — you truly cannot preserve all information with fewer bits). The result can look numerically unrelated to the original value.
- **Mechanism**: simply **drop the extra high-order bit(s)**. Whatever bit becomes the new most-significant bit takes on the new (smaller) representation's sign-bit weight.
- **When it "just works"**: if the discarded high bits were all copies of the original sign bit (i.e., the value's true magnitude fits in the smaller width), truncation preserves the numeric value — this is exactly sign extension in reverse.
- **When it doesn't work (value out of range for smaller width)**: the value is effectively changed by a multiple of $2^{w}$ (modular wraparound), which can flip sign or magnitude unpredictably.
  - Example: a 5-bit representation of `10` truncated to 4 bits becomes **−6** (value effectively decreases by 16, since 10 doesn't fit in the signed 4-bit range of −8..7).
  - Example: a 5-bit representation of `−10` truncated to 4 bits becomes **6** (clipped/wrapped, since −10 is outside the 4-bit signed range).
- **Takeaway**: truncation is safe only when the value already fits within the smaller type's range; otherwise, the result is a modular "clipping" that can look arbitrary.

---

## Summary of Core Themes for This Chapter

1. **Bits have no inherent meaning** — interpretation (unsigned, two's complement, float, pointer, instruction, etc.) is everything.
2. **Hex is a compact, human-friendly notation** for bit patterns (not a good tool for mental arithmetic).
3. **Word size (32-bit/64-bit) is really about OS+compiler+hardware together**, not a fixed machine property.
4. **Bitwise operators (`&`, `|`, `~`, `^`) operate per-bit**; **logical operators (`&&`, `||`, `!`) treat 0 as false / nonzero as true** and always yield 0 or 1 — do not confuse them.
5. **Shifts**: left is unambiguous; right shift has logical (fill 0) vs. arithmetic (replicate sign bit) variants; shift-by-negative or shift-by-≥width is undefined behavior.
6. **Two's complement** is the standard signed representation: same as unsigned except the top bit has negative weight.
7. **Casting signed↔unsigned changes no bits**, only reinterprets them — this is the root cause of many subtle bugs, especially in comparisons and loop conditions involving `unsigned`/`size_t`.
8. **Sign extension** (widening) preserves value by replicating the sign bit; **truncation** (narrowing) can silently change the value via modular wraparound if the value doesn't fit.