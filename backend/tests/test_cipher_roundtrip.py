"""
Verification Test Suite: Cipher Round-Trip Invertibility
Invariant: Decrypt(Encrypt(P, K), K) == P for all supported valid inputs.
"""

import pytest
import os
import random
import string
from backend.app.cipher.engine import Gudha64Cipher

@pytest.mark.parametrize("rounds", [2, 4, 6, 8])
def test_cipher_roundtrip_basic(rounds):
    key = "KAUTILYA_SECRET_KEY"
    plaintext = "Hello, Arthaśāstra!"
    
    cipher = Gudha64Cipher(key=key, rounds=rounds)
    enc_result = cipher.encrypt(plaintext, record_trace=True)
    assert "ciphertext_hex" in enc_result
    assert len(enc_result["ciphertext_hex"]) > 0
    
    dec_result = cipher.decrypt(enc_result["ciphertext_hex"])
    assert dec_result["plaintext"] == plaintext

@pytest.mark.parametrize("length", [1, 2, 7, 8, 9, 15, 16, 17, 32, 64, 127, 256])
def test_cipher_arbitrary_lengths(length):
    key = "TEST_ROUNDTRIP_KEY"
    alphabet = string.ascii_letters + string.digits + " !@#$%^&*()-_=+[]{}|;:,.<>?"
    plaintext = "".join(random.choice(alphabet) for _ in range(length))
    
    cipher = Gudha64Cipher(key=key, rounds=6)
    enc = cipher.encrypt(plaintext)
    dec = cipher.decrypt(enc["ciphertext_hex"])
    assert dec["plaintext"] == plaintext

def test_randomized_roundtrips_50():
    """Run 50 randomized stress tests with distinct random keys and messages."""
    for _ in range(50):
        key_len = random.randint(1, 32)
        msg_len = random.randint(1, 200)
        rounds = random.choice([4, 6, 8])
        
        random_key = "".join(random.choices(string.ascii_letters + string.digits, k=key_len))
        random_msg = "".join(random.choices(string.printable, k=msg_len))
        
        cipher = Gudha64Cipher(key=random_key, rounds=rounds)
        enc = cipher.encrypt(random_msg)
        dec = cipher.decrypt(enc["ciphertext_hex"])
        assert dec["plaintext"] == random_msg, f"Roundtrip failed for message length {msg_len}"
