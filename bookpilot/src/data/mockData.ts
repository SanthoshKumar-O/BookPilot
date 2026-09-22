import type {
  Resource,
  Chapter,
  Concept,
  Highlight,
  Note,
  Bookmark,
  Quiz,
  CodingProblem,
  StudyPlan,
  LearningActivity,
  ProgressAnalytics,
  AISession
} from '../types';

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 'res-ml-python',
    title: 'Machine Learning with Python & Scikit-Learn',
    author: 'Sebastian Raschka & Vahid Mirjalili',
    type: 'pdf',
    status: 'in_progress',
    totalPages: 580,
    totalChapters: 12,
    completedChapters: 2,
    progress: 25,
    currentChapterId: 'ch-3',
    currentSectionId: 'sec-3-2',
    lastOpenedAt: '10 minutes ago',
    description: 'A comprehensive guide to building machine learning and deep learning models with scikit-learn, TensorFlow, and PyTorch.',
    tags: ['Machine Learning', 'Python', 'Scikit-Learn', 'Math'],
    estimatedRemainingMinutes: 340,
    totalReadingMinutes: 185,
    quizAverageScore: 88,
    processingSteps: [
      { id: '1', name: 'Upload complete', status: 'completed', description: 'File received (14.2 MB)' },
      { id: '2', name: 'Extracting content', status: 'completed', description: '580 pages extracted and parsed' },
      { id: '3', name: 'Detecting chapters', status: 'completed', description: '12 chapters identified' },
      { id: '4', name: 'Analyzing concepts', status: 'completed', description: '48 technical concepts mapped' },
      { id: '5', name: 'Creating searchable knowledge', status: 'completed', description: 'Semantic embeddings indexed' },
      { id: '6', name: 'Finalizing reader', status: 'completed', description: 'Reader environment ready' }
    ]
  },
  {
    id: 'res-ddia',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    type: 'epub',
    status: 'in_progress',
    totalPages: 616,
    totalChapters: 12,
    completedChapters: 5,
    progress: 42,
    currentChapterId: 'ch-ddia-6',
    currentSectionId: 'sec-ddia-6-1',
    lastOpenedAt: '2 hours ago',
    description: 'The big ideas behind reliable, scalable, and maintainable systems: data models, distributed storage, replication, and partitioning.',
    tags: ['Distributed Systems', 'Databases', 'Architecture', 'Backend'],
    estimatedRemainingMinutes: 420,
    totalReadingMinutes: 310,
    quizAverageScore: 92,
    processingSteps: [
      { id: '1', name: 'Upload complete', status: 'completed', description: 'EPUB validated' },
      { id: '2', name: 'Extracting content', status: 'completed', description: 'Complete text and diagram mapping' },
      { id: '3', name: 'Detecting chapters', status: 'completed', description: '12 chapters found' },
      { id: '4', name: 'Analyzing concepts', status: 'completed', description: '64 system concepts cataloged' },
      { id: '5', name: 'Creating searchable knowledge', status: 'completed', description: 'Vectors generated' },
      { id: '6', name: 'Finalizing reader', status: 'completed', description: 'Ready' }
    ]
  },
  {
    id: 'res-dsa-go',
    title: 'Data Structures & Algorithms in Go',
    author: 'Hemant Jain',
    type: 'url',
    status: 'completed',
    totalPages: 340,
    totalChapters: 8,
    completedChapters: 8,
    progress: 100,
    currentChapterId: 'ch-dsa-8',
    currentSectionId: 'sec-dsa-8-2',
    lastOpenedAt: 'Yesterday',
    description: 'Practical guide to fundamental algorithms, data structures, trees, dynamic programming, and complexity analysis using modern Go.',
    tags: ['Algorithms', 'Go', 'Data Structures', 'CS Fundamentals'],
    estimatedRemainingMinutes: 0,
    totalReadingMinutes: 260,
    quizAverageScore: 95,
    processingSteps: [
      { id: '1', name: 'Upload complete', status: 'completed', description: 'URL fetched' },
      { id: '2', name: 'Extracting content', status: 'completed', description: 'Content sanitized' },
      { id: '3', name: 'Detecting chapters', status: 'completed', description: '8 chapters identified' },
      { id: '4', name: 'Analyzing concepts', status: 'completed', description: '32 concepts mapped' },
      { id: '5', name: 'Creating searchable knowledge', status: 'completed', description: 'Indexed' },
      { id: '6', name: 'Finalizing reader', status: 'completed', description: 'Done' }
    ]
  },
  {
    id: 'res-rust-book',
    title: 'The Rust Programming Language',
    author: 'Steve Klabnik & Carol Nichols',
    type: 'pdf',
    status: 'processing',
    totalPages: 520,
    totalChapters: 20,
    completedChapters: 0,
    progress: 0,
    currentChapterId: 'ch-rust-1',
    currentSectionId: 'sec-rust-1-1',
    lastOpenedAt: 'Just now',
    description: 'The official book on Rust covering ownership, borrowing, lifetimes, fearless concurrency, and macro systems.',
    tags: ['Rust', 'Systems Programming', 'Memory Safety'],
    estimatedRemainingMinutes: 600,
    totalReadingMinutes: 0,
    quizAverageScore: 0,
    processingSteps: [
      { id: '1', name: 'Upload complete', status: 'completed', description: 'File received (8.4 MB)' },
      { id: '2', name: 'Extracting content', status: 'completed', description: 'Extracting text and AST' },
      { id: '3', name: 'Detecting chapters', status: 'completed', description: '20 chapters detected' },
      { id: '4', name: 'Analyzing concepts', status: 'in_progress', description: 'Analyzing borrow checker and lifetimes...' },
      { id: '5', name: 'Creating searchable knowledge', status: 'pending', description: 'Waiting for concept mapping' },
      { id: '6', name: 'Finalizing reader', status: 'pending', description: 'Waiting' }
    ]
  }
];

