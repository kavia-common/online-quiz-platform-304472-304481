import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../state/AuthContext";

// PUBLIC_INTERFACE
/**
 * UserProfile allows users to view and update their account information.
 */
function UserProfile() {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({ email: "", name: "" });
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.user
      .get()
      .then((data) => {
        setProfile(data);
        setNewName(data?.name || "");
      })
      .catch(() => setError("Could not load profile"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await api.user.update({ ...profile, name: newName });
      setProfile(updated);
      setEditing(false);
      setUser && setUser(updated);
      setSuccess(true);
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="card">Loading profile...</div>;
  if (error)
    return (
      <div className="card" style={{ color: "var(--color-error)" }}>
        {error}
      </div>
    );

  return (
    <div className="card">
      <div className="heading">My Profile</div>
      <div>
        <label>Email</label>
        <input type="email" value={profile.email} disabled style={{ width: "100%" }} />
      </div>
      <div>
        <label>Name</label>
        {editing ? (
          <input value={newName} onChange={(e) => setNewName(e.target.value)} style={{ width: "100%" }} />
        ) : (
          <input value={profile.name || ""} disabled style={{ width: "100%" }} />
        )}
      </div>
      <div style={{ marginTop: "1rem" }}>
        {editing ? (
          <>
            <button className="btn" style={{ marginRight: "1rem" }} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button className="btn secondary" onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </button>
          </>
        ) : (
          <button className="btn" onClick={() => setEditing(true)}>
            Edit Name
          </button>
        )}
      </div>
      {success && (
        <div style={{ color: "var(--color-success)", marginTop: 8 }}>Saved successfully</div>
      )}
      {error && (
        <div style={{ color: "var(--color-error)", marginTop: 8 }}>{error}</div>
      )}
    </div>
  );
}

export default UserProfile;
