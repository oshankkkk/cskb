---
Title: Machine learning in C
date: 2026-06-27
---
![[machine_learning.png|333]]

[Tsoding machine learning in C ](https://www.youtube.com/watch?v=PGSba51aRYU&list=PLpM-Dvs8t0VZPZKggcql-MmjaBdZKeDMw)
- Machine learning is a field of computer science where computers learn patterns from data and improve their performance on a task without being explicitly programmed for every rule. 
- So bacially my understanding is that ml is just a math function that you changes incrementally to produce a certian value in the pattern. 
- ==The value that you change until it works is called a paramter==.
- ==We take the difference we missed in the prediction and call it a  cost value ==.
- ==We use Mean Square Error (MSE) for that==, ig the reason is cause it amplifys the actual value so even a small differenc can be seen in graphs and stuff.
- Direvative the instant change in a value. (your typical gradient gets the average rate of change not the change at that point). [this guy on youtube explains it well](https://youtu.be/wUZcIYx-7a4?si=uKmcBWwP-MwPvZ5M) also the [khan academy videos is also really good](https://youtu.be/rAof9Ld5sOg?si=iP_WVkTOojIC3Sij) [and this](https://youtu.be/ay8838UZ4nM?si=AShe17u9qw0pDDqp). A derivative measures how much a function changes when you nudge its input a tiny bit. If I change a model's weight slightly, does the cost go up or down? The derivative of the cost function with respect to each weight is calculated.
	- Compute the cost
	- Compute derivatives to see which direction is downhill?
	- Nudge all weights a tiny step in the downhill direction.
	- Repeat until cost is minimized
- Learning rate is the rate of which we change the paramter.

>This thing is called a Gradient Decent algorithem
 


>Im just gonna watch adrej kapathys vid until i learn something [adrej gpt explained](https://www.youtube.com/watch?v=7xTGNNLPyMI)
>[ML roadmap blog i found on medium](https://pub.towardsai.net/the-ultimate-beginner-to-advance-guide-to-machine-learning-b4dd361aefbb?sharedUserId=oshankodagoda200667) (This is basically whats explained in uni)



