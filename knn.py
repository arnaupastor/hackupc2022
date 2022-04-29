import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier


# Read dataset to pandas dataframe
dataset = pd.read_csv(url, names=names)


# Mirar primeres 10 lines dataset
# dataset.head()

X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, 4].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20)


#Normalitzar les dades
scaler = StandardScaler()
scaler.fit(X_train)

X_train = scaler.transform(X_train)
X_test = scaler.transform(X_test)


#Training and prediction

classifier = KNeighborsClassifier(n_neighbors=5)
classifier.fit(X_train, y_train)