"""
Verification: HMAC authentication, uniform decrypt errors, strict UTF-8 decode.
"""

import pytest
from backend.app.cipher.engine import Gudha64Cipher


def test_hmac_roundtrip():
    cipher = Gudha64Cipher(key="AUTH_KEY", rounds=6)
    enc = cipher.encrypt("TAMPER EVIDENT DISPATCH", authenticate=True)
    assert enc["auth_tag_hex"] is not None and len(enc["auth_tag_hex"]) == 64
    dec = cipher.decrypt(enc["ciphertext_hex"], expected_tag=enc["auth_tag_hex"])
    assert dec["plaintext"] == "TAMPER EVIDENT DISPATCH"


def test_hmac_tamper_detected():
    cipher = Gudha64Cipher(key="AUTH_KEY", rounds=6)
    enc = cipher.encrypt("TAMPER EVIDENT DISPATCH", authenticate=True)
    assert enc["auth_tag_hex"]
    ct = bytearray(bytes.fromhex(enc["ciphertext_hex"]))
    ct[0] ^= 0x01
    with pytest.raises(ValueError, match="Authentication failed"):
        cipher.decrypt(ct.hex().upper(), expected_tag=enc["auth_tag_hex"])


def test_hmac_wrong_key_rejected():
    enc = Gudha64Cipher(key="RIGHT_KEY", rounds=6).encrypt("SECRET", authenticate=True)
    assert enc["auth_tag_hex"]
    with pytest.raises(ValueError, match="Authentication failed"):
        Gudha64Cipher(key="WRONG_KEY", rounds=6).decrypt(
            enc["ciphertext_hex"], expected_tag=enc["auth_tag_hex"]
        )


def test_no_tag_by_default():
    cipher = Gudha64Cipher(key="K", rounds=6)
    enc = cipher.encrypt("HELLO")
    assert enc["auth_tag_hex"] is None
    assert cipher.decrypt(enc["ciphertext_hex"])["plaintext"] == "HELLO"


def test_strict_utf8_no_latin1_fallback():
    # Non-UTF8 bytes round-trip through pad/cipher/unpad intact, so the
    # strict decode step must raise instead of returning latin1 mojibake.
    cipher = Gudha64Cipher(key="K", rounds=6)
    enc = cipher.encrypt(b"\xff\xfe\x00\x01", record_trace=False)
    with pytest.raises(ValueError, match="non-UTF8"):
        cipher.decrypt(enc["ciphertext_hex"])


def test_uniform_400_status_for_all_decrypt_failures():
    from fastapi.testclient import TestClient
    from backend.app.main import app

    client = TestClient(app)
    enc = client.post("/api/cipher/encrypt", json={
        "plaintext": "STATUS CHECK", "key": "K", "rounds": 6, "record_trace": False,
    }).json()["ciphertext_hex"]

    bad_payloads = [
        {"ciphertext_hex": "ZZZ", "key": "K", "rounds": 6},  # bad hex
        {"ciphertext_hex": "010203", "key": "K", "rounds": 6},  # unaligned
        {"ciphertext_hex": enc[:-2] + ("00" if enc[-2:] != "00" else "FF"), "key": "K", "rounds": 6},  # corrupt pad
    ]
    for payload in bad_payloads:
        res = client.post("/api/cipher/decrypt", json=payload)
        assert res.status_code == 400, payload

    # Authenticated encrypt over HTTP verifies tag on decrypt
    enc_auth = client.post("/api/cipher/encrypt", json={
        "plaintext": "TAGGED", "key": "K", "rounds": 6,
        "record_trace": False, "authenticate": True,
    }).json()
    assert enc_auth["auth_tag_hex"] and len(enc_auth["auth_tag_hex"]) == 64
    ok = client.post("/api/cipher/decrypt", json={
        "ciphertext_hex": enc_auth["ciphertext_hex"], "key": "K", "rounds": 6,
        "auth_tag_hex": enc_auth["auth_tag_hex"],
    })
    assert ok.status_code == 200 and ok.json()["plaintext"] == "TAGGED"
    bad_tag = client.post("/api/cipher/decrypt", json={
        "ciphertext_hex": enc_auth["ciphertext_hex"], "key": "K", "rounds": 6,
        "auth_tag_hex": "0" * 64,
    })
    assert bad_tag.status_code == 400
