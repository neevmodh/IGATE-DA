# Question bank build-out progress (toward 5000 target)

Target distribution (see `validate.py`'s `TARGET` dict — proportional to real GATE DA exam weighting):

| Section | Target | Current | Status |
|---|---:|---:|---|
| Probability and Statistics | 950 | 30 | **Not started — wave 1 batch was killed mid-run before writing output, needs a fresh run** |
| Machine Learning | 1050 | 170 | Wave 1 done |
| Linear Algebra | 500 | 137 | Wave 1 done |
| Calculus and Optimization | 350 | 114 | Wave 1 done |
| Programming, Data Structures & Algorithms | 500 | 146 | Wave 1 done |
| Database Management & Warehousing | 450 | 137 | Wave 1 done |
| Artificial Intelligence | 450 | 136 | Wave 1 done |
| General Aptitude | 750 | 161 | Wave 1 done |
| **Total** | **5000** | **1031** | |

## Open item: PS wave 1

Wave 1 (2026-09-16) launched 8 parallel agents, one per section, each writing ~100-150 questions to `question_bank/batches/<SECTION>-batch1.json`. The PS (Probability and Statistics) agent was stopped by the user before it produced any output file — it never got to `batches/PS-batch1.json`, unlike GA which had already finished writing (150 questions, later validated and merged) even though its handback report hadn't arrived yet.

**Next step:** re-run a PS batch (same brief as the other wave-1 agents — see the git history / this session's transcript for the exact prompt used, or reconstruct from `question_bank/schema.md` + the PS topic list in `web/src/data/syllabus.json`) targeting ~150 questions to start, then continue in further batches toward the 950 target. This is the most under-filled section relative to target (3.2%) alongside General Aptitude (21.5%) and Machine Learning (16.2%) — Probability & Statistics and Machine Learning carry the most exam weight, so they should be prioritized in the next wave.

## Process for future batches

1. Launch parallel `general-purpose` agents (subagent per section or topic-cluster), each briefed with: exact syllabus topic list (from `web/src/data/syllabus.json`), the schema (`question_bank/schema.md`), target type/marks/difficulty mix, and an explicit instruction to hand-verify every computed answer before writing.
2. Each agent writes ONLY a raw JSON array to `question_bank/batches/<SECTION>-batchN.json`.
3. Validate each batch: `python3 question_bank/validate.py batches/<file>.json`.
4. Merge into `question_bank/questions.json`, copy to `web/src/data/questions.json`, re-run `python3 question_bank/validate.py` (no-arg form) to confirm 0 errors and see updated per-section counts.
5. `cd web && npx tsc --noEmit -p tsconfig.json` to confirm the app still type-checks.
6. Archive processed batch files into `question_bank/batches/done/`.
7. Update the table above.
