"""
Verification Test Suite: Analysis Module
"""

from backend.app.analysis.avalanche import analyze_avalanche
from backend.app.analysis.sensitivity import analyze_key_sensitivity, analyze_plaintext_sensitivity
from backend.app.analysis.frequency import analyze_frequency_distribution
from backend.app.analysis.benchmark import benchmark_cipher_performance
from backend.app.analysis.cryptanalysis import demo_weak_vs_strong_frequency, demo_controlled_brute_force

def test_avalanche_analysis():
    res = analyze_avalanche("KAUTILYA_ARTHASHASTRA", "TEST_KEY", rounds=6)
    assert "block_avalanche_percentage" in res
    assert 35.0 <= res["block_avalanche_percentage"] <= 65.0
    assert len(res["round_progression"]) == 7  # round 0 to 6

def test_sensitivity_analysis():
    key_res = analyze_key_sensitivity("HELLO WORLD", "KEY_A", "KEY_B", rounds=4)
    assert key_res["sensitivity_percentage"] > 30.0

    pt_res = analyze_plaintext_sensitivity("HELLO WORLD", "HELLO WORLE", "KEY", rounds=4)
    assert pt_res["perturbed_block_percentage"] > 35.0

def test_frequency_analysis():
    pt = "A" * 100
    ct_hex = "A1B2C3D4E5F60718" * 12
    res = analyze_frequency_distribution(pt, ct_hex)
    assert res["plaintext_entropy"] < 1.0  # repeating 'A' has 0 entropy
    assert res["ciphertext_entropy"] > 2.0

def test_benchmark_analysis():
    res = benchmark_cipher_performance([64, 256], rounds=4)
    assert len(res["results"]) == 2
    assert res["results"][0]["encrypt_time_ms"] > 0

def test_cryptanalysis_demos():
    freq_demo = demo_weak_vs_strong_frequency("TESTING FREQUENCY LEAKAGE")
    assert "weak_mode" in freq_demo
    assert "gudha_mode" in freq_demo

    bf_demo = demo_controlled_brute_force(target_pin=25, keyspace_bits=6)  # 64 keys
    assert bf_demo["recovered_key"] == "PIN_0025"
    assert bf_demo["attempts_made"] == 26
