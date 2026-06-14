import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# Load dataset
df = pd.read_csv("resume_dataset.csv")

# Features and labels
X = df["Resume"]
y = df["Category"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Create pipeline
model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            stop_words="english",
            max_features=5000
        )
    ),
    (
        "classifier",
        LogisticRegression(
            max_iter=1000,
            random_state=42
        )
    )
])

# Train model
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)

# Calculate accuracy
accuracy = accuracy_score(y_test, predictions)

print("\n" + "=" * 50)
print(f"Model Accuracy: {accuracy * 100:.2f}%")
print("=" * 50)

print("\nClassification Report:\n")
print(classification_report(y_test, predictions))

# Save model
joblib.dump(model, "resume_model.pkl")

print("\nModel saved as resume_model.pkl")