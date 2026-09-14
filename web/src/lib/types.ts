export type QType = "MCQ" | "MSQ" | "NAT";

export interface Question {
  id: string;
  section: string;
  topic: string;
  type: QType;
  marks: number;
  difficulty: string;
  question: string;
  options: string[];
  correct_answer: (string | number)[];
  explanation: string;
  source: string;
  tags: string[];
}

export interface Attempt {
  date: string;
  test_type: string;
  scope: string;
  total_questions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  marks_scored: number;
  max_marks: number;
  accuracy_pct: number;
  weak_topics: string;
}
