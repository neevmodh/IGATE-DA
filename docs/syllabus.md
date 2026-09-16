# GATE DA (Data Science & Artificial Intelligence) Syllabus

Source: Official GATE DA syllabus, verbatim (cross-checked against the GATE 2027 syllabus hosted by IIT Madras via GeeksforGeeks, Sept 2026, and confirmed against a screenshot of the official syllabus document). Re-verify each year against the official GATE portal (the hosting IIT rotates), since sections can be added or reworded.

## Exam Pattern
| Aspect | Details |
|---|---|
| Duration | 3 hours |
| Mode | Online CBT |
| Total Marks | 100 |
| Total Questions | 65 |
| General Aptitude | 10 questions, 15 marks |
| Core Subject | 55 questions, 85 marks |
| Question Types | MCQ, MSQ, NAT |

**Marking:**
- General Aptitude: 5 × 1 mark + 5 × 2 marks
- Core Subject: 25 × 1 mark + 30 × 2 marks
- Negative marking (MCQ only): −1/3 for 1-mark, −2/3 for 2-mark
- No negative marking for MSQ or NAT

## Sections

### 1. Probability and Statistics
Counting (permutation and combinations), probability axioms, sample space, events, independent events, mutually exclusive events, marginal/conditional/joint probability, Bayes theorem, conditional expectation and variance, mean/median/mode/standard deviation, correlation and covariance, random variables, discrete random variables and probability mass functions, uniform/Bernoulli/binomial distributions, continuous random variables and probability distribution function, uniform/exponential/Poisson/normal/standard normal distributions, t-distribution, chi-squared distribution, cumulative distribution function, conditional PDF, central limit theorem, confidence interval, z-test, t-test, chi-squared test.

### 2. Linear Algebra
Vector space, subspaces, linear dependence and independence of vectors, matrices, projection matrix, orthogonal matrix, idempotent matrix, partition matrix and its properties, quadratic forms, systems of linear equations and solutions, Gaussian elimination, eigenvalues and eigenvectors, determinant, rank, nullity, projections, LU decomposition, singular value decomposition (SVD).

### 3. Calculus and Optimization
Functions of a single variable, limit, continuity, differentiability, Taylor series, maxima and minima, optimization involving a single variable.

**Note:** this section is single-variable only in the official syllabus — multivariable calculus, gradient descent, and constrained optimization are not literal syllabus items here (though gradient descent is implicit in how neural nets are trained under Machine Learning).

### 4. Programming, Data Structures & Algorithms
Programming in Python, basic data structures (stacks, queues, linked lists, trees, hash tables), search algorithms (linear search, binary search), basic sorting algorithms (selection sort, bubble sort, insertion sort), divide-and-conquer (merge sort, quicksort), introduction to graph theory, basic graph algorithms (traversals, shortest path).

### 5. Database Management & Warehousing
ER model, relational model (relational algebra, tuple calculus), SQL, integrity constraints, normal forms, file organization, indexing, data types, data transformation (normalization, discretization, sampling, compression), data warehouse modelling (schema for multidimensional data models, concept hierarchies, measures — categorization and computations).

### 6. Machine Learning
- **Supervised learning:** regression and classification problems, simple linear regression, multiple linear regression, ridge regression, logistic regression, k-nearest neighbour, naive Bayes classifier, linear discriminant analysis (LDA), support vector machine (SVM), decision trees, bias-variance trade-off, cross-validation (leave-one-out, k-folds), multi-layer perceptron, feedforward neural network.
- **Unsupervised learning:** clustering algorithms, k-means/k-medoid, hierarchical clustering (single-linkage, multiple-linkage top-down/bottom-up), dimensionality reduction, principal component analysis (PCA).

### 7. Artificial Intelligence
Search: informed, uninformed, adversarial. Logic: propositional, predicate. Reasoning under uncertainty: conditional independence representation, exact inference through variable elimination, approximate inference through sampling.

### General Aptitude
Verbal ability, quantitative aptitude, analytical reasoning.

## Weightage Notes (from official pattern + past papers)
- Machine Learning (~21%) and Probability & Statistics (~19%) carry the heaviest weight — together roughly 38–42% of total marks.
- Linear Algebra and Programming/DSA are consistently well-represented.
- All 3 released past papers (2024, 2025, 2026) have been checked question-by-question against this syllabus — nothing tested so far falls outside the literal syllabus wording above (e.g. ridge regression/regularization questions map directly to the "ridge regression" syllabus item, not to an off-syllabus "L1/L2 regularization" topic).
- Revisit and re-verify this section as each new past paper is released.
