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
#### Why we use Numpy?
Its to do math, with the data organised by pandas
#### Plotting data in graphs
#### Label encorder
