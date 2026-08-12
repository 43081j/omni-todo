export interface Todo {
  id: string;
  title: string;
  done: boolean;
}

export interface TodosChangeDetail {
  todos: Todo[];
}

let counter = 0;

export const createTodo = (title: string): Todo => ({
  id: `todo-${++counter}`,
  title,
  done: false,
});

export const addTodo = (todos: readonly Todo[], title: string): Todo[] => {
  const trimmed = title.trim();

  if (trimmed === '') {
    return [...todos];
  }

  return [...todos, createTodo(trimmed)];
};

export const removeTodo = (todos: readonly Todo[], id: string): Todo[] =>
  todos.filter((todo) => todo.id !== id);

export const setTodoDone = (
  todos: readonly Todo[],
  id: string,
  done: boolean,
): Todo[] => todos.map((todo) => (todo.id === id ? { ...todo, done } : todo));

export const countRemaining = (todos: readonly Todo[]): number =>
  todos.reduce((count, todo) => (todo.done ? count : count + 1), 0);
