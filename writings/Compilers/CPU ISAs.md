---
date: 2026-10-02
Title: Understanding the CPU Architecture
tags:
  - low-level
---
### Understanding x86-64
x86 is the name of a family of CPU instruction set architectures (ISAs) basically the "language" that Intel and AMD processors understand at the hardware level. It's the dominant architecture for desktop/laptop PCs and most servers.

It traces back to Intel's early processors, which had model numbers ending in 86, therefore the whole series was called x86.
- 8086 (1978) —> the original, 16-bit
- 80286 ("286")
- 80386 ("386") —> first 32-bit version of the architecture
- 80486 ("486")

| Era      | Name           | Word/register size | Max addressable memory |
| -------- | -------------- | ------------------ | ---------------------- |
| 1978     | 8086           | 16-bit             | 1 MB                   |
| 1985     | 80386 ("i386") | 32-bit             | 4 GB                   |
| 2003<br> | x86-64 / AMD64 | 64-bit             | huge (2⁶⁴)             |

Intel initially made a 64-bit processor architecture called IA-64, implemented in Itanium. Itanium was a fundamentally different ISA rather than an extension of the existing 32 bit x86 architecture and it flopped commercially. AMD made AMD64, a 64 bit extension of the existing 32 bit x86 architecture (IA-32). It preserved compatibility with legacy x86 software while introducing 64 bit registers, addressing, and additional instructions. 
Then everyone including intel(they rebranded it as Intel64) started using AMD64.
- x86-64 or x86_64 (generic/vendor-neutral name)
- x64 (Microsoft's shorthand, used in Windows)
- Intel 64 (Intel's own branding for their implementation of the same thing, once they adopted it) - they also adapted AMD 64 ryt

They're all the same ISA, just different names from different companies/contexts.

So "x86" alone (without "-64") usually implies the original 32-bit architecture, while "x86-64"/"x64"/"AMD64/Intel64" means the modern 64-bit extension of it. 
### Understanding ARM
ARM originally stood for Acorn RISC Machine, developed in the UK by Acorn Computers in the mid-1980s for their Archimedes computers. It was designed from scratch with a totally different philosophy than x86 which uses CISC.

|                   | x86                                        | ARM                                                                                                                |
| ----------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Design philosophy | CISC (Complex Instruction Set Computer)    | RISC (Reduced Instruction Set Computer)                                                                            |
| Instructions      | Many, complex, variable-length             | Fewer, simpler, fixed-length                                                                                       |
| Power use         | Historically power-hungry                  | Designed for efficiency                                                                                            |
| Business model    | Intel/AMD design **and** manufacture chips | ARM Holdings just **licenses the design** — companies like Apple, Qualcomm, Samsung build their own chips using it |

That licensing model is a big deal it's why ARM chips are everywhere, nearly all smartphones, iPads, Apple Silicon Macs (M1/M2/M3/M4), Raspberry Pis, and increasingly cloud servers (AWS Graviton) all use ARM based designs from different manufacturers, unlike x86 which is basically just Intel and AMD.

But ARM went through its own 32-bit → 64-bit transition too, just with different naming:

- AArch32 (or ARMv7 and earlier) = 32-bit
- **AArch64** (ARMv8-A onward) = 64-bit, introduced in 2011

ARM is both a company and an ISA family:
- ARM Holdings is the company (originally Acorn, now owned by SoftBank) that designs the instruction set and licenses it out.
- ARM is also the name of the ISA itself, the actual set of instructions (like `ADD`, `LDR`, `MOV`, etc.) and rules for how a CPU executes them.

Some companies license the ARM ISA and build their own chips around it.
- Apple → Apple Silicon (M-series, A-series)
- Qualcomm → Snapdragon
- Samsung → Exynos
- Broadcom → chips used in Raspberry Pi

Each of these is a different physical chip design with different transistor layout, performance and stuff but they all execute the same ARM ISA yk like how both AMD and Intel runs x86.

| ARM version       | Bit width                               | Name    |
| ----------------- | --------------------------------------- | ------- |
| ARMv6 and earlier | 32-bit only                             | AArch32 |
| ARMv7             | 32-bit                                  | AArch32 |
| ARMv8-A onward    | 64-bit (with 32-bit compatibility mode) | AArch64 |
| ARMv9 (latest)    | 64-bit                                  | AArch64 |
