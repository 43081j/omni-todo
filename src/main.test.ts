import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import './main.js';
import type { OmniCheckbox } from './checkbox/omni-checkbox.js';
import type { OmniDeleteButton } from './delete-button/omni-delete-button.js';

let app: HTMLElement;

const entries = (): HTMLElement[] => [
  ...app.shadowRoot!.querySelectorAll<HTMLElement>('omni-entry'),
];

const draftInput = (): HTMLInputElement =>
  app
    .shadowRoot!.querySelector('omni-input')!
    .shadowRoot!.querySelector('input')!;

const addButton = (): HTMLButtonElement =>
  app
    .shadowRoot!.querySelector('omni-add-button')!
    .shadowRoot!.querySelector('button')!;

const addTodo = async (title: string): Promise<void> => {
  const input = draftInput();

  input.value = title;
  input.dispatchEvent(new Event('input', { bubbles: true }));

  await vi.waitFor(() => {
    expect(addButton().disabled).toBe(false);
  });

  addButton().click();

  await vi.waitFor(() => {
    expect(entries().map((entry) => entry.getAttribute('label'))).toContain(
      title,
    );
  });
};

const entryTitle = (entry: HTMLElement): string =>
  entry.shadowRoot!.querySelector('.title')!.textContent!;

const checkboxOf = (entry: HTMLElement): OmniCheckbox =>
  entry.shadowRoot!.querySelector<OmniCheckbox>('omni-checkbox')!;

const deleteButtonOf = (entry: HTMLElement): OmniDeleteButton =>
  entry.shadowRoot!.querySelector<OmniDeleteButton>('omni-delete-button')!;

beforeEach(() => {
  app = document.createElement('omni-todo');
  app.setAttribute('heading', 'Things to do');
  document.body.append(app);
});

afterEach(() => {
  app.remove();
});

test('renders the svelte shell', async () => {
  await vi.waitFor(() => {
    expect(app.shadowRoot!.querySelector('h1')!.textContent).toBe(
      'Things to do',
    );
  });

  expect(draftInput().placeholder).toBe('What needs doing?');
  expect(addButton().textContent).toBe('Add');

  expect(app.shadowRoot!.querySelector('.empty')!.textContent).toContain(
    'Nothing to do',
  );
  expect(app.shadowRoot!.querySelector('.count')!.textContent).toContain(
    '0 of 0',
  );
});

test('renders each todo as a vue entry', async () => {
  await addTodo('purge the bloat');
  await addTodo('touch grass');

  expect(entries().map(entryTitle)).toEqual(['purge the bloat', 'touch grass']);
  expect(app.shadowRoot!.querySelector('.count')!.textContent).toContain(
    '2 of 2',
  );
});

test('renders a lit checkbox and a react button per entry', async () => {
  await addTodo('purge the bloat');

  const entry = entries()[0]!;
  const checkbox = checkboxOf(entry);
  const button = deleteButtonOf(entry);

  await vi.waitFor(() => {
    expect(
      checkbox.shadowRoot!.querySelector('input[type="checkbox"]'),
    ).toBeTruthy();
    expect(button.shadowRoot!.querySelector('button')).toBeTruthy();
  });

  expect(
    button.shadowRoot!.querySelector('button')!.getAttribute('aria-label'),
  ).toBe('Delete purge the bloat');
});

test('toggling the lit checkbox updates the svelte state', async () => {
  await addTodo('purge the bloat');

  const entry = entries()[0]!;
  const checkbox = checkboxOf(entry);

  await checkbox.updateComplete;
  checkbox.shadowRoot!.querySelector('input')!.click();

  await vi.waitFor(() => {
    expect(app.shadowRoot!.querySelector('.count')!.textContent).toContain(
      '0 of 1',
    );
  });

  expect(
    entry.shadowRoot!.querySelector('.entry')!.classList.contains('done'),
  ).toBe(true);
});

test('pressing the react button removes the entry', async () => {
  await addTodo('purge the bloat');
  await addTodo('touch grass');

  const button = deleteButtonOf(entries()[0]!);

  await vi.waitFor(() => {
    expect(button.shadowRoot!.querySelector('button')).toBeTruthy();
  });

  button.shadowRoot!.querySelector('button')!.click();

  await vi.waitFor(() => {
    expect(entries().map(entryTitle)).toEqual(['touch grass']);
  });
});

test('emits todos-change from the host element', async () => {
  const changes: unknown[] = [];

  app.addEventListener('todos-change', (event) => {
    changes.push((event as CustomEvent<{ todos: unknown[] }>).detail.todos);
  });

  await addTodo('purge the bloat');

  expect(changes).toHaveLength(1);
  expect(changes[0]).toMatchObject([{ title: 'purge the bloat', done: false }]);
});

test('disables the solid button until the preact input has a value', async () => {
  await vi.waitFor(() => {
    expect(addButton().disabled).toBe(true);
  });

  const input = draftInput();

  input.value = 'purge the bloat';
  input.dispatchEvent(new Event('input', { bubbles: true }));

  await vi.waitFor(() => {
    expect(addButton().disabled).toBe(false);
  });
});

test('adds a todo when enter is pressed in the preact input', async () => {
  const input = draftInput();

  input.value = 'purge the bloat';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
  );

  await vi.waitFor(() => {
    expect(entries().map(entryTitle)).toEqual(['purge the bloat']);
  });
});

test('clears the preact input after adding', async () => {
  await addTodo('purge the bloat');

  await vi.waitFor(() => {
    expect(draftInput().value).toBe('');
  });
});
