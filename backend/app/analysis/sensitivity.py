"""
GŪḌHA Analysis: Key and Plaintext Sensitivity
---------------------------------------------
Measures cross-cryptographic sensitivity to minimal modifications in keys and plaintexts.
"""

from typing import Dict, Any, List
from ..cipher.engine import Gudha64Cipher

def _hamming_distance(a: bytes, b: bytes) -> int:
    return sum(bin(x ^ y).count('1') for x, y in zip(a, b))

def analyze_key_sensitivity(
    plaintext: str = "CONFIDENTIAL DISPATCH FOR THE MAURYAN CHANCELLERY",
    key_a: str = "KAUTILYA_SECRET_A",
    key_b: str = "KAUTILYA_SECRET_B",
    rounds: int = 6
) -> Dict[str, Any]:
    """
    Encrypts the same plaintext under two keys with minimal differential.
    """
    cipher_a = Gudha64Cipher(key=key_a, rounds=rounds)
    cipher_b = Gudha64Cipher(key=key_b, rounds=rounds)

    enc_a = cipher_a.encrypt(plaintext, record_trace=False)
    enc_b = cipher_b.encrypt(plaintext, record_trace=False)

    ca_bytes = bytes.fromhex(enc_a["ciphertext_hex"])
    cb_bytes = bytes.fromhex(enc_b["ciphertext_hex"])

    total_bits = len(ca_bytes) * 8
    diff_bits = _hamming_distance(ca_bytes, cb_bytes)
    pct = round((diff_bits / total_bits) * 100, 2)

    # Byte by byte delta
    byte_deltas: List[Dict[str, Any]] = []
    for idx, (b1, b2) in enumerate(zip(ca_bytes, cb_bytes)):
        byte_deltas.append({
            "byte_index": idx,
            "byte_a_hex": f"{b1:02X}",
            "byte_b_hex": f"{b2:02X}",
            "xor_diff_hex": f"{(b1 ^ b2):02X}",
            "bits_flipped": bin(b1 ^ b2).count('1')
        })

    return {
        "key_a": key_a,
        "key_b": key_b,
        "plaintext": plaintext,
        "ciphertext_a_hex": enc_a["ciphertext_hex"],
        "ciphertext_b_hex": enc_b["ciphertext_hex"],
        "total_bits": total_bits,
        "differing_bits": diff_bits,
        "sensitivity_percentage": pct,
        "byte_deltas": byte_deltas[:32],  # preview first 32 bytes
        "summary": f"Key change produced {pct}% bit variance across the ciphertext payload."
    }

def analyze_plaintext_sensitivity(
    plaintext_a: str = "HELLO WORLD",
    plaintext_b: str = "HELLO WORLE",
    key: str = "KAUTILYA_DEFAULT_KEY",
    rounds: int = 6
) -> Dict[str, Any]:
    """
    Encrypts two plaintexts differing by a single character under the same key.
    """
    cipher = Gudha64Cipher(key=key, rounds=rounds)

    enc_a = cipher.encrypt(plaintext_a, record_trace=False)
    enc_b = cipher.encrypt(plaintext_b, record_trace=False)

    ca_bytes = bytes.fromhex(enc_a["ciphertext_hex"])
    cb_bytes = bytes.fromhex(enc_b["ciphertext_hex"])

    total_bits = min(len(ca_bytes), len(cb_bytes)) * 8
    diff_bits = _hamming_distance(ca_bytes[:len(cb_bytes)], cb_bytes[:len(ca_bytes)])
    overall_pct = round((diff_bits / total_bits) * 100, 2)

    # Also calculate the sensitivity within the specific block that had the character modification
    # Find which block differs:
    pt_a_bytes = plaintext_a.encode('utf-8')
    pt_b_bytes = plaintext_b.encode('utf-8')
    diff_indices = [i for i, (b1, b2) in enumerate(zip(pt_a_bytes, pt_b_bytes)) if b1 != b2]
    diff_block_idx = (diff_indices[0] // 8) if diff_indices else 0

    block_start = diff_block_idx * 8
    block_end = block_start + 8
    if block_end <= len(ca_bytes) and block_end <= len(cb_bytes):
        block_diff = _hamming_distance(ca_bytes[block_start:block_end], cb_bytes[block_start:block_end])
        block_pct = round((block_diff / 64) * 100, 2)
    else:
        block_diff = diff_bits
        block_pct = overall_pct

    return {
        "plaintext_a": plaintext_a,
        "plaintext_b": plaintext_b,
        "key": key,
        "ciphertext_a_hex": enc_a["ciphertext_hex"],
        "ciphertext_b_hex": enc_b["ciphertext_hex"],
        "perturbed_block_index": diff_block_idx,
        "perturbed_block_bits_flipped": block_diff,
        "perturbed_block_percentage": block_pct,
        "total_bits": total_bits,
        "overall_differing_bits": diff_bits,
        "overall_sensitivity_percentage": overall_pct,
        "summary": f"Altering 1 character in block {diff_block_idx} produced {block_pct}% bit variance within that block ({overall_pct}% over full payload)."
    }
