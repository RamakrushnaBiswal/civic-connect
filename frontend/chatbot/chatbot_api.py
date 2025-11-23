from flask import Flask, request, jsonify  # pyright: ignore[reportMissingImports]
from flask_cors import CORS  # type: ignore
import random
import uuid
import pandas as pd
from typing import Optional, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer  # pyright: ignore[reportMissingModuleSource]
from sklearn.naive_bayes import MultinomialNB  # pyright: ignore[reportMissingModuleSource]

app = Flask(__name__)
CORS(app)  # allow frontend requests

# Simple in-memory session store for conversational context (ephemeral)
sessions: Dict[str, Dict[str, Any]] = {}

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


# Simple navigation mapping: map natural page names to frontend routes.
# Add or adjust routes to match your frontend routing as needed.
navigation_map = {
    "home": "/",
    "services": "/services",
    "birth certificate": "/services/birth-certificate",
    "death certificate": "/services/death-certificate",
    "water connection": "/services/water-connection",
    "events": "/events",
    "feedback": "/feedback",
    "login": "/login",
    "admin": "/admin",
}


def detect_navigation(user_input: str) -> Optional[Dict[str, str]]:
    """Detect if the user asked to navigate anywhere in the site.

    Returns a dict with `route` and `label` when navigation is detected, otherwise None.
    """
    text = user_input.lower()
    # simple verbs that indicate navigation intent
    nav_verbs = ["navigate to", "go to", "open", "show me", "take me to", "where is", "bring me to"]
    if any(verb in text for verb in nav_verbs):
        # try to find one of the known pages in the text
        for name, route in navigation_map.items():
            if name in text:
                return {"label": name, "route": route}

        # fallback: if user said "services" or similar single word
        words = text.split()
        for word in words:
            if word in navigation_map:
                return {"label": word, "route": navigation_map[word]}

    return None


def humanize_reply(base: str, follow_up: Optional[str] = None) -> str:
    """Add small variations and a friendly tone to replies."""
    templates = [
        "{base}",
        "{base} 😊",
        "{base} — let me know if you want anything else.",
        "{base} 👍",
        "{base} — happy to help!",
    ]
    reply = random.choice(templates).format(base=base)
    if follow_up:
        choices = ["Do you want me to do that now?", "Should I take you there?", "Would you like me to open it for you?"]
        reply = f"{reply} {random.choice(choices)}"
    return reply


def interpret_intent(user_input: str) -> Dict[str, Any]:
    """Interpret the user input and return a structured response.

    Returns a dict with keys: `intent`, `reply`, and optional `action`.
    """
    # greetings first
    if detect_greeting(user_input):
        return {"intent": "greeting", "reply": random.choice(responses["greeting"])}

    # navigation detection (rule-based)
    nav = detect_navigation(user_input)
    if nav:
        # action to instruct frontend to navigate
        base = f"Sure — I can take you to the {nav['label']} page."
        return {"intent": "navigate", "reply": humanize_reply(base, follow_up=None), "action": {"type": "navigate", "route": nav["route"]}}

    # ML classification with confidence check
    X_test = vectorizer.transform([user_input])
    probs = None
    try:
        probs = model.predict_proba(X_test)[0]
    except Exception:
        probs = None

    predicted = model.predict(X_test)[0]
    confidence = 0.0
    if probs is not None:
        # get class index
        classes = list(model.classes_)
        if predicted in classes:
            idx = classes.index(predicted)
            confidence = float(probs[idx])

    # threshold for trusting the ML label
    threshold = 0.60
    if confidence >= threshold and predicted in responses:
        base = random.choice(responses[predicted])
        return {"intent": predicted, "reply": humanize_reply(base)}

    # fallback
    return {"intent": "fallback", "reply": random.choice(responses["fallback"])}

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    user_message = data.get("message", "")
    session_id = data.get("session_id")

    # create session if not provided
    if not session_id:
        session_id = str(uuid.uuid4())
        sessions[session_id] = {"history": []}
    elif session_id not in sessions:
        sessions[session_id] = {"history": []}

    # save user message to session history
    sessions[session_id]["history"].append({"from": "user", "text": user_message})

    interpreted = interpret_intent(user_message)
    reply = interpreted.get("reply", "Sorry, I didn't get that.")

    # save bot reply
    sessions[session_id]["history"].append({"from": "bot", "text": reply, "intent": interpreted.get("intent")})

    response_payload = {
        "reply": reply,
        "intent": interpreted.get("intent"),
        "session_id": session_id,
    }

    # include action if any (frontend can use this to navigate or perform tasks)
    if "action" in interpreted:
        response_payload["action"] = interpreted["action"]

    return jsonify(response_payload)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
