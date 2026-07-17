"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, XCircle, RotateCcw, Trophy, Lightbulb, ChevronRight } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which country has won the most FIFA World Cup titles?",
    options: ["Germany", "Brazil", "Italy", "Argentina"],
    correct: 1,
    explanation: "Brazil has won 5 World Cups (1958, 1962, 1970, 1994, 2002) — more than any other nation.",
    difficulty: "Easy",
  },
  {
    id: 2,
    question: "Who is the all-time top scorer in World Cup history?",
    options: ["Pelé", "Ronaldo Nazário", "Miroslav Klose", "Lionel Messi"],
    correct: 2,
    explanation: "Miroslav Klose scored 16 goals across 4 tournaments (2002, 2006, 2010, 2014), surpassing Ronaldo's 15.",
    difficulty: "Medium",
  },
  {
    id: 3,
    question: "Which player scored a hat-trick in a World Cup Final?",
    options: ["Pelé (1958)", "Geoff Hurst (1966)", "Diego Maradona (1986)", "Zinedine Zidane (1998)"],
    correct: 1,
    explanation: "Geoff Hurst scored 3 goals for England in the 1966 Final vs West Germany — the only WC Final hat-trick.",
    difficulty: "Hard",
  },
  {
    id: 4,
    question: "Where was the first FIFA World Cup held in 1930?",
    options: ["Brazil", "Italy", "Uruguay", "Argentina"],
    correct: 2,
    explanation: "Uruguay hosted and won the inaugural 1930 World Cup, defeating Argentina 4-2 in the final at Estadio Centenario.",
    difficulty: "Easy",
  },
  {
    id: 5,
    question: "Which two World Cups were cancelled due to World War II?",
    options: ["1942 & 1946", "1940 & 1944", "1938 & 1942", "1944 & 1948"],
    correct: 0,
    explanation: "The 1942 and 1946 tournaments were cancelled due to WWII. The WC resumed in 1950 in Brazil.",
    difficulty: "Medium",
  },
  {
    id: 6,
    question: "Who scored the 'Goal of the Century' in 1986?",
    options: ["Pelé", "Diego Maradona", "Johan Cruyff", "Michel Platini"],
    correct: 1,
    explanation: "Maradona's 60-yard dribble past 5 England players in the 1986 quarter-final is widely regarded as the greatest goal ever.",
    difficulty: "Easy",
  },
  {
    id: 7,
    question: "Which is the highest-attended World Cup match ever?",
    options: ["1950 Final (Maracanã)", "2014 Final", "1970 Final", "1998 Final"],
    correct: 0,
    explanation: "The 1950 Final (Uruguay vs Brazil) at Maracanã had 173,850 spectators — still the record today.",
    difficulty: "Medium",
  },
  {
    id: 8,
    question: "Which player won the Golden Ball at the 2022 World Cup?",
    options: ["Kylian Mbappé", "Lionel Messi", "Luka Modrić", "Cristiano Ronaldo"],
    correct: 1,
    explanation: "Messi won his 2nd Golden Ball (after 2014) after leading Argentina to the 2022 title in Qatar.",
    difficulty: "Easy",
  },
  {
    id: 9,
    question: "How many teams will participate in the 2026 World Cup?",
    options: ["32", "40", "48", "64"],
    correct: 2,
    explanation: "2026 is the first 48-team World Cup, hosted by USA, Canada, and Mexico — up from 32 since 1998.",
    difficulty: "Medium",
  },
  {
    id: 10,
    question: "Who is the youngest goalscorer in World Cup history?",
    options: ["Pelé (17y 239d)", "Kylian Mbappé (18y 347d)", "Norman Whiteside (17y 41d)", "Lionel Messi (18y 357d)"],
    correct: 0,
    explanation: "Pelé scored against Wales in the 1958 quarter-final at age 17 years, 239 days — a record that still stands.",
    difficulty: "Hard",
  },
];

const DIFFICULTY_COLORS = {
  Easy: "#22c55e",
  Medium: "#f97316",
  Hard: "#ef4444",
};

