"""
Verification: benchmark defaults are quick, explicit sizes are clamped,
invalid rounds are rejected, and the HTTP contract carries the scope flag.
"""

import pytest
from backend.app.analysis.benchmark import benchmark_cipher_performance


def test_benchmark_default_is_quick_matrix():
    res = benchmark_cipher_performance(rounds=4)
    assert [r["size_bytes"] for r in res["results"]] == [64, 256, 1024]
    assert res["full"] is False


def test_benchmark_explicit_sizes_clamped():
    res = benchmark_cipher_performance(sizes_bytes=[1, 100000, 8, 8, 8, 8, 8, 8], rounds=2)
    sizes = [r["size_bytes"] for r in res["results"]]
    assert sizes == [8, 65536, 8, 8, 8]  # clamped to [8, 65536], max 5 entries


def test_benchmark_invalid_rounds_rejected():
    with pytest.raises(ValueError):
        benchmark_cipher_performance(rounds=99)


def test_benchmark_api_contract():
    from fastapi.testclient import TestClient
    from backend.app.main import app

    client = TestClient(app)
    ok = client.get("/api/analysis/benchmark", params={"rounds": 6})
    assert ok.status_code == 200
    data = ok.json()
    assert len(data["results"]) == 3
    assert data["full"] is False

    bad = client.get("/api/analysis/benchmark", params={"rounds": 99})
    assert bad.status_code == 400
