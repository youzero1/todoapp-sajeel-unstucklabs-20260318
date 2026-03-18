"use client";

import { useState, FormEvent } from "react";

interface AddTodoFormProps {
  onAdd: (title: string, description: string) => Promise<void>;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onAdd(title.trim(), description.trim());
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-form">
      <h2>Add New Todo</h2>
      {error && <div className="todo-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title <span style={{ color: "#ef4444" }}>*</span></label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description <span style={{ color: "var(--text-light)", fontSize: "0.8rem" }}>(optional)</span></label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "+ Add Todo"}
        </button>
      </form>
    </div>
  );
}
