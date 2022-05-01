import sys
import joblib
import pandas as pd
from sklearn import *

#print(sys.argv[1:])



if len(sys.argv) != 6:
    print("Maloooo passa bé els paràmetres")

entrada = {'brand': [sys.argv[1]],
           'model': [sys.argv[2]],
           'version': [sys.argv[3]],
           'year': [sys.argv[4]],
           'km': [sys.argv[5]],
           }

data = pd.DataFrame(entrada)
print(data)


pipeline = joblib.load('pipeline.joblib')
tree_reg = joblib.load('treeRegressor.joblib')

data_prepared = pipeline.transform(data)
prediction = tree_reg.predict(data_prepared)

print(prediction)