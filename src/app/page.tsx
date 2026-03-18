import TodoList from "../components/TodoList";

export default function Home() {
  return (
    <main className="container">
      <h1>📝 Todo App</h1>
      <p className="subtitle">Stay organized and get things done</p>
      <TodoList />
    </main>
  );
}
