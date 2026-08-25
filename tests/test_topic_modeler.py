import unittest
from src.nlp.topic_modeler import run_lda, run_nmf

class TestTopicModeler(unittest.TestCase):
    def setUp(self):
        self.sample_texts = [
            "gravitasi bumi menarik semua benda bermassa",
            "kecepatan cahaya adalah konstanta universal dalam fisika",
            "lubang hitam memiliki gravitasi yang sangat kuat",
            "foton adalah partikel dasar pembawa gelombang elektromagnetik",
            "teori relativitas einstein menjelaskan ruang dan waktu",
            "mekanika kuantum mempelajari perilaku partikel subatomik"
        ]

    def test_run_lda(self):
        lda, vec, topics = run_lda(self.sample_texts, n_topics=2, max_features=50)
        self.assertIsNotNone(lda)
        self.assertEqual(len(topics), 2)
        self.assertIn("top_words", topics[0])
        self.assertTrue(len(topics[0]["top_words"]) > 0)

    def test_run_nmf(self):
        nmf, vec, topics = run_nmf(self.sample_texts, n_topics=2, max_features=50)
        self.assertIsNotNone(nmf)
        self.assertEqual(len(topics), 2)
        self.assertIn("top_words", topics[0])

    def test_empty_input(self):
        lda, vec, topics = run_lda([])
        self.assertIsNone(lda)
        self.assertEqual(len(topics), 0)

if __name__ == '__main__':
    unittest.main()
