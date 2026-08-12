import { describe, expect, test } from 'vitest';
import {
  addTodo,
  countRemaining,
  createTodo,
  removeTodo,
  setTodoDone,
} from './todos.js';

describe('createTodo', () => {
  test('creates an unfinished todo with a unique id', () => {
    const first = createTodo('touch grass');
    const second = createTodo('touch grass');

    expect(first).toMatchObject({ title: 'touch grass', done: false });
    expect(first.id).not.toBe(second.id);
  });
});

describe('addTodo', () => {
  test('appends a trimmed todo', () => {
    const todos = addTodo([], '  purge the bloat  ');

    expect(todos).toHaveLength(1);
    expect(todos[0]?.title).toBe('purge the bloat');
  });

  test('ignores blank titles', () => {
    expect(addTodo([], '   ')).toHaveLength(0);
  });

  test('does not mutate the input', () => {
    const todos = [createTodo('one')];

    addTodo(todos, 'two');

    expect(todos).toHaveLength(1);
  });
});

describe('removeTodo', () => {
  test('removes only the matching todo', () => {
    const first = createTodo('one');
    const second = createTodo('two');

    expect(removeTodo([first, second], first.id)).toEqual([second]);
  });

  test('ignores unknown ids', () => {
    const todos = [createTodo('one')];

    expect(removeTodo(todos, 'nope')).toEqual(todos);
  });
});

describe('setTodoDone', () => {
  test('sets the done state of the matching todo', () => {
    const first = createTodo('one');
    const second = createTodo('two');
    const result = setTodoDone([first, second], second.id, true);

    expect(result[0]?.done).toBe(false);
    expect(result[1]?.done).toBe(true);
  });

  test('does not mutate the matched todo', () => {
    const todo = createTodo('one');

    setTodoDone([todo], todo.id, true);

    expect(todo.done).toBe(false);
  });
});

describe('countRemaining', () => {
  test('counts todos which are not done', () => {
    const todos = [createTodo('one'), createTodo('two'), createTodo('three')];

    expect(countRemaining(setTodoDone(todos, todos[1]!.id, true))).toBe(2);
  });
});
