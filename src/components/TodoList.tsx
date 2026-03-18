"use client";

import { useState, useEffect } from "react";
import TodoItem, { TodoData } from "./TodoItem";
import AddTodoForm from "./AddTodoForm";

export default function TodoList() {
  const [todos, setTodos] = useState<TodoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (title: string, description: string) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create todo");
    }
    await fetchTodos();
  };

  const handleToggle = async (id: number, completed: boolean) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed })
    });
    if (!res.ok) throw new Error("Failed to update todo");
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t))
    );
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete todo");
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdate = async (id: number, title: string, description: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    });
    if (!res.ok) throw new Error("Failed to update todo");
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div>
      <AddTodoForm onAdd={handleAdd} />

      {error && <div className="todo-error">{error}</div>}

      {totalCount > 0 && (
        <div className="todo-stats">
          <span>{totalCount} total</span>
          <span className="stat-completed">{completedCount} completed</span>
          <span>{totalCount - completedCount} remaining</span>
        </div>
      )}

      {loading ? (
        <div className="todo-loading">Loading todos...</div>
      ) : todos.length === 0 ? (
        <div className="todo-empty">
          <p>📋</p>
          <p>No todos yet. Add one above!</p>
        </div>
      ) : (
        <div className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
