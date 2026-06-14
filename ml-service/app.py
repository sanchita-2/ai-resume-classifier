from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

model = joblib.load("resume_model.pkl")

MODEL_ACCURACY = 97.84

@app.route("/")
def home():
    return "AI Resume Classifier API Running"

@app.route("/accuracy")
def accuracy():
    return jsonify({
        "accuracy": MODEL_ACCURACY
    })

@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    resume_text = data["resume"]

    prediction = model.predict(
        [resume_text]
    )[0]

    return jsonify({
        "prediction": prediction
    })

if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )