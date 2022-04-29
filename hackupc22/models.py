from django.db import models
from django.db import connection

# Create your models here.
raw_query = "SELECT * FROM brands LIMIT 10"

cursor = connection.cursor()
cursor.execute(raw_query)
cursor.fetchall()