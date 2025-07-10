from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json
import os
import requests

app = Flask(__name__)

# --- モデルとインデックスロード ---
model = SentenceTransformer("gemini-1.5-flash")
index = faiss.read_index("api/index.faiss")

# チャンクのメタ情報（ID, ファイル名, テキストなど）
with open("api/documents.json", "r", encoding="utf-8") as f:
    documents = json.load(f)

# --- Gemini APIキー（Vercel環境変数） ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

@app.route('/', methods=['POST'])
def rag_answer():
    data = request.json
    question = data.get("question", "").strip()

    if not question or len(question) < 2:
        return jsonify({ "reply": "申し訳ありませんが、その情報が見つかりませんでした。" })

    # 1. クエリのベクトル化と類似検索
    vec = model.encode([question])
    _, idxs = index.search(np.array(vec), 3)  # 上位3件を検索
    top_docs = [documents[i] for i in idxs[0]]

    # 2. 文脈を構築
    context = "\n\n".join(
        f"[{i+1}] {doc['file']} (chunk {doc['chunk_id']}):\n{doc['text']}"
        for i, doc in enumerate(top_docs)
    )

    # 3. Geminiに投げるプロンプト
    prompt = f"""
あなたはチャットボットです。以下の「参照情報」に基づいて日本語で簡潔に答えてください。
質問が意味不明な文字列、または情報が見つからない場合は「申し訳ありませんが、その情報が見つかりませんでした。」とだけ答えてください。

【質問】
{question}

【参照情報】
{context}
    """

    try:
        res = requests.post(
            GEMINI_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {GEMINI_API_KEY}"
            },
            json={
                "contents": [
                    { "role": "user", "parts": [{ "text": prompt }] }
                ]
            }
        )
        res.raise_for_status()
        reply = res.json()['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        reply = "Gemini APIへの接続に失敗しました。"

    return jsonify({ "reply": reply })
