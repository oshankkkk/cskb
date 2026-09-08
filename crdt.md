# CRDTs: Designing Data Structures for Collaboration Software

*A talk by Martin Kleppmann, University of Cambridge*

Hello everybody, my name is Martin Kleppmann. I'm a researcher at the University of Cambridge, and today I'd like to talk about some of our work on Conflict-Free Replicated Data Types, or CRDTs.

I'm going to start this talk with a very brief introduction as to what CRDTs are and why they are useful, but most of this talk is going to be about new results that we have figured out only within the last year or two.

You might know me from a book I wrote a couple of years ago called *Designing Data-Intensive Applications*. It's a broad overview of the architecture of data systems and how to choose your database for a particular application. That's not what we're talking about today. Today we're talking about collaboration software.

## What is Collaboration Software?

In collaboration software, I'm taking a fairly broad view of the term: this is any kind of software where several users can come in and update a document, a database, or some other kind of shared state. There are various examples of software that fit into this category:

- **Google Docs** is an obvious example, where you can have several people editing a text document or spreadsheet at the same time. Similar things apply to **Office 365**.
- **Figma** is an example of graphics software that supports multi-user, real-time collaboration.
- **Trello** is an example of project management software, where several users can update the status of various tasks, assign tasks, add comments, and so on.

All of these have in common that users are updating some kind of shared state. I'm going to use collaborative text editing as my running example for now, though there will be examples from other types of applications later.

### A Simple Example

In collaborative text editing, you can end up with a scenario like this: two users start with the same document, `hello!`. The red user comes along and changes the document to `hello world`, by inserting the word "world" before the exclamation mark. Concurrently, while the red user is doing this, the blue user changes the document to add a smiley face after the exclamation mark.

These two changes happen concurrently, without knowledge of each other. Later on, as the network communicates those changes — the two users communicating over the internet or whatever network they're using the users should converge to the same state. We want that at the end, both users have the same document on their screen, and that document reflects all of the changes that were made. In this case, the merged outcome is quite reasonable: we expect the word "world" before the exclamation mark, and the smiley face after it.

## Two Families of Algorithms

There are broadly two families of algorithms for achieving this kind of collaborative editing:

1. **Operational Transformation (OT)** — the classic approach to multi-user collaborative editing that has been around for a long time, and is used, for example, by Google Docs.
2. **CRDTs** — a newer family of algorithms, which is what I work on, and which take a somewhat different approach to solving a similar problem.
### How Operational Transformation Works

With OT, we first need a way of describing how changes are made to a document. When a user changes a document, they insert or delete a character at some position in the document, and we describe those positions using indexes: we number the first character in the document to be 0, the second character to be 1, and so on.

Now imagine two users updating their documents. Both start with the document `helo` (h at index 0, e at index 1, l at index 2, o at index 3). The left-hand user inserts a second "l" at position 3 (before the "o"), changing their document to `hello`. Concurrently, the right-hand user inserts an exclamation mark at position 4 (after the "o"), changing their document to `helo!`.

Now these two changes need to be communicated over the network, so that one user finds out about the change made by the other. Suppose there's a server that forwards these messages between users. Let's first take the insertion from the left-hand side and move it to the right-hand side. The server can just forward "insert L at position 3" unchanged. On the right-hand side, we insert L at position 3, in the document `helo!`, and we end up with `hello!` — exactly what we want.

Now, what happens if we go in the other direction — taking the exclamation-mark insertion from the right-hand side over to the left? If we simply forward the operation "insert ! at position 4" unchanged, the left-hand user, whose document is now `hello`, would insert the "!" before the final "o", ending up with `hell!o` — which is not what we want.

==Instead, what has to happen is that the insertion at position 4 needs to be *transformed* into an insertion at position 5. The reason is that, concurrently, there has been another insertion (the extra "l") at position 3, which is *before* the position of this insertion so the position needs to be shifted along by one to account for it. This is why the algorithm is called operational transformation: we have to take these insertion and deletion operations and, depending on which other operations happened concurrently, transform the indexes or positions at which they take place.=-

### The Central Server Assumption
==This algorithm does work, but it requires one very particular, fundamental assumption: that all communication goes via a single central server. In Google Docs' case, that server is provided by Google, and the server takes a really key role in the algorithm by sequencing all of the operations.==

==Because OT depends on this central server to sequence all operations, there cannot be any other communication channels in the system. Even if two collaborating users are sitting in the same room and could just use the local Wi-Fi or even Bluetooth to communicate their changes directly between their two devices, using that local channel is not allowed it would undermine the assumptions the OT algorithm makes. So OT requires all communication to go via the central server, even if that server is on a different continent, and even if the two users are actually sitting in the same room ==

