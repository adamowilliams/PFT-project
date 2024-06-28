import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.multioutput import MultiOutputClassifier
import joblib

# Load data
df_ml = pd.read_csv('../data/sampleUNIQUEdata.csv')

# target and features
y = df_ml[['Kategori', 'Subkategori']]
X = df_ml[['Text']]

# Preprocessing
text_transformer = Pipeline(steps=[
    ('tfidf', TfidfVectorizer())
])

preprocessor = ColumnTransformer(
    transformers=[
        ('text', text_transformer, 'Text')
    ]
)

# Model pipeline using the MultiOutputClassifier
model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', MultiOutputClassifier(RandomForestClassifier(random_state=42, n_estimators=100)))
])

# Split / fit / predict / evaluate
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model_pipeline.fit(X_train, y_train)

y_pred = model_pipeline.predict(X_test)

for i, output_name in enumerate(y.columns):
    print(f"Classification report for {output_name}:")
    print(classification_report(y_test.iloc[:, i], y_pred[:, i]))
    print(f"Accuracy for {output_name}: {accuracy_score(y_test.iloc[:, i], y_pred[:, i])}")

#Save the model
joblib.dump(model_pipeline, 'transaction_categorizer.joblib')
