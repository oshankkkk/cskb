> 20/10
## What is a graph 
A graph is a set of vertices (nodes) and edges (connections between pairs of vertices). Formally you write it as sets, e.g. V = {0, 1, 2, 3, 4} and E = {(0,1), (0,2), (0,3), (1,3), (2,3), (3,4)}. It is a network made by connecting components and is used to define and visualize relationships between various components. We study these networks and use them to solve various problems.
Graphs model maps and navigation (intersections = vertices, roads = edges), social networks (people = vertices, friendships = edges, and friend recommendations come from "friends of friends"), and even Sudoku, which can be framed as a vertex coloring problem.
#### Key terminology
| Term                     | Meaning                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| Neighbors                | Two vertices joined by an edge                                                                      |
| Degree                   | Number of edges touching a vertex (= number of neighbors), yk how much a vertex is branched sort of |
| Path                     | Sequence of vertices connected by edges (length = number of edges)                                  |
| Cycle                    | A path that starts and ends at the same vertex (all cycles are paths, not all paths are cycles)     |
| Connected (two vertices) | A path exists between them                                                                          |
| Connected graph          | A path exists between every pair of vertices, just any path                                         |
| Connected component*     | A maximal connected subset of vertices                                                              |
#### Types of graphs
- Undirected: an edge 0–1 implies 1–0.
- If a graph is connected atleast once its a cyclic graph.
- Directed: edges are oneway. A directed graph with no cycles is a DAG (directed acyclic graph).
		![[Graphs-1792427228814.webp|388x204]]
- Weighted: edges carry values like distance or traffic.
		![[Graphs-1792427902513.webp|430|378x227]]
- Trees are a type of graph thats connected and acyclic. Removing any edge from a tree disconnects the whole thing, and adding any edge creates a cycle.
#### How computers store graphs
- Adjacency matrix an n×n grid where entry (i, j) is 1 if an edge exists, else 0. It's simple but uses O(V²) memory, which is wasteful for large graphs.
		![[Graphs-1792428200645.webp|372x208]]
- Edge set just a list of all edges. It's complete but awkward for asking "who are this vertex's neighbors?"
		![[Graphs-1792428411330.webp|380x212]]
- Adjacency list, each vertex maps to a list of its neighbors. This is the most common representation because neighbor lookup is easy and it suits sparse graphs (many vertices, few edges each), like social networks.
		![[Graphs-1792428334774.webp|360|402x222]]
#### Classic graph problems
- Connectivity: are two vertices connected? Is the whole graph connected?
- Shortest path: the fewest-edge path between two vertices.
- Cycle detection: does the graph contain a cycle?
- Vertex coloring: can you color vertices so no neighbors share a color using k colors? (2 colors fail on the video's example, 3 work.)
- Path using every edge exactly once: an efficient algorithm exists. This is called an Eulerian path.
- Path visiting every vertex exactly once: no known efficient algorithm. This is the Hamiltonian path problem, tied to the famous P vs NP question.

> - What's the difference between a path and a cycle?
> - Why would you pick an adjacency list over a matrix for a social network?
> - Why does adding an edge to a tree always create a cycle?
