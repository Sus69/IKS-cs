"""
API Endpoints: Historical Foundation & Academic Demarcation
"""

from fastapi import APIRouter

router = APIRouter(prefix="/history", tags=["History & IKS"])

@router.get("/context")
def get_historical_context():
    """
    Returns the rigorous three-tier historical and cryptographic demarcation.
    """
    return {
        "project_name": "GŪḌHA (गूढ)",
        "project_title": "Arthaśāstra-Inspired Symmetric Cipher System",
        "academic_disclaimer": (
            "GŪḌHA is an educational experimental cipher inspired by the Arthaśāstra's "
            "tradition of secret communication (gūḍhalekhya). It does NOT claim to reproduce "
            "an ancient cipher algorithm, nor is it intended as a replacement for standardized "
            "modern cryptographic algorithms (such as AES-GCM or ChaCha20-Poly1305)."
        ),
        "three_tier_demarcation": {
            "tier_1_historical_fact": {
                "title": "Historical Arthaśāstra Grounding",
                "description": (
                    "Kauṭilya's Arthaśāstra (Book 1, Ch 16 & Book 2, Ch 10) explicitly documents "
                    "the requirement for gūḍhalekhya (cipher-writing / coded letters) to protect "
                    "intelligence in transit. Secret agents (gūḍhapuruṣa) operated in compartmentalized "
                    "zero-knowledge cells to mitigate systemic betrayal."
                ),
                "citations": [
                    "Kangle, R. P. (1965). The Kauṭilīya Arthaśāstra: Critical Edition and Translation. University of Bombay.",
                    "Olivelle, Patrick (2013). King, Governance, and Law in Ancient India: Kauṭilya's Arthaśāstra. Oxford University Press.",
                    "Trautmann, Thomas R. (1971). Kauṭilya and the Arthaśāstra: A Statistical Investigation of the Authorship and Evolution of the Text. E.J. Brill."
                ]
            },
            "tier_2_modern_concepts": {
                "title": "Modern Cryptographic Foundations",
                "description": (
                    "Claude Shannon's 1949 Communication Theory of Secrecy Systems: Confusion and Diffusion; "
                    "Substitution-Permutation Networks (SPN); Key Schedules; Avalanche Behavior; "
                    "Finite field and ring algebra (Z_256)."
                ),
                "citations": [
                    "Shannon, C. E. (1949). Communication Theory of Secrecy Systems. Bell System Technical Journal, 28(4), 656–715.",
                    "Daemen, J., & Rijmen, V. (2002). The Design of Rijndael: AES - The Advanced Encryption Standard. Springer."
                ]
            },
            "tier_3_computational_design": {
                "title": "Our Original Computational Implementation",
                "description": (
                    "GŪḌHA-64: A 64-bit SPN block cipher featuring Parivartana (8-bit non-linear S-Box), "
                    "Krama (8x8 bit transposition and cyclic rotation), Miśraṇa (invertible Z_256 matrix diffusion), "
                    "and Vistāra (128-bit key schedule seeded by mathematical constants)."
                )
            }
        },
        "sanskrit_glossary": [
            {
                "term": "Gūḍha (गूढ)",
                "meaning": "Hidden, concealed, secret, enigmatic."
            },
            {
                "term": "Gūḍhalekhya (गूढलेख्य)",
                "meaning": "Secret dispatches, cipher-writing, encrypted correspondence."
            },
            {
                "term": "Gūḍhapuruṣa (गूढपुरुष)",
                "meaning": "Secret agents, covert intelligence officers."
            },
            {
                "term": "Parivartana (परिवर्तन)",
                "meaning": "Non-linear byte substitution (Confusion / S-Box)."
            },
            {
                "term": "Krama (क्रम)",
                "meaning": "Sequential permutation / bit-matrix transposition (Diffusion)."
            },
            {
                "term": "Miśraṇa (मिश्रण)",
                "meaning": "Linear modular matrix diffusion / mixing."
            },
            {
                "term": "Vistāra (विस्तार)",
                "meaning": "Expansion / Key schedule deriving distinct round subkeys."
            },
            {
                "term": "Yoga (योग)",
                "meaning": "Key addition / bitwise XOR integration."
            }
        ]
    }

@router.get("/arthashastra-chapters")
def get_arthashastra_chapters():
    """
    Returns authentic chapter summaries from the Arthaśāstra related to covert communications.
    """
    return [
        {
            "book": "Book 1 (Vinayādhikārikam - Concerning Discipline)",
            "chapter": "Chapter 16: Dūtapraṇidhiḥ (Rules for Envoys)",
            "sanskrit_reference": "गूढलेख्यं वा प्रेषयेत् । (1.16.29)",
            "translation": (
                "Or an envoy shall dispatch confidential correspondence written in code (gūḍhalekhya), "
                "or transmit oral information through confidential double agents disguised as ascetics, "
                "physicians, or merchants."
            ),
            "relevance": "Direct textual proof of statecraft-directed secret writing in ancient India."
        },
        {
            "book": "Book 1",
            "chapter": "Chapter 11–12: Gūḍhapuruṣa-utpattiḥ (Establishment of Secret Agents)",
            "sanskrit_reference": "परस्परमविज्ञाताः संचरेयुः । (1.12.7)",
            "translation": (
                "Secret agents must move about unknown to one another, so that betrayal by one "
                "shall not jeopardize the intelligence apparatus."
            ),
            "relevance": "Inspiration for zero-knowledge key isolation and distinct round keys in the key schedule."
        },
        {
            "book": "Book 2 (Adhyakṣapracāraḥ - The Activities of Heads of Departments)",
            "chapter": "Chapter 10: Śāsanādhikāra (The Royal Decrees and Edicts)",
            "sanskrit_reference": "शासनप्रमाणं हि यतः सर्वम् । (2.10.3)",
            "translation": (
                "For on royal writs rests the entire administration of treaties, war, and alliance. "
                "Therefore, scribes must avoid omissions, errors of transposition (akṣaraviparyāsa), "
                "and unauthorized copying."
            ),
            "relevance": "Early understanding of transmission integrity and textual tampering."
        }
    ]
