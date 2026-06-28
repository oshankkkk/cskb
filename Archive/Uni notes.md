---
Title: Basics
date: 2026-06-27
---
## Data Preprocessing
Preprocessing is just the umbrella term for everything you do to data before the actual ML stuff. Data cleaning, transformation, reduction, integration — all of that falls under preprocessing. It's just getting the data ready yk.
### Missing Values
Missing values are a problem because they introduce bias into the model. The model starts learning patterns from incomplete information and that messes things up.

- Filling with a fixed value — replace nulls with something sensible like 0 or "Unknown"
- Filling with the mean — good for numerical columns, keeps the average intact
- Filling with the mode — good for categorical columns, since mode is just the most frequent value

> Sometimes you can also just yeet the whole bunch out
### Types of Data
Before you start doing anything to your data, you need to know what kind you're dealing with:

- Nominal — categorical, no order. Like colors or city names. Red isn't "greater than" blue.
- Ordinal — categorical but with a meaningful order. Low < Medium < High. There's a hierarchy.
- Ratio — actual numbers where zero means absence. Height, weight, salary.
- Interval — numbers on a scale, but zero doesn't mean nothing. Temperature in Celsius for example — 0°C doesn't mean no temperature.

This matters because how you handle and transform data depends on what type it is.
### Encodings 
Models only work with numbers. So categorical data needs to be converted before you feed it in.
#### Label Encoding
Assign integers  0, 1, 2, 3 to each category. Simple, but the problem is the model will think there's an order between them. Like it'll treat category 2  "bigger than" category 1, which is wrong if they're just labels with no hierarchy.
#### One-Hot Encoding
Create a separate binary column for each category, with 1 or 0 indicating whether a row belongs to it. No false ordering. But if you have like 50 categories you're going to explode your feature count, which creates its own problems.
### Scaling Data
Some models rely on the distance or magnitude of values. If one feature ranges from 0–1 and another from 0–100000, the big one dominates everything and the smaller feature basically becomes invisible to the model. Scaling is used to bringing all features to a comparable range. A common approach is standardization  transforming each feature so it has a mean of 0 and standard deviation of 1. Another is normalization, squishing everything into a 0 to 1 range.

> Only compute your scaling parameters (like mean and std) from the training data. Never from the full dataset. If you include the test data when computing these, the model indirectly gets information about unseen data during training. That's called data leakage and it gives you fake good results that fall apart on real data.

### Exploratory Data Analysis (EDA)
Before you train anything, you should visualize and understand the data. EDA is just that exploring the dataset before committing to a model.

Things you're looking for:
- Outliers — values that are way off from the rest. They distort averages, confuse models, and break scaling.
- Distributions — how are values spread? Is it skewed? Roughly normal? Bimodal?
- Categorical frequencies — how often does each category appear?
- Class imbalance — is one target label way more common than the other?
#### Common graphs and what they tell you

| Graph        | What it tells you                                          |
| ------------ | ---------------------------------------------------------- |
| Histogram    | How values are distributed                                 |
| Box Plot     | Where the outliers are                                     |
| Heatmap      | Correlations between features, or where values are missing |
| Scatter Plot | Relationship between two variables                         |
| Count Plot   | Class imbalance in your target                             |
| Pair Plot    | All feature relationships at once                          |
## Model Training
### Train/Test Split
Features are the input variables the stuff the model uses to make predictions. The target is the output  what you're actually trying to predict.
If you train and evaluate on the same data, the model just memorizes the answers. It'll score perfectly but it's useless on new data. So you split the dataset usually 80% for training, 20% for testing and only evaluate on data the model has never seen during training. The split should be random, but you want to fix the random seed so results are reproducible, Otherwise every run gives a different split and you can't tell if your model actually improved or you just got a lucky split.

