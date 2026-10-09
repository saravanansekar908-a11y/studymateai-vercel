import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import QuizCard from "../components/QuizCard";
import QuizProgress from "../components/QuizProgress";
import QuizResult from "../components/QuizResult";

import { generateQuiz } from "../services/quizApi";

export default function AdaptiveQuiz() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  async function startQuiz() {
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }

    setLoading(true);

    try {
      const data = await generateQuiz(
        topic,
        difficulty,
        numberOfQuestions
      );

      setQuestions(data.questions);
      setCurrentQuestion(0);
      setAnswers({});
      setQuizFinished(false);
    } catch (error) {
      console.error(error);
      alert("Unable to generate quiz.");
    }

    setLoading(false);
  }

  function selectAnswer(answer) {
    setAnswers({
      ...answers,
      [currentQuestion]: answer,
    });
  }

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  function calculateScore() {
    let score = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) {
        score++;
      }
    });

    return score;
  }

  function restartQuiz() {
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizFinished(false);
  }

  return (
    <div
      style={{
        display: "flex",
        background: "#F3F4F6",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div className="responsive-page-container">
          <h1 style={{ color: "#2563EB", marginBottom: "16px" }}>🧠 Adaptive AI Quiz</h1>

          {questions.length === 0 && (
            <div style={{ maxWidth: "600px", background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
              <label style={{ fontWeight: "600", fontSize: "14px", color: "#1E293B", display: "block", marginBottom: "6px" }}>
                Quiz Topic
              </label>
              <input
                placeholder="Enter Topic (e.g. Python, World War 2, Organic Chemistry)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 15,
                  borderRadius: 10,
                  border: "1px solid #CBD5E1",
                  marginBottom: "16px",
                }}
              />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontWeight: "600", fontSize: "13px", color: "#64748B", display: "block", marginBottom: "4px" }}>
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: 8,
                      border: "1px solid #CBD5E1",
                    }}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontWeight: "600", fontSize: "13px", color: "#64748B", display: "block", marginBottom: "4px" }}>
                    Number of Questions
                  </label>
                  <select
                    value={numberOfQuestions}
                    onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: 8,
                      border: "1px solid #CBD5E1",
                    }}
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                  </select>
                </div>
              </div>

              <button
                onClick={startQuiz}
                disabled={loading}
                style={{
                  width: "100%",
                  background: "#2563EB",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                {loading ? "Generating Quiz..." : "Start Adaptive Quiz 🚀"}
              </button>
            </div>
          )}

          {questions.length > 0 && !quizFinished && (
            <>
              <br />

              <QuizProgress
                current={currentQuestion + 1}
                total={questions.length}
              />

              <QuizCard
                question={questions[currentQuestion]}
                selectedAnswer={answers[currentQuestion]}
                setSelectedAnswer={selectAnswer}
              />

              <br />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </button>

                <button onClick={nextQuestion}>
                  {currentQuestion === questions.length - 1
                    ? "Finish Quiz"
                    : "Next"}
                </button>
              </div>
            </>
          )}

          {quizFinished && (
            <QuizResult
              score={calculateScore()}
              total={questions.length}
              restartQuiz={restartQuiz}
            />
          )}
        </div>
      </div>
    </div>
  );
}