export const MOCK_CHAPTERS: Record<string, Chapter[]> = {
  'res-ml-python': [
    {
      id: 'ch-1',
      resourceId: 'res-ml-python',
      number: 1,
      title: 'Giving Computers the Ability to Learn from Data',
      overview: 'Introduction to machine learning paradigms: supervised, unsupervised, and reinforcement learning.',
      estimatedMinutes: 25,
      progress: 100,
      isCompleted: true,
      quizId: 'quiz-ch-1',
      codingProblemIds: ['prob-ml-1'],
      sections: [
        {
          id: 'sec-1-1',
          title: '1.1 Three Different Types of Machine Learning',
          order: 1,
          wordCount: 1400,
          estimatedMinutes: 12,
          content: `### 1.1 Three Different Types of Machine Learning

Machine learning is a subset of artificial intelligence where algorithms discover patterns from historical data to make automated predictions or decisions without being explicitly programmed for every scenario.

We can categorize machine learning applications into three broad learning paradigms:

1. **Supervised Learning**: The algorithm learns from labeled training data to predict outcomes on unseen future inputs. Examples include classification (categorical outputs) and regression (continuous numerical outputs).
2. **Unsupervised Learning**: Discovering intrinsic latent structure, clusters, or manifold representations from unlabeled datasets.
3. **Reinforcement Learning**: An autonomous agent interacts with a dynamic environment, receiving scalar rewards or penalties to maximize cumulative long-term utility.`
        },
        {
          id: 'sec-1-2',
          title: '1.2 Road Map for Building Machine Learning Systems',
          order: 2,
          wordCount: 1200,
          estimatedMinutes: 13,
          content: `### 1.2 Road Map for Building Machine Learning Systems

Every machine learning system follows a structured pipeline:

- **Preprocessing**: Feature extraction, handling missing attributes, normalization and dimensionality reduction.
- **Model Training & Selection**: Benchmarking hypothesis classes, hyperparameter tuning via cross-validation.
- **Evaluation**: Generalization error measurement on isolated test sets.
- **Deployment**: Inference serving and monitoring data distribution shifts.`
        }
      ]
    },
    {
      id: 'ch-2',
      resourceId: 'res-ml-python',
      number: 2,
      title: 'Training Simple Machine Learning Algorithms for Classification',
      overview: 'Early history of AI: Rosenblatt Perceptron and Adaptive Linear Neurons (Adaline).',
      estimatedMinutes: 35,
      progress: 100,
      isCompleted: true,
      quizId: 'quiz-ch-2',
      codingProblemIds: ['prob-ml-2'],
      sections: [
        {
          id: 'sec-2-1',
          title: '2.1 Artificial Neurons: A Brief Overview',
          order: 1,
          wordCount: 1600,
          estimatedMinutes: 15,
          content: `### 2.1 Artificial Neurons: A Brief Overview

The concept of artificial neurons originated with Warren McCulloch and Walter Pitts in 1943. Later in 1957, Frank Rosenblatt proposed the Perceptron learning rule, an algorithm that automatically discovers optimal weight coefficients multiplied with input features.

#### The Decision Function

Given an input vector $\\mathbf{x} = [x_1, x_2, \\dots, x_m]^T$ and a weight vector $\\mathbf{w} = [w_1, w_2, \\dots, w_m]^T$, the net input $z$ is:

$$z = w_1 x_1 + w_2 x_2 + \\dots + w_m x_m + b = \\mathbf{w}^T \\mathbf{x} + b$$

The decision function $\\phi(z)$ outputs $+1$ if $z \\ge 0$, and $-1$ otherwise.`
        },
        {
          id: 'sec-2-2',
          title: '2.2 Implementing the Perceptron Learning Algorithm in Python',
          order: 2,
          wordCount: 1800,
          estimatedMinutes: 20,
          content: `### 2.2 Implementing the Perceptron Learning Algorithm in Python

Let's implement a clean object-oriented Perceptron classifier in Python:

\`\`\`python
import numpy as np

class Perceptron:
    """Perceptron classifier.
    
    Parameters
    ------------
    eta : float
        Learning rate (between 0.0 and 1.0)
    n_iter : int
        Passes over the training dataset.
    random_state : int
        Random number generator seed for random weight initialization.
    """
    def __init__(self, eta: float = 0.01, n_iter: int = 50, random_state: int = 1):
        self.eta = eta
        self.n_iter = n_iter
        self.random_state = random_state

    def fit(self, X: np.ndarray, y: np.ndarray):
        rgen = np.random.RandomState(self.random_state)
        self.w_ = rgen.normal(loc=0.0, scale=0.01, size=X.shape[1])
        self.b_ = np.float_(0.)
        self.errors_ = []

        for _ in range(self.n_iter):
            errors = 0
            for xi, target in zip(X, y):
                update = self.eta * (target - self.predict(xi))
                self.w_ += update * xi
                self.b_ += update
                errors += int(update != 0.0)
            self.errors_.append(errors)
        return self

    def net_input(self, X: np.ndarray) -> np.ndarray:
        """Calculate net input"""
        return np.dot(X, self.w_) + self.b_

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Return class label after unit step"""
        return np.where(self.net_input(X) >= 0.0, 1, -1)
\`\`\`
`
        }
      ]
    },
    {
      id: 'ch-3',
      resourceId: 'res-ml-python',
      number: 3,
      title: 'A Tour of Machine Learning Classifiers Using Scikit-Learn',
      overview: 'Logistic regression, Support Vector Machines, Decision Trees, and K-Nearest Neighbors.',
      estimatedMinutes: 45,
      progress: 30,
      isCompleted: false,
      quizId: 'quiz-ch-3',
      codingProblemIds: ['prob-ml-3'],
      sections: [
        {
          id: 'sec-3-1',
          title: '3.1 Choosing a Classification Algorithm',
          order: 1,
          wordCount: 1500,
          estimatedMinutes: 15,
          content: `### 3.1 Choosing a Classification Algorithm

Choosing the appropriate machine learning classifier depends on several key trade-offs:
- **Interpretability vs. Accuracy**: Linear models and decision trees are inherently explainable; deep neural networks and ensemble methods often achieve superior empirical performance.
- **Dataset Size and Dimensionality**: High-dimensional sparse data often pairs well with linear SVMs and logistic regression with L1 regularization.
- **Noise and Linearity**: When decision boundaries are non-linear, kernel SVMs, random forests, or gradient boosted trees generally outperform simple hyperplanes.`
        },
        {
          id: 'sec-3-2',
          title: '3.2 Logistic Regression and Conditional Probabilities',
          order: 2,
          wordCount: 2200,
          estimatedMinutes: 20,
          content: `### 3.2 Logistic Regression and Conditional Probabilities

Despite its name, **Logistic Regression** is a probabilistic linear model for binary classification. It models the conditional probability $P(y=1|\\mathbf{x})$ using the **sigmoid (logistic) activation function**:

$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$

Where $z = \\mathbf{w}^T \\mathbf{x} + b$ represents the net input.

\`\`\`
          1.0 |                   .-------
              |                .-'
              |              .'
   σ(z)   0.5 |-------------+ (Decision threshold z=0)
              |           .'
              |        .-'
          0.0 |-------'-------------------
                    -4  -2   0   2   4
                              z
\`\`\`

#### The Log-Loss Objective Function

To learn optimal parameters $\\mathbf{w}$ and $b$, we minimize the negative log-likelihood (binary cross-entropy loss):

$$J(\\mathbf{w}, b) = -\\sum_{i=1}^{n} \\left[ y^{(i)} \\log(\\hat{y}^{(i)}) + (1 - y^{(i)}) \\log(1 - \\hat{y}^{(i)}) \\right]$$

Where $\\hat{y}^{(i)} = \\sigma(\\mathbf{w}^T \\mathbf{x}^{(i)} + b)$.

#### Regularization: Preventing Overfitting

To prevent weights from exploding on noisy datasets, we introduce a regularization penalty:

- **L2 Regularization (Ridge)**: Adds $\\frac{\\lambda}{2} \\|\\mathbf{w}\\|^2$, penalizing large weights smoothly.
- **L1 Regularization (Lasso)**: Adds $\\lambda \\|\\mathbf{w}\\|_1$, driving non-informative coefficients to exactly zero (automatic feature selection).

In scikit-learn, the inverse regularization parameter $C = \\frac{1}{\\lambda}$ is used. Smaller values of $C$ specify stronger regularization.`
        },
        {
          id: 'sec-3-3',
          title: '3.3 Support Vector Machines with Maximum Margin',
          order: 3,
          wordCount: 1900,
          estimatedMinutes: 18,
          content: `### 3.3 Support Vector Machines with Maximum Margin

Support Vector Machines (SVMs) optimize for the hyperplane that maximizes the geometric margin between decision boundaries and the closest training samples (support vectors).

Maximizing the margin minimizes the generalization error bound according to Vapnik-Chervonenkis (VC) dimension theory.`
        }
      ]
    }
  ]
};

