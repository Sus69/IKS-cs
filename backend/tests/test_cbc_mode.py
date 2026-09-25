"""
Verification: CBC block mode (opt-in chaining, ECB remains default).
"""

import pytest
from backend.app.cipher.engine import Gudha64Cipher


def test_ecb_default_preserved():
    cipher = Gudha64Cipher(key="KAUTILYA_CHANAKYA_321BCE", rounds=6)
    res = cipher.encrypt("ARTHASHASTRA")
    assert res["mode"] == "ecb"
    assert res["iv_hex"] is None
    assert res["ciphertext_hex"] == "ED85A02064EA1DB978A186337B1584AB"


def test_cbc_roundtrip():
    cipher = Gudha64Cipher(key="CBC_TEST_KEY", rounds=6)
    enc = cipher.encrypt("CONFIDENTIAL DISPATCH FOR MAGADHA", mode="cbc")
    assert enc["mode"] == "cbc"
    assert enc["iv_hex"] is not None and len(enc["iv_hex"]) == 16
    dec = cipher.decrypt(enc["ciphertext_hex"], mode="cbc", iv_hex=enc["iv_hex"])
    assert dec["plaintext"] == "CONFIDENTIAL DISPATCH FOR MAGADHA"


def test_cbc_hides_repeated_blocks():
    cipher = Gudha64Cipher(key="CBC_REPEAT_KEY", rounds=6)
    enc_ecb = cipher.encrypt("AAAAAAAAAAAAAAAA", mode="ecb")
    # ECB: first two 8-byte blocks identical
    assert enc_ecb["ciphertext_hex"][:16] == enc_ecb["ciphertext_hex"][16:32]
    enc_cbc = cipher.encrypt("AAAAAAAAAAAAAAAA", mode="cbc", iv_hex="0011223344556677")
    # CBC with fixed IV: identical plaintext blocks diverge
    assert enc_cbc["ciphertext_hex"][:16] != enc_cbc["ciphertext_hex"][16:32]


def test_cbc_random_iv_differs():
    cipher = Gudha64Cipher(key="CBC_IV_KEY", rounds=6)
    enc1 = cipher.encrypt("SAME MESSAGE", mode="cbc")
    enc2 = cipher.encrypt("SAME MESSAGE", mode="cbc")
    assert enc1["iv_hex"] != enc2["iv_hex"] or enc1["ciphertext_hex"] != enc2["ciphertext_hex"]
    # Both still decrypt
    assert cipher.decrypt(enc1["ciphertext_hex"], mode="cbc", iv_hex=enc1["iv_hex"])["plaintext"] == "SAME MESSAGE"
    assert cipher.decrypt(enc2["ciphertext_hex"], mode="cbc", iv_hex=enc2["iv_hex"])["plaintext"] == "SAME MESSAGE"


def test_cbc_requires_iv_on_decrypt():
    cipher = Gudha64Cipher(key="K", rounds=6)
    enc = cipher.encrypt("HELLO WORLD", mode="cbc")
    with pytest.raises(ValueError):
        cipher.decrypt(enc["ciphertext_hex"], mode="cbc", iv_hex=None)
    with pytest.raises(ValueError):
        cipher.decrypt(enc["ciphertext_hex"], mode="cbc", iv_hex="ZZZ")
    with pytest.raises(ValueError):
        cipher.decrypt(enc["ciphertext_hex"], mode="cbc", iv_hex="0011")


def test_invalid_mode_rejected():
    cipher = Gudha64Cipher(key="K", rounds=6)
    with pytest.raises(ValueError):
        cipher.encrypt("HELLO", mode="ctr")
    with pytest.raises(ValueError):
        cipher.decrypt("0011223344556677", mode="ctr")


def test_cbc_api_roundtrip():
    from fastapi.testclient import TestClient
    from backend.app.main import app

    client = TestClient(app)
    enc_res = client.post("/api/cipher/encrypt", json={
        "plaintext": "CBC OVER HTTP",
        "key": "HTTP_CBC_KEY",
        "rounds": 6,
        "record_trace": False,
        "mode": "cbc",
    })
    assert enc_res.status_code == 200
    enc = enc_res.json()
    assert enc["mode"] == "cbc" and enc["iv_hex"]

    dec_res = client.post("/api/cipher/decrypt", json={
        "ciphertext_hex": enc["ciphertext_hex"],
        "key": "HTTP_CBC_KEY",
        "rounds": 6,
        "record_trace": False,
        "mode": "cbc",
        "iv_hex": enc["iv_hex"],
    })
    assert dec_res.status_code == 200
    assert dec_res.json()["plaintext"] == "CBC OVER HTTP"

    # Missing IV in CBC decrypt must fail cleanly with uniform 400
    bad_res = client.post("/api/cipher/decrypt", json={
        "ciphertext_hex": enc["ciphertext_hex"],
        "key": "HTTP_CBC_KEY",
        "rounds": 6,
        "mode": "cbc",
    })
    assert bad_res.status_code == 400
