# Chapter 3: CPU Caches — The Full Picture

## The Motivation (why caches exist at all)

Before caches, CPU core frequency and memory bus frequency were roughly matched  a memory access cost about as much as a register access. Starting in the early 90s, CPU frequencies shot up while DRAM speeds barely moved (because, as Chapter 2 explained, fast SRAM is far more expensive per bit than DRAM). This created what's often called the "memory wall."

The insight: you can't afford a machine made entirely of fast SRAM (too expensive, and even a modest amount would be a huge win), but you also can't tolerate all-DRAM (too slow). The solution is a small amount of fast SRAM that transparently caches data likely to be reused, sitting between the CPU and the large, slow DRAM.

This transparency relies on two empirical properties of real programs:
- Temporal locality — data used recently is likely to be used again soon.
- Spatial locality — data near recently-used data is likely to be used soon too.

> How the CPU works and cycles

Drepper gives a concrete number: if main memory access is ~200 cycles and cache access is ~15 cycles, a workload touching 100 elements 100 times each goes from 2,000,000 cycles (no cache) to 168,500 cycles (all cached) — a 91.5% improvement. That's the payoff caches are chasing.

Critically, this can't be managed by software/OS directly — mapping physical SRAM into every process's address space and making programs manage it themselves would be a synchronization nightmare. So caches are **transparent hardware**, automatically managed by the processor.
> wdym transparent
---

## 3.1 — The Big Picture: Where Caches Sit

**Minimal configuration:** CPU core → Cache → Bus (FSB) → Main Memory. The core no longer touches memory directly; everything goes through the cache.

**Split I/D caches:** Even though most machines are von Neumann architecture (unified code+data memory), Intel has split L1 into **L1i** (instructions) and **L1d** (data) since 1993. Why split them?

- Code and data regions are used very differently and independently — separate caches serve each better than one shared one.
- Instruction decoding is slow on CISC processors (x86 especially), so caching *already-decoded* instructions in L1i saves real time, especially after branch mispredictions flush the pipeline.

**Multi-level hierarchy:** As the SRAM-vs-core speed gap grew further, a single cache wasn't enough — so a second, bigger-but-slower L2 was added, then L3 in high-end systems. Naming convention: **L1d, L1i** are per-core; **L2** often shared by pairs of cores or per-core depending on generation; **L3** typically shared by an entire socket.

**Multi-core, multi-thread topology:** In a full modern system you get a hierarchy like: Processor → Cores → Hyper-threads. Threads on the same core share **everything**, including L1. Cores on the same chip share higher-level caches (L2/L3) but have their own L1. Separate physical processors (sockets) share **nothing**. This topology matters enormously for programmers doing thread placement (covered later in Ch 6).

> is core and cpu seperate things, what is a core
---

## 3.2 — How a Cache Actually Works

**Cache lines, not bytes.** Caching individual words would waste huge amounts of space on tags (metadata) relative to data, and would throw away spatial locality. So caches operate in units called **cache lines** — historically 32 bytes, now typically **64 bytes**. A whole line is loaded/evicted as one unit.

**The address split.** A memory address is conceptually split into three fields:

```
| Tag (T bits) | Set index (S bits) | Offset (O bits) |
```

- **Offset** (low `O` bits): picks the byte within the 2^O-byte cache line.
- **Set index** (`S` bits): picks which "set" (row) of the cache this address maps to.
- **Tag** (remaining `T` bits): stored alongside the cache line's data to identify *which* memory address is actually cached in that set/slot.

When the CPU wants an address, it computes the set index, checks the tag(s) stored there, and if one matches → cache hit; if not → cache miss, fetch from the next level.

**Dirty bit.** When a line is written to, it can't be discarded silently — it's marked **dirty**, meaning it must eventually be written back to memory (or the next level down) before being evicted. If it's never written to (clean), it can just be dropped.

**Eviction cascades.** Getting a new line into L1d generally requires evicting something. That evicted line gets pushed to L2, which might in turn have to evict into L3, and so on down to main memory. Each eviction costs more the deeper you push.

