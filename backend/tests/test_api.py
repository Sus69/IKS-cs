"""
Verification Test Suite: API Integration Tests
"""

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["engine"] == "GŪḌHA-64 SPN"

def test_api_encrypt_decrypt_roundtrip():
    payload = {
        "plaintext": "GUDHA ENCRYPTION OVER API",
        "key": "KAUTILYA_API_SECRET",
        "rounds": 6,
        "record_trace": True
    }
    enc_res = client.post("/api/cipher/encrypt", json=payload)
    assert enc_res.status_code == 200
    enc_data = enc_res.json()
    assert "ciphertext_hex" in enc_data
    assert len(enc_data["derivation_trace"]) > 0

    dec_payload = {
        "ciphertext_hex": enc_data["ciphertext_hex"],
        "key": "KAUTILYA_API_SECRET",
        "rounds": 6,
        "record_trace": False
    }
    dec_res = client.post("/api/cipher/decrypt", json=dec_payload)
    assert dec_res.status_code == 200
    dec_data = dec_res.json()
    assert dec_data["plaintext"] == payload["plaintext"]

def test_api_cipher_components():
    res = client.get("/api/cipher/components")
    assert res.status_code == 200
    data = res.json()
    assert data["block_size_bits"] == 64
    assert data["sbox_parivartana"]["is_bijective"] is True

def test_api_avalanche():
    res = client.post("/api/analysis/avalanche", json={
        "plaintext": "AVALANCHE_TEST",
        "key": "TEST_KEY",
        "rounds": 6
    })
    assert res.status_code == 200
    data = res.json()
    assert "block_avalanche_percentage" in data

def test_api_history_endpoints():
    res = client.get("/api/history/context")
    assert res.status_code == 200
    assert "three_tier_demarcation" in res.json()

    res_ch = client.get("/api/history/arthashastra-chapters")
    assert res_ch.status_code == 200
    assert len(res_ch.json()) >= 3