> The server should be there to manage the concurrent changes and transform the indices of the changes
## Where CRDTs Come In

This is where CRDTs come in. CRDTs allow this kind of multi-user collaboration without making any assumptions about the network topology. They don't assume anything about servers or the kind of network being used, any type of communication channel can be used to communicate operations or updates from one user to another.

The main correctness criterion for both OT and CRDTs is what we call **convergence**: whenever any two users have seen the same set of operations, those users must end up in the same state even if the users actually saw the operations in a different order. In a CRDT, we achieve this by making the operations *commutative*: even if their order is swapped around, the end result remains the same.

Convergence is clearly a minimum requirement for any collaboration software without it, we'd have permanent inconsistency between users, which would be bad. But as we shall see in this talk, convergence by itself is not really enough, because convergence doesn't say anything about *what* that final state actually is. Is the final merged state actually the state we wanted? This is a little difficult to define, because what state is desirable or not is really a matter of human judgment of what we, as humans, expect from the software.

Unfortunately, it turns out that several CRDT algorithms for collaborative editing sometimes behave in ways that are not really desirable  they behave weirdly, in ways we as humans would not expect. I've come to the conclusion, after several years of working on CRDTs, that these problems are quite hard: a simple version of a CRDT is very easy to implement, but actually getting it right, in a way that satisfies user expectations, is difficult. CRDTs are easy to implement badly. What we shall look at in this talk is how to implement CRDTs *well*, in a way that actually behaves how we want.

## Four Topics

Today I want to look at four topics all areas in which CRDTs are difficult in some way, and for most of which we now have solutions:

1. Interleaving anomalies in text editing
2. Reordering list items (move operations on lists)
3. Moving subtrees in trees
4. Making CRDTs more efficient

## Topic 1: Interleaving

Interleaving is a problem that can happen in collaborative text editors when several people insert text at the same position in the document. To explain why this happens, I need to give a brief introduction to how CRDTs for text editing work.

### How Text CRDTs Work

As I said earlier, with operational transformation we identify insertion or deletion positions by their index counting from the start of the document. That has the problem that those indexes need to be transformed whenever concurrent edits occur. CRDTs avoid the need for this kind of transformation by instead giving a unique identifier to every single character in the document. That identifier remains stable it stays the same even as other characters are added and deleted elsewhere in the document.

There are several possible ways of constructing such identifiers. One way is to choose a number between 0 and 1 — a fractional, rational number — where 0 is the beginning of the document and 1 is the end, and for every character somewhere in the text we pick a number appropriately positioned on that number line.

For example, take the document `helo`. We could assign:

- `0.2` → h
- `0.4` → e
- `0.6` → l
- `0.8` → o

This spaces our characters out over the 0 to 1 interval. Now, when we want to insert a second letter "l" and an exclamation mark, we pick numbers in between the existing intervals. We want to insert a second "l" between the first "l" and the "o" that is, between 0.6 and 0.8 so let's pick 0.7 as the midpoint. Likewise, for the exclamation mark, we'd pick a number between 0.8 and 1.0 say, 0.9.

This is a simple enough scheme, and we can use it to implement a CRDT in quite a simple way. We can think of our text document as a **set of triples**: each triple contains the character, the numeric value that tells us where it goes, and a node ID — an identifier for the particular user or node that created this insertion operation. We need the node ID just in case two different nodes happen to pick the same number, in which case we can use the node ID as a tiebreaker.

So we now have a set of triples representing the document. We can insert new characters just by picking numbers for them and computing the set union, and we reconstruct the state of the document by sorting the triples by their numbers, tiebreaking on node IDs.

Several text CRDTs take essentially this approach — though instead of numbers between 0 and 1, they tend to use something like a path through a tree. The effective idea is still the same: they are essentially picking positions on a number line.

### The Interleaving Problem

When we implement a CRDT this way, we can get some unfortunate behavior. Here's an example. We have two users. User 1 starts with the document `hello!` and inserts the word "Alice" between "hello" and the exclamation mark. Concurrently, User 2 starts with the same document and inserts the word "Charlie" in the same place — between "hello" and the exclamation mark.

Now the two users communicate and merge their changes. What we get out at the end is `hello` followed by some kind of unreadable jumble of letters — not "Alice" or "Charlie", but a random mix of the two.