**Inclusive vs exclusive caches** — an important architectural choice:
- **Inclusive** (Intel): every line in L1 is *also* present in L2. Wastes some capacity (duplication) but makes L1 eviction cheap (nothing needs to move — it's already backed up in L2).
- **Exclusive** (AMD, VIA): a line lives in exactly one cache level at a time. More effective use of total capacity, but evictions are more expensive since data must actually migrate down a level.

---

## 3.3 — Implementation Details

### 3.3.1 Associativity — the central design trade-off

This is arguably the most important concept in the chapter. Three possible cache designs:

**1. Fully associative** — any memory line can go into *any* cache slot. Best hit rate (no artificial collisions), but to look up an address you must compare its tag against **every single slot in parallel**. For a realistic cache (say a 4MB L2 with 64B lines → 65,536 slots) this requires 65,536 parallel comparators — insanely expensive in transistors and impossible to make fast. Only viable for *very* small caches (e.g. some TLBs with a few dozen entries).

**2. Direct-mapped** — each address maps to *exactly one* possible slot (determined purely by its set-index bits). Needs only **one comparator total** — cheap and fast. But: if your program happens to access several addresses that alias to the same slot, they'll constantly evict each other even though the rest of the cache sits empty. This is disastrous if data access patterns aren't evenly distributed (which they usually aren't).

**3. Set-associative** — the practical compromise, and what real caches use. The cache is divided into "sets"; an address's set-index picks *one set*, but within that set there are `N` slots ("ways"), and the tag is checked against all `N` in parallel. This is called "N-way set associative" (e.g., 8-way). You get:
- Few comparators needed (only `N`, not the whole cache)
- Resistance to pathological collision patterns, since there's more than one slot per index

The relationship: **cache size = line size × associativity × number of sets**.

Drepper shows real data (Table 3.1 / Figure 3.8, gcc benchmark) demonstrating diminishing returns: going from direct-mapped to 2-way associative saves ~44% of misses for an 8MB cache in one case — a huge jump. But going from 4-way to 8-way barely helps. **In the literature, adding associativity is sometimes said to be "as good as doubling cache size," but this is only true in specific edge cases** — generally it saturates fast. Today's L2 caches often use up to 24-way associativity; L1 often just 8-way.

Important twist for **multi-core/hyper-threaded chips**: if the cache is shared between two hardware threads, each effectively only gets half the associativity in practice (or a quarter for 4 threads sharing), since two independent programs are now fighting for the same limited number of ways per set.

### 3.3.2 Measured Cache Effects

Using a synthetic benchmark (a circular linked list traversal, sequential or randomized order, with configurable element size `NPAD`), Drepper shows the signature "staircase" pattern: cycles-per-element stays flat and low while the working set fits in L1d, jumps to a higher plateau once it exceeds L1d but still fits L2, then jumps again once main memory is needed.

Key findings:
- **Prefetching saves you** — sequential access only costs ~9 cycles even when missing L1d (much less than the raw ~200 cycle memory latency), because the hardware prefetcher predicts the linear stride and starts loading the next line before you ask for it.
- **Larger struct sizes hurt** — when list elements are bigger than a cache line, prefetching effectiveness collapses because the prefetcher's stride recognition window is limited and (critically) **hardware prefetching cannot cross page boundaries** (it would risk triggering unwanted page faults, which the OS can't safely intercept mid-prefetch).
- **TLB misses compound the pain** — a separate experiment (placing list elements one-per-page vs packed together) isolates just how expensive translation lookaside buffer misses are, showing a dramatic spike once the TLB's limited entry count is exceeded.
- **Random access is much worse than sequential**, and gets progressively worse (not just flat) as working set grows, because the prefetcher is useless against a randomized stride — this is measured directly via L2 miss ratios climbing toward ~50%+.

### 3.3.3 Write Behavior — how modifications propagate

Two fundamental policies:

- **Write-through**: every write to a cache line is *immediately* also written to main memory. Simple, keeps things always in sync, but generates huge FSB traffic — even for a variable modified repeatedly in a tight loop with no other consumer.
- **Write-back**: writes only update the cache line and set the dirty bit; the write-back to memory happens later, only when the line is evicted. Much better performance, so this is what most systems use — but it introduces the coherency problem discussed next (a dirty line might be the *only* correct copy of that data anywhere).

Two more specialized policies exist for special memory regions (usually device memory, set up via **MTRRs** on x86):
- **Write-combining**: used for things like graphics card memory, where transferring a whole cache line for every single-word write would be wasteful. Multiple small writes into the same line get "combined" and flushed out together as one transfer.
- **Uncacheable**: for memory-mapped I/O registers (e.g., an LED toggle on an embedded board) where caching would be actively wrong — you want every write to reach the device immediately, and reads must always get fresh values.

### 3.3.4 Multi-Processor Support — the MESI protocol

This is the big one for anyone doing concurrent programming. When multiple cores/processors each have their own cache but access the same shared main memory, you need a **cache coherency protocol** to guarantee all processors see a consistent view of memory.

The industry-standard protocol is **MESI** (Modified, Exclusive, Shared, Invalid) — named for the four states a cache line can be in:

| State             | Meaning                                                            |
| ----------------- | ------------------------------------------------------------------ |
| **Modified (M)**  | This cache has the only copy, and it's dirty (differs from memory) |
| **Exclusive (E)** | This cache has the only copy, but it's clean (matches memory)      |
| **Shared (S)**    | Multiple caches may have this line; all are clean/consistent       |
| **Invalid (I)**   | This slot holds no valid data                                      |

Transitions happen via **bus snooping** — every processor watches the shared bus and notices when another processor requests a line it also has.

- Local read on empty line → goes to **E** if no one else has it, or **S** if others do.
- Local write on an **S** line → must broadcast a **Request For Ownership (RFO)** message so every other cache invalidates its copy, then transitions to **M**.
- Local write on an **E** line → cheap, transitions directly to **M**, *no bus message needed* (nobody else has a copy to invalidate). This is why processors prefer landing in E over S when possible.
- If another processor wants to read a line that's **M** in your cache, you must supply your dirty data directly (cache-to-cache transfer, "snooping"), typically also writing it back to memory, before transitioning to **S**.

The two governing rules that fall out of this:
1. A dirty line is never present in more than one cache.
2. Clean copies of a line can exist in arbitrarily many caches simultaneously.

**Why this matters for performance**: an RFO is expensive — it requires waiting on a reply from every other processor that might have a copy, made worse if the interconnect has high latency (NUMA) or high traffic. The two scenarios that trigger the most RFOs: migrating a thread between cores (forces cache repopulation) and genuine concurrent read/write sharing of the same cache line between threads. This directly motivates the **false sharing** discussion later in Chapter 6 — where two unrelated variables happen to land on the same cache line and get ping-ponged between cores' caches even though the threads never logically touch each other's data.

### 3.3.5 Other Details

- **Virtual vs. physical addressing**: L1 caches (small, must be blazing fast, ~3 cycle latency) are typically tagged with **virtual addresses**, letting lookup start before the MMU finishes translating the address. Higher-level caches (L2+) use **physical addresses** since there's enough pipeline slack for translation to complete first, and physical tagging avoids headaches when the same physical page is mapped to multiple virtual addresses.
- **Replacement policy**: most caches use **LRU (Least Recently Used)** eviction as a solid default, though maintaining exact LRU state gets expensive as associativity grows, so real hardware increasingly uses approximations.

---

## 3.4 — Instruction Cache (L1i)

Good news: L1i is much less troublesome than L1d, for a few structural reasons:
- Code size is generally fixed and bounded by problem complexity — it doesn't balloon the way data working sets do.
- Code is generated by compilers, whose authors already understand cache-friendly code generation rules.
- **Program flow is highly predictable** compared to data access patterns — branch predictors are very good at pattern-matching typical control flow, enabling effective prefetching of upcoming instructions.
- Code naturally has strong locality (loops re-execute the same instructions repeatedly).

One clever detail: because x86/x86-64 decoding is slow (CISC variable-length instructions), Intel processors actually cache **decoded** micro-ops in L1i rather than raw bytes — this is called the **trace cache**. A hit means skipping the decode pipeline stage entirely.

### 3.4.1 Self-Modifying Code (SMC)

A historical technique (saving memory by mutating instructions at runtime) that's now mostly discouraged because it wrecks cache assumptions:
- Modified code can't stay in the trace cache (decoded instructions are now stale).
- If an instruction already in the pipeline gets modified, the CPU may have to flush a large amount of speculative/in-flight work.
- Because the processor assumes (for performance) that code pages are immutable, L1i often uses a *simpler* coherency protocol (SI instead of full MESI) — so when SMC is detected, the processor has to fall back to expensive, pessimistic handling.

---

## 3.5 — What Drives Cache Misses

### 3.5.1 Bandwidth measurements

Drepper measures raw read/write/copy bandwidth (bytes/cycle) across several real CPUs (Pentium 4, Core 2, AMD Opteron) at various working-set sizes. Notable finding: **write bandwidth is often dramatically worse than read bandwidth** once you leave L1 — sometimes 10-20x worse — because writing dirty data eventually forces write-backs that compete with prefetch reads for the same limited FSB bandwidth. Multi-threaded variants show that **when threads share a bus/memory controller, they don't scale linearly** — bandwidth is a shared, finite resource.

### 3.5.2 Critical Word First & Early Restart

Since a cache line (64B) is transferred in several smaller bus bursts (e.g., 8×8-byte chunks), what if the specific word your instruction is actually waiting on is the *last* chunk to arrive? Naively you'd stall for the whole line's transfer time. The fix: the memory controller can be told which word is the "critical word" and send **that one first**, letting execution resume immediately while the rest of the line fills in the background (this technique is literally named **Critical Word First and Early Restart**).

### 3.5.3 Cache Placement (sharing across cores)

Different cache topologies (dedicated per-core L2 vs. shared L2 across a pair of cores) have real trade-offs. Shared caches let two cores collaborate efficiently on overlapping working sets and dynamically rebalance capacity — but "smart" cache-partitioning heuristics aren't perfect, and Drepper shows a benchmark where two competing processes effectively experience a smaller *usable* half-cache each than the true 50% share, due to inefficient eviction algorithms under contention.

### 3.5.4 FSB Influence

A direct experiment comparing identical CPUs with only the memory bus frequency changed (667MHz vs 800MHz DDR2, a 20% clock increase) shows up to an **18.2% real performance improvement** for memory-bound workloads — confirming that once your working set exceeds cache, raw bus bandwidth becomes the dominant bottleneck, and it's a scarce resource shared across all cores on that bus.

---

**The throughline of the whole chapter**: caches only help if your code's access patterns match the assumptions caches are built on — spatial/temporal locality, sequential/predictable strides, minimal cross-thread write contention. Everything here sets up Chapter 6's actual optimization advice (loop tiling, prefetch instructions, alignment, false-sharing avoidance) — this chapter is the "why," Chapter 6 is the "how."
