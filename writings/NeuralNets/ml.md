---
Title: Understanding Neural Networks
date: 2026-06-27
---
>Most ML scratch tutorials teach ppl how to use ml models, not how they work and how to build them from scratch.This technically makes sense cause irl your just gonna use ml to solve problems(like a programing language would). But unlike a programming language, using ml models is boring af and most of the time your just gonna end up matching python functions. I find learning how the actual thing is made more interesting and fun. Also i recommed you to watch [tsodings machine learning in C stream ](https://www.youtube.com/watch?v=PGSba51aRYU&list=PLpM-Dvs8t0VZPZKggcql-MmjaBdZKeDMw) its pretty good

A Neural Network is just a one or more math functions that you change incrementally to produce a certian value in the pattern you want. We basically take assign some magic numbers (aka parameters) and those like noobs that we increase and reduce to get the our needed output values.
##### Important concepts 
Activation function
Bais
Learning rate
Weight 
Cost (we use MSE cause its the simplest)
Gradient Decent
Direvatives
Chain rule
Differentials
Back propagation
###### Gradient decent
Compute the cost 
Compute derivatives to see which direction is downhill? 
Increment all weights a tiny step in the downhill direction.
Repeat until cost is minimized 
Learning rate is the rate of which we change the paramter.

[3blue1brown as a Neural Nets series that really good](https://youtu.be/aircAruvnKk?si=ghc-zTIaEihj18Wq) [And he also recommends this book](http://neuralnetworksanddeeplearning.com/)
### Backpropagation
Alryt, back propagation is basically the "learning" part, We take the cost function and re-evaluvate the parameters to get the cost function down. We do this by taking the derivations of those noobs to the cost function. The algorithm used for that is called backpropagation. 
#### Derivatives $$f'(x) = lim(h→0) of [ f(x + h) − f(x) ] / h $$
Derivatives is the instant change in a value. (your typical gradient gets the average rate of change not the change at that point). A derivative measures how much a function value changes when it grows at that moment. [This guy on youtube explains it well](https://youtu.be/wUZcIYx-7a4?si=uKmcBWwP-MwPvZ5M) also the [khan academy videos is also really good](https://youtu.be/rAof9Ld5sOg?si=iP_WVkTOojIC3Sij) [and this](https://youtu.be/ay8838UZ4nM?si=AShe17u9qw0pDDqp). Also i dont really understand limits, i think of it like saying, "okay take the answer of the function and bring this value(h) to this(0)"
##### The chain rule $$\frac{dL}{dx}= \frac{dL}{dy} \times \frac{dy}{dx}$$
Multiply the upstream gradient by the local gradient. [This guy youtube explaintion bout chain rule](https://youtu.be/4s7G7nkMYHM?si=54yNPntUKvaNgapX) and [another one](https://youtu.be/H-ybCx8gt-8?si=obGJaLBjce1xmXJb). 

> You also need to understand the differential rules thats get used with derivatives. Youll use them a lot

## Micrograd

> [adraj kapathys micrograd lecture is realy good](https://youtu.be/VMj-3S1tku0?si=63IeWDJ9iN0cngu5)

Its a Neural Network introductory project build by adraj kapathy (The guy found "vibe coding"). It is a system that computes exact derivatives (differentiation) without manual formula-derivation or numerical approximation (automatic) by decomposing expressions into primitive ops with known local derivatives and chaining them via backprop.

The whole thing works with a data struct called Values. You can do arithmatic stuff on values like add/divide etc... Then it keeps track on how the values are passed through what ever equations you made. You can see how the values change in a graph and also see deravitives of those values using backpropagation.

"These operations but really all of this is kind of like a fake concept all that matters is we have some kind of inputs and some kind of an output and this output is a function of the inputs in some way and as long as you can do forward pass and the backward pass of that little operation it doesn't matter what that operation is and how composite it is if you can write the local gradients you can chain the gradient and you can continue back propagation so the design of what those functions are is completely up to you" - Kapathy

> Another great NN teaching project [Minitorch](https://minitorch.github.io/)

![[machine_learning.png]]


