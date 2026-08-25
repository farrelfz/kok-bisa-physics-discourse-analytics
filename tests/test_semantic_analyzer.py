import unittest
import numpy as np
from src.nlp.semantic_analyzer import calculate_cosine_similarity, calculate_semantic_diversity

class TestSemanticAnalyzer(unittest.TestCase):
    def test_cosine_similarity_identical(self):
        vec_a = np.array([[1.0, 0.0, 0.0]])
        vec_b = np.array([[1.0, 0.0, 0.0]])
        sim = calculate_cosine_similarity(vec_a, vec_b)
        self.assertAlmostEqual(float(sim[0][0]), 1.0, places=4)

    def test_cosine_similarity_orthogonal(self):
        vec_a = np.array([[1.0, 0.0, 0.0]])
        vec_b = np.array([[0.0, 1.0, 0.0]])
        sim = calculate_cosine_similarity(vec_a, vec_b)
        self.assertAlmostEqual(float(sim[0][0]), 0.0, places=4)

    def test_semantic_diversity_range(self):
        embeddings = np.random.randn(20, 384)
        div = calculate_semantic_diversity(embeddings)
        self.assertGreaterEqual(div, 0.0)
        self.assertLessEqual(div, 2.0)

    def test_empty_embeddings(self):
        sim = calculate_cosine_similarity(np.array([]), np.array([]))
        self.assertEqual(len(sim), 0)

if __name__ == '__main__':
    unittest.main()
