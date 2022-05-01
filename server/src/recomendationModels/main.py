import sys
import joblib
import re
import pandas as pd

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
# print(data)

pipeline = joblib.load('./src/recomendationModels/pipeline.joblib')
tree_reg = joblib.load('./src/recomendationModels/treeRegressor.joblib')

data_prepared = pipeline.transform(data)
prediction = tree_reg.predict(data_prepared)
x = re.findall('[0-9]+', str(prediction))[0]

print(x)