> Like the ratio of the different data should be the same even tho its random, like 40% big values and 60% lil values should be the same for both testing and traning splits. But the actual variables should be random.
#### Stratified Splitting
When your classes are imbalanced  say only 14% of samples are class 1 a random split might accidentally put almost no class 1 samples in the test set. Stratified splitting preserves the original class ratio in both the training and test sets, so evaluation is actually meaningful.
## Things that go wrong
##### Underfitting
The model is too simple. It doesn't capture the real patterns in the data and fails on both training and new data. Dumb model basically.
##### Overfitting
The model is too complex. It memorizes the training data including the noise, scores great on training but falls apart on anything new.
##### Bias
Bias is when a model makes wrong assumptions about the data. It's oversimplified and can't capture real patterns. High bias leads to underfitting.
##### Variance
Variance is when a model learns the training data too perfectly, noise and all. It memorizes instead of generalizing. High variance leads to overfitting.

| Situation         | Bias     | Variance |
| ----------------- | -------- | -------- |
| Too simple model  | High     | Low      |
| Too complex model | Low      | High     |
| Good model        | Balanced | Balanced |

> The goal is to find the sweet spot. This tradeoff is called the bias-variance tradeoff and it's one of the core ideas in ML.
## Models
### Logistic Regression
Despite the name, it's a classification model not a regression one. It estimates the probability that a given input belongs to a particular class. Most commonly used for binary classification (yes/no, spam/not spam) but can handle multiple classes too.

- One-vs-Rest (OvR) — train a separate binary classifier for each class, treating that class as positive and everything else as negative. At prediction time, pick whichever class had the highest confidence.
- Softmax / Multinomial — models all class probabilities at once using a softmax function, which generalizes the sigmoid to multiple outputs. All probabilities sum to 1.

A model gives you two things: a predicted class (the actual label it chose) and a predicted probability (how confident it is). The probability is useful for things like ranking or threshold tuning.
### KNN (K-Nearest Neighbors)
Super intuitive. To classify a new data point, look at the K closest points in the training data and take a majority vote. Whatever class most of those neighbors belong to, that's the prediction. You choose K yourself. Getting it right matters:

- K too small (like K=1) → model is too sensitive to individual points, memorizes noise → overfitting
- K too large → model averages over too many points, loses nuance → underfitting

KNN works purely on distances between values, so your features need to be on the same scale before you use it. Otherwise features with large values dominate the distance calculation and small-valued features get ignored.
### Naive Bayes
Flips the logic compared to logistic regression. Instead of estimating the probability of a class given the features, it estimates the probability of the features given the class, then uses Bayes' theorem to work backwards. The "naive" part is the assumption that all features are independent from each other. That's almost never actually true in real data, but the model still works surprisingly well in practice despite that.
## Evaluation Metrics
Once you have predictions, you need to actually measure how good they are. First, four building blocks from a confusion matrix:

- TP (True Positive) — predicted positive, actually positive
- TN (True Negative) — predicted negative, actually negative
- FP (False Positive) — predicted positive, actually negative. A false alarm.
- FN (False Negative) — predicted negative, actually positive. A miss.
### Accuracy
(TP + TN) / (TP + TN + FP + FN)
Overall how often is the model right. Looks good on paper but is misleading on imbalanced datasets. If 95% of your data is class 0, predicting 0 every single time gives you 95% accuracy and the model is completely useless.
### Precision
TP / (TP + FP)
Of everything the model flagged as positive, how many actually were? High precision = fewer false alarms.
### Recall
TP / (TP + FN)
Of all the actual positives in the dataset, how many did the model catch? High recall = fewer misses.
### F1 Score
2 × (Precision × Recall) / (Precision + Recall)
The harmonic mean of precision and recall. Useful when you care about both and your classes are imbalanced. A single number that captures the tradeoff between the two.
### AUC-ROC
The ROC curve plots the tradeoff between:
- TPR (True Positive Rate / Recall) = TP / (TP + FN)
- FPR (False Positive Rate) = FP / (FP + TN)

AUC is the area under that curve. A perfect model scores 1.0, random guessing scores 0.5. The higher the AUC, the better the model is at distinguishing between classes regardless of what decision threshold you pick.


