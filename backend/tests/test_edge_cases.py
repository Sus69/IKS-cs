"""
Verification Test Suite: Edge Cases, Multibyte Unicode, Wrong Keys, Malformed Inputs
"""

import pytest
from backend.app.cipher.engine import Gudha64Cipher

def test_empty_string():
    key = "GUDHA_TEST_KEY"
    cipher = Gudha64Cipher(key=key, rounds=6)
    enc = cipher.encrypt("")
    # PKCS#7 pads empty string to exactly one 8-byte block of value 0x08
    assert enc["block_count"] == 1
    assert len(enc["ciphertext_hex"]) == 16  # 8 bytes = 16 hex chars
    dec = cipher.decrypt(enc["ciphertext_hex"])
    assert dec["plaintext"] == ""

def test_single_character():
    key = "GUDHA_TEST_KEY"
    cipher = Gudha64Cipher(key=key, rounds=6)
    enc = cipher.encrypt("A")
    assert enc["block_count"] == 1
    dec = cipher.decrypt(enc["ciphertext_hex"])
    assert dec["plaintext"] == "A"

def test_exact_block_size():
    key = "GUDHA_TEST_KEY"
    cipher = Gudha64Cipher(key=key, rounds=6)
    exact_8 = "12345678"
    enc = cipher.encrypt(exact_8)
    # PKCS#7 appends a full 8-byte padding block of 0x08 -> 2 blocks total
    assert enc["block_count"] == 2
    dec = cipher.decrypt(enc["ciphertext_hex"])
    assert dec["plaintext"] == exact_8

def test_sanskrit_unicode_characters():
    key = "कौटिल्य"
    sanskrit_text = "गूढलेख्यम् अर्थशास्त्रस्य गुह्यं तत्त्वम् । गुप्तचराणां संवादः ॥"
    cipher = Gudha64Cipher(key=key, rounds=6)
    enc = cipher.encrypt(sanskrit_text)
    dec = cipher.decrypt(enc["ciphertext_hex"])
    assert dec["plaintext"] == sanskrit_text

def test_wrong_key_fails_decryption():
    key_correct = "CORRECT_PASSPHRASE"
    key_wrong = "WRONG_PASSPHRASE"
    plaintext = "CONFIDENTIAL DISPATCH FOR MAGADHA"
    
    cipher_enc = Gudha64Cipher(key=key_correct, rounds=6)
    cipher_wrong = Gudha64Cipher(key=key_wrong, rounds=6)
    
    enc = cipher_enc.encrypt(plaintext)
    
    # Decrypting with wrong key should either raise ValueError (due to corrupt PKCS#7 pad)
    # or return completely garbled text, never the original plaintext.
    try:
        dec = cipher_wrong.decrypt(enc["ciphertext_hex"])
        assert dec["plaintext"] != plaintext
    except ValueError:
        # Expected behavior: corrupted padding detection
        pass

def test_invalid_hex_ciphertext():
    cipher = Gudha64Cipher(key="TEST", rounds=6)
    with pytest.raises(ValueError):
        cipher.decrypt("NOT_A_HEX_STRING!!!")

def test_unaligned_ciphertext_length():
    cipher = Gudha64Cipher(key="TEST", rounds=6)
    with pytest.raises(ValueError):
        cipher.decrypt("010203")  # Not a multiple of 16 hex chars (8 bytes)
