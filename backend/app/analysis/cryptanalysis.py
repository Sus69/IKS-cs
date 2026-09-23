"""
GŪḌHA Educational Cryptanalysis Demonstrations
----------------------------------------------
Controlled educational demonstrations illustrating cryptographic vulnerabilities:
1. Frequency Analysis Attack against a Weak Monoalphabetic Mode vs. Full GŪḌHA
2. Controlled Brute-Force Key Recovery over a Constrained Demonstration Keyspace
3. Keyspace Scalability Comparison (16-bit Demo vs 56-bit DES vs 128-bit GŪḌHA)

DISCLAIMER:
These demonstrations are designed strictly for educational pedagogy.
The restricted keyspace used in demo 2 does not reflect the 128-bit security
of the full GŪḌHA cipher engine.
"""

import time
from collections import Counter
from typing import Dict, Any, List
from ..cipher.engine import Gudha64Cipher

def demo_weak_vs_strong_frequency(
    sample_text: str = "SECRET DISPATCH FOR ARTHASHASTRA CHANCELLERY: ATTACK AT DAWN ON THE BORDER FORTRESS."
) -> Dict[str, Any]:
    """
    Demonstrates why naive substitution ciphers fail against frequency analysis,
    and how GŪḌHA's multi-round diffusion eliminates single-character frequency patterns.
    """
    # 1. Deliberately weak monoalphabetic substitution (Caesar-like shift by 7)
    weak_ciphertext = "".join(
        chr((ord(c) - 65 + 7) % 26 + 65) if 'A' <= c <= 'Z' else c
        for c in sample_text.upper()
    )

    # 2. Strong GŪḌHA-64 encryption
    cipher = Gudha64Cipher(key="ARTHASHASTRA_DEMO_KEY", rounds=6)
    strong_enc = cipher.encrypt(sample_text, record_trace=False)
    strong_ciphertext_bytes = bytes.fromhex(strong_enc["ciphertext_hex"])

    # Analyze letter frequency in weak ciphertext
    weak_letters = [c for c in weak_ciphertext if 'A' <= c <= 'Z']
    weak_counts = Counter(weak_letters).most_common(5)

    # Analyze byte frequency in strong ciphertext
    strong_counts = Counter(strong_ciphertext_bytes).most_common(5)

    return {
        "disclaimer": "Educational demonstration only. Compares naive substitution with block SPN.",
        "sample_plaintext": sample_text,
        "weak_mode": {
            "name": "Naive Caesar/Monoalphabetic Substitution",
            "ciphertext_preview": weak_ciphertext[:60] + "...",
            "vulnerability": "Preserves relative letter frequency. The most frequent letter in English ('E') directly correlates to the most frequent ciphertext letter.",
            "top_frequencies": [{"symbol": char, "count": count} for char, count in weak_counts]
        },
        "gudha_mode": {
            "name": "GŪḌHA-64 Full SPN Pipeline (6 Rounds)",
            "ciphertext_hex_preview": strong_enc["ciphertext_hex"][:60] + "...",
            "defense": "Non-linear S-Box + Bit Permutation + Matrix Diffusion flattens the frequency distribution, rendering statistical single-character frequency analysis ineffective.",
            "top_frequencies": [{"symbol": f"0x{b:02X}", "count": count} for b, count in strong_counts]
        }
    }

def demo_controlled_brute_force(
    target_pin: int = 1423,
    keyspace_bits: int = 12
) -> Dict[str, Any]:
    """
    Simulates a controlled brute-force key search over an intentionally tiny keyspace (12-bit = 4,096 keys).
    Illustrates how an adversary tests candidate keys against a known plaintext-ciphertext pair.
    """
    assert 4 <= keyspace_bits <= 14, "Demo keyspace restricted between 4 and 14 bits for sub-second safety"
    max_key = 1 << keyspace_bits
    target_key_int = target_pin % max_key
    target_key_str = f"PIN_{target_key_int:04d}"

    known_plaintext = "TARGET01"  # 8 bytes
    target_cipher = Gudha64Cipher(key=target_key_str, rounds=4)
    target_enc = target_cipher.encrypt(known_plaintext, record_trace=False)
    target_ciphertext_hex = target_enc["ciphertext_hex"]

    # Search loop
    t0 = time.perf_counter()
    attempts = 0
    found_key = None
    tested_samples: List[Dict[str, Any]] = []

    for candidate in range(max_key):
        attempts += 1
        cand_key_str = f"PIN_{candidate:04d}"
        c = Gudha64Cipher(key=cand_key_str, rounds=4)
        out = c.encrypt(known_plaintext, record_trace=False)
        
        if attempts <= 5 or candidate == target_key_int:
            tested_samples.append({
                "attempt": attempts,
                "candidate_key": cand_key_str,
                "output_hex": out["ciphertext_hex"],
                "match": out["ciphertext_hex"] == target_ciphertext_hex
            })

        if out["ciphertext_hex"] == target_ciphertext_hex:
            found_key = cand_key_str
            break

    elapsed_sec = time.perf_counter() - t0

    return {
        "disclaimer": "Educational demonstration only. Shows why tiny keyspaces are trivial to invert via exhaustive search.",
        "keyspace_bits": keyspace_bits,
        "total_possible_keys": max_key,
        "target_key": target_key_str,
        "known_plaintext": known_plaintext,
        "target_ciphertext_hex": target_ciphertext_hex,
        "recovered_key": found_key,
        "attempts_made": attempts,
        "elapsed_seconds": round(elapsed_sec, 4),
        "keys_per_second": round(attempts / (elapsed_sec if elapsed_sec > 0 else 1e-6), 1),
        "tested_samples": tested_samples,
        "keyspace_comparison_table": [
            {
                "standard": "Educational Demo (12-bit)",
                "keyspace": "2^12 = 4,096",
                "time_to_crack": f"{round(elapsed_sec, 3)} seconds",
                "security_status": "Instantly broken on a phone/laptop"
            },
            {
                "standard": "Tiny Demo (16-bit)",
                "keyspace": "2^16 = 65,536",
                "time_to_crack": "~0.05 seconds",
                "security_status": "Trivial brute force"
            },
            {
                "standard": "Legacy DES (56-bit)",
                "keyspace": "2^56 ≈ 7.2 × 10^16",
                "time_to_crack": "~1 day on specialized FPGA hardware (EFF Deep Crack 1998)",
                "security_status": "Deprecated & insecure"
            },
            {
                "standard": "GŪḌHA Master Key (128-bit)",
                "keyspace": "2^128 ≈ 3.4 × 10^38",
                "time_to_crack": "> 10^22 years (longer than the age of the universe)",
                "security_status": "Computationally infeasible for classical brute force"
            }
        ]
    }
