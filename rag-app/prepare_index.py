import os
import json
import uuid
import faiss
import fitz
import numpy as np
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer

# --- 設定 ---
PDF_DIR = "data"
OUTPUT_FAISS = "api/index.faiss"
OUTPUT_JSON = "api/documents.json"
CHUNK_SIZE = 300  # 文字数ベースで分割

# --- モデル読み込み（日本語対応） ---
model = SentenceTransformer("all-MiniLM-L6-v2")

# --- チャンク作成 ---
documents = []
vectors = []

def chunk_text(text, size=300):
    return [text[i:i+size] for i in range(0, len(text), size)]

# --- PDF処理 ---
for filename in os.listdir(PDF_DIR):
    if not filename.endswith(".pdf"):
        continue

    filepath = os.path.join(PDF_DIR, filename)
    try:
        doc = fitz.open(filepath)
        full_text = ""
        for page in doc:
            full_text += page.get_text()
    except Exception as e:
        print(f"読み込み失敗: {filename}: {e}")
        continue

    chunks = chunk_text(full_text, CHUNK_SIZE)

    for i, chunk in enumerate(chunks):
        if not chunk.strip():
            continue
        embedding = model.encode(chunk)
        vectors.append(embedding)

        documents.append({
            "id": str(uuid.uuid4()),
            "file": filename,
            "chunk_id": i,
            "text": chunk
        })

# --- FAISSインデックスを作成 ---
dim = len(vectors[0])
index = faiss.IndexFlatL2(dim)
index.add(np.array(vectors).astype("float32"))

# --- 保存 ---
os.makedirs(os.path.dirname(OUTPUT_FAISS), exist_ok=True)
faiss.write_index(index, OUTPUT_FAISS)

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(documents, f, ensure_ascii=False, indent=2)

print(f"✅ 作成完了: {len(documents)}チャンク → {OUTPUT_FAISS}, {OUTPUT_JSON}")
