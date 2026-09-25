# GŪḌHA (गूढ)
### Arthaśāstra-Inspired Symmetric Cipher System

[![Pytest Tests](https://img.shields.io/badge/pytest-51%20passed-brightgreen.svg)]()
[![Backend](https://img.shields.io/badge/FastAPI-1.0.0-009688.svg)]()
[![Frontend](https://img.shields.io/badge/React%2019-TypeScript-blue.svg)]()
[![License](https://img.shields.io/badge/License-MIT%20Educational-gold.svg)]()

> **"गूढलेख्यं वा प्रेषयेत् ।"** — *Kauṭilīya Arthaśāstra (1.16.29)*  
> *"Or he shall dispatch confidential correspondence written in secret cipher."*

---

## 🏛️ Academic & Cryptographic Integrity Boundary

**GŪḌHA** is an educational, research-oriented symmetric cryptographic system and experimental laboratory inspired by the *Arthaśāstra’s* documented statecraft tradition of secret communication (*gūḍhalekhya*) and compartmentalized intelligence (*gūḍhapuruṣa*).

- **Historical Grounding**: The *Arthaśāstra* provides the conceptual doctrine of secret dispatches and compartmentalized intelligence.
- **Modern Cryptographic Concepts**: Shannon’s confusion & diffusion, Substitution-Permutation Networks (SPN), modular matrix diffusion over $\mathbb{Z}_{256}$, and key expansion.
- **Our Implementation**: GŪḌHA-64 is an original 64-bit educational SPN block cipher created for transparent academic analysis.
- **Disclaimer**: *GŪḌHA does not claim that the Arthaśāstra contains modern mathematical algorithms. It does not replace standardized algorithms (AES-GCM, ChaCha20).*

---

## 🚀 Key Features

1. **GŪḌHA-64 Cipher Engine**:
   - 64-bit block size (8 bytes) & 128-bit key size.
   - Configurable rounds (default 6 rounds).
   - Invertible 8-bit S-Box (*Parivartana*) with zero fixed points.
   - $8 \times 8$ bit-matrix transposition & 11-bit cyclic rotation (*Krama*).
   - Invertible circulant modular matrix diffusion over $\mathbb{Z}_{256}$ (*Miśraṇa*).
   - Non-linear 128-bit key schedule derived via the Golden Ratio ($\phi$) (*Vistāra*).
   - Block modes: ECB (default, demo-compatible) & opt-in CBC chaining (`C_i = E(P_i ⊕ C_{i-1})` with random 8-byte IV).
   - Optional HMAC-SHA256 authentication tag over the ciphertext (constant-time verify, uniform HTTP 400 on all decrypt failures).
2. **Step-by-Step Derivation Studio**:
   - Visual telemetry recording every intermediate state: Input $\to$ Whitening $\to$ S-Box $\to$ Permutation $\to$ Diffusion $\to$ Key Addition.
   - Interactive 8-byte state grid highlighting dynamic bit changes.
3. **Empirical Cryptanalysis Suite**:
   - Strict Avalanche Criterion (SAC) verification (bit flip progression to ~51.5%).
   - Key & Plaintext sensitivity differential analysis.
   - Shannon Entropy gauge ($H \to 7.91$ bits/byte) and monobit balance.
   - Controlled educational attack demonstrations (frequency analysis & 12-bit brute-force).
4. **Interactive Research Laboratory UI**:
   - React 19 + TypeScript + Vite with a dark obsidian & ancient bronze research aesthetic.
   - Clickable SPN pipeline explorer.
   - 18-part comprehensive viva examination documentation.

---

## 📂 Project Structure

```
IKS-cs/
├── backend/
│   ├── app/
│   │   ├── api/             # REST endpoints (/cipher, /analysis, /history)
│   │   ├── cipher/          # GŪḌHA-64 SPN cipher implementation
│   │   │   ├── engine.py    # Gudha64Cipher core & derivation tracer
│   │   │   ├── sbox.py      # Parivartana (Invertible 8-bit S-Box)
│   │   │   ├── permutation.py # Krama (8x8 bit transpose & 11-bit rotation)
│   │   │   ├── diffusion.py # Miśraṇa (Z_256 modular circulant matrix)
│   │   │   ├── key_schedule.py # Vistāra (128-bit key schedule)
│   │   │   └── padding.py   # PKCS#7 block padding
│   │   ├── analysis/        # Avalanche, sensitivity, entropy, benchmarks
│   │   ├── models/          # Pydantic schemas
│   │   └── main.py          # FastAPI application
│   ├── tests/               # 51 automated test cases (Pytest)
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navigation, Header, visual components
│   │   ├── pages/           # Landing, Lab, Pipeline, Analysis, History, Docs
│   │   ├── api/             # Typed API client
│   │   ├── types/           # TypeScript data interfaces
│   │   └── index.css        # Custom CSS design system
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│   ├── algorithm_specification.md
│   ├── historical_context_arthashastra.md
│   └── viva_defense_guide.md
└── README.md
```

---

## ⚡ Quick Start

### 1. Run Backend (FastAPI)
```bash
# From workspace root
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at `http://127.0.0.1:8000/docs`.

### 2. Run Frontend (React + Vite)
```bash
# In frontend directory
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run Automated Tests
```bash
# Run all 51 backend tests
python -m pytest backend/tests -v
```

CI (`.github/workflows/ci.yml`) runs the backend suite plus the frontend
typecheck/build (`npm run build`) on every push and pull request.

---

## 🔬 Deterministic Golden Test Vector

```python
Key: "KAUTILYA_CHANAKYA_321BCE"
Master Key Hex: afe7d9d4433923887d43d2713a672934
Plaintext: "ARTHASHASTRA"
Ciphertext Hex: ED85A02064EA1DB978A186337B1584AB
Rounds: 6
Block Count: 2 (12 bytes padded to 16 bytes via PKCS#7)
Invariant: Decrypt(Ciphertext, Key) == Plaintext
```

> The golden vector uses the default ECB mode. ECB encrypts blocks
> independently (identical plaintext blocks yield identical ciphertext
> blocks) and is kept for demo compatibility — use `mode: "cbc"` for
> chained encryption and `authenticate: true` for an HMAC-SHA256 tag.

---

## 🔐 Security Modes (CBC & HMAC)

```bash
# CBC encrypt (server generates a random IV, returned as iv_hex)
curl -s -X POST http://127.0.0.1:8000/api/cipher/encrypt \
  -H 'Content-Type: application/json' \
  -d '{"plaintext":"SECRET DISPATCH","key":"KAUTILYA","rounds":6,
       "record_trace":false,"mode":"cbc","authenticate":true}'

# CBC decrypt (iv_hex required; auth_tag_hex verified when provided)
curl -s -X POST http://127.0.0.1:8000/api/cipher/decrypt \
  -H 'Content-Type: application/json' \
  -d '{"ciphertext_hex":"<HEX>","key":"KAUTILYA","rounds":6,
       "mode":"cbc","iv_hex":"<IV>","auth_tag_hex":"<TAG>"}'
```

- All decryption failures (bad hex, length, padding, auth mismatch,
  non-UTF8 output) return a uniform HTTP 400 so status codes do not leak
  padding state.
- CORS is restricted to local dev origins (`localhost:5173`, `3000`);
  the Vite dev server proxies `/api` same-origin.

---

## 📚 Academic References

1. **Kangle, R. P.** (1965). *The Kauṭilīya Arthaśāstra: Part II — An English Translation with Critical and Explanatory Notes*. University of Bombay.
2. **Olivelle, Patrick** (2013). *King, Governance, and Law in Ancient India: Kauṭilya's Arthaśāstra*. Oxford University Press.
3. **Shannon, Claude E.** (1949). *Communication Theory of Secrecy Systems*. Bell System Technical Journal, 28(4), 656–715.
4. **Daemen, J., & Rijmen, V.** (2002). *The Design of Rijndael: AES - The Advanced Encryption Standard*. Springer.
5. **Webster, A. F., & Tavares, S. E.** (1985). *On the design of S-boxes*. Advances in Cryptology — CRYPTO '85, pp. 523–534.
