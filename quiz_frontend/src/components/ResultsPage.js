import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

// PUBLIC_INTERFACE
/**
 * After submitting a quiz, shows user their score, correct answers, and review.
 */
function ResultsPage() {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.quizzes
      .getResult(resultId)
      .then((data) => setResult(data))
      .catch(() => setError("Could not load results"))
      .finally(() => setLoading(false));
  }, [resultId]);

  if (loading)
    return <div className="card">Loading results…</div>;
  if (error)
    return (
      <div className="card" style={{ color: "var(--color-error)" }}>
        {error}
      </div>
    );
  if (!result)
    return (
      <div className="card">
        <div>Results not found.</div>
      </div>
    );

  return (
    <div className="card">
      <div className="heading">Quiz Results</div>
      <div style={{ fontWeight: 600, fontSize: "1.15em", marginBottom: 12 }}>
        Score: <span style={{ color: "var(--color-success)" }}>{result.score}</span> /{" "}
        {result.total}
      </div>
      <hr style={{ border: 0, borderTop: "1.5px solid #314155" }} />
      <div style={{ margin: "1em 0 0.1em 0" }}>
        <b style={{ fontSize: "1.03em" }}>Answers Review:</b>
      </div>
      {result.questions &&
        result.questions.map((q, i) => (
          <div key={q.id} style={{ margin: "1em 0" }}>
            <div style={{ color: "var(--color-primary)" }}>
              Q{i + 1}. {q.text}
            </div>
            <div>
              Your answer:{" "}
              <span
                style={{
                  color: q.correct
                    ? "var(--color-success)"
                    : "var(--color-error)",
                  fontWeight: 600,
                }}
              >
                {q.userAnswerText}
              </span>
              {!q.correct && (
                <span>
                  {" "}
                  | Correct:{" "}
                  <span
                    style={{
                      color: "var(--color-success)",
                      fontWeight: 600,
                    }}
                  >
                    {q.correctAnswerText}
                  </span>
                </span>
              )}
            </div>
          </div>
        ))}
      <button
        className="btn"
        style={{ marginTop: "2em" }}
        onClick={() => navigate("/")}
      >
        Back to Quizzes List
      </button>
    </div>
  );
}

export default ResultsPage;