export const MOCK_CONCEPTS: Concept[] = [
  {
    id: 'concept-gradient-descent',
    resourceId: 'res-ml-python',
    chapterId: 'ch-3',
    name: 'Gradient Descent & Loss Optimization',
    category: 'Optimization',
    difficulty: 'intermediate',
    importance: 'core',
    prerequisites: ['Vector Calculus', 'Loss Functions'],
    chapterReference: 'Chapter 3, Section 3.2',
    explanation: 'Gradient descent computes the partial derivatives of the cost function with respect to each model parameter and iteratively updates parameters in the direction of steepest descent.',
    codeExample: 'weights = weights - learning_rate * np.dot(X.T, (predictions - y)) / n'
  },
  {
    id: 'concept-sigmoid',
    resourceId: 'res-ml-python',
    chapterId: 'ch-3',
    name: 'Sigmoid Activation Function',
    category: 'Activation Functions',
    difficulty: 'beginner',
    importance: 'core',
    prerequisites: ['Exponential Function', 'Probability'],
    chapterReference: 'Chapter 3, Section 3.2',
    explanation: 'Maps any real-valued number into a bounded range between 0 and 1, interpreting net linear activations as class posterior probabilities.',
    codeExample: 'def sigmoid(z):\n    return 1.0 / (1.0 + np.exp(-z))'
  },
  {
    id: 'concept-regularization',
    resourceId: 'res-ml-python',
    chapterId: 'ch-3',
    name: 'L1 & L2 Regularization',
    category: 'Generalization',
    difficulty: 'intermediate',
    importance: 'core',
    prerequisites: ['Loss Functions', 'Norms'],
    chapterReference: 'Chapter 3, Section 3.2',
    explanation: 'Penalizes model complexity to mitigate overfitting. L2 encourages diffuse small weights, while L1 promotes parameter sparsity.',
    codeExample: 'from sklearn.linear_model import LogisticRegression\nclf = LogisticRegression(penalty="l2", C=1.0)'
  },
  {
    id: 'concept-svm-margin',
    resourceId: 'res-ml-python',
    chapterId: 'ch-3',
    name: 'Maximum Margin Classification',
    category: 'Linear Models',
    difficulty: 'advanced',
    importance: 'supporting',
    prerequisites: ['Linear Algebra', 'Convex Optimization'],
    chapterReference: 'Chapter 3, Section 3.3',
    explanation: 'The geometric distance between the decision hyperplane and the closest data points (support vectors). SVM maximizes this margin to reduce generalization error.',
  }
];

