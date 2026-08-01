---
date: 2026-07-30
Title: local 1st
tags: []
---
>https://lofi.so/, https://automerge.org/
### Local-First Software (Kleppmann, Wiggins, van Hardenberg, McGranaghan — 2019)
Core problem: cloud apps (Google Docs, Trello, Figma) give you seamless collaboration but you don't actually own your data, the server is authoritative, you're a client with a cache. Old-fashioned apps (text editors, local files) give you full ownership but no real-time collaboration. Can we get both tho?
#### The 7 ideals for "local-first" software
Treat the device's local disk as the primary copy of data, server as a secondary/backup copy, not the source of truth:

1. No spinners - instant response since you're reading/writing local disk, not round-tripping to a server to servers disk
2. Multi-device - your work syncs across your devices, not trapped on one
3. Offline works - network is optional, not required
4. Seamless collaboration - real-time multi-user editing on par with Google Docs
5. The Long Now - your data outlives the company/service that made the software
6. Privacy/security by default - no centralized honeypot of everyone's data on someone else's server
7. User retains ultimate control - no company can lock you out or restrict what you do with your own data
#### Survey of existing approaches (none hit all 7)
- Files/email attachments - fast, offline, good longevity/control, but collaboration is terrible (manual merge, "final_v3_FINAL.docx")
- Web apps (Google Docs, Trello) - great collaboration, but slow, breaks offline, poor privacy/longevity/control
- Dropbox/Drive - good on desktop (watches local folder), but mobile clients are thin/server-dependent, no real conflict resolution
- Git/GitHub - closest thing to local-first today: offline-first, fast, user controls data. But no real-time fine-grained collaboration (only coarse async via PRs), and only really works well for text/code
- Firebase/CloudKit/Realm (BaaS) - good multi-device/offline dev experience, but you're still trusting a vendor's servers long-term
- CouchDB/PouchDB — philosophically aligned (multi-master sync) but conflict resolution has to be hand-written per app, never got wide adoption
#### CRDTs (Conflict-free Replicated Data Types)
Data structures (maps, lists, text) that are multi-user from the ground up and merge automatically, no central server needed to resolve conflicts. Each device holds a full local copy; changes sync via any channel (server, P2P, Bluetooth, USB) and merge deterministically. Similar spirit to Git, but operating on structured data instead of line-based text, and merging automatically instead of requiring manual resolution in the common case. Ink switch build 3 CRDTs and found out that CRDTs actually works well and offline works was great and conflicts were rarer than expected (fine-grained merge + humans naturally avoid stepping on each other). All the CRDTs are in the automerge lib. A gap found was CRDTs accumulate unbounded history (perf/storage issue), network transport is a separate unsolved problem from the merge algorithm itself, P2P (NAT traversal etc.) is still rough, and visualizing "what changed and why" in a decentralized system is genuinely hard there's no single source of truth to diff against


- Need branching/forking semantics for CRDTs (like git branches), and schema evolution without a central authority
- Incrementally improve existing apps toward these ideals (aggressive caching, exportable formats, offline support)
- "Firebase for CRDTs", a dev platform offering local persistence + sync + offline + multi-device, but where the server is never the source of truth. (Automerge itself, and later projects like Yjs and Kleppmann's own work, became attempts at this.)
