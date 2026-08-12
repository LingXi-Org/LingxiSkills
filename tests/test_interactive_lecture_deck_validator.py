from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILL_ROOT = REPO_ROOT / "skills" / "interactive-lecture-deck"
EXAMPLE_ROOT = SKILL_ROOT / "assets" / "examples" / "quadratic-vertex"
VALIDATOR = SKILL_ROOT / "scripts" / "validate_deck.py"


class InteractiveLectureDeckValidatorTests(unittest.TestCase):
    def test_malformed_array_rect_is_reported_without_traceback(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "deck"
            project.mkdir()
            for source in EXAMPLE_ROOT.rglob("*"):
                if source.is_file() and source.name != "lecture.html":
                    target = project / source.relative_to(EXAMPLE_ROOT)
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_bytes(source.read_bytes())

            lecture_path = project / "lecture.json"
            lecture = json.loads(lecture_path.read_text(encoding="utf-8"))
            anchor = next(slide["anchors"][0] for slide in lecture["slides"] if slide["anchors"])
            rect = anchor["rect"]
            anchor["rect"] = [rect["x"], rect["y"], rect["w"], rect["h"]]
            lecture_path.write_text(json.dumps(lecture, ensure_ascii=False), encoding="utf-8")

            result = subprocess.run(
                [sys.executable, str(VALIDATOR), str(project), "--strict", "--json"],
                capture_output=True,
                text=True,
                check=False,
            )

            self.assertEqual(result.returncode, 1)
            self.assertNotIn("Traceback", result.stdout + result.stderr)
            report = json.loads(result.stdout)
            self.assertTrue(any("不要使用 [x, y, w, h] 数组" in error for error in report["errors"]))


if __name__ == "__main__":
    unittest.main()
