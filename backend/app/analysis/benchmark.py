"""
GŪḌHA Analysis: Performance & Latency Benchmarks
------------------------------------------------
Measures encryption and decryption throughput across message sizes and round configs.
"""

import time
import random
import string
from typing import Dict, Any, List
from ..cipher.engine import Gudha64Cipher

def benchmark_cipher_performance(
    sizes_bytes: List[int] = [64, 256, 1024, 4096, 16384],
    rounds: int = 6
) -> Dict[str, Any]:
    """
    Executes timed encryption and decryption passes across varying payload sizes.
    """
    cipher = Gudha64Cipher(key="BENCHMARK_KEY_ARTHASHASTRA", rounds=rounds)
    results: List[Dict[str, Any]] = []

    for size in sizes_bytes:
        # Printable-ASCII payload: valid UTF-8 so the decrypt path (which
        # strictly decodes UTF-8 since the auth-hardening change) round-trips.
        # os.urandom bytes would fail strict decoding and poison the timing.
        test_payload = "".join(
            random.choice(string.ascii_letters + string.digits + " ")
            for _ in range(size)
        )
        
        # Warmup
        _ = cipher.encrypt(test_payload, record_trace=False)

        # Measure encryption (averaged over multiple iterations)
        iterations = max(10, 5000 // (size + 1))
        
        t0 = time.perf_counter()
        for _ in range(iterations):
            enc = cipher.encrypt(test_payload, record_trace=False)
        t_enc = (time.perf_counter() - t0) / iterations

        ct_hex = enc["ciphertext_hex"]

        # Measure decryption
        t1 = time.perf_counter()
        for _ in range(iterations):
            _ = cipher.decrypt(ct_hex, record_trace=False)
        t_dec = (time.perf_counter() - t1) / iterations

        enc_throughput_mb_s = (size / (1024 * 1024)) / (t_enc if t_enc > 0 else 1e-9)
        dec_throughput_mb_s = (size / (1024 * 1024)) / (t_dec if t_dec > 0 else 1e-9)

        results.append({
            "size_bytes": size,
            "size_label": f"{size} B" if size < 1024 else f"{size // 1024} KB",
            "encrypt_time_ms": round(t_enc * 1000, 3),
            "decrypt_time_ms": round(t_dec * 1000, 3),
            "encrypt_throughput_mb_s": round(enc_throughput_mb_s, 2),
            "decrypt_throughput_mb_s": round(dec_throughput_mb_s, 2)
        })

    return {
        "rounds": rounds,
        "results": results,
        "note": "Benchmarks measured on pure Python software runtime."
    }
