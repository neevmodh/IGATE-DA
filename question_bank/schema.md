# Question Bank Schema

Questions live in `question_bank/questions.json` as a JSON array. Each question:

```json
{
  "id": "ML-0001",
  "section": "Machine Learning",
  "topic": "Decision Trees",
  "type": "MCQ",
  "marks": 2,
  "difficulty": "medium",
  "question": "Question text (markdown/LaTeX allowed, use $...$ for inline math)",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correct_answer": ["B"],
  "explanation": "Full worked explanation.",
  "source": "generated | GATE DA 2024 Q23 | GATE DA 2025 Q10",
  "tags": ["entropy", "gini-index"]
}
```

Notes:
- `id` prefix = section code (PS=Probability&Stats, LA=Linear Algebra, CO=Calculus&Optimization, PDSA=Programming/DS/Algo, DBMS=Database, ML=Machine Learning, AI=Artificial Intelligence, GA=General Aptitude).
- `type`: MCQ (single correct, negative marking), MSQ (multi-select, no negative marking), NAT (numeric answer, no negative marking, `correct_answer` is a number or range).
- `options` omitted for NAT.
- `correct_answer` is always an array (single value for MCQ/NAT, multiple for MSQ).
- `source: "generated"` means AI-generated based on syllabus (not lifted from an official paper) — always disclosed, never presented as an official question.
