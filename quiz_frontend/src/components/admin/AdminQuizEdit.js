import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

// PUBLIC_INTERFACE
/**
 * AdminQuizEdit: edit quiz details and manage questions for a quiz (CRUD).
 */
function AdminQuizEdit() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For quiz edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingQuiz, setSavingQuiz] = useState(false);

  // For question add
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [newAnswerIdx, setNewAnswerIdx] = useState(0);
  const [creatingQ, setCreatingQ] = useState(false);

  function refresh() {
    setLoading(true);
    api.admin
      .listQuizzes()
      .then((qs) => setQuiz(qs.find((q) => String(q.id) === String(quizId))))
      .catch(() => setError("Could not load quiz"))
      .finally(() => {});
    api.admin
      .getQuestions(quizId)
      .then((qs) => setQuestions(qs))
      .catch(() => setError("Failed to load questions"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [quizId]);

  useEffect(() => {
    if (quiz) {
      setEditTitle(quiz.title);
      setEditDescription(quiz.description);
    }
  }, [quiz]);

  async function handleQuizSave(e) {
    e.preventDefault();
    setSavingQuiz(true);
    try {
      await api.admin.updateQuiz(quizId, {
        title: editTitle,
        description: editDescription,
      });
      setQuiz({ ...quiz, title: editTitle, description: editDescription });
    } catch {
      setError("Failed to save quiz changes");
    } finally {
      setSavingQuiz(false);
    }
  }

  async function createQuestion(e) {
    e.preventDefault();
    setCreatingQ(true);
    if (!newQuestion.trim() || newOptions.some((o) => !o.trim()))
      return setError("Fill question/options");
    try {
      await api.admin.createQuestion(quizId, {
        text: newQuestion,
        options: newOptions.map((text, i) => ({
          text,
          correct: i === Number(newAnswerIdx),
        })),
      });
      setNewQuestion("");
      setNewOptions(["", ""]);
      setNewAnswerIdx(0);
      refresh();
    } catch {
      setError("Failed to create question");
    } finally {
      setCreatingQ(false);
    }
  }

  async function deleteQuestion(qid) {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.admin.deleteQuestion(quizId, qid);
      setQuestions((prev) => prev.filter((q) => q.id !== qid));
    } catch {
      setError("Failed to delete question");
    }
  }

  async function handleOptionChange(idx, value) {
    setNewOptions((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  }

  async function handleAddOption() {
    setNewOptions((prev) => [...prev, ""]);
  }

  async function handleRemoveOption(idx) {
    if (newOptions.length <= 2) return; // minimum 2
    setNewOptions((prev) => prev.filter((_, i) => i !== idx));
    // Adjust answer idx if needed
    if (newAnswerIdx >= newOptions.length - 1) setNewAnswerIdx(0);
  }

  return (
    <div className="card">
      <div className="heading">Admin: Edit Quiz</div>
      {loading ? (
        "Loading…"
      ) : (
        <>
          <form style={{ marginBottom: "1.5em" }} onSubmit={handleQuizSave}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
            />
            <button className="btn" type="submit" disabled={savingQuiz}>
              {savingQuiz ? "Saving..." : "Save Quiz"}
            </button>
            <button
              className="btn secondary"
              type="button"
              style={{ marginLeft: 8 }}
              onClick={() => navigate("/admin")}
            >
              Back to list
            </button>
          </form>
          <hr
            style={{
              border: 0,
              borderTop: "1.5px solid #232425",
              margin: "1em 0",
            }}
          />
          <div style={{ marginBottom: "0.8em" }}>
            <b>Questions</b>
          </div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {questions.map((q, i) => (
              <li
                key={q.id}
                style={{
                  marginBottom: "1.15em",
                  background: "#293040",
                  borderRadius: 7,
                  padding: "0.8em",
                  position: "relative",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>
                  Q{i + 1}.
                </span>{" "}
                <span>{q.text}</span>
                <button
                  className="btn error"
                  style={{ position: "absolute", top: 10, right: 10 }}
                  onClick={() => deleteQuestion(q.id)}
                >
                  Delete
                </button>
                <ul style={{ margin: "0.6em 0 0 1em" }}>
                  {q.options.map((o) => (
                    <li
                      key={o.id}
                      style={{
                        color: o.correct
                          ? "var(--color-success)"
                          : "var(--color-text)",
                        fontWeight: o.correct ? 600 : 400,
                        marginBottom: 2,
                      }}
                    >
                      {o.text} {o.correct ? "(correct)" : ""}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <form onSubmit={createQuestion}>
            <div style={{ marginTop: 18, marginBottom: 10 }}>
              <b>Add New Question</b>
            </div>
            <input
              type="text"
              placeholder="Question text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              required
            />
            {newOptions.map((opt, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <input
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <input
                  type="radio"
                  name="correctOption"
                  checked={Number(newAnswerIdx) === idx}
                  onChange={() => setNewAnswerIdx(idx)}
                  style={{ marginLeft: 10 }}
                  aria-label="Correct answer"
                />
                <span style={{ marginLeft: 2, color: "#bbf7d0" }}>Correct</span>
                {newOptions.length > 2 && (
                  <button
                    className="btn error"
                    type="button"
                    style={{ marginLeft: 6, fontSize: 13, padding: "0.2em 0.7em" }}
                    onClick={() => handleRemoveOption(idx)}
                  >
                    x
                  </button>
                )}
              </div>
            ))}
            <button
              className="btn secondary"
              type="button"
              onClick={handleAddOption}
              style={{ margin: "0 0 0.7em 0" }}
            >
              Add Option
            </button>
            <div>
              <button className="btn" disabled={creatingQ} type="submit" style={{ marginTop: 4 }}>
                {creatingQ ? "Adding..." : "Add Question"}
              </button>
            </div>
          </form>
          {error && (
            <div style={{ color: "var(--color-error)", marginTop: "1em" }}>{error}</div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminQuizEdit;