Here's what happened: in the original document, the "o" of "hello" had a position number around 0.64, and the exclamation mark had a position number around 0.95. So the insertion of "Alice" chose some numbers within that interval, and independently, the insertion of "Charlie" also chose numbers within that same interval. Many CRDTs actually randomize these numbers a little, because that reduces the risk that two different nodes will pick exactly the same position for a character. But the effect here is that we now have all the numbers from "Alice" (coded in red) and all the numbers from "Charlie" (coded in blue), and we simply order them based on the numbers — and the result is that we've interleaved the two character sequences from the two different users, producing a completely unreadable mess.

This problem is bad enough if we're just inserting a single word, as in this example. It gets even worse if the two users have concurrently inserted an entire paragraph, or an entire section. If a paragraph or section has been interleaved on a basically random, character-by-character basis, you won't be able to use that text anymore — you'll just have to delete it and rewrite it. Users are not going to be happy about this.

Unfortunately, this behavior really does occur in real CRDTs. We have examined a number of different CRDT algorithms for text editing, and we have demonstrated this problem, at minimum, in algorithms called **Logoot** and **LSEQ**. In these algorithms, unfortunately, the interleaving problem is very deeply baked into the fundamental way the algorithm is constructed. I cannot see any way of fixing this bug, because the way these numbers are assigned, or the way the tree paths are assigned, makes this interleaving idea inherent to how the algorithms work.

### Algorithms That Avoid It — At a Cost

Other algorithms don't have this problem. In **Treedoc** and **WOOT**, for example, we did not find the interleaving problem. This doesn't entirely guarantee that it can never happen, but we believe it won't, so these algorithms are, in a sense, safe.

However, unfortunately, these two algorithms are also the least efficient. The entire reason LSEQ was designed, for example, is that its designers wanted a CRDT that was more efficient than Treedoc and WOOT, since those algorithms take a lot of space for their identifiers. Unfortunately, this performance optimization introduced the bad interleaving behavior. In my opinion, that makes algorithms like LSEQ and Logoot basically unsuitable for use in many text-editing applications.

Moreover, there is a formal specification of collaborative text editing — sometimes called the strong list specification — published by Attiya and others in 2016. This specification also allows interleaving as valid behavior, though we have a paper in which we fix the specification to rule out interleaving.

### RGA: A Partial Case

Finally, **RGA** (Replicated Growable Array) is an interesting case study, because it does not quite have the same interleaving problem — it has a lesser version of the problem.

Here's an example. User 1 starts with `hello!`, inserts the word "reader" between "hello" and the exclamation mark, then moves their cursor back to just after "hello" and types the word "dear". So what happened is: type "reader", move the cursor back, then type "dear". Concurrently, User 2 just types the word "Alice" between "hello" and the exclamation mark.

What can now happen in RGA is that the word "Alice" gets interleaved in between the words "dear" and "reader" — so even though "dear reader" was typed by one user, and "Alice" was typed by the other, we can end up with the two mixed together. We don't get the same character-by-character interleaving we saw with the other CRDTs, but we can still get text inserted into the middle of a different user's insertion.

The reason this happens has to do with the data structure RGA uses: a tree with very deep sub-trees and typically a small branching factor. Each node in the tree is a character that was inserted, and the parent of each node is the character that was the immediate predecessor character at the time of insertion. We start with a single special root node representing the beginning of the document, and when a user types "h-e-l-l-o-!", each letter's parent is the character typed immediately before it — forming a chain, almost like a linked list.

Then the users position their cursors between "hello" and the exclamation mark, and one types "space, reader", the other types "space, Alice". The first user then moves their cursor back and types "dear". Every time a cursor is moved, a new sub-tree forms. Otherwise, the order of characters in the document is a depth-first traversal over this tree, and the order in which sub-trees are visited is defined by a timestamp attached to every node — when a node has several children, they're visited in descending order of timestamp. Because timestamps are unpredictable across concurrent edits, you can end up with several possible interleaved outcomes as the merge result.

It is possible to get full character-by-character interleaving in RGA too — this happens if users type their document back to front, i.e., starting from the end of the document, typing the last letter, moving the cursor back to the start, typing the second-to-last letter, and so on. If a document is typed this way, all the characters end up as siblings — direct children of the root — and their order is defined purely by timestamps, exactly reproducing the character-level interleaving problem. Fortunately, in practice, people don't type documents this way — people tend to type in a reasonably linear fashion from beginning to end, occasionally backtracking, deleting, or copy-pasting sections, but generally moving forward. For that reason, the interleaving problem isn't as bad in RGA as in the other algorithms.

