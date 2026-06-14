import joblib

model = joblib.load("resume_model.pkl")

resume_text = """
Python
Machine Learning
Deep Learning
Pandas
NumPy
TensorFlow
Scikit Learn
"""

prediction = model.predict([resume_text])

print("Prediction:", prediction[0])