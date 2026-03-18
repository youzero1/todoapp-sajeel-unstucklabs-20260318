"use client";

import { useState } from "react";

export interface TodoData {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: TodoData;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string, description: string) => Promise<void>;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(todo.id, !todo.completed);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${todo.title}"?`)) return;
    setLoading(true);
    try {
      await onDelete(todo.id);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!editTitle.trim()) return;
    setLoading(true);
    try {
      await onUpdate(todo.id, editTitle.trim(), editDescription.trim());
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setIsEditing(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-item-header">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={loading}
        />
        <div className="todo-content">
          <div className={`todo-title ${todo.completed ? "completed-text" : ""}`}>
            {todo.title}
          </div>
          {todo.description && (
            <div className="todo-description">{todo.description}</div>
          )}
          <div className="todo-meta">Created: {formatDate(todo.createdAt)}</div>
        </div>
        <div className="todo-actions">
          {!isEditing && (
            <button
              className="btn btn-secondary"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              ✏️ Edit
            </button>
          )}
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="edit-form">
          <div className="form-group">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description (optional)"
              disabled={loading}
            />
          </div>
          <div className="edit-actions">
            <button
              className="btn btn-save"
              onClick={handleEditSave}
              disabled={loading || !editTitle.trim()}
            >
              ✓ Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleEditCancel}
              disabled={loading}
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
