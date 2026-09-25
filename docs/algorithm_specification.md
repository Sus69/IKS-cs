# GŪḌHA-64 Algorithm Specification
**Arthaśāstra-Inspired Symmetric Block Cipher System**

---

## 1. Parameters Summary

| Parameter | Notation | Value | Description |
| :--- | :--- | :--- | :--- |
| **Block Size** | $N$ | 64 bits (8 bytes) | State vector $[b_0, b_1, b_2, b_3, b_4, b_5, b_6, b_7] \in (\mathbb{Z}_{256})^8$ |
| **Master Key Size** | $K$ | 128 bits (16 bytes) | Normalized via SHA-256 truncation for user passphrases |
| **Rounds** | $R$ | 6 (default, 2–16 configurable) | Iterative substitution-permutation-diffusion cycles |
| **Round Keys** | $K_0 \dots K_R$ | $R+1$ keys of 64 bits each | Pre-whitening key $K_0$ + $R$ round keys |
| **Algebraic Ring** | $\mathcal{R}$ | $\mathbb{Z}_{256}$ | Modular arithmetic modulo 256 |
| **Padding** | PKCS#7 | Block length 8 | $k = 8 - (\text{length} \bmod 8)$ bytes of value $k$ |

---

## 2. Mathematical Transformations per Round

Each round $r \in [1, R]$ executes four ordered operations:

### 1. Non-linear Substitution (*Parivartana* — S-Box)
Confusion is introduced via a bijective 256-element S-Box $S: \{0..255\} \to \{0..255\}$.
$$S_A[i] = S[S_{r-1}[i]], \quad \forall i \in \{0, \dots, 7\}$$
- **Properties**:
  - Bijective: Exactly 256 unique entries.
  - Zero fixed points: $S[x] \neq x$ for all $x$.
  - Exact inverse: $S^{-1}[S[x]] = x$.

### 2. Bit Permutation (*Krama*)
Bit-level diffusion across bytes:
1. **$8 \times 8$ Bit Matrix Transposition**:
   Bits are arranged in an $8 \times 8$ grid where row $i$ is byte $i$ and column $j$ is bit $j$.
   $$\text{Bit}(i, j) \longmapsto \text{Bit}(j, i)$$
   This scatters all 8 bits of every byte across 8 distinct output bytes.
2. **Cyclic Rotation**:
   The resulting 64-bit integer is cyclically rotated left by 11 positions ($\gcd(11, 64) = 1$):
   $$S_B = \text{ROL}_{64}(\text{Transpose}_{8 \times 8}(S_A), 11)$$
- **Inverse Operation**:
   $$S_A = \text{Transpose}_{8 \times 8}(\text{ROR}_{64}(S_B, 11))$$

### 3. Linear Modular Diffusion Matrix (*Miśraṇa*)
Inter-byte diffusion is performed via matrix multiplication over $\mathbb{Z}_{256}$:
$$S_C = (M \cdot S_B) \pmod{256}$$
Where $M$ is an $8 \times 8$ circulant matrix with first row $[1, 2, 1, 4, 1, 2, 1, 1]$.
- **Invertibility Proof**:
  $$\det(M) = -5265 \equiv 1 \pmod 2$$
  Since $\gcd(-5265, 256) = 1$, $M$ possesses an exact integer inverse matrix $M^{-1}$ mod 256.
  The first row of $M^{-1}$ is:
  $$[63, 29, 63, 114, 63, 200, 63, 114]$$
- **Inverse Operation**:
  $$S_B = (M^{-1} \cdot S_C) \pmod{256}$$

### 4. Key Addition (*Yoga*)
Bitwise XOR with round subkey $K_r$:
$$S_r = S_C \oplus K_r$$

---

## 3. Key Schedule (*Vistāra*)

1. **Input**: 128-bit key partitioned into two 64-bit words: $W_0, W_1$.
2. **Expansion**:
   For $i = 2$ to $R$:
   $$\text{temp} = W_{i-1}$$
   $$\text{If } i \equiv 0 \pmod 2: \quad \text{temp} = \text{SubWord64}(\text{RotWord64}(\text{temp}, 13)) \oplus \text{RCON}_i$$
   $$\text{If } i \equiv 1 \pmod 2: \quad \text{temp} = \text{RotWord64}(\text{temp}, 19) \oplus \text{RCON}_i$$
   $$W_i = W_{i-2} \oplus \text{temp}$$
3. **Round Constants ($\text{RCON}$)**:
   Derived from the fractional bits of the golden ratio $\phi = \frac{1 + \sqrt{5}}{2}$:
   $$\text{RCON}_0 = \text{0x9E3779B97F4A7C15}$$
   $$\text{RCON}_1 = \text{0x243F6A8885A308D3}$$
   $$\text{RCON}_2 = \text{0x13198A2E03707344}$$
   $$\text{RCON}_3 = \text{0xA4093822299F31D0}$$
   $$\text{RCON}_4 = \text{0x082EFA98EC4E6C89}$$
   $$\text{RCON}_5 = \text{0x452821E638D01377}$$
   $$\text{RCON}_6 = \text{0xBE5466CF34E90C6C}$$

---

## 4. Invertibility Proof

To decrypt ciphertext block $C$:
$$P = \text{Decrypt}(C, K)$$

Since every component has an exact inverse:
$$\text{InvSub}(\text{InvPerm}(\text{InvMix}(\text{Mix}(\text{Perm}(\text{Sub}(X)))))) = X$$
and because bitwise XOR is self-inverting ($A \oplus B \oplus B = A$), the round-trip identity:
$$\forall P, K: \quad \text{Decrypt}_K(\text{Encrypt}_K(P)) = P$$
holds unconditionally.

---

## 5. Block Modes

The block cipher above operates on single 8-byte blocks. Multi-block messages support two modes:

### ECB (Electronic Codebook, default)
Each padded block is encrypted independently:
$$C_i = \text{EncryptBlock}(P_i), \quad \forall i$$
Identical plaintext blocks yield identical ciphertext blocks. Kept as the default for demo compatibility and golden-vector stability; not recommended for structured messages.

### CBC (Cipher Block Chaining, opt-in)
Each block is XORed with the previous ciphertext block (or a random 8-byte IV for the first block) before encryption:
$$C_0 = \text{EncryptBlock}(P_0 \oplus IV), \quad C_i = \text{EncryptBlock}(P_i \oplus C_{i-1})$$
Decryption reverses the chain after block decryption:
$$P_0 = \text{DecryptBlock}(C_0) \oplus IV, \quad P_i = \text{DecryptBlock}(C_i) \oplus C_{i-1}$$
The IV is generated with a cryptographic RNG when omitted and must be supplied (`iv_hex`) for decryption. Chaining steps are recorded in the derivation trace (`CBC Chaining XOR` / `CBC Unchaining XOR`).

---

## 6. Authentication (HMAC-SHA256, opt-in)

With `authenticate=True`, encryption additionally returns:
$$\text{tag} = \text{HMAC-SHA256}(\text{master\_key}, \text{ciphertext})$$
Decryption with `expected_tag` verifies the tag with a constant-time comparison *before* unpadding and raises on mismatch, providing encrypt-then-MAC tamper detection. All decryption failures (bad hex, length, padding, auth mismatch, non-UTF8 output) surface as a single error class so callers cannot distinguish padding state.
