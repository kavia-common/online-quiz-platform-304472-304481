import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * QuizPage shows a quiz, lets user select answers and submit.
 */
function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.quizzes
      .get(quizId)
      .then((quizData) => {
        setQuiz(quizData);
        setAnswers({});
      })
      .catch(() => setError("Quiz data could not be loaded"))
      .finally(() => setLoading(false));
  }, [quizId]);

  function handleChange(qid, oid) {
    setAnswers((prev) => ({ ...prev, [qid]: oid }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.quizzes.submit(quizId, answers);
      navigate(`/result/${res.resultId || res.id}`);
    } catch (err) {
      setError("Submit failed (are you logged in?)");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return <div className="card">Loading quiz...</div>;
  if (error)
    return (
      <div className="card" style={{ color: "var(--color-error)" }}>
        {error}
      </div>
    );
  if (!quiz)
    return (
      <div className="card">
        <div>Quiz not found.</div>
      </div>
    );

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="heading" style={{ marginBottom: 0 }}>
        {quiz.title}
      </div>
      <div style={{ marginBottom: "2em", color: "#a6f4c5" }}>
        {quiz.description}
      </div>
      {quiz.questions &&
        quiz.questions.map((q, idx) => (
          <div key={q.id} style={{ marginBottom: "1.2em" }}>
            <div style={{ color: "var(--color-primary)", fontWeight: 600 }}>
              Q{idx + 1}. {q.text}
            </div>
            {q.options.map((o) => (
              <label
                key={o.id}
                style={{
                  display: "block",
                  background:
                    answers[q.id] === o.id
                      ? "var(--color-secondary)"
                      : "transparent",
                  color:
                    answers[q.id] === o.id
                      ? "var(--color-surface)"
                      : "var(--color-text)",
                  padding: "0.45em 0.8em",
                  borderRadius: 7,
                  margin: "0.13em 0",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "1em",
                  transition: "background 0.18s",
                }}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  disabled={submitting}
                  value={o.id}
                  checked={answers[q.id] === o.id}
                  onChange={() => handleChange(q.id, o.id)}
                  style={{ marginRight: "0.85em" }}
                />
                {o.text}
              </label>
            ))}
          </div>
        ))}
      <button
        className="btn"
        type="submit"
        disabled={submitting}
        style={{ marginTop: "0.7em" }}
      >
        {submitting ? "Submitting…" : "Submit Answers"}
      </button>
    </form>
  );
}

export default QuizPage;