Still, if we want to be strict and disallow *any* interleaving at all, we did devise a fix — a modification to the RGA algorithm that prevents this kind of interleaving of concurrent insertions regardless of how cursors are moved. I don't have time in this talk to go through the algorithm, but if you're interested, there's a paper we published in 2019 called *Interleaving Anomalies in Collaborative Text Editors*, which describes the algorithm in detail.

---

## Topic 2: Reordering List Items

Let's move on to reordering list items — moving an item from one position in a list to another.

One example application where we might want this is a to-do list. Often, you can drag and drop items into whatever order you want. Consider a to-do list: (1) buy milk, (2) water the plants, (3) phone Joe — and the user drags and drops "phone Joe" to the top, making it position 1.

### Representing a List with CRDTs

We can represent this list using any of the text-editing CRDTs discussed earlier — all of these CRDTs are, in effect, list CRDTs too. However, none of them actually support a *move* operation directly — they only have insert and delete operations.

You might think this isn't a problem, since we could implement moving by deleting the item from its old location and inserting it at its new location. This works — except it breaks down if several people can concurrently move the same item.

Suppose Replica A and Replica B both move "phone Joe" to the top of the list. Both replicas delete "phone Joe" from position 3 — so it's definitely gone from position 3. Then both replicas insert "phone Joe" at position 1. But now both insertions happen, and we end up with **two copies** of "phone Joe" at positions 1 and 2. The item we only wanted to move has accidentally been duplicated — not the behavior a user would expect. Reordering an item on a to-do list shouldn't produce two copies of it.

### What Behavior Do We Actually Want?

Consider a similar example, but this time the two replicas move "phone Joe" to *different* positions: Replica A moves it to the top of the list, while Replica B moves it to the second position (after "buy milk"). What's the desirable behavior here?

We could say "phone Joe" should appear at both positions — but that reintroduces duplication, which we don't want. What we really want is for "phone Joe" to appear in just *one* of the two positions — perhaps with a warning that we picked one of two conflicting positions, or perhaps it's fine to just pick one and move on. Let's say we pick one of the two concurrent positions arbitrarily but deterministically as the winner. In this example, say the top-of-the-list position wins: from the first user's point of view, nothing changes, but from the second user's point of view, after moving "phone Joe" to position 2, it's then subsequently moved back to position 1.

This may look familiar if you've studied existing CRDTs, because it's exactly what happens in a **last-writer-wins (LWW) register**: a variable that can be concurrently assigned different values by different users, where the merge outcome is to pick one of the concurrently written values as the winner and discard the others. You can think of the position of "phone Joe" as having last-writer-wins register semantics: one user assigns its position to the head of the list, the other assigns it to "after buy milk", and as the two users communicate, the result is that one of the two values wins.

### Building a Move Operation from Existing CRDTs

Let's make this more formal. What we need is:

1. **A last-writer-wins register.**
2. **An unambiguous way of referencing positions in the list.**

For the second part, we can reuse exactly what the text-editing CRDTs already give us: a stable, unique way of referencing particular positions in a list, via the unique identifiers we saw earlier. Different CRDTs construct these identifiers differently — Treedoc uses a path through a binary tree, Logoot uses a path through a tree with a higher branching factor, RGA and causal trees use timestamps — but the basic idea is the same: unique identifiers for particular positions in the list. We can take these identifiers and use them as the value inside our last-writer-wins register.