export const MOCK_HIGHLIGHTS: Highlight[] = [
  {
    id: 'hl-1',
    resourceId: 'res-ml-python',
    chapterId: 'ch-3',
    sectionId: 'sec-3-2',
    text: 'To learn optimal parameters w and b, we minimize the negative log-likelihood (binary cross-entropy loss)',
    category: 'formula',
    color: 'amber',
    createdAt: '25 minutes ago',
    location: 'Section 3.2 - Paragraph 4'
  },
  {
    id: 'hl-2',
    resourceId: 'res-ml-python',
    chapterId: 'ch-3',
    sectionId: 'sec-3-2',
    text: 'Smaller values of C specify stronger regularization.',
    category: 'important',
    color: 'yellow',
    createdAt: '15 minutes ago',
    location: 'Section 3.2 - Regularization'
  },
  {
    id: 'hl-3',
    resourceId: 'res-ml-python',
    chapterId: 'ch-2',
    sectionId: 'sec-2-1',
    text: 'The decision function outputs +1 if z >= 0, and -1 otherwise.',
    category: 'definition',
    color: 'blue',
    createdAt: 'Yesterday',
    location: 'Section 2.1'
  }
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'note-1',
    resourceId: 'res-ml-python',
    chapterId: 'ch-3',
    sectionId: 'sec-3-2',
    selectedText: 'In scikit-learn, the inverse regularization parameter C = 1 / lambda is used.',
    note: 'Remember: C is inversely proportional to penalty strength! C=0.01 is very strong regularization, while C=100 is weak regularization.',
    createdAt: '18 minutes ago',
    updatedAt: '18 minutes ago',
    location: 'Section 3.2'
  },
  {
    id: 'note-2',
    resourceId: 'res-ml-python',
    chapterId: 'ch-2',
    sectionId: 'sec-2-2',
    selectedText: 'update = self.eta * (target - self.predict(xi))',
    note: 'Weights only update when the prediction is wrong (target != predicted). If prediction matches target, update = 0.',
    createdAt: 'Yesterday',
    updatedAt: 'Yesterday',
    location: 'Section 2.2'
  }
];