export function WorldCupQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [finished, setFinished] = useState(false);

  const current = QUESTIONS[currentIdx];
  const progress = ((currentIdx + (showExplanation ? 1 : 0)) / QUESTIONS.length) * 100;

  const handleAnswer = (idx: number) => {
    if (showExplanation) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[currentIdx] = idx;
    setAnswers(newAnswers);
    if (idx === current.correct) setScore(score + 1);
  };

  const next = () => {
    if (currentIdx === QUESTIONS.length - 1) {
      setFinished(true);
      return;
    }
    setCurrentIdx(currentIdx + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const reset = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setFinished(false);
  };

  const getScoreMessage = () => {
    const pct = (score / QUESTIONS.length) * 100;
    if (pct === 100) return { msg: "Perfect! You're a World Cup legend! 🏆", color: "#D4AF37" };
    if (pct >= 80) return { msg: "Outstanding! True football scholar! ⭐", color: "#22c55e" };
    if (pct >= 60) return { msg: "Good job! You know your football. 👏", color: "#00E1FF" };
    if (pct >= 40) return { msg: "Not bad! Room to learn more. 📚", color: "#f97316" };
    return { msg: "Time to brush up on World Cup history! 🔄", color: "#ef4444" };
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 section-scroll bg-[#0a0a14]" id="quiz">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
              World Cup Quiz · Test Your Knowledge
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            Football <span className="text-gold-gradient">Trivia</span>
          </h2>
          <p className="text-[#9a9a9a] max-w-2xl">
            10 questions across Easy, Medium, and Hard difficulty. From 1930 Uruguay to 2026 USA/Canada/Mexico — how well do you know World Cup history?
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="text-[#9a9a9a]">
                    Question {currentIdx + 1} of {QUESTIONS.length}
                  </span>
                  <span className="text-[#D4AF37] font-semibold">Score: {score}</span>
                </div>
                <div className="h-1.5 bg-[#0B0B0B] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#00E1FF]"
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Difficulty badge */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: `${DIFFICULTY_COLORS[current.difficulty]}20`,
                    color: DIFFICULTY_COLORS[current.difficulty],
                  }}
                >
                  {current.difficulty}
                </span>
              </div>

              {/* Question */}
              <h3 className="text-xl font-bold text-white mb-6 leading-tight">
                {current.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 mb-4">
                {current.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === current.correct;
                  const showResult = showExplanation;

                  let bgClass = "glass hover:bg-[rgba(212,175,55,0.05)] border-[rgba(255,255,255,0.1)]";
                  if (showResult && isCorrect) {
                    bgClass = "bg-[rgba(34,197,94,0.15)] border-[#22c55e]";
                  } else if (showResult && isSelected && !isCorrect) {
                    bgClass = "bg-[rgba(239,68,68,0.15)] border-[#ef4444]";
                  } else if (showResult) {
                    bgClass = "glass border-[rgba(255,255,255,0.05)] opacity-50";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={showExplanation}
                      className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-center justify-between ${bgClass}`}
                    >
                      <span className="text-sm text-white">{opt}</span>
                      {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-[#ef4444] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 glass-blue rounded-lg mb-4">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-[#00E1FF] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-[#00E1FF] mb-1">Explanation</div>
                          <p className="text-sm text-white leading-relaxed">{current.explanation}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={next}
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5D67B] text-[#0B0B0B] font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                    >
                      {currentIdx === QUESTIONS.length - 1 ? "See Results" : "Next Question"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <div className="text-6xl mb-4">
                {score >= 8 ? "🏆" : score >= 6 ? "⭐" : score >= 4 ? "⚽" : "📚"}
              </div>
              <h3 className="text-3xl font-black text-white mb-2">Quiz Complete!</h3>
              <div className="text-5xl font-black text-gold-gradient mb-2">
                {score} / {QUESTIONS.length}
              </div>
              <p className="text-sm mb-6" style={{ color: getScoreMessage().color }}>
                {getScoreMessage().msg}
              </p>

              {/* Answer review */}
              <div className="text-left mb-6 max-h-64 overflow-y-auto">
                <div className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-2">Answer Review</div>
                <div className="space-y-1.5">
                  {QUESTIONS.map((q, i) => {
                    const userAns = answers[i];
                    const correct = userAns === q.correct;
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs p-2 glass rounded">
                        {correct ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-[#ef4444] flex-shrink-0" />
                        )}
                        <span className="text-[#9a9a9a]">Q{i + 1}:</span>
                        <span className="text-white truncate flex-1">{q.question}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={reset}
                className="bg-gradient-to-r from-[#D4AF37] to-[#F5D67B] text-[#0B0B0B] font-bold px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
