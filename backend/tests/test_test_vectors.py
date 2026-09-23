"""
Verification Test Suite: Golden Test Vectors
Ensures strict determinism across runs and environments.
"""

from backend.app.cipher.engine import Gudha64Cipher

def test_golden_vector_arthashastra():
    key = "KAUTILYA_CHANAKYA_321BCE"
    plaintext = "ARTHASHASTRA"
    expected_ciphertext = "ED85A02064EA1DB978A186337B1584AB"
    
    cipher = Gudha64Cipher(key=key, rounds=6)
    res = cipher.encrypt(plaintext)
    assert res["ciphertext_hex"] == expected_ciphertext
    
    # Decrypt and verify matching
    dec = cipher.decrypt(expected_ciphertext)
    assert dec["plaintext"] == plaintext

def test_golden_vector_single_block():
    key = "GUDHA_LAB_KEY_V1"
    plaintext = "SECRET01"  # 8 bytes exact
    cipher = Gudha64Cipher(key=key, rounds=6)
    res = cipher.encrypt(plaintext)
    dec = cipher.decrypt(res["ciphertext_hex"])
    assert dec["plaintext"] == plaintext
