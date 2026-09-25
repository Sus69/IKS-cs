# GŪḌHA: Viva Defense & Examination Guide
**College Evaluation Preparation Dossier**

---

## 1. High-Probability Evaluation Questions & Model Answers

### Q1: What is the Indian Knowledge Systems (IKS) foundation of your project?
> **Answer**:
> "Our project is grounded in the *Arthaśāstra* of Kauṭilya (Books 1 & 2), which explicitly documents the requirement for *gūḍhalekhya* (secret/coded writing) for diplomatic envoys navigating hostile territory (1.16.29) and establishes compartmentalized intelligence networks (*gūḍhapuruṣa*, 1.12.7). We translate these classical concepts into modern computational principles (confusion, diffusion, and key expansion). We strictly maintain that the *Arthaśāstra* provided the statecraft doctrine of secret communication, while the mathematical block cipher algorithm is our own original 21st-century engineering implementation."

---

### Q2: Why is your cipher called a Substitution-Permutation Network (SPN)?
> **Answer**:
> "An SPN is a symmetric block cipher design paradigm that achieves Shannon's twin goals of confusion and diffusion through alternating layers of non-linear substitution (S-Boxes) and linear permutations/mixers across multiple rounds. In GŪḌHA-64, each round executes:
> 1. *Parivartana* (8-bit non-linear S-Box substitution for confusion)
> 2. *Krama* (8x8 bit-matrix transposition and 11-bit cyclic rotation for bit diffusion)
> 3. *Miśraṇa* (circulant modular matrix multiplication over $\mathbb{Z}_{256}$ for inter-byte diffusion)
> 4. *Yoga* (Key addition via bitwise XOR)."

---

### Q3: How do you prove that GŪḌHA decryption always restores the original plaintext?
> **Answer**:
> "Every mathematical component in our round function is bijective (one-to-one and onto):
> 1. XOR is self-inverting: $A \oplus B \oplus B = A$.
> 2. The diffusion matrix $M$ has determinant $\det(M) = -5265$. Since $-5265$ is odd, it is coprime to 256, guaranteeing an exact inverse matrix $M^{-1}$ in the ring $\mathbb{Z}_{256}$.
> 3. The 8x8 bit-matrix transposition is self-inverting ($(A^T)^T = A$), and the 11-bit left rotation is inverted by an 11-bit right rotation.
> 4. The 8-bit S-Box is a verified bijection with an exact inverse table $S^{-1}$.
> Thus, applying the inverse operations in reverse order strictly guarantees $\text{Decrypt}(\text{Encrypt}(P)) = P$. This invariant is verified by 51 automated unit tests across 50 randomized keys/messages plus parametrized length and round sweeps."

---

### Q4: What is the Strict Avalanche Criterion (SAC) and did GŪḌHA satisfy it?
> **Answer**:
> "The Strict Avalanche Criterion (SAC), formalized by Webster and Tavares (1985), states that whenever a single input bit is complemented, each of the output ciphertext bits should change with a probability of 50%. In GŪḌHA-64, flipping 1 bit in byte 0 produces an initial 1.56% variance at Round 0, which expands to 28.12% after Round 1, and reaches 51.56% by Round 6. This aligns with the theoretical 45%–55% range for well-diffused block ciphers."

---

### Q5: Why does your Key Schedule use Round Constants based on the Golden Ratio?
> **Answer**:
> "Round constants prevent slide attacks and structural symmetry between rounds. If all round keys were generated with identical linear relations, an attacker could analyze cipher relationships without breaking individual rounds. We derive our round constants from the fractional expansion of $\phi = \frac{1 + \sqrt{5}}{2}$ ($\text{0x9E3779B97F4A7C15}$), an irrational constant with high binary entropy that destroys slide symmetry."

---

### Q6: What are the security limitations of GŪḌHA?
> **Answer**:
> "We explicitly declare three limitations:
> 1. Block Size: GŪḌHA uses a 64-bit block size (8 bytes), which is ideal for visual college demonstration, but modern standards like AES use 128-bit blocks to prevent birthday paradox collisions on multi-terabyte streams.
> 2. Review Maturity: It is an educational research cipher that has not undergone decades of open cryptanalysis.
> 3. Side-channel timing: It is implemented in software (Python) without constant-time hardware instructions, making it vulnerable to cache-timing attacks."

---

## 2. Technical Glossary for Quick Recall

- **Confusion**: Obscuring the relationship between the key and ciphertext (achieved via S-Boxes).
- **Diffusion**: Spreading the statistical influence of a single plaintext bit across many ciphertext bits.
- **Hamming Distance**: The count of differing bit positions between two binary strings.
- **PKCS#7**: A deterministic padding standard where $k$ bytes of value $k$ are appended.
- **Shannon Entropy**: A measure of information unpredictability; maximum for 8-bit bytes is $8.0$ bits/byte.
- **Bijective Function**: A mathematical mapping that is both injective (no two inputs map to same output) and surjective (every output is covered), guaranteeing an exact inverse.
