<script setup lang="ts">
import { computed, useHost } from 'vue';
import '../checkbox/omni-checkbox.js';
import '../delete-button/omni-delete-button.js';
import type { CheckboxChangeDetail } from '../checkbox/omni-checkbox.js';

const props = defineProps<{
  todoId: string;
  label: string;
  done?: boolean;
}>();

const host = useHost();
const isDone = computed(() => props.done === true);

const emitHostEvent = (type: string, detail: unknown): void => {
  host?.dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true }),
  );
};

const onCheckboxChange = (event: Event): void => {
  const { detail } = event as CustomEvent<CheckboxChangeDetail>;

  emitHostEvent('entry-toggle', { id: props.todoId, done: detail.checked });
};

const onDeleteClick = (): void => {
  emitHostEvent('entry-delete', { id: props.todoId });
};
</script>

<template>
  <li class="entry" :class="{ done: isDone }">
    <omni-checkbox
      :checked="isDone || undefined"
      :label="`Mark ${label} as ${isDone ? 'not done' : 'done'}`"
      @checkbox-change.stop="onCheckboxChange"
    />
    <span class="title">{{ label }}</span>
    <omni-delete-button
      :label="`Delete ${label}`"
      @delete-click.stop="onDeleteClick"
    />
  </li>
</template>

<style>
:host {
  display: block;
}

.entry {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  padding: 0.75rem 0.7rem 0.6rem;
  border: 1px dashed color-mix(in srgb, currentColor 22%, transparent);
  border-radius: 0.5rem;
  list-style: none;
}

.entry::before {
  content: 'vue';
  position: absolute;
  top: -0.4rem;
  left: 0.5rem;
  padding: 0 0.25rem;
  background-color: var(--omni-todo-background, #fff);
  font-size: 0.5rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.45;
}

.title {
  flex: 1;
  overflow-wrap: anywhere;
}

.done .title {
  text-decoration: line-through;
  opacity: 0.55;
}
</style>
