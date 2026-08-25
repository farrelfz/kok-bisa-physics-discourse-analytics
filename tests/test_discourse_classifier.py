import unittest
import os
from src.nlp.discourse_classifier import classify_discourse, DISCOURSE_LABELS, rule_based_classify

class TestDiscourseClassifier(unittest.TestCase):
    def setUp(self):
        # Force rule-based fallback for fast deterministic CPU unit tests
        os.environ["FORCE_RULE_BASED"] = "1"

    def test_labels_exist(self):
        self.assertEqual(len(DISCOURSE_LABELS), 8)
        self.assertIn("Question", DISCOURSE_LABELS)
        self.assertIn("Opinion", DISCOURSE_LABELS)
        self.assertIn("Disagreement", DISCOURSE_LABELS)
        self.assertIn("Correction", DISCOURSE_LABELS)
        self.assertIn("Suggestion", DISCOURSE_LABELS)
        self.assertIn("Praise", DISCOURSE_LABELS)
        self.assertIn("Agreement", DISCOURSE_LABELS)
        self.assertIn("Experience", DISCOURSE_LABELS)

    def test_empty_string(self):
        label, scores = classify_discourse("")
        self.assertEqual(label, "Opinion")
        self.assertEqual(len(scores), 8)

    def test_question_detection(self):
        label, _ = classify_discourse("Kenapa langit berwarna biru min?")
        self.assertEqual(label, "Question")

    def test_praise_detection(self):
        label, _ = classify_discourse("Keren banget videonya min, mantap penjelasannya!")
        self.assertEqual(label, "Praise")

    def test_agreement_detection(self):
        label, _ = classify_discourse("Saya sangat setuju dan sependapat dengan teori tersebut.")
        self.assertEqual(label, "Agreement")

    def test_suggestion_detection(self):
        label, _ = classify_discourse("Min tolong bahas dong tentang kuantum teleportasi request ya.")
        self.assertEqual(label, "Suggestion")

    def test_disagreement_detection(self):
        label, _ = classify_discourse("Saya tidak setuju, itu kurang pas penjelasannya.")
        self.assertEqual(label, "Disagreement")

    def test_experience_detection(self):
        label, _ = classify_discourse("Pengalaman saya dulu waktu kecil juga pernah mengalami hal serupa.")
        self.assertEqual(label, "Experience")

    def test_correction_detection(self):
        label, _ = classify_discourse("Koreksi sedikit di menit ke-3 sebenarnya rumusnya berbeda.")
        self.assertEqual(label, "Correction")

if __name__ == '__main__':
    unittest.main()
