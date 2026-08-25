import unittest
import os
import pandas as pd

class TestAnnotationPipeline(unittest.TestCase):
    def test_pilot_annotation_file_exists(self):
        pilot_path = "reports/annotation_pilot.csv"
        self.assertTrue(os.path.exists(pilot_path), "Pilot annotation CSV must exist")
        df = pd.read_csv(pilot_path)
        required_cols = [
            "comment_id", "video_id", "parent_id", "text",
            "predicted_discourse_act", "human_annotator_1",
            "human_annotator_2", "adjudicated_label"
        ]
        for col in required_cols:
            self.assertIn(col, df.columns)
        self.assertGreater(len(df), 500, "Pilot sample should contain at least 500 rows")

    def test_codebook_exists(self):
        codebook_path = "docs/discourse_codebook_v1.md"
        self.assertTrue(os.path.exists(codebook_path), "Discourse codebook must exist")
        with open(codebook_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("QUESTION", content)
        self.assertIn("CORRECTION", content)
        self.assertIn("SUGGESTION", content)

if __name__ == '__main__':
    unittest.main()
