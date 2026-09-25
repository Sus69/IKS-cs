"""
GŪḌHA: Arthaśāstra-Inspired Symmetric Cipher System
FastAPI Main Application Entrypoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import cipher_router, analysis_router, history_router

app = FastAPI(
    title="GŪḌHA (गूढ) — Cryptographic Laboratory API",
    description=(
        "An educational symmetric block cipher, derivation tracer, and experimental cryptanalysis suite "
        "inspired by the Arthaśāstra's documented tradition of covert communication (gūḍhalekhya).\n\n"
        "**Academic Boundary**: This system translates ancient intelligence principles into a modern "
        "computational experiment. It does not attribute modern algorithms to antiquity, nor does it replace "
        "standard production cryptography (AES-GCM/ChaCha20)."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS for local development. Explicit origin list (no wildcard) with
# credentials disabled: the Vite dev proxy serves /api same-origin, and direct
# browser access only needs simple CORS. Never combine allow_origins=["*"]
# with allow_credentials=True (browsers reject it; credentialed wildcard CORS
# would let any site read lab responses).
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(cipher_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(history_router, prefix="/api")

@app.get("/")
def root():
    return {
        "system": "GŪḌHA",
        "tagline": "Secret Communication, Reimagined.",
        "description": "Arthaśāstra-Inspired Symmetric Cipher System",
        "status": "online",
        "api_docs": "/docs",
        "laboratory_mode": "educational_experimental"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "GŪḌHA-64 SPN",
        "block_size": "64-bit",
        "master_key": "128-bit",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
