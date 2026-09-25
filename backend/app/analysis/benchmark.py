"""
GŪḌHA Analysis: Performance & Latency Benchmarks
------------------------------------------------
Measures encryption and decryption throughput across message sizes and round configs.
"""

import time
import random
import string
from typing import Dict, Any, List, Optional
from ..cipher.engine import Gudha64Cipher

# Default matrix finishes in ~2s; the full matrix (with 4/16 KB) takes ~1 min
# in pure Python, so the UI only runs it on explicit request.
DEFAULT_SIZES = [64, 256, 1024]
FULL_SIZES = [64, 256, 1024, 4096, 16384]
MAX_SIZE_BYTES = 65536
MAX_SIZES = 5

def benchmark_cipher_performance(
    sizes_bytes: Optional[List[int]] = None,
    rounds: int = 6,
    full: bool = False
) -> Dict[str, Any]:
    """
    Executes timed encryption and decryption passes across varying payload sizes.
    sizes_bytes=None selects the default (fast) or full matrix via `full`.
    Explicit sizes are clamped to [8, 65536] bytes, max 5 entries, so one
    request cannot pin the single worker process for minutes.
    """
    if not (2 <= rounds <= 16):
        raise ValueError("Rounds must be between 2 and 16")
    if sizes_bytes is None:
        sizes_bytes = FULL_SIZES if full else DEFAULT_SIZES
    sizes_bytes = [min(max(int(s), 8), MAX_SIZE_BYTES) for s in sizes_bytes][:MAX_SIZES]

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
        iterations = max(3, 2000 // (size + 1))
        
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
        "full": full or sizes_bytes == FULL_SIZES,
        "results": results,
        "note": "Benchmarks measured on pure Python software runtime."
    }
