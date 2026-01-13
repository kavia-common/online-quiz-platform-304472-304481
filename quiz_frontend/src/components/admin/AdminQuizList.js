import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * AdminQuizList lets admin view, create, delete quizzes.
 */
function AdminQuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizDescription, setNewQuizDescription] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function refresh() {
    setLoading(true);
    api.admin
      .listQuizzes()
      .then((data) => setQuizzes(data))
      .catch(() => setError("Could not load quizzes"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const newQuiz = await api.admin.createQuiz({
        title: newQuizTitle,
        description: newQuizDescription,
      });
      setNewQuizTitle("");
      setNewQuizDescription("");
      setQuizzes((prev) => [...prev, newQuiz]);
    } catch (err) {
      setError("Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(quizId) {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      await api.admin.deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    } catch {
      setError("Delete failed");
    }
  }

  return (
    <div className="card">
      <div className="heading">Admin: Quiz List</div>
      <form style={{ marginBottom: 18 }} onSubmit={handleCreate}>
        <div style={{ display: "flex", gap: "0.8em", alignItems: "center" }}>
          <input
            type="text"
            required
            placeholder="New quiz title"
            value={newQuizTitle}
            onChange={(e) => setNewQuizTitle(e.target.value)}
          />
          <input
            type="text"
            required
            placeholder="Description"
            value={newQuizDescription}
            onChange={(e) => setNewQuizDescription(e.target.value)}
          />
          <button className="btn secondary" disabled={creating} type="submit">
            {creating ? "Creating..." : "Add Quiz"}
          </button>
        </div>
      </form>
      {error && <div style={{ color: "var(--color-error)" }}>{error}</div>}
      <div>
        {loading ? (
          "Loading quizzes..."
        ) : (
          <ul style={{ listStyle: "none", padding: 0, marginTop: 0 }}>
            {quizzes.map((quiz) => (
              <li
                key={quiz.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.5em 0",
                  borderBottom: "1px solid #28303a",
                }}
              >
                <div style={{ flex: 1 }}>
                  <b style={{ color: "var(--color-primary)" }}>{quiz.title}</b>{" "}
                  <span style={{ color: "#a6f4c5" }}>{quiz.description}</span>
                </div>
                <button
                  className="btn"
                  style={{ marginRight: 8 }}
                  onClick={() => navigate(`/admin/quiz/${quiz.id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn error"
                  onClick={() => handleDelete(quiz.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminQuizList;