export const MOCK_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm-1',
    resourceId: 'res-ml-python',
    chapterId: 'ch-3',
    sectionId: 'sec-3-2',
    title: 'Logistic Regression Decision Function & Loss',
    note: 'Review binary cross entropy formula before Chapter 3 quiz',
    createdAt: '12 minutes ago',
    location: 'Page 78, Section 3.2'
  },
  {
    id: 'bm-2',
    resourceId: 'res-ddia',
    chapterId: 'ch-ddia-6',
    sectionId: 'sec-ddia-6-1',
    title: 'Partitioning and Secondary Indexes',
    note: 'Key topic for distributed database design',
    createdAt: '2 days ago',
    location: 'Chapter 6'
  }
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'quiz-ch-1',
    resourceId: 'res-ml-python',
    chapterId: 'ch-1',
    title: 'Chapter 1 Assessment: Machine Learning Fundamentals',
    questionsCount: 4,
    estimatedMinutes: 6,
    questions: [
      {
        id: 'q1-1',
        question: 'Which of the following problems is best suited for Supervised Learning with classification?',
        options: [
          'Predicting the continuous market price of a house',
          'Grouping news articles into latent thematic topics without tags',
          'Detecting whether an incoming email is Spam or Not Spam',
          'Teaching a robotic arm to balance a pole via trial-and-error rewards'
        ],
        correctOptionIndex: 2,
        explanation: 'Email spam detection assigns discrete categorical labels (Spam vs. Ham) from labeled training examples, making it a canonical supervised classification problem.',
        relatedConceptId: 'concept-supervised',
        relatedConceptName: 'Supervised Learning'
      },
      {
        id: 'q1-2',
        question: 'What is the primary role of a held-out test set in the machine learning workflow?',
        options: [
          'To optimize the model weights using gradient descent',
          'To assess how well the model generalizes to unseen data without data leakage',
          'To perform hyperparameter search and grid tuning',
          'To impute missing feature values'
        ],
        correctOptionIndex: 1,
        explanation: 'An isolated test set provides an unbiased estimate of generalization error on data never seen during feature engineering or training.',
        relatedConceptId: 'concept-evaluation',
        relatedConceptName: 'Generalization & Evaluation'
      }
    ]
  },
  {
    id: 'quiz-ch-3',
    resourceId: 'res-ml-python',
    chapterId: 'ch-3',
    title: 'Chapter 3 Assessment: Classifiers & Optimization',
    questionsCount: 5,
    estimatedMinutes: 8,
    questions: [
      {
        id: 'q3-1',
        question: 'What is the mathematical output range of the standard Sigmoid activation function?',
        options: [
          '[-1.0, 1.0]',
          '[0.0, 1.0]',
          '(-inf, +inf)',
          '[0.0, +inf)'
        ],
        correctOptionIndex: 1,
        explanation: 'The sigmoid function σ(z) = 1 / (1 + e^(-z)) asymptotically approaches 0 as z -> -inf and 1 as z -> +inf, restricting outputs strictly to (0, 1).',
        relatedConceptId: 'concept-sigmoid',
        relatedConceptName: 'Sigmoid Activation Function'
      },
      {
        id: 'q3-2',
        question: 'In scikit-learn Logistic Regression, what effect does setting a very small value for parameter C (e.g., C=0.001) have?',
        options: [
          'Disables regularization completely',
          'Applies strong regularization, driving weights closer to zero to prevent overfitting',
          'Increases model capacity and increases risk of overfitting',
          'Switches the solver to stochastic gradient descent'
        ],
        correctOptionIndex: 1,
        explanation: 'In scikit-learn, C = 1 / lambda. A smaller C represents a larger penalty lambda, which applies stronger regularization and simpler decision boundaries.',
        relatedConceptId: 'concept-regularization',
        relatedConceptName: 'L1 & L2 Regularization'
      },
      {
        id: 'q3-3',
        question: 'Why is Log-Loss (Binary Cross-Entropy) preferred over Mean Squared Error for logistic regression?',
        options: [
          'MSE creates a non-convex optimization surface with local minima when paired with the sigmoid function',
          'Log-Loss cannot be differentiated',
          'MSE is only defined for integer classifications',
          'Log-loss guarantees zero training error on every dataset'
        ],
        correctOptionIndex: 0,
        explanation: 'Pairing Mean Squared Error with a non-linear sigmoid activation yields a non-convex cost function with multiple local minima. Binary cross-entropy is provably convex for linear models.',
        relatedConceptId: 'concept-gradient-descent',
        relatedConceptName: 'Gradient Descent & Loss Optimization'
      }
    ]
  }
];

