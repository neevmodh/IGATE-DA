# I-GATE — GATE DA (Data Science & AI) Exam Prep

Personal prep system for GATE DA 2027. Syllabus and study plan are self-managed; test generation, scoring, and progress tracking are done with Claude.

## Structure
- `docs/syllabus.md` — full syllabus + exam pattern, sourced from official GATE DA syllabus
- `past_papers/` — official past year question papers + answer keys (PDF)
- `question_bank/questions.json` — bank of practice questions (topic-tagged, see `question_bank/schema.md`)
- `scores/history.csv` — log of every test attempt (score, accuracy, weak topics)

## How tests are generated
Ask for a test by topic, chapter, or full mock (GATE-style: 65 Q, 100 marks, MCQ/MSQ/NAT, negative marking, 3 hrs). Questions are generated from the syllabus and calibrated against the official past papers in `past_papers/`. Every AI-generated question is tagged `source: generated` in the question bank (as opposed to `source: GATE DA <year> Q<n>` for real past questions used for practice/reference).

## Past papers status
- 2024: downloaded (`past_papers/GATE_DA_2024_paper.pdf`, `GATE_DA_2024_answerkey.pdf`)
- 2025: added (`past_papers/GATE_DA_2025_paper.pdf`) — no separate answer key yet
- 2026: added (`past_papers/GATE_DA_2026_paper.pdf`) — no separate answer key yet

## Score tracking
After each test, results are appended to `scores/history.csv` so weak topics can be tracked over time.
