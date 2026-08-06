 Design a concurrent graph data structure that allows an idle thread to acquire the next available task. Tasks are nodes and contain all the context and execution instructions to perform the task. Graph connections denote task dependencies for order of execution, as some tasks depend on the completion of others. The completion of a task may trigger updating the context / instructions contained in dependent task nodes. New tasks can be added during ongoing execution. For a proof of concept, write some code to generate such a graph for the parallel computation of simple arithmetic expressions (PEMDAS order).

For more interest, consider modeling more complicated dependencies. In the stated design, multiple dependencies are straight forward (a node is not available until every dependent node is completed), like a logical AND, but you can also consider logical OR. In the general case, a task could evaluate the current state of the graph to determine whether it is available based on any criteria.

For more interest, consider modeling granular semantic dependencies between tasks that are handled symbolically. You may, for example, simplify a subexpression that is not ready to be evaluated. As one idea, a task could be a coroutine that yields to its dependency. This would allow modeling tasks more meaningfully.

Once you are satisfied with your graph model, find some non-trivial concurrent applications for its use beyond arithmetic
https://github.com/arnavarora1710/todoer
