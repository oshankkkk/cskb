# Machine learning notes

```python
from google.colab import drive
drive.mount('/content/drive')
```
#### Pandas for fucking with data
###### Whats data preprocessing and is it same as data cleaning?
- Data cleaning, transformation, reduction and integrations are all comes under preprocessing . Its just processing the data before the main process yk
###### We use pandas mainly for this
```python
import pandas as pd
```
###### Whats a data frame?
- Data frame is a data struct in pandas, that's what read_csv returns
```python
dp.info()
```
- This will find missing values and data types and column names
```python
dp.describe()
```
- This gets the mean, std, mode and stuff
###### Why this is important
- Detect outliers like negative numbers or ones that are too big
- Gives a idea on scale
- werid quartiles ranges (how does quartile ranges work)

```python
copy=dp.copy()
# this makes a copy
dp.shape() 
# gives the size of the dataframe 
df.describe(include="number") same as df.describe()
df.describe(include="all") so its all the data
# only include these type of data
df.fillna(value)
df.fillna(df.mean())
# this fills all the null values with the value passed
df["Gender"] = df["Gender"].fillna(df["Gender"].mode()[0])
# mode can return a series if there are values with the same frequency
# to fill all the object values or a certain type you either gotta go for each column or make a dataframe with only that datatype and go
obj_cols = df.select_dtypes(include="object")
df[obj_cols.columns] = obj_cols.fillna(obj_cols.mode().iloc[0])
# mode()[0] vs mode().iloc[0]
```

###### Why missing values are problematic?
Cause its gonna make baises in the model i think? #doubt

```python
dp.isnull()
# this gets true/falses values on each cell if its null or not
dp.isnull().sum()
# this gets the sum on each column if its null or not
```
###### Dropping values in pandas 
```python
#func signature
df.drop(labels, axis, inplace, errors)
df.drop(['A', 'B'], axis=1) 
# same as
df.drop(columns=['A', 'B'])
# if inplace is set to false else it edits the original df
newdf=df.drop()
# having errors set to 'ignore' will not crash the snippet if errors like no column names occurs
```
###### Scaling data 
Data given to a model can be divided into different types. Nominal data is categorical data with no meaningful order, while ordinal data is categorical data with a hierarchy, such as low, medium, and high. Ratio data consists of actual numerical values, whereas interval data is also numerical but represents values on a scale rather than true quantities.
#### Encordings
###### Label encrodings
This is where we convert categorical data into numerical we just put 0 1  2 3 
But the model will think they are hierarchical yk cause 2>1
###### Hot encordings
We make them columns and we put 0s and 1s for them
If there are too many categories this will be a problem too
#### Making graphs
##### Exploratory Data Analysis (EDA).
Visualize the dataset before ML training, checking for:
- Outliers, they distort averages, confuse models, break scaling ultimately reducing accuracy.
- Distributions, It shows how the values are spread.
- categorical frequencies, so frequencies on categorical data?
- imbalance in the dataset. yk the targets

| Graph        | Purpose                        |
| ------------ | ------------------------------ |
| Histogram    | Check distribution             |
| Box Plot     | Detect outliers                |
| Heatmap      | Correlation / missing values   |
| Scatter Plot | Relationship between variables |
| Count Plot   | Class imbalance                |
| Pair Plot    | Feature relationships          |
#### Making basic models 
##### Testing vs Training data
X → input features (the data used to predict)
y → target labels/output (what the model tries to predict)

If you train and test on the same data, the model may just memorize the answers. Then its gonna increase overfitting where the model is good in training data but it fails in unseen data. We need unseen data to test on so we divide the dataset into 2 parts and only train using half of it. A testing and training pairs of question and answers

```python
# Import the train_test_split function for creating train and test subsets.
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
	#explain bout these 2 and why they exist
    random_state=42,
    stratify=y
)
```

