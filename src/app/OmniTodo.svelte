<svelte:options
  customElement={{
    tag: 'omni-todo',
    shadow: 'open',
    props: {heading: {type: 'String', reflect: true}}
  }}
/>

<script lang="ts">
  import '../add-button/OmniAddButton.js';
  import '../entry/omni-entry.js';
  import '../input/OmniInput.js';
  import {
    addTodo,
    countRemaining,
    removeTodo,
    setTodoDone
  } from '../todos.js';
  import type {Todo, TodosChangeDetail} from '../todos.js';
  import type {InputChangeDetail} from '../input/OmniInput.js';
  import type {
    EntryDeleteDetail,
    EntryToggleDetail
  } from '../entry/omni-entry.js';

  interface Props {
    heading?: string;
  }

  const {heading = 'Todo'}: Props = $props();

  let todos = $state<Todo[]>([]);
  let draft = $state('');

  const remaining = $derived(countRemaining(todos));

  const notifyChange = (): void => {
    const detail: TodosChangeDetail = {todos: $state.snapshot(todos)};

    $host().dispatchEvent(
      new CustomEvent('todos-change', {
        detail,
        bubbles: true,
        composed: true
      })
    );
  };

  const onAdd = (): void => {
    const next = addTodo(todos, draft);

    if (next.length === todos.length) {
      return;
    }

    todos = next;
    draft = '';
    notifyChange();
  };

  const onDraftChange = (event: CustomEvent<InputChangeDetail>): void => {
    draft = event.detail.value;
  };

  const onToggle = (event: CustomEvent<EntryToggleDetail>): void => {
    const {detail} = event;

    todos = setTodoDone(todos, detail.id, detail.done);
    notifyChange();
  };

  const onDelete = (event: CustomEvent<EntryDeleteDetail>): void => {
    const {detail} = event;

    todos = removeTodo(todos, detail.id);
    notifyChange();
  };
</script>

<section class="app">
  <div class="frame">
    <header>
      <h1>{heading}</h1>
      <p class="count">
        {remaining} of {todos.length} remaining
      </p>
    </header>

    <div class="controls">
      <omni-input
        value={draft}
        oninput-change={onDraftChange}
        oninput-submit={onAdd}
      ></omni-input>
      <omni-add-button
        disabled={draft.trim() === '' ? 'true' : undefined}
        onadd-click={onAdd}
      ></omni-add-button>
    </div>

    <ul onentry-toggle={onToggle} onentry-delete={onDelete}>
      {#each todos as todo (todo.id)}
        <omni-entry
          todo-id={todo.id}
          label={todo.title}
          done={todo.done ? '' : undefined}
        ></omni-entry>
      {:else}
        <li class="empty">Nothing to do.</li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .app {
    display: block;
    padding: 1.25rem;
    border-radius: 0.75rem;
    background-color: var(--omni-todo-background, #fff);
    color: var(--omni-todo-color, #1a1a1a);
    font-family: var(--omni-todo-font-family, system-ui, sans-serif);
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.12), 0 8px 24px rgb(0 0 0 / 0.08);
  }

  .frame {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    padding: 1.1rem 0.85rem 0.9rem;
    border: 1px dashed color-mix(in srgb, currentColor 22%, transparent);
    border-radius: 0.5rem;
  }

  .frame::before {
    content: 'svelte';
    position: absolute;
    top: -0.4rem;
    left: 0.6rem;
    padding: 0 0.25rem;
    background-color: var(--omni-todo-background, #fff);
    font-size: 0.5rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.45;
  }

  header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }

  h1 {
    margin: 0;
    font-size: 1.25rem;
  }

  .count {
    margin: 0;
    font-size: 0.8rem;
    opacity: 0.6;
  }

  .controls {
    display: flex;
    align-items: stretch;
    gap: 0.5rem;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    margin: 0;
    padding: 0;
  }

  .empty {
    padding: 0.6rem 0.75rem;
    list-style: none;
    opacity: 0.5;
  }
</style>
