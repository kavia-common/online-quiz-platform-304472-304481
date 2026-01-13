import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * QuizList displays the available quizzes.
 */
function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.quizzes
      .list()
      .then((data) => setQuizzes(data))
      .catch(() => setError("Could not load quizzes"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading quizzes...</div>;
  if (error)
    return (
      <div style={{ color: "var(--color-error)" }}>{error}</div>
    );
  if (!quizzes.length)
    return (
      <div className="card">
        <div className="heading">Quizzes</div>
        <div>No quizzes found.</div>
      </div>
    );

  return (
    <div>
      <div className="heading">Available Quizzes</div>
      {quizzes.map((quiz) => (
        <div className="card" key={quiz.id}>
          <div
            style={{
              fontWeight: 600,
              fontSize: "1.15rem",
              color: "var(--color-primary)",
            }}
          >
            {quiz.title}
          </div>
          <div style={{ color: "#bbf7d0", margin: "0.22em 0 1em 0" }}>
            {quiz.description}
          </div>
          <button
            className="btn"
            onClick={() => navigate(`/quiz/${quiz.id}`)}
            style={{ marginTop: 6 }}
          >
            Take Quiz
          </button>
        </div>
      ))}
    </div>
  );
}

export default QuizList;
