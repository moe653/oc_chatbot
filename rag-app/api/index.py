import os
import requests
import json
import faiss
import numpy as np
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)

# GitHub Release からのURL（適宜変更）
DOC_URL = "https://github.com/moe653/oc_chatbot/releases/download/v1.0.0/documents.json"
FAISS_URL = "https://github.com/moe653/oc_chatbot/releases/download/v1.0.0/index.faiss"

# ローカルに保存するパス
DOC_PATH = "/tmp/documents.json"
FAISS_PATH = "/tmp/index.faiss"

def download_if_not_exists(url, path):
    if not os.path.exists(path):
        res = requests.get(url)
        res.raise_for_status()
        with open(path, "wb") as f:
            f.write(res.content)

# ファイルをダウンロード
download_if_not_exists(DOC_URL, DOC_PATH)
download_if_not_exists(FAISS_URL, FAISS_PATH)

# モデルとデータをロード
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
with open(DOC_PATH, "r", encoding="utf-8") as f:
    documents = json.load(f)
index = faiss.read_index(FAISS_PATH)

# Gemini 設定
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

@app.route("/", methods=["POST"])
def rag_answer():
    data = request.json
    question = data.get("question", "").strip()

    if not question or len(question) < 2:
        return jsonify({ "reply": "申し訳ありませんが、その情報が見つかりませんでした。" })

    vec = model.encode([question])
    _, idxs = index.search(np.array(vec), 3)
    top_docs = [documents[i] for i in idxs[0]]

    context = "\n\n".join(
        f"[{i+1}] {doc['file']} (chunk {doc['chunk_id']}):\n{doc['text']}"
        for i, doc in enumerate(top_docs)
    )

    prompt = f"""
あなたはチャットボットです。以下の「参照情報」に基づいて日本語で簡潔に答えてください。
意味不明な質問や情報が存在しない場合は「申し訳ありませんが、その情報が見つかりませんでした。」とだけ返してください。

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
        reply = f"Gemini APIへの接続に失敗しました。エラー: {str(e)}"

    return jsonify({ "reply": reply })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
