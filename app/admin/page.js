"use client";

import { useEffect, useState } from "react";

const PROOF_TYPES = [
  { value: "text", label: "Text / Quote" },
  { value: "image", label: "Image / Screenshot" },
  { value: "pdf", label: "PDF" },
  { value: "video", label: "Video (direct file link)" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram Reel" },
];

function emptyProof() {
  return { type: "text", url: "", label: "", note: "" };
}

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => {
        setLoggedIn(d.loggedIn);
        setChecking(false);
      });
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setLoggedIn(true);
    } else {
      setLoginError("Galat password. Dobara koshish karein.");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false);
  }

  if (checking) {
    return <p className="text-center py-16 text-gray-500">Check ho raha hai...</p>;
  }

  if (!loggedIn) {
    return (
      <section className="max-w-sm mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold text-brand-dark mb-6 text-center">
          Admin Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-brand-gold/50 rounded-lg px-4 py-3"
            required
          />
          {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-brand-dark text-brand-cream py-3 rounded-lg font-semibold"
          >
            Login
          </button>
        </form>
      </section>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }) {
  const [questions, setQuestions] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [editingId, setEditingId] = useState(null); // null = new question mode
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [proofs, setProofs] = useState([emptyProof()]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadList() {
    setLoadingList(true);
    const res = await fetch("/api/questions?page=1");
    const json = await res.json();
    setQuestions(json.questions || []);
    setLoadingList(false);
  }

  useEffect(() => {
    loadList();
  }, []);

  function resetForm() {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setProofs([emptyProof()]);
    setMessage("");
  }

  async function startEdit(id) {
    setMessage("");
    const res = await fetch(`/api/questions/${id}`);
    const json = await res.json();
    setEditingId(id);
    setQuestion(json.question.question);
    setAnswer(json.question.answer);
    setProofs(
      json.proofs.length > 0
        ? json.proofs.map((p) => ({
            type: p.type,
            url: p.url || "",
            label: p.label || "",
            note: p.note || "",
          }))
        : [emptyProof()]
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Kya aap wakai is sawal ko delete karna chahte hain?")) return;
    const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
    if (res.ok) {
      loadList();
      if (editingId === id) resetForm();
    }
  }

  function updateProof(index, field, value) {
    setProofs((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  }

  function addProofRow() {
    setProofs((prev) => [...prev, emptyProof()]);
  }

  function removeProofRow(index) {
    setProofs((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = { question, answer, proofs };
    const url = editingId ? `/api/questions/${editingId}` : "/api/questions";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (res.ok) {
      setMessage(editingId ? "Update ho gaya!" : "Naya sawal add ho gaya!");
      resetForm();
      loadList();
    } else {
      const json = await res.json();
      setMessage("Error: " + (json.error || "Kuch ghalat ho gaya"));
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-brand-dark">Admin Panel</h1>
        <button
          onClick={onLogout}
          className="text-sm border border-brand-gold px-4 py-2 rounded-full"
        >
          Logout
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-brand-gold/40 rounded-xl p-6 space-y-5 mb-10"
      >
        <h2 className="font-semibold text-brand-dark">
          {editingId ? "Sawal Update Karein" : "Naya Sawal Add Karein"}
        </h2>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Sawal *</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            rows={2}
            className="w-full border border-brand-gold/40 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Jawab *</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            rows={6}
            className="w-full border border-brand-gold/40 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-600">Proofs / Hawale</label>
            <button
              type="button"
              onClick={addProofRow}
              className="text-sm text-brand-gold underline"
            >
              + Aur Proof Add Karein
            </button>
          </div>

          <div className="space-y-4">
            {proofs.map((p, i) => (
              <div
                key={i}
                className="border border-dashed border-brand-gold/50 rounded-lg p-4 space-y-2"
              >
                <div className="flex gap-2">
                  <select
                    value={p.type}
                    onChange={(e) => updateProof(i, "type", e.target.value)}
                    className="border border-brand-gold/40 rounded-lg px-2 py-2 text-sm"
                  >
                    {PROOF_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Label (misaal: Fatawa Rahimiya, Jild 2, Safha 45)"
                    value={p.label}
                    onChange={(e) => updateProof(i, "label", e.target.value)}
                    className="flex-1 border border-brand-gold/40 rounded-lg px-3 py-2 text-sm"
                  />
                  {proofs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProofRow(i)}
                      className="text-red-600 text-sm px-2"
                    >
                      Hatayein
                    </button>
                  )}
                </div>

                {p.type !== "text" && (
                  <input
                    type="url"
                    placeholder="URL yaha daalein (image/pdf/video/youtube/instagram link)"
                    value={p.url}
                    onChange={(e) => updateProof(i, "url", e.target.value)}
                    className="w-full border border-brand-gold/40 rounded-lg px-3 py-2 text-sm"
                  />
                )}

                <textarea
                  placeholder={
                    p.type === "text"
                      ? "Quote ya reference text yaha likhein"
                      : "Extra note (optional)"
                  }
                  value={p.note}
                  onChange={(e) => updateProof(i, "note", e.target.value)}
                  rows={2}
                  className="w-full border border-brand-gold/40 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {message && <p className="text-sm text-brand-dark">{message}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-dark text-brand-cream px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {saving ? "Save ho raha hai..." : editingId ? "Update Karein" : "Add Karein"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 rounded-lg border border-brand-gold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* LIST */}
      <div>
        <h2 className="font-semibold text-brand-dark mb-4">
          Sab Sawalaat ({questions.length})
        </h2>
        {loadingList && <p className="text-gray-500">Load ho raha hai...</p>}
        <ul className="space-y-3">
          {questions.map((q) => (
            <li
              key={q.id}
              className="flex items-center justify-between gap-4 border border-brand-gold/30 rounded-lg p-4 bg-white"
            >
              <span className="text-brand-dark">{q.question}</span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(q.id)}
                  className="text-sm border border-brand-gold px-3 py-1 rounded-full"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="text-sm border border-red-400 text-red-600 px-3 py-1 rounded-full"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