Next, since we have multiple list items, we need a separate register for each item to hold its position. We can construct a set — for example, using an **add-win set CRDT** — whose contents are all the items on our list, where each item is a pair: a value (like the to-do list item's text) and a last-writer-wins register containing that item's position.

Now we can:

- **Add** new items to the list by adding them to the add-win set.
- **Move** an item's position by updating its LWW register — using a list CRDT to create a position identifier for the destination, then using that identifier as the value in the register.

We've constructed a new CRDT operation — a move operation for lists — just by composing three existing CRDTs: a list CRDT (of any of the flavors discussed), an add-win set, and a last-writer-wins register. Because we've composed existing CRDTs, we know the end result is itself a CRDT. This allows us to do atomic moves of a single list item at a time.

### The Open Problem: Moving Ranges

Things get more difficult if we want to move more than one item at a time. For a to-do list, this usually isn't necessary — drag-and-drop typically only lets you move one item at a time. But in text editing, this kind of situation arises naturally.

Consider a to-do list represented as plain text, with each bullet point starting with a bullet character and ending with a newline. Suppose Replica B takes the item "milk" and moves it in front of "bacon" — meaning the whole range of characters (bullet, space, "milk", newline) is moved. Concurrently, a different user updates the "milk" item to say "soy milk," by deleting the uppercase "M" and inserting "soy" and a lowercase "m".

What do we expect? We'd expect both changes to take effect cleanly, merging together so that "soy milk" appears in front of "bacon" — two changes merged cleanly, as we want. Unfortunately, this isn't what actually happens. If we apply our single-item move algorithm to each character individually, "milk" is correctly moved in front of "bacon," but the change from "milk" to "soy milk" remains attached to the *old* position where "milk" used to be — not the new position it moved to. The end result is that the list reads "milk / bacon / soy M", with the "soy M" standing alone, without context, because its context has been moved away.

This is a problem I do not know how to solve. I've spent a while thinking about it, come up with a couple of half-solutions that don't really work, and a couple of other people are thinking about it too. If you're interested, feel free to think about it — and please publish the result if you manage to figure it out. This is the problem of moving items in lists: we've figured out how to move a single list item at a time, but moving ranges of characters in a way that behaves well remains an open challenge.

---

## Topic 3: Moving Subtrees in Trees

Now, rather than moving elements in lists, let's move sub-trees within a tree. Let's again look at an example — say, a file system.

### Concurrent Moves to Different Locations

Suppose we start with a tree on both replicas where nodes A, B, and C are children of the root. On Replica 1, node A is moved to become a child of B. On Replica 2, the same node A is moved to become a child of C. Now A has been moved to two different locations on two different replicas. What outcome do we expect?

This is similar to the case of moving elements in lists. One option is to duplicate: have A appear both as a child of B *and* as a child of C — meaning any children of A also need to be duplicated. As with lists, I think duplicating nodes on concurrent moves is not good behavior.

Another option is for A to be shared as a common child of both B and C. This works, but it's no longer a tree — if what we expect our data structure to be is a tree, rather than a DAG or some other kind of graph, this isn't acceptable, because in a tree, no node ever has two parents.

That leaves the option of picking one replica's move as the winner and ignoring the other — either A ends up as a child of B, or as a child of C, but not both. As with moving list items, this is a kind of last-writer-wins behavior, and I think it's reasonable.

### Cycles: Moving a Directory Into Itself

Additional complications arise with trees. One tricky example can be illustrated with your own file system: create a directory `a`, then create a sub-directory within it called `b`, then try moving `a` into `b` — that is, moving `a` to be a child of `a/b`. This might sound weird, since you'd effectively be trying to move a directory into itself. If you try this — I tried it on macOS — you get an error like "invalid argument." This makes sense: performing such a move would create a cycle, and the data structure would no longer be a tree — it would become a graph with cycles, which would be very confusing for a file system.

If we build tree CRDTs that allow moving sub-trees, it makes sense to prevent this kind of cycle too — but with CRDTs, we have the added complication of concurrent changes.

Consider this example: we start with the same tree on both replicas. On Replica 1, we move B to be a child of A (so B is a child of A, and C remains an existing child of A). On Replica 2, we move A to be a child of B (so A is a child of B, and C remains a child of A). Each of these moves is, by itself, perfectly fine. But if we combine both, we end up with exactly the problem described above — a directory effectively moved inside itself. If we're not careful, we end up with A and B in a cycle, disconnected from the root of the tree, which is no longer a tree — it's some more general graph structure.

As before, one option is to duplicate nodes: allow both "B is a child of A" and "A is a child of B" to exist simultaneously, duplicating any of their children too. As before, I think duplication is the wrong way to handle this. It seems, again, that we want a last-writer-wins semantics: pick either the outcome of moving B into A (ignoring the other move) or the outcome of moving A into B (ignoring the other move). Both replicas must end up picking the *same* winner and ignoring the *same* loser, or they wouldn't converge, and it wouldn't be a CRDT.

### How Do We Achieve This?

I tried some existing software to see how it handles this. I tried it with Google Drive, for example: I created two directories, A and B, and concurrently moved A into B and B into A on two different computers. What I got was a persistent "internal, unknown error, try again" message that never went away — it just kept looping trying to sync. So Google Drive hasn't solved this problem either.

Here's how we solved it. We think about the sequence of operations applied on each replica, with a timestamp on each operation — we can assume some globally unique timestamp, e.g. Lamport timestamps. Among these operations, some are move operations and some might be other kinds of operations. On Replica 1 we have "move A into B" then "move B into A"; on Replica 2 we might have similar conflicting moves.

Each of these operations is, by itself, safe and fine to execute. What we need is to detect the case where two operations are in conflict with each other, in the sense that executing both would create a cycle — and ensure we never create a cycle.

When these two replicas merge their sequences, we take the union of the operations from both replicas and put them in timestamp order. Then we say the operations get executed exactly in increasing timestamp order. The first move in the combined sequence is fine, because by that point nothing bad has happened yet — but by the time we get to the second conflicting move, that move is unsafe, so if we want to ensure the tree remains free of cycles, we have to skip it, pretending it didn't happen. This is tricky because one of the replicas may have already executed the operation that must now be undone, in order to converge again with the other replica.

### The Undo/Redo Algorithm

The basic principle we use is to take these sequences of timestamped operations and merge them into a single sequence, in timestamp order, using undo and redo. Suppose, on Replica 1, we've executed operations with timestamps 1, 3, 4, and 5, and now we receive an operation with timestamp 2 from Replica 2. We need to insert this timestamp-2 operation earlier in our sequence — but time has already moved on, since we've executed operations 3, 4, and 5.

The approach: undo operations until we're back at the point where all operations with a timestamp greater than the new operation have been undone. So we undo operation 5, then undo operation 4, then undo operation 3 — now we're only left with operation 1. Now we can apply operation 2 on top of that. Then we redo the three operations we undid. If we perform this logic consistently on each replica, all replicas will end up executing the same operations in the same order — it just means extra work when an operation needs to be inserted early in the order, requiring a lot of undos and then a lot of redos to replay everything that happened since.

### Performance

You might wonder whether this makes performance terrible. We ran some performance experiments, and the results were okay. There is certainly a cost from performing all these undos and redos, and we tested this with a system of three replicas spread across three different continents, with a network delay of over 100 milliseconds round-trip between them. We then generated move operations at a high rate — the higher the rate, the more undo/redo work is needed, and the slower each individual operation becomes to execute.

We were able to get this system to handle at least **600 operations per second**. That's not massive on big-data scales, but for something like a single user updating their own file system, I don't think a single user is going to perform more than 600 move operations per second locally. For a lot of collaboration software, this performance is perfectly fine, and we don't have to worry too much.

### The Data Structures

Let me explain a bit more about how this works in terms of data structures. First, we describe a move operation as a structure with the following fields:

- A globally unique **timestamp** (such as a Lamport timestamp).
- The **child** — the node in the tree we are moving.
- The **parent** — the new location, the new parent of that child in the tree.

Note that this operation does not record what the *old* parent of the child was — we simply take the child from wherever it currently is in the tree and move it to be a child of the new parent. We can call this a "stealing" move. We can also attach a little metadata to the operation — for example, in a file system, a file has a name within its directory, and that name can be the metadata associated with the file in a given directory.

To support the undo/redo mechanism, we construct a log of operations, where each log entry has:

- The **timestamp**, new parent, new metadata, and child — all taken directly from the move operation.
- Additionally, the **old parent** and **old metadata** — that is, what the parent and metadata of the child were *before* this move was performed.

This extra information is what allows us to undo the operation: to undo a move, we simply set the child's parent and metadata back to its old parent and old metadata.

Given this log, we can construct the current state of the tree as a set of triples of (parent, metadata, child) — whenever child is a child of parent in the tree. We can now define an **ancestor** relation: A is an ancestor of B if either A is a direct parent of B (i.e., a (A, metadata, B) triple exists in the tree), or there exists some tree node C such that A is a parent of C, and C is an ancestor of B. This defines the transitive closure over the parent-child relationship.

Given this definition of ancestry, we can now define what makes a move operation **safe**. For a move operation with a given child and parent (the destination):

- If the child is currently already an ancestor of the destination parent, this move would be unsafe (it would create a cycle), so we do nothing.
- Similarly, if the child and the parent are the same node, this would also be unsafe, so we do nothing.
- In all other cases, it's fine: we update the tree by removing the child from its existing location — stealing it from wherever it currently is — and adding the new (parent, metadata, child) relationship.

Given this function for performing a move operation, and the undo/redo procedure I described, we now have an algorithm for safely performing move operations on a tree CRDT. We proved several theorems about this algorithm. In particular, we showed that this algorithm does indeed preserve the tree structure — every node has a unique parent, and the tree contains no cycles, for any sequence of operations that are executed. We also proved that, given any two sequences of operations, if one is a permutation of the other, applying either sequence leads to the same state — in other words, the operations are commutative, and the algorithm is a genuine CRDT.

---

## Topic 4: Making CRDTs More Efficient

Let's talk about efficiency and reducing the overhead of CRDT metadata. This is a particular problem with a lot of CRDT algorithms, especially text-editing CRDTs.

Think about a text document: as we discussed, we give every single character a unique identifier. Each character in English text takes one byte for the ASCII character (or a UTF-8 encoding of it), but then you have additional metadata — perhaps a path through a tree taking a couple of dozen bytes, plus an identifier for the node that inserted the character, which, if it's a UUID, will be at least another 16 bytes (36 bytes if hex-encoded). You quickly end up with a really disproportionate situation: one byte of actual data, and something like a hundred bytes — or more — of CRDT metadata.

I want to talk about some work we've done as part of the **Automerge** project, a CRDT implementation I work on, to bring down that metadata overhead. We've had some really good results using carefully designed algorithms and data structures.

### A Case Study: Editing History of a LaTeX Paper

The old version of Automerge uses a JSON encoding to encode all metadata and send it over the network and write it to disk — an incredibly verbose format. As a case study, we took the editing history of the LaTeX source of a paper. A colleague and I wrote this paper using a homegrown text editor, capturing every single keystroke that went into writing it.

The final file is about **100 kilobytes** of plain text (ASCII, with LaTeX markup). We captured over **300,000 operations** — every individual keystroke of the editing history, including every character typed, every character deleted (typos corrected, sections rewritten, etc.), and every single cursor movement.

Encoding this history of 300,000 or so changes in the old JSON format, the file size is about **150 megabytes** — that is, almost 500 bytes per change, which is pretty terrible.

We designed a new binary data format that encodes the full editing history — every insertion and deletion, and when it happened — in a compact form, without losing any information at all (a completely lossless encoding). With this new format, we managed to reduce the file size by **over a factor of 200**, down to about **700 kilobytes**, encoding exactly the same information.

I should emphasize: if you just took the JSON history and encoded it with one of the standard binary equivalents of JSON — protocol buffers, MessagePack, and so on — you'd reduce it by a factor of two or three at most. To achieve a factor-of-200 improvement, you have to design a data format specific to CRDTs and to the particular editing patterns that tend to occur in these applications.

You can also reduce the size further by gzipping: the 150 MB JSON file gzips down to about 6 megabytes. But 6 MB is still huge compared to the 700 KB we achieved uncompressed with our binary format — and that 700 KB binary format gzips down further, to about **300 kilobytes**, without losing any information at all. At this point, we've encoded a 300,000-operation change history in 300 KB — less than one byte per change — meaning we can look back at any past version of the document at any point in time, and all of that data is still there, encoded in this very compact form, which I find very exciting.

### Compressing Further by Throwing Away History

We can compress further by throwing away some of the history. The first thing we might choose to discard is cursor movements — to be honest, who cares exactly where the cursor was at any given point in the editing history? Discarding cursor movements saves about **22%**. We can go down further, to about **230 kilobytes**, by also throwing away the full change history for the text (keeping only the CRDT state needed for merging, not the entire history of every edit).

At 230 KB, we still have all of the CRDT metadata, including all tombstones — meaning we can still perform arbitrary merges between different replicas of this data. Yet we're down to only about twice the raw data-set size: about 100 KB is the raw text document with no CRDT metadata at all — just the final state of the text. So all the CRDT metadata is adding only a bit more than 100% overhead on top of the raw text, without gzip. If we apply gzip at this point, the file sizes with and without CRDT metadata become almost the same.

We can go even further by removing the **tombstones** — the markers for deleted characters in the document. Doing so saves roughly another 70 kilobytes. Whether you want to do this depends on your needs: if you throw away tombstones, you can no longer merge with edits that happened before, or concurrently with, the tombstone removal. But if you do remove them, the raw CRDT metadata — just the unique identifiers for the characters that remain — takes only about **50 kilobytes**, which is only about **48% overhead** on top of the raw 100 KB text document. I find this very exciting.

### How the Compact Encoding Works

I should explain how this compression is actually achieved. The basic idea is that we want to maintain the full change history as much as possible. We store the full set of insertion operations, deletion operations, and cursor movements (if needed). Each operation is given a unique ID, which is just a Lamport timestamp — a pair of a counter and the ID of the node that generated it (which we call the "actor ID" in Automerge). The text-editing algorithm is CRDT-based: whenever you perform an insertion, you reference the identifier — the Lamport timestamp — of the character immediately before the inserted position.

We keep the full set of operations stored in document order (the order in which characters appear in the document). This produces something like a table, similar to a table in a relational database, where each row is one operation. For example, typing "hello" with three L's, and then someone comes along and deletes one of the three L's, leaving the final result as "hello". Each row here is an insertion operation into the document, and each row has:

- An **operation ID** (a Lamport timestamp: a counter plus an actor ID).
- A **reference element** — the identifier of the predecessor character. For example, "e" comes after "h", so "h" has ID `1a`, and "e" has ID `2a`, referencing `1a` as its predecessor.
- If an operation is marked as deleted, additional **deletion columns**, recording the operation ID of whichever operation(s) deleted this particular character. (Multiple deletion operations for the same character can occur if multiple users deleted it concurrently.)

We can encode this table very compactly using some fairly simple tricks. First, we encode each column of the table individually.

**The counter column.** Suppose the counter column consists of the numbers 1, 2, 3, 4, 5, 6. We first delta-encode it: for each number, we calculate the difference from its predecessor. Since these numbers are all sequential, the differences are all 1: `1, 1, 1, 1, 1, 1`. We then run-length encode this to "6 times the number 1," and use a variable-length binary encoding for integers, so that small numbers are represented in one byte, slightly bigger numbers in two bytes, and so on. This entire counter column, for six operations, gets encoded in just **2 bytes**.

**The actor ID column.** If all six characters were inserted by the same actor, we build a lookup table mapping actor IDs (which are normally UUIDs, so 16 or even 32 bytes each) to small numbers — actor `a` maps to `0`, actor `b` maps to `1`, and so on. This translates the column into `0, 0, 0, 0, 0, 0`, which we run-length encode and variable-length encode again — the entire actor column gets encoded in another **2 bytes**.

**The text columns.** We represent the actual inserted text in two separate columns: the UTF-8 byte string for each character being inserted, and the number of bytes that character takes. If we're typing plain English text, every character fits within one byte of UTF-8, so this length column just consists of a long run of 1's — again compressing extremely well. Once we've encoded the length column, we can just concatenate all the actual character bytes together, since we can later split the boundaries between characters using the length column. Concatenating "hello" with an extra "l" gives us six bytes total.

By encoding each column individually this way, we can represent each column extremely compactly — just a couple of bytes each. It turns out that, because of the editing patterns typical of text, you tend to get increasing sequences (since people generally type letters in sequential order), which means counters tend to increase by exactly one each time. The whole data set has a structure that compresses really nicely, and we can take advantage of our knowledge of this structure to encode it very compactly.

This gives us the set of operations. To have the full change history, we need a small amount of extra metadata: for each set of changes made at a given point in time, we record the timestamp of when that occurred and the range of operation IDs involved. With this extra metadata, we can reconstruct exactly what the document looked like at any past point in time, using a very small amount of additional storage space.

So, if people tell you that with CRDTs you have to put a lot of effort into tombstone garbage collection because tombstones waste a lot of space, think back to this example: tombstones actually cost us only about 48% of the space of the raw text, which is a fairly small cost to maintain, in exchange for the ability to merge fully. Whereas the difference between a simple JSON format and an optimized binary format made a **factor of 200** difference. This means that, if we want to store the full change history — allowing dips into the history, interesting visualizations of a document's evolution, and so on — we can do so at very low cost, and we don't actually have to throw away all this extra metadata that we have.

---

## Conclusion

As I said at the beginning, I think CRDTs are very easy to implement badly — easy to implement in a way that is inefficient, or that has all sorts of weird behaviors, like the interleaving anomaly we saw, or the problems of doing move operations safely on both lists and trees, in a way that is both correct and intuitive to users.

But as you've seen from this talk, we've made a lot of progress in just the last few years on these topics, and I think we're heading in a direction where CRDTs are starting to become something that can really be the foundation for a very large set of applications — where we can start to build actual, practical user-facing software, not just research prototypes, on top of these basic principles.

I hope you will join me in finding this very interesting, and in exploring where this ends up going in the future. I'll end with some references: first, the list of the various text-editing CRDTs I talked about in the context of interleaving, and finally the publications I've worked on for the various algorithms and anomalies discussed in this talk. All of the slides are online, so you can find them there.

Thank you very much for listening — I hope you enjoyed this talk, and I'll see you again soon.

---

### Referenced Work

- *Designing Data-Intensive Applications* — Martin Kleppmann
- *Interleaving Anomalies in Collaborative Text Editors* (2019) — on fixing the RGA algorithm to eliminate interleaving
- Attiya et al. (2016) — formal specification of collaborative text editing (the "strong list specification")
- Text-editing CRDT algorithms discussed: Treedoc, WOOT, Logoot, LSEQ, RGA, and causal trees
- The Automerge project — an open-source CRDT implementation, including the compact binary encoding format discussed in the efficiency section