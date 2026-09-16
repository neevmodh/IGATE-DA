#!/usr/bin/env python3
"""Validate question_bank/questions.json (and optionally a batch file) against schema.md.

Usage:
  python3 validate.py                     # validate the merged bank, print per-section counts
  python3 validate.py batches/foo.json     # validate a single batch file before merging
"""
import json
import re
import sys
from collections import Counter

SECTION_PREFIX = {
    "Probability and Statistics": "PS",
    "Linear Algebra": "LA",
    "Calculus and Optimization": "CO",
    "Programming, Data Structures & Algorithms": "PDSA",
    "Database Management & Warehousing": "DBMS",
    "Machine Learning": "ML",
    "Artificial Intelligence": "AI",
    "General Aptitude": "GA",
}
VALID_TYPES = {"MCQ", "MSQ", "NAT"}
VALID_DIFFICULTY = {"easy", "medium", "hard"}
REQUIRED_FIELDS = {"id", "section", "topic", "type", "marks", "difficulty", "question", "correct_answer", "explanation", "source", "tags"}

TARGET = {
    "Probability and Statistics": 950,
    "Machine Learning": 1050,
    "Linear Algebra": 500,
    "Calculus and Optimization": 350,
    "Programming, Data Structures & Algorithms": 500,
    "Database Management & Warehousing": 450,
    "Artificial Intelligence": 450,
    "General Aptitude": 750,
}


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def validate(questions, existing_ids=None, existing_norms=None):
    errors = []
    ids = set(existing_ids or [])
    norms = set(existing_norms or [])

    for i, q in enumerate(questions):
        loc = f"[{i}] id={q.get('id', '?')}"

        missing = REQUIRED_FIELDS - q.keys()
        if missing:
            errors.append(f"{loc}: missing fields {missing}")
            continue

        if q["section"] not in SECTION_PREFIX:
            errors.append(f"{loc}: unknown section '{q['section']}'")
        elif not q["id"].startswith("PYQ"):
            # PYQ-* ids are real past-paper questions with their own numbering scheme (PYQ<year>-Q<n>);
            # everything else (generated or freshly sourced) must use the section-code prefix.
            expected_prefix = SECTION_PREFIX[q["section"]]
            if not q["id"].startswith(expected_prefix + "-"):
                errors.append(f"{loc}: id prefix doesn't match section (expected {expected_prefix}-...)")

        if q["id"] in ids:
            errors.append(f"{loc}: duplicate id")
        ids.add(q["id"])

        if q["type"] not in VALID_TYPES:
            errors.append(f"{loc}: invalid type '{q['type']}'")

        if q["difficulty"] not in VALID_DIFFICULTY:
            errors.append(f"{loc}: invalid difficulty '{q['difficulty']}'")

        if q["marks"] not in (1, 2):
            errors.append(f"{loc}: marks must be 1 or 2, got {q['marks']}")

        ca = q["correct_answer"]
        if not isinstance(ca, list) or len(ca) == 0:
            errors.append(f"{loc}: correct_answer must be a non-empty list")

        if q["type"] == "MCQ":
            opts = q.get("options")
            if not opts or len(opts) != 4:
                errors.append(f"{loc}: MCQ must have exactly 4 options")
            if isinstance(ca, list) and len(ca) != 1:
                errors.append(f"{loc}: MCQ must have exactly 1 correct_answer")
        elif q["type"] == "MSQ":
            opts = q.get("options")
            if not opts or len(opts) < 4:
                errors.append(f"{loc}: MSQ must have at least 4 options")
            if isinstance(ca, list) and len(ca) < 2:
                errors.append(f"{loc}: MSQ must have >= 2 correct answers")
        elif q["type"] == "NAT":
            if q.get("options"):
                errors.append(f"{loc}: NAT must not have 'options'")

        if q["type"] in ("MCQ", "MSQ") and isinstance(ca, list) and q.get("options"):
            letters = {opt.strip()[0] for opt in q["options"] if opt.strip()}
            for a in ca:
                if isinstance(a, str) and a not in letters:
                    errors.append(f"{loc}: correct_answer '{a}' not among option letters {sorted(letters)}")

        norm = normalize(q["question"])
        if norm in norms:
            errors.append(f"{loc}: near-duplicate question text")
        norms.add(norm)

    return errors, ids, norms


def main():
    if len(sys.argv) > 1:
        batch_path = sys.argv[1]
        with open("questions.json") as f:
            existing = json.load(f)
        existing_ids = {q["id"] for q in existing}
        existing_norms = {normalize(q["question"]) for q in existing}
        with open(batch_path) as f:
            batch = json.load(f)
        errors, _, _ = validate(batch, existing_ids, existing_norms)
        print(f"Validated {len(batch)} questions from {batch_path}")
        if errors:
            print(f"{len(errors)} ERROR(S):")
            for e in errors[:200]:
                print("  " + e)
            sys.exit(1)
        print("OK — no errors.")
        return

    with open("questions.json") as f:
        questions = json.load(f)
    errors, _, _ = validate(questions)
    counts = Counter(q["section"] for q in questions)
    print(f"Total questions: {len(questions)}")
    print(f"{'Section':<42} {'Count':>6} {'Target':>7} {'%':>6}")
    for section, target in TARGET.items():
        c = counts.get(section, 0)
        print(f"{section:<42} {c:>6} {target:>7} {c/target*100:>5.1f}%")
    if errors:
        print(f"\n{len(errors)} ERROR(S):")
        for e in errors[:200]:
            print("  " + e)
        sys.exit(1)
    print("\nOK — no schema errors.")


if __name__ == "__main__":
    main()
