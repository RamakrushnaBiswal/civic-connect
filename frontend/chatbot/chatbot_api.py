from flask import Flask, request, jsonify  # pyright: ignore[reportMissingImports]
from flask_cors import CORS  # type: ignore
import random
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer  # pyright: ignore[reportMissingModuleSource]
from sklearn.naive_bayes import MultinomialNB  # pyright: ignore[reportMissingModuleSource]

app = Flask(__name__)
CORS(app)  # allow frontend requests

# Load training data
df = pd.read_csv("training_data.csv")
X_train = df["text"].tolist()
y_train = df["label"].tolist()

# Train model
vectorizer = TfidfVectorizer()
X_train_vec = vectorizer.fit_transform(X_train)
model = MultinomialNB()
model.fit(X_train_vec, y_train)

# Predefined responses
responses = {
    "complaint": [
        "Thanks for reporting this issue 🙏. Our team will look into it shortly.",
        "I understand your concern. The complaint has been registered ✅."
    ],
    "suggestion": [
        "That’s a great idea 💡! We’ve noted your suggestion.",
        "Thanks for sharing your thoughts. Our committee will review it soon."
    ],
    "status": [
        "Let me check 🔎… your query is still in progress.",
        "Your query is under review. You’ll get an update soon ✅."
    ],
    "request": [
        "Got it! I’ve registered your request 📩.",
        "Your request has been logged successfully ✅."
    ],
    "greeting": [
        "Hello! 👋 How can I help you today?",
        "Hi there 😊 What can I do for you?",
        "Hey! How may I assist you?"
    ],
    "fallback": [
        "Sorry, I’m not sure I understood that 🤔. Could you rephrase?",
        "Hmm… I couldn’t figure that out. Can you try again?"
    ]
}

# Simple rule-based greetings
greeting_keywords = {"hi", "hello", "hey", "good morning", "good evening"}

def detect_greeting(user_input: str) -> bool:
    text = user_input.lower().strip()
    return any(word in text for word in greeting_keywords)

def chatbot_response(user_input: str):
    # Rule-based: greetings
    if detect_greeting(user_input):
        return random.choice(responses["greeting"])

    # ML-based: classify
    X_test = vectorizer.transform([user_input])
    prediction = model.predict(X_test)[0]

    # If prediction not in responses (safety check)
    if prediction not in responses:
        return random.choice(responses["fallback"])

    return random.choice(responses[prediction])

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    bot_reply = chatbot_response(user_message)
    return jsonify({"reply": bot_reply})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