```
test_size = 0.2 means 20% = test and 80% = train
```
###### Using different test/train ratios 
##### Why did you set `random_state=42` in `train_test_split`?
`random_state` fixes the random seed so the split is reproducible. Without it, every run would produce a different train/test split, making it impossible to compare model results consistently. Using `42` (or any fixed number) ensures the exact same rows end up in train and test every time the notebook is run.
##### What does `stratify=y` do and why is it important here?
`stratify=y` ensures the class distribution in the target variable is preserved in both the train and test sets. Since only ~14% of loans are approved (class 1), without stratification the random split might put disproportionately few approved loans in the test set by chance. Stratification guarantees both sets reflect the original 86%/14% imbalance, making evaluation more reliable.
##### Why is it important that you fit the StandardScaler only on the training data and not the full dataset?
Fitting the scaler on the full dataset (including the test set) would constitute **data leakage** — the scaler would learn the mean and standard deviation of the test data, giving the model indirect knowledge of unseen data during training. The correct workflow is:
##### Underfitting Overfitting
###### Underfitting 
Its when the model is dumb
######  Overfitting
When the model memorizes instead of understands and does well on seen data but not in unseen data
##### Model variance and biases
###### Model Bias
Bias is when a model makes wrong assumptions about the data. Its too simplyfied.
Leads to underfitting
###### Model variance
Variance is when a model learns the training data too perfectly, including noise. It memorizes instead of understanding.
Leads to Overfitting

| Situation         | Bias     | Variance |
| ----------------- | -------- | -------- |
| Too simple model  | High     | Low      |
| Too complex model | Low      | High     |
| Good model        | Balanced | Balanced |
##### Logistic Regression model
###### What is it?
Probability of class given the features
Logistic regression is a statistical model that estimates the probability that a given input belongs to a particular class. It’s most commonly used for binary classification. it can be used to predict more than 2 categories tho.

> Train a separate binary logistic regression classifier for each class, treating that class as “positive” and all others as “negative.” At prediction time, choose the class with the highest predicted probability. Or you can 
> model the probabilities of all classes using a softmax function, which generalizes the sigmoid to multiple outputs. This is the form used in many libraries (e.g., sklearn.linear_model.LogisticRegression with multi_class='multinomial').

```python
# Logistic Regression model
lr_model = LogisticRegression(max_iter=2000, random_state=42)
lr_model.fit(X_std_train, y_train)

# # Predictions
y_pred_lr = lr_model.predict(X_std_test)
y_prob_lr = lr_model.predict_proba(X_std_test)[:, 1]
# model returns the probability of both classes, we depending on the probelm can pick both or one
# whats pred and prob

# Comparison dataframe
lr_comparison_df = pd.DataFrame({
    'Actual': y_test.reset_index(drop=True),
    'Predicted': pd.Series(y_pred_lr)
})

```

##### KNN
Simple machine learning algorithm predict a new data point, look at the most similar existing data points nearby.

> You give a value and it checks for all the x number of values close to the given value( k=x which is a parameter you can set).
>Then based on the majority vote the value is predicted.
###### Standardised data for KNN
KNN works according to the value differences among the data points.
So we should standardised all the values parsed in to make sure its all realtive

```python
# Create the initial KNN model with k equal to 9.
knn_model = KNeighborsClassifier(n_neighbors=9)
# where did k=9 come from. The is k=5,you can adjust k values based on the model outputs

# Fit the KNN model on the standardised training data.
knn_model.fit(X_std_train, y_train)

# Make predictions on the standardised test data.
y_pred_knn = knn_model.predict(X_std_test)

# Predict class probabilities for ROC-AUC calculation.
y_prob_knn = knn_model.predict_proba(X_std_test)[:, 1]

# Create a comparison data frame for actual and predicted results.
knn_comparison_df = pd.DataFrame({
    'Actual': y_test.reset_index(drop=True),
    'Predicted': pd.Series(y_pred_knn)
})
```

> When the k increase too much the model becomes noisy and underfit
> When the k decrease, such as k=1, the model becomes too sensitive and overfit

###### Naive Bayes
Probability of features given the class
#### Matrices to measure 

```
Accuracy 
(TP + TN) / (TP + TN + FP + FN)

Precision 
TP / (TP + FP)

Recall
TP / (TP + FN)

F1 Score:
2 × (Precision × Recall) / (Precision + Recall)

AUC-ROC (Area under the ROC curve)
ROC curve plots:

TPR = TP / (TP + FN)
FPR = FP / (FP + TN)

```
