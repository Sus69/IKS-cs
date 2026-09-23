"""
GŪḌHA Analysis: Frequency Distribution & Information Entropy
------------------------------------------------------------
Computes Shannon Entropy, Monobit (0/1) balance, and byte frequency distributions
comparing input plaintexts against output ciphertexts.
"""

import math
from collections import Counter
from typing import Dict, Any, List

def calculate_shannon_entropy(data: bytes) -> float:
    """
    Calculates Shannon entropy in bits per byte (0.0 to 8.0).
    Max theoretical entropy for uniform random bytes = 8.0 bits/byte.
    """
    if not data:
        return 0.0
    length = len(data)
    counts = Counter(data)
    entropy = 0.0
    for count in counts.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 4)

def calculate_monobit_balance(data: bytes) -> Dict[str, Any]:
    """
    Calculates ratio of binary 0s and 1s in the data.
    Ideal random distribution: 50.0% ones, 50.0% zeros.
    """
    if not data:
        return {"ones": 0, "zeros": 0, "total_bits": 0, "one_percentage": 50.0}
    total_bits = len(data) * 8
    ones = sum(bin(b).count('1') for b in data)
    zeros = total_bits - ones
    one_pct = round((ones / total_bits) * 100, 2)
    return {
        "ones": ones,
        "zeros": zeros,
        "total_bits": total_bits,
        "one_percentage": one_pct,
        "deviation_from_ideal": round(abs(50.0 - one_pct), 2)
    }

def analyze_frequency_distribution(
    plaintext: str,
    ciphertext_hex: str
) -> Dict[str, Any]:
    """
    Compares symbol and byte frequencies between plaintext and ciphertext.
    """
    pt_bytes = plaintext.encode('utf-8')
    ct_bytes = bytes.fromhex(ciphertext_hex)

    pt_entropy = calculate_shannon_entropy(pt_bytes)
    ct_entropy = calculate_shannon_entropy(ct_bytes)

    pt_monobit = calculate_monobit_balance(pt_bytes)
    ct_monobit = calculate_monobit_balance(ct_bytes)

    # Top byte frequencies for visualization (ASCII or top 10 hex codes)
    pt_counter = Counter(pt_bytes)
    ct_counter = Counter(ct_bytes)

    # Format top items for easy charting in frontend
    pt_top: List[Dict[str, Any]] = [
        {"byte": f"{b:02X}", "char": chr(b) if 32 <= b <= 126 else f"\\x{b:02x}", "count": count}
        for b, count in pt_counter.most_common(12)
    ]
    ct_top: List[Dict[str, Any]] = [
        {"byte": f"{b:02X}", "char": f"0x{b:02X}", "count": count}
        for b, count in ct_counter.most_common(12)
    ]

    return {
        "plaintext_length_bytes": len(pt_bytes),
        "ciphertext_length_bytes": len(ct_bytes),
        "plaintext_entropy": pt_entropy,
        "ciphertext_entropy": ct_entropy,
        "max_theoretical_entropy": 8.0,
        "plaintext_monobit": pt_monobit,
        "ciphertext_monobit": ct_monobit,
        "plaintext_top_bytes": pt_top,
        "ciphertext_top_bytes": ct_top,
        "interpretation": (
            f"Plaintext entropy ({pt_entropy} bits/byte) reflects natural language redundancy. "
            f"Ciphertext entropy ({ct_entropy} bits/byte) shows near-uniform dispersion, "
            "obscuring statistical frequency analysis."
        )
    }
