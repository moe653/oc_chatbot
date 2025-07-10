from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['POST'])
def answer():
    data = request.json
    question = data.get('question', '')
    return jsonify({ "reply": f"仮の回答です。質問は：{question}" })
