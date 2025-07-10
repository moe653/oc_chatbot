from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import faiss
import json
import numpy as np
import requests
import os

app = Flask(__name__)

# --- モデルとインデックス読み込み（初回のみ） ---
model = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.read_index("api/index.faiss")

# 文書情報読み込み
with open("api/documents.json", encoding="utf-8") as f:
    documents = json.load(f)

# --- Gemini API設定 ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Vercelに環境変数で設定しておく
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"

# --- 類似検索 + Gemini問い合わせ ---
@app.route('/', methods=['POST'])
def answer():
    data = request.json
    question = data.get("question", "")

    if not question:
        return jsonify({"reply": "質問が空です。"})

    # 質問をベクトル化して検索
    query_vec = model.encode([question])
    _, indices = index.search(np.array(query_vec), 3)  # 上位3件
    contexts = [documents[i] for i in indices[0]]

    # プロンプト作成
    context_text = "\n\n".join(
        f"[{i+1}] {doc['file']} (chunk {doc['chunk_id']}):\n{doc['text']}"
        for i, doc in enumerate(contexts)
    )

    prompt = f"""
以下の文献を参考に、次の質問に答えてください。

【質問】
{question}

【参考文献】
{context_text}
    """

    # Gemini APIに問い合わせ
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GEMINI_API_KEY}"
    }
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{ "text": prompt }]
            }
        ]
    }
    try:
        res = requests.post(GEMINI_URL, headers=headers, json=payload)
        res.raise_for_status()
        reply = res.json()['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        reply = f"Gemini APIエラー: {str(e)}"

    return jsonify({"reply": reply})