export const MOCK_CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'prob-ml-1',
    resourceId: 'res-ml-python',
    chapterId: 'ch-3',
    conceptId: 'concept-sigmoid',
    title: 'Implement Numerically Stable Sigmoid',
    difficulty: 'Easy',
    status: 'solved',
    relatedChapterTitle: 'Chapter 3: Classifiers & Log-Loss',
    relatedConceptName: 'Sigmoid Activation Function',
    description: `Implement a function \`sigmoid(z)\` that computes the sigmoid activation for scalar values or NumPy arrays:

$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$

Ensure numerical stability when $z$ is a large negative or positive number to avoid floating-point overflow.`,
    examples: [
      { input: 'z = 0.0', output: '0.5', explanation: 'At z=0, 1 / (1 + 1) = 0.5' },
      { input: 'z = 2.0', output: '0.880797', explanation: '1 / (1 + exp(-2)) ≈ 0.8808' }
    ],
    constraints: [
      '-500.0 <= z <= 500.0',
      'Should support floating point numbers'
    ],
    starterCode: `def sigmoid(z: float) -> float:
    import numpy as np
    # Your code here
    return 1.0 / (1.0 + np.exp(-z))
`,
    solutionCode: `def sigmoid(z: float) -> float:
    import numpy as np
    z = np.clip(z, -500, 500)
    return 1.0 / (1.0 + np.exp(-z))
`,
    testCases: [
      { id: 't1', input: '0.0', expectedOutput: '0.5' },
      { id: 't2', input: '2.0', expectedOutput: '0.8807970779778823' },
      { id: 't3', input: '-2.0', expectedOutput: '0.11920292202211755' }
    ]
  },
  {
    id: 'prob-ml-2',
    resourceId: 'res-ml-python',
    chapterId: 'ch-3',
    conceptId: 'concept-gradient-descent',
    title: 'Binary Cross-Entropy Loss Calculator',
    difficulty: 'Medium',
    status: 'unsolved',
    relatedChapterTitle: 'Chapter 3: Classifiers & Log-Loss',
    relatedConceptName: 'Gradient Descent & Loss Optimization',
    description: `Write a function \`compute_binary_loss(y_true, y_pred)\` that computes the mean binary cross-entropy loss across $N$ samples:

$$J = -\\frac{1}{N} \\sum_{i=1}^{N} \\left[ y_i \\log(\\hat{y}_i + \\epsilon) + (1 - y_i) \\log(1 - \\hat{y}_i + \\epsilon) \\right]$$

Use $\\epsilon = 10^{-15}$ to prevent $\\log(0)$.`,
    examples: [
      { input: 'y_true = [1, 0], y_pred = [0.9, 0.1]', output: '0.10536', explanation: 'High confidence correct predictions yield minimal loss.' }
    ],
    constraints: [
      'y_true elements are 0 or 1',
      '0.0 <= y_pred elements <= 1.0',
      'len(y_true) == len(y_pred) >= 1'
    ],
    starterCode: `def compute_binary_loss(y_true: list[int], y_pred: list[float]) -> float:
    import math
    eps = 1e-15
    # Calculate binary cross entropy loss
    pass
`,
    testCases: [
      { id: 't1', input: '[1, 0], [0.9, 0.1]', expectedOutput: '0.10536051565782628' },
      { id: 't2', input: '[1, 1, 0], [0.8, 0.7, 0.3]', expectedOutput: '0.3121928094892422' }
    ]
  }
];

