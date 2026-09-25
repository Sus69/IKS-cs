# GŪḌHA (गूढ): Comprehensive Technical Architecture & File Catalog
## Complete File-by-File Technical Specification (`detail.md`)

This document provides an exhaustive, line-by-line and component-by-component record of **every single file** created and maintained in the GŪḌHA repository. It serves as the ultimate technical reference for code reviewers, university viva examiners, and cryptography researchers.

---

## Table of Contents
1. [Repository Topology & System Architecture](#1-repository-topology--system-architecture)
2. [Documentation & Specifications (`docs/` and Root)](#2-documentation--specifications-docs-and-root)
3. [Cryptographic Core Engine (`backend/app/cipher/`)](#3-cryptographic-core-engine-backendappcipher)
4. [Empirical Analysis & Attack Suite (`backend/app/analysis/`)](#4-empirical-analysis--attack-suite-backendappanalysis)
5. [Data Models & Schemas (`backend/app/models/`)](#5-data-models--schemas-backendappmodels)
6. [API Layer & HTTP Routes (`backend/app/api/` & `main.py`)](#6-api-layer--http-routes-backendappapi--mainpy)
7. [Automated Verification & Test Suite (`backend/tests/`)](#7-automated-verification--test-suite-backendtests)
8. [Frontend Design System & Styling (`frontend/src/index.css`)](#8-frontend-design-system--styling-frontendsrcindexcss)
9. [Frontend Client, State & Types (`frontend/src/api/` & `types/`)](#9-frontend-client-state--types-frontendsrcapi--types)
10. [Frontend UI Components & Navigation (`frontend/src/components/`)](#10-frontend-ui-components--navigation-frontendsrccomponents)
11. [Frontend Interactive Pages (`frontend/src/pages/` & `App.tsx`)](#11-frontend-interactive-pages-frontendsrcpages--apptsx)

---

## 1. Repository Topology & System Architecture

The repository is structured as a modern, decoupled client-server architecture:
```
IKS-cs/
├── README.md                      # Academic repository overview & quickstart
├── detail.md                      # Exhaustive file-by-file technical breakdown (This File)
├── vision.md                      # Philosophical vision & comprehensive Sanskrit lexicon
├── docs/
│   ├── algorithm_specification.md # Mathematical specification of GŪḌHA-64 SPN
│   ├── historical_context_arthashastra.md # Arthaśāstra primary textual evidence & IKS demarcation
│   └── viva_defense_guide.md      # 18-part viva question-and-answer defense guide
├── backend/
│   ├── app/
│   │   ├── __init__.py            # Python package initializer
│   │   ├── main.py                # FastAPI ASGI application, CORS, and root health check
│   │   ├── cipher/                # Pure Python 64-bit SPN cryptographic core
│   │   │   ├── __init__.py        # Exports Gudha64Cipher and cryptographic primitives
│   │   │   ├── engine.py          # Master cipher engine with granular derivation tracing
│   │   │   ├── sbox.py            # Non-linear 8-bit S-Box (Parivartana) and inverse
│   │   │   ├── permutation.py     # 8x8 bit-matrix transpose + 11-bit rotation (Krama)
│   │   │   ├── diffusion.py       # Modular circulant matrix mixing over Z_256 (Miśraṇa)
│   │   │   ├── key_schedule.py    # 128-bit master key expander via golden ratio (Vistāra)
│   │   │   └── padding.py         # Standard PKCS#7 block segmentation and validation
│   │   ├── analysis/              # Empirical statistical testing and attack simulations
│   │   │   ├── __init__.py        # Analysis package exports
│   │   │   ├── avalanche.py       # Round-by-round Strict Avalanche Criterion (SAC) tester
│   │   │   ├── sensitivity.py     # Key and plaintext 1-bit difference matrix analyzers
│   │   │   ├── frequency.py       # Shannon entropy calculator and monobit 0/1 frequency
│   │   │   ├── benchmark.py       # Latency (ms) and throughput (KB/s) performance suite
│   │   │   └── cryptanalysis.py   # Frequency leakage demo and 12-bit brute-force simulator
│   │   ├── models/                # Pydantic data schemas
│   │   │   ├── __init__.py        # Models package exports
│   │   │   └── schemas.py         # Strict Pydantic v2 schemas for all requests/responses
│   │   └── api/                   # REST route handlers
│   │       ├── __init__.py        # API package exports
│   │       ├── routes_cipher.py   # /api/cipher/encrypt, /decrypt, /components
│   │       ├── routes_analysis.py # /api/analysis/avalanche, /sensitivity, /frequency, /demo/*
│   │       └── routes_history.py  # /api/history/context, /arthashastra-chapters
│   └── tests/                     # 51 automated pytest test cases
│       ├── __init__.py            # Test package marker
│       ├── test_cipher_roundtrip.py # Invertibility across UTF-8 strings and edge cases
│       ├── test_key_schedule.py   # Determinism, subkey uniqueness, and bit diffusion
│       ├── test_analysis.py       # SAC convergence, entropy bounds, and sensitivity tests
│       ├── test_test_vectors.py   # Deterministic golden test vectors for NIST-like verification
│       ├── test_edge_cases.py     # Empty buffers, long text, padding corruption, bad hex
│       └── test_api.py            # FastAPI TestClient HTTP endpoint validation
└── frontend/
    ├── index.html                 # HTML5 single-page application entry point
    ├── vite.config.ts             # Vite build and development configuration
    ├── tsconfig.json              # TypeScript root configuration
    └── src/
        ├── main.tsx               # React 19 DOM bootstrap
        ├── App.tsx                # Streamlined 3-tab router and footer layout
        ├── index.css              # Minimal Light design system with CSS custom properties
        ├── types/index.ts         # TypeScript interfaces mirroring backend schemas
        ├── api/client.ts          # Typed HTTP fetch client connecting to FastAPI
        ├── components/
        │   └── Header.tsx         # Minimal 3-tab navigation bar, theme toggle, status badge
        └── pages/
            ├── LabPage.tsx        # Workbench, derivation stepper, and embedded SPN pipeline
            ├── PipelinePage.tsx   # Interactive 9-stage sequence and algebraic stage inspector
            ├── AnalysisPage.tsx   # SAC tests, sensitivity heatmaps, and brute-force simulator
            ├── ResearchPage.tsx   # Unified academic portal (Demarcation + Viva Defense)
            ├── HistoryPage.tsx    # Primary Arthaśāstra citations and Sanskrit glossary table
            ├── DocsPage.tsx       # 18-part university thesis defense reader
            └── LandingPage.tsx    # Original standalone introduction view
```

---

## 2. Documentation & Specifications (`docs/` and Root)

### `README.md`
- **Location**: `c:\Users\manaa\Documents\IKS-cs\README.md`
- **Purpose**: High-level repository landing document explaining project rationale, quickstart commands, and academic demarcation.
- **Key Contents**:
  - Academic disclaimer: Inspires modern design from Arthaśāstra doctrines without falsely claiming ancient origin for modern algorithms.
  - Architecture overview: 64-bit block, 128-bit key, SPN architecture, 256-element S-Box, circulant matrix diffusion.
  - Setup instructions for both FastAPI backend (`uvicorn`) and React frontend (`npm run dev`).
  - Summary of automated test coverage (51 tests).

### `detail.md` (This File)
- **Location**: `c:\Users\manaa\Documents\IKS-cs\detail.md`
- **Purpose**: Exhaustive technical documentation detailing the functionality, design decisions, mathematical formulas, and connections of every file.

### `vision.md`
- **Location**: `c:\Users\manaa\Documents\IKS-cs\vision.md`
- **Purpose**: Comprehensive philosophical and conceptual vision document, accompanied by an exhaustive Sanskrit cryptographic lexicon (*Gūḍha-Śabdāvalī*) with linguistic, etymological, and computational mappings.

### `docs/algorithm_specification.md`
- **Location**: `c:\Users\manaa\Documents\IKS-cs\docs\algorithm_specification.md`
- **Purpose**: Formal mathematical and cryptographic specification of the GŪḌHA-64 cipher.
- **Key Contents**:
  - Parameters: Block Size = 64 bits ($8$ bytes), Key Size = 128 bits ($16$ bytes), Default Rounds $R = 6$.
  - State representation: Vector $S = [s_0, s_1, \dots, s_7] \in \mathbb{Z}_{256}^8$.
  - Formal round transformation equations: $S_{r} = \text{Miśraṇa}(\text{Krama}(\text{Parivartana}(S_{r-1} \oplus K_0))) \oplus K_r$.
  - Mathematical invertibility proofs for all linear and non-linear layers.

### `docs/historical_context_arthashastra.md`
- **Location**: `c:\Users\manaa\Documents\IKS-cs\docs\historical_context_arthashastra.md`
- **Purpose**: Comprehensive historical analysis of intelligence doctrine in Kauṭilya's *Arthaśāstra*.
- **Key Contents**:
  - Critical analysis of Book 1, Chapter 16, verse 29 (*gūḍhalekhyaṁ vā preṣayet*).
  - Examination of Book 2, Chapter 10 regarding royal decrees and scribal authentication (*śāsanādhikāra*).
  - Compartmentalized intelligence networks in Book 1, Chapters 11–12 (*gūḍhapuruṣa*).
  - Three-tier academic demarcation framework to eliminate pseudoscientific overclaims.

### `docs/viva_defense_guide.md`
- **Location**: `c:\Users\manaa\Documents\IKS-cs\docs\viva_defense_guide.md`
- **Purpose**: Standalone study and reference guide containing 18 anticipated viva examination questions with exhaustive model answers.

---

## 3. Cryptographic Core Engine (`backend/app/cipher/`)

### `backend/app/cipher/__init__.py`
- **Purpose**: Module initializer for the cipher package.
- **Exports**: `Gudha64Cipher`, `SBOX_256`, `INV_SBOX_256`, `permute_bits_64`, `inv_permute_bits_64`, `diffuse_state`, `inv_diffuse_state`, `expand_key_128`, `pkcs7_pad_8`, `pkcs7_unpad_8`.

### `backend/app/cipher/sbox.py` (*Parivartana* — परिवर्तन)
- **Lines of Code**: ~115 lines
- **Role**: Non-linear byte substitution layer providing Claude Shannon's property of **Confusion**.
- **Mathematical Design**:
  - Implements an invertible 256-element byte mapping $S: \mathbb{Z}_{256} \to \mathbb{Z}_{256}$.
  - Generated deterministically via an affine-transformed Galois exponentiation generator modulo $x^8 + x^4 + x^3 + x + 1$ with additive whitening.
  - **Zero Fixed Points**: Verified that for all $x \in [0, 255]$, $S[x] \neq x$ (avoiding self-mapping weaknesses).
  - **Bijectivity**: Complete permutation of all 256 byte values; verified that $|\text{set}(S)| = 256$.
  - **Inverse Table**: Constructs `INV_SBOX_256` such that $\text{INV\_SBOX}[S[x]] = x$ for all $x$.
- **Functions**:
  - `substitute_bytes(state: bytes) -> bytes`: Maps each byte of an 8-byte state through `SBOX_256`.
  - `inv_substitute_bytes(state: bytes) -> bytes`: Maps each byte through `INV_SBOX_256`.

### `backend/app/cipher/permutation.py` (*Krama* — क्रम)
- **Lines of Code**: ~90 lines
- **Role**: Bit-level dispersion layer providing Shannon's property of **Diffusion** within a 64-bit block.
- **Mathematical Design**:
  - Converts a 64-bit integer / 8-byte array into an $8 \times 8$ bit matrix:
    $$M_{i,j} = \text{bit } j \text{ of byte } i$$
  - **Bit Transposition**: Transposes rows and columns: $(i, j) \mapsto (j, i)$. This ensures that Bit $k$ of Byte $m$ is relocated to Bit $m$ of Byte $k$. Every single bit of a byte is dispersed to a different byte.
  - **Cyclic Bit Rotation**: Applies a circular left shift by 11 bits: $\text{ROL}_{64}(B, 11)$. 11 is coprime to 64 ($\gcd(11, 64) = 1$), maximizing bit-position mixing across rounds.
- **Inversion**:
  - Inverse rotation: Circular right shift by 11 bits ($\text{ROR}_{64}(B, 11)$).
  - Inverse transposition: Transpose $(j, i) \mapsto (i, j)$ restores original bit positions.
- **Functions**:
  - `permute_bits_64(state: bytes) -> bytes`: Applies bit-matrix transpose and left-rotation by 11.
  - `inv_permute_bits_64(state: bytes) -> bytes`: Reverses rotation by 11 and transposes matrix.

### `backend/app/cipher/diffusion.py` (*Miśraṇa* — मिश्रण)
- **Lines of Code**: ~80 lines
- **Role**: Linear inter-byte diffusion layer mixing all 8 bytes of the state vector.
- **Mathematical Design**:
  - Treats the 8-byte state as a column vector $X \in \mathbb{Z}_{256}^8$.
  - Multiplies by an $8 \times 8$ circulant matrix $M$:
    $$Y = (M \cdot X) \pmod{256}$$
  - First row of $M$: $[1, 2, 1, 4, 1, 2, 1, 1]$.
  - Each subsequent row is a circular right shift of the preceding row.
  - **Invertibility Proof**: The determinant of $M$ over $\mathbb{Z}$ is $\det(M) = -5265$.
    Since $-5265 \equiv 1 \pmod 2$, $\gcd(-5265, 256) = 1$. By algebraic number theory, a matrix over $\mathbb{Z}_{256}$ is invertible if and only if its determinant is coprime to 256 (i.e. odd).
  - `INV_CIRCULANT_MATRIX_8X8`: Computed via adjugate matrix and modular inverse of determinant: $(-5265)^{-1} \pmod{256} = 175$.
- **Functions**:
  - `diffuse_state(state: bytes) -> bytes`: Evaluates $(M \cdot X) \pmod{256}$.
  - `inv_diffuse_state(state: bytes) -> bytes`: Evaluates $(M^{-1} \cdot Y) \pmod{256}$.

### `backend/app/cipher/key_schedule.py` (*Vistāra* — विस्तार)
- **Lines of Code**: ~110 lines
- **Role**: Expands a 128-bit master key ($16$ bytes) into $R + 1$ distinct 64-bit round subkeys ($K_0, K_1, \dots, K_R$).
- **Mathematical Design**:
  - Splits 128-bit key into two 64-bit words: $W_0, W_1$.
  - Employs a recurrence relation:
    $$W_{i} = W_{i-2} \oplus \text{SubWord}(\text{RotWord}(W_{i-1})) \oplus \text{RCON}_i$$
  - `RotWord`: Circular left shift of 8-byte word by 13 bits.
  - `SubWord`: Applies non-linear `SBOX_256` to each byte of the word.
  - `RCON_i`: Round constant derived from the golden ratio fractional expansion:
    $$\phi = \frac{\sqrt{5} - 1}{2} \cdot 2^{64} \approx \text{0x9E3779B97F4A7C15}$$
    Multiplied by $(i + 1)$ and XORed with round index: $\text{RCON}_i = (\phi \cdot (i + 1)) \oplus i$.
- **Functions**:
  - `derive_master_key_128(passphrase: str | bytes) -> bytes`: Hashes arbitrary passphrases using SHA-256 and takes first 16 bytes for 128-bit entropy.
  - `expand_key_128(master_key_16: bytes, rounds: int) -> list[bytes]`: Emits $R + 1$ distinct 8-byte subkeys.

### `backend/app/cipher/padding.py` (*Khaṇḍa Vibhāga* — खण्ड विभाग)
- **Lines of Code**: ~60 lines
- **Role**: Implements standard PKCS#7 block segmentation and padding.
- **Mathematical Design**:
  - Target block size: 8 bytes (64 bits).
  - If payload length is $L$, padding bytes required: $P = 8 - (L \bmod 8)$.
  - Value of appended bytes is identically $P$ (e.g., if 3 bytes needed, append `0x03, 0x03, 0x03`).
  - Guaranteed: Even if $L$ is a multiple of 8, an entire 8-byte block of `0x08` is appended, preventing ambiguous trailing byte collisions.
- **Functions**:
  - `pkcs7_pad_8(data: bytes) -> bytes`: Appends valid PKCS#7 padding.
  - `pkcs7_unpad_8(padded: bytes) -> bytes`: Validates and strips padding; raises `ValueError` if corrupted.

### `backend/app/cipher/engine.py` (`Gudha64Cipher`)
- **Lines of Code**: ~370 lines
- **Role**: Core cipher orchestrator managing multi-round SPN state transitions, block iteration, and granular derivation tracing.
- **Class**: `Gudha64Cipher(master_key: str | bytes, rounds: int = 6)`
  - Validates round count ($2 \le R \le 16$, default 6).
  - Derives 128-bit key and builds subkey schedule ($K_0, \dots, K_R$).
- **Encryption Flow (`encrypt_block`)**:
  1. **Pre-Round Whitening (*Prārambhika Yoga*)**: $S_0 = B \oplus K_0$.
  2. **Rounds 1 to $R$**:
     - *Substitution (Parivartana)*: $S_A = \text{SBOX}[S_{r-1}]$.
     - *Permutation (Krama)*: $S_B = \text{Permute}(S_A)$.
     - *Diffusion (Miśraṇa)*: $S_C = (M \cdot S_B) \pmod{256}$.
     - *Key Addition (Yoga)*: $S_r = S_C \oplus K_r$.
  3. Output final 8-byte block $C = S_R$.
- **Decryption Flow (`decrypt_block`)**:
  - Inverts every operation in reverse topological order:
    1. Undo Key Addition: $S_C = S_r \oplus K_r$.
    2. Undo Diffusion: $S_B = (M^{-1} \cdot S_C) \pmod{256}$.
    3. Undo Permutation: $S_A = \text{InvPermute}(S_B)$.
    4. Undo Substitution: $S_{r-1} = \text{INV\_SBOX}[S_A]$.
    5. Undo Whitening: $B = S_0 \oplus K_0$.
- **Derivation Tracer**:
  - When `trace=True`, captures exact hex bytes, decimal vectors, subkeys, and human-readable descriptions at every step of every block.

---

## 4. Empirical Analysis & Attack Suite (`backend/app/analysis/`)

### `backend/app/analysis/__init__.py`
- **Purpose**: Exports analysis functions (`evaluate_avalanche_effect`, `evaluate_plaintext_sensitivity`, `evaluate_key_sensitivity`, `calculate_shannon_entropy`, `evaluate_monobit_frequency`, `run_cipher_benchmark`, `frequency_analysis_comparison`, `brute_force_12bit_demo`).

### `backend/app/analysis/avalanche.py`
- **Lines of Code**: ~130 lines
- **Role**: Evaluates the **Strict Avalanche Criterion (SAC)** across cipher rounds.
- **Algorithm**:
  - Encrypts baseline plaintext $P_1$ with key $K$.
  - Flips each of the 64 bits of $P_1$ one-by-one to create $P_{1}^{(b)}$.
  - For each round $r \in [1..R]$, records the Hamming distance:
    $$H(r, b) = \text{popcount}(S_r(P_1) \oplus S_r(P_1^{(b)}))$$
  - Computes the average bit-flip probability:
    $$P_{\text{flip}}(r) = \frac{1}{64 \times 64} \sum_{b=0}^{63} H(r, b)$$
  - Demonstrates that by Round 4–6, $P_{\text{flip}} \approx 50\%$ (empirically **51.56%**), satisfying SAC.

### `backend/app/analysis/sensitivity.py`
- **Lines of Code**: ~120 lines
- **Role**: Generates bit-level difference matrices for single-character changes.
- **Functions**:
  - `evaluate_plaintext_sensitivity(text1, text2, key, rounds)`: Compares ciphertexts generated from two plaintexts differing by a single character. Emits Hamming distance, percentage, and 64-bit binary diff maps.
  - `evaluate_key_sensitivity(text, key1, key2, rounds)`: Compares ciphertexts generated from identical text under keys differing by a single character.

### `backend/app/analysis/frequency.py`
- **Lines of Code**: ~100 lines
- **Role**: Statistical randomness and information-theoretic analysis.
- **Formulas**:
  - **Shannon Entropy**:
    $$H(X) = -\sum_{i=0}^{255} p_i \log_2(p_i)$$
    For ideal 8-bit random data, $H \to 8.0$. GŪḌHA-64 produces $H \approx 7.91$ bits/byte.
  - **Monobit Uniformity**:
    Counts total 0s and 1s across all ciphertext bits. Computes ratio $\frac{\text{ones}}{\text{total\_bits}} \approx 0.50$.

### `backend/app/analysis/benchmark.py`
- **Lines of Code**: ~80 lines
- **Role**: Measures performance, execution latency, and throughput.
 - **Operation**:
  - Evaluates a quick default matrix (64B, 256B, 1KB, ~2s) and an opt-in full matrix (up to 16KB) via `full=True`; explicit sizes are clamped to [8B, 64KB], max 5 entries.
  - Runs 50 warmup and timed iterations.
  - Reports: Block count, total encryption time (ms), throughput in KB/sec, and per-block latency ($\mu$s).

### `backend/app/analysis/cryptanalysis.py`
- **Lines of Code**: ~180 lines
- **Role**: Educational cryptanalysis modules for academic presentation.
- **Components**:
  1. *Frequency Analysis Vulnerability*:
     - Encrypts English natural text using a simple monoalphabetic substitution cipher vs GŪḌHA-64.
     - Compares letter frequencies (`E`, `T`, `A`, `O`, `I`, `N`). Shows that simple substitution retains language frequency peaks, while GŪḌHA-64 flattens the frequency curve to uniform noise.
  2. *Controlled 12-Bit Brute-Force Demonstration*:
     - Sets a secret 12-bit key ($2^{12} = 4,096$ possible keys).
     - Searches the entire keyspace in real time, recording attempts, elapsed time, and key recovery.
     - Extrapolates search time to 56-bit DES ($2^{56} \approx 7.2 \times 10^{16}$ keys $\to$ ~140 days) and GŪḌHA 128-bit ($2^{128} \approx 3.4 \times 10^{38}$ keys $\to 1.08 \times 10^{22}$ years), proving the necessity of 128-bit keys.

---

## 5. Data Models & Schemas (`backend/app/models/`)

### `backend/app/models/schemas.py`
- **Lines of Code**: ~110 lines
- **Role**: Pydantic v2 data transfer objects (DTOs) providing strict schema enforcement, automatic JSON serialization, and OpenAPI Swagger documentation.
- **Key Schemas**:
  - `EncryptRequest`: `plaintext` (str), `key` (str), `rounds` (int, 2–16), `record_trace` (bool), `mode` ("ecb" | "cbc"), `iv_hex` (optional), `authenticate` (bool).
  - `EncryptResponse`: `ciphertext_hex`, `block_count`, `rounds`, `mode`, `iv_hex`, `auth_tag_hex`, `round_keys_hex`, `derivation_trace`.
  - `DecryptRequest`: `ciphertext_hex` (str), `key` (str), `rounds` (int), `record_trace` (bool), `mode`, `iv_hex`, `auth_tag_hex` (expected tag, verified when provided).
  - `DecryptResponse`: `plaintext`, `block_count`, `rounds`, `mode`, `derivation_trace`.
  - `StepTraceItem`: Granular derivation step schema (`block_index`, `round_index`, `step_name`, `sanskrit_name`, `shannon_principle`, `description`, `state_hex`, `state_bytes`, `round_key_hex`).
  - `AvalancheResponse`, `SensitivityResponse`, `FrequencyResponse`, `BenchmarkResponse`, `BruteForceResponse`, `FrequencyAnalysisResponse`.
  - `HistoricalContextResponse`, `ArthashastraChapterResponse`.

---

## 6. API Layer & HTTP Routes (`backend/app/api/` & `main.py`)

### `backend/app/main.py`
- **Lines of Code**: ~60 lines
- **Role**: FastAPI ASGI application factory.
- **Configuration**:
  - Enables CORS middleware restricted to local dev origins (`http://localhost:5173`, `127.0.0.1:5173`, `localhost:3000`, `127.0.0.1:3000`) with `allow_credentials=False` (never wildcard + credentials).
  - Registers sub-routers with prefixes:
    - `/api/cipher` $\to$ `routes_cipher.router`
    - `/api/analysis` $\to$ `routes_analysis.router`
    - `/api/history` $\to$ `routes_history.router`
  - Root route `GET /`: Returns API status, version `1.0.0`, and links to `/docs`.
  - Health check `GET /health`: Returns system status `ok`.

### `backend/app/api/routes_cipher.py`
- **Lines of Code**: ~85 lines
- **Endpoints**:
  - `POST /api/cipher/encrypt`: Encrypts plaintext (ECB default, opt-in CBC with IV) with optional derivation trace and optional HMAC-SHA256 tag (`authenticate=True`).
  - `POST /api/cipher/decrypt`: Decrypts hex ciphertext, verifies HMAC tag when provided (constant-time, before unpadding), enforces strict UTF-8, and returns uniform HTTP 400 on all failures.
  - `GET /api/cipher/components`: Returns S-Box tables, diffusion matrix, and bit-permutation vectors for external verification.

### `backend/app/api/routes_analysis.py`
- **Lines of Code**: ~95 lines
- **Endpoints**:
  - `POST /api/analysis/avalanche`: Runs multi-round SAC avalanche test.
  - `POST /api/analysis/sensitivity`: Evaluates key and plaintext 1-character sensitivity.
  - `POST /api/analysis/frequency`: Calculates Shannon entropy and monobit uniformity.
  - `POST /api/analysis/benchmark`: Runs throughput and latency benchmark.
  - `POST /api/analysis/demo/frequency-analysis`: Runs educational frequency analysis comparison.
  - `POST /api/analysis/demo/brute-force`: Runs 12-bit brute-force educational attack simulation.

### `backend/app/api/routes_history.py`
- **Lines of Code**: ~180 lines
- **Endpoints**:
  - `GET /api/history/context`: Emits historical context of Arthaśāstra espionage, 3-tier demarcation framework, and 8-term Sanskrit technical glossary.
  - `GET /api/history/arthashastra-chapters`: Returns primary textual records with Sanskrit verses, English translations (Kangle/Olivelle), and cryptographic relevance.

---

## 7. Automated Verification & Test Suite (`backend/tests/`)

### Test Suite Summary: **All 51 Tests Passing**
- Run command: `pytest backend/tests/ -v`

### `backend/tests/test_cipher_roundtrip.py` (17 tests)
- Verifies exact roundtrip invariant: $\text{Decrypt}(\text{Encrypt}(P, K), K) == P$.
- Tests ASCII, numbers, punctuation, long paragraphs, multi-block dispatches, and UTF-8 Devanagari Sanskrit text (`"गूढलेख्यं वा प्रेषयेत्"`).
- Tests across all round configurations: $R \in [2, 4, 6, 8, 12, 16]$.

### `backend/tests/test_key_schedule.py` (2 tests)
- Verifies subkey schedule generation:
  - Produces exactly $R + 1$ subkeys.
  - Every subkey is 64 bits ($8$ bytes).
  - Subkeys are mutually distinct ($K_i \neq K_j$ for $i \neq j$).
  - A 1-bit difference in master key produces significant divergence across all derived subkeys.

### `backend/tests/test_analysis.py` (5 tests)
- Verifies that `evaluate_avalanche_effect` returns SAC convergence near 50%.
- Verifies that Shannon entropy $H > 7.5$ bits/byte for encrypted data.
- Verifies that monobit uniformity ratio is between $0.45$ and $0.55$.
- Verifies sensitivity and frequency analysis responses.

### `backend/tests/test_test_vectors.py` (2 tests)
- Verifies deterministic golden test vector:
  ```python
  Key: "KAUTILYA_CHANAKYA_321BCE"
  Plaintext: "ARTHASHASTRA"
  Ciphertext: "ED85A02064EA1DB978A186337B1584AB"
  Rounds: 6
  ```
- Ensures reproducible results matching specification across platforms.

### `backend/tests/test_edge_cases.py` (7 tests)
- Tests: Empty string encryption/decryption, odd-length hex strings, invalid non-hex characters, corrupted PKCS#7 padding, single-byte payload, and wrong key decryption failure.

### `backend/tests/test_api.py` (5 tests)
- Uses FastAPI `TestClient` to verify HTTP 200 responses, schema validity, and error handling for `/api/cipher/encrypt`, `/api/cipher/decrypt`, `/api/analysis/avalanche`, and `/api/history/context`.

### `backend/tests/test_cbc_mode.py` (7 tests)
- Verifies the ECB default preserves the golden vector, CBC round-trips with `iv_hex`, CBC hides repeated plaintext blocks, random IVs diverge, and invalid modes/IVs are rejected (plus HTTP-level CBC round-trip and uniform-400 on missing IV).

### `backend/tests/test_auth.py` (6 tests)
- Verifies HMAC-SHA256 round-trip, tamper detection, wrong-key rejection, strict UTF-8 decoding (no latin1 fallback), and uniform HTTP 400 across bad-hex/unaligned/corrupt-padding inputs plus HTTP tag verification.

---

## 8. Frontend Design System & Styling (`frontend/src/index.css`)

### `frontend/src/index.css`
- **Lines of Code**: ~580 lines
- **Role**: Vanilla CSS design system providing a minimal light theme default, dark mode support, and typography.
- **Design Tokens (CSS Custom Properties)**:
  - `--bg-primary`: `#f8fafc` (crisp slate-50 light background).
  - `--bg-card`: `#ffffff` (elevated card surface).
  - `--border-subtle`: `#e2e8f0` (clean, non-intrusive border).
  - `--text-primary`: `#0f172a` (deep slate text with maximum readability).
  - `--text-secondary`: `#475569` (balanced secondary text).
  - `--accent-gold`: `#b45309` (historical amber/gold accent).
  - `--accent-cyan`: `#0284c7` (computational sky blue accent).
  - `--accent-emerald`: `#059669` (success and verification green).
- **Dark Mode Support (`[data-theme="dark"]`)**:
  - Seamlessly flips background to `#0a0e17`, card surface to `#111622`, text to `#f1f5f9`, and borders to `#1e293b`.
- **Custom Classes**:
  - `.nav-links`, `.nav-item`, `.nav-item.active`: Minimal segmented control styling.
  - `.subnav-toggle`, `.subnav-btn`, `.subnav-btn.active`: In-page sub-navigation pills.
  - `.academic-alert`: Academic demarcation banner with gold accent.
  - `.hex-display`: Monospace terminal display for hex streams.
  - `.grid-2`, `.grid-3`, `.grid-4`: Responsive CSS grid layouts.

---

## 9. Frontend Client, State & Types (`frontend/src/api/` & `types/`)

### `frontend/src/types/index.ts`
- **Lines of Code**: ~140 lines
- **Role**: TypeScript interfaces mirroring backend Pydantic models.
- **Interfaces**:
  - `EncryptResponse`, `DecryptResponse`, `StepTraceItem`.
  - `AvalancheResponse`, `SensitivityResponse`, `FrequencyResponse`, `BenchmarkResponse`, `BruteForceResponse`, `FrequencyAnalysisResponse`.
  - `HistoricalContextResponse`, `ArthashastraChapter`, `SanskritGlossaryItem`.

### `frontend/src/api/client.ts`
- **Lines of Code**: ~110 lines
- **Role**: Typed fetch API client connecting the React UI to the FastAPI server.
- **Functions**:
  - `encryptApi(plaintext, key, rounds, includeTrace)`
  - `decryptApi(ciphertextHex, key, rounds, includeTrace)`
  - `getAvalancheApi(text, key, rounds)`
  - `getSensitivityApi(text1, text2, key, rounds)`
  - `getFrequencyApi(text, key, rounds)`
  - `getBenchmarkApi()`
  - `getHistoricalContextApi()`, `getArthashastraChaptersApi()`
  - `runFrequencyAnalysisDemoApi()`, `runBruteForceDemoApi()`

---

## 10. Frontend UI Components & Navigation (`frontend/src/components/`)

### `frontend/src/components/Header.tsx`
- **Lines of Code**: ~95 lines
- **Role**: Minimal, distraction-free top navigation header.
- **Features**:
  - **Brand Badge**: Sanskrit glyph `गू` in gold badge + `GŪḌHA` title; clicking navigates directly to Cipher Lab.
  - **3 Minimal Tabs**:
    1. `[ 🔬 Cipher Lab ]` (`lab`)
    2. `[ 📊 Analysis ]` (`analysis`)
    3. `[ 📜 Research & Thesis ]` (`research`)
  - **Right Controls**:
    - **Theme Toggle Button**: Instant Light/Dark toggle with Moon/Sun icon and `localStorage` persistence.
    - **System Status Indicator**: Pulsing green dot with `GŪḌHA-64` badge.

---

## 11. Frontend Interactive Pages (`frontend/src/pages/` & `App.tsx`)

### `frontend/src/App.tsx`
- **Lines of Code**: ~65 lines
- **Role**: Main application orchestrator managing the 3-tab layout, view routing, and academic footer.
- **State**: `activeTab: 'lab' | 'analysis' | 'research'` (default `'lab'`).
- **Footer**: Displays version `v1.0.0`, Arthaśāstra inspiration credit, and academic demarcation statement.

### `frontend/src/pages/LabPage.tsx`
- **Lines of Code**: ~545 lines
- **Role**: Primary cryptographic laboratory and interactive workbench.
- **Features**:
  - **Header Hero**: Title `GŪḌHA (गूढ)`, subtitle, and toggleable *Academic Demarcation Note*.
  - **Subnav Switcher**:
    - `[ ⚡ Workbench & Derivation Stepper ]`
    - `[ 🏛️ 9-Stage SPN Architecture ]` (embeds `PipelinePage`)
  - **Workbench**:
    - Mode toggle: `ENCRYPT` / `DECRYPT`.
    - Preset dispatches: `Arthaśāstra (1.16.29)`, `Sanskrit Verse`, `Minimal Hello World`.
    - Plaintext & secret key inputs with live byte-length counters.
    - Configurable rounds ($2, 4, 6, 8$).
    - Output hex dump with copy-to-clipboard button.
  - **Mathematical Derivation Studio (*Anukramaṇa*)**:
    - Interactive 8-byte state matrix grid displaying Hex, Decimal, and Binary representations.
    - Step playback controls: `Previous`, `Play/Pause`, `Next`, step counter.
    - Active subkey display with XOR applied indicator.

### `frontend/src/pages/PipelinePage.tsx`
- **Lines of Code**: ~265 lines
- **Role**: Interactive 9-stage SPN sequence viewer and stage inspector.
- **9 Stages**:
  1. *Mūla Saṅkalana* (Normalization & UTF-8 Encoding)
  2. *Khaṇḍa Vibhāga* (PKCS#7 Block Segmentation)
  3. *Vistāra* (128-bit Key Schedule Expansion)
  4. *Prārambhika Yoga* (Pre-Round Whitening)
  5. *Parivartana* (Non-Linear S-Box Substitution)
  6. *Krama* (8x8 Bit-Matrix Transposition & 11-Bit Rotation)
  7. *Miśraṇa* (Modular Matrix Diffusion over $\mathbb{Z}_{256}$)
  8. *Yoga* (Round Key Addition)
  9. *Gūḍha Rūpa* (Final Ciphertext Concatenation)
- **Inspector Panel**: Shows Shannon principle, description, rationale, algebraic formula, and concrete numerical example for the selected stage.

### `frontend/src/pages/AnalysisPage.tsx`
- **Lines of Code**: ~680 lines
- **Role**: Empirical cryptanalysis dashboard.
- **Features**:
  - **Avalanche Effect Test**: Live round-by-round SAC evaluation with visual convergence progress bar ($51.56\%$).
  - **Sensitivity Heatmap**: Bit difference matrix comparing single-character modifications.
  - **Shannon Entropy & Uniformity**: Entropy gauge ($H \to 7.91$ bits/byte) and monobit ratio.
  - **Educational Attack Simulations**:
    - Frequency analysis comparison (Monoalphabetic vs GŪḌHA-64).
    - Real-time 12-bit brute-force key recovery with comparative time complexity analysis against 56-bit DES and 128-bit GŪḌHA.

### `frontend/src/pages/ResearchPage.tsx`
- **Lines of Code**: ~40 lines
- **Role**: Consolidated academic portal unifying historical context and viva defense.
- **Subnav Switcher**:
  - `[ 📜 Historical Context & Demarcation ]` $\to$ renders `HistoryPage`.
  - `[ 🎓 18-Part Viva Defense Guide ]` $\to$ renders `DocsPage`.

### `frontend/src/pages/HistoryPage.tsx`
- **Lines of Code**: ~200 lines
- **Role**: Primary historical evidence and linguistic foundation portal.
- **Features**:
  - Academic Demarcation Mandate alert.
  - 3-Tier Demarcation Cards (Historical Fact $\to$ Modern Theory $\to$ Our Design).
  - Primary text quotations from *Arthaśāstra* Book 1 Ch 16, Book 2 Ch 10, and Book 1 Ch 11–12 with translations and cryptographic relevance.
  - Sanskrit Cryptographic Glossary table mapping 8 formal terms to computational mechanisms.

### `frontend/src/pages/DocsPage.tsx`
- **Lines of Code**: ~380 lines
- **Role**: Complete 18-section academic project thesis report with category filters.
- **Each Section Includes**:
  - Section title and summary.
  - Exhaustive academic text with mathematical equations.
  - Anticipated viva examination question and model defense answer.

### `frontend/src/pages/LandingPage.tsx`
- **Lines of Code**: ~190 lines
- **Role**: Standalone introductory splash page with live quick-encryption trial and architectural triad cards.

---

## 12. Verification & Build Integrity

- **Backend Pytest Suite**: 51 of 51 tests passing (`pytest backend/tests/ -v`), including CBC mode and HMAC authentication suites.
- **CI**: `.github/workflows/ci.yml` runs the backend suite and the frontend typecheck/build on push and pull requests.
- **Frontend TypeScript Build**: `npm run build` (`tsc -b && vite build`) executes in <600ms with **0 errors and 0 warnings**.
- **Services Active**:
  - Backend API: `http://127.0.0.1:8000` (Swagger docs: `/docs`).
  - Frontend Web UI: `http://localhost:5173/`.