export const MOCK_STUDY_PLAN: StudyPlan = {
  id: 'plan-1',
  resourceId: 'res-ml-python',
  resourceTitle: 'Machine Learning with Python & Scikit-Learn',
  targetCompletionDate: 'Oct 28, 2026',
  dailyReadingMinutes: 30,
  currentStreakDays: 6,
  totalDays: 28,
  completedDays: 7,
  schedule: [
    { day: 1, date: 'Today', chapterId: 'ch-3', chapterTitle: 'Chapter 3: Classifiers & Log-Loss', taskType: 'read', isDone: false, estimatedMinutes: 25 },
    { day: 2, date: 'Tomorrow', chapterId: 'ch-3', chapterTitle: 'Chapter 3 Quiz & Practice', taskType: 'quiz', isDone: false, estimatedMinutes: 15 },
    { day: 3, date: 'Sep 25', chapterId: 'ch-3', chapterTitle: 'Binary Cross-Entropy Coding Problem', taskType: 'code', isDone: false, estimatedMinutes: 20 },
    { day: 4, date: 'Sep 26', chapterId: 'ch-4', chapterTitle: 'Chapter 4: Data Preprocessing', taskType: 'read', isDone: false, estimatedMinutes: 30 },
    { day: 5, date: 'Sep 27', chapterId: 'ch-4', chapterTitle: 'Handling Missing Data & Categorical Features', taskType: 'read', isDone: false, estimatedMinutes: 25 }
  ]
};

export const MOCK_ACTIVITIES: LearningActivity[] = [
  {
    id: 'act-1',
    type: 'reading',
    title: 'Read Section 3.2: Logistic Regression',
    description: 'Read 2,200 words and reviewed loss optimization equations',
    timestamp: '15 minutes ago',
    resourceId: 'res-ml-python',
    resourceTitle: 'Machine Learning with Python & Scikit-Learn',
    link: '/reader/res-ml-python/ch-3'
  },
  {
    id: 'act-2',
    type: 'highlight',
    title: 'Highlighted Log-Loss Definition',
    description: 'Created category highlight: Formula in Chapter 3',
    timestamp: '25 minutes ago',
    resourceId: 'res-ml-python',
    resourceTitle: 'Machine Learning with Python & Scikit-Learn'
  },
  {
    id: 'act-3',
    type: 'quiz',
    title: 'Completed Chapter 1 Assessment',
    description: 'Scored 100% (4/4 questions correct)',
    timestamp: 'Yesterday',
    resourceId: 'res-ml-python',
    resourceTitle: 'Machine Learning with Python & Scikit-Learn',
    link: '/quizzes/quiz-ch-1'
  },
  {
    id: 'act-4',
    type: 'coding',
    title: 'Solved Sigmoid Activation Function',
    description: 'Passed all 3 test cases in 12ms',
    timestamp: 'Yesterday',
    resourceId: 'res-ml-python',
    resourceTitle: 'Machine Learning with Python & Scikit-Learn',
    link: '/coding/prob-ml-1'
  }
];

export const MOCK_ANALYTICS: ProgressAnalytics = {
  totalReadingMinutes: 755,
  totalChaptersCompleted: 15,
  totalBooksCompleted: 1,
  quizAverage: 91,
  codingAccuracy: 86,
  currentStreakDays: 6,
  strongConcepts: [
    { name: 'Supervised Learning', score: 98, count: 5 },
    { name: 'Perceptron Learning Rule', score: 95, count: 4 },
    { name: 'Sigmoid Activation', score: 92, count: 3 }
  ],
  weakConcepts: [
    { name: 'L1 vs L2 Regularization Penalty', score: 68, count: 3, chapterId: 'ch-3', resourceId: 'res-ml-python' },
    { name: 'Maximum Margin Hyperplanes (SVM)', score: 72, count: 2, chapterId: 'ch-3', resourceId: 'res-ml-python' }
  ],
  chaptersNeedingReview: [
    { chapterTitle: 'Chapter 3: Logistic Regression & Regularization', resourceTitle: 'Machine Learning with Python', chapterId: 'ch-3', resourceId: 'res-ml-python', reason: 'Recent quiz error in parameter C inverse penalty' }
  ]
};

export const MOCK_AI_SESSIONS: Record<string, AISession[]> = {
  'res-ml-python': [
    {
      id: 'session-1',
      resourceId: 'res-ml-python',
      chapterId: 'ch-3',
      title: 'Regularization & Parameter C in Scikit-Learn',
      createdAt: '20 minutes ago',
      updatedAt: '15 minutes ago',
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Why does smaller C mean stronger regularization in scikit-learn?',
          timestamp: '20 minutes ago',
          contextSnapshot: {
            chapterTitle: 'Chapter 3: A Tour of Machine Learning Classifiers',
            sectionTitle: '3.2 Logistic Regression and Conditional Probabilities',
            selectedText: 'In scikit-learn, the inverse regularization parameter C = 1 / lambda is used.'
          }
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: `### Understanding the Inverse Regularization Parameter $C$

In textbook formulation, regularized loss is written as:

$$J(\\mathbf{w}) = \\text{Loss}(\\mathbf{w}) + \\lambda \\cdot \\text{Penalty}(\\mathbf{w})$$

Here, higher $\\lambda$ increases the penalty on large weights.

#### Why Scikit-Learn uses $C$:
Scikit-learn follows the Support Vector Machine convention where the objective is multiplied by $C = \\frac{1}{\\lambda}$:

$$\\text{Objective}(\\mathbf{w}) = C \\cdot \\text{Loss}(\\mathbf{w}) + \\text{Penalty}(\\mathbf{w})$$

- **When $C \\to 0$**: The data loss term receives very little weight relative to the penalty term $\\implies$ **strong regularization**.
- **When $C \\to \\infty$**: The penalty term is neglected $\\implies$ **weak or no regularization**.`,
          timestamp: '19 minutes ago',
          sourceReferences: [
            {
              chapterTitle: 'Chapter 3',
              sectionTitle: 'Section 3.2: Regularization',
              chapterId: 'ch-3',
              sectionId: 'sec-3-2',
              location: 'Page 79'
            }
          ]
        }
      ]
    }
  ]
};
