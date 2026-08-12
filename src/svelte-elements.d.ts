import type { HTMLAttributes } from 'svelte/elements';
import type { CheckboxChangeDetail } from './checkbox/omni-checkbox.js';
import type {
  EntryDeleteDetail,
  EntryToggleDetail,
} from './entry/omni-entry.js';
import type { InputChangeDetail } from './input/OmniInput.js';
import type { TodosChangeDetail } from './todos.js';

declare module 'svelte/elements' {
  interface HTMLAttributes<T extends EventTarget> {
    'onentry-toggle'?: (event: CustomEvent<EntryToggleDetail>) => void;
    'onentry-delete'?: (event: CustomEvent<EntryDeleteDetail>) => void;
    'oncheckbox-change'?: (event: CustomEvent<CheckboxChangeDetail>) => void;
    'ondelete-click'?: (event: CustomEvent<void>) => void;
    'oninput-change'?: (event: CustomEvent<InputChangeDetail>) => void;
    'oninput-submit'?: (event: CustomEvent<void>) => void;
    'onadd-click'?: (event: CustomEvent<void>) => void;
    'ontodos-change'?: (event: CustomEvent<TodosChangeDetail>) => void;
  }

  interface SvelteHTMLElements {
    'omni-entry': HTMLAttributes<HTMLElement> & {
      'todo-id': string;
      label: string;
      done?: '' | undefined;
    };
    'omni-input': HTMLAttributes<HTMLElement> & {
      value?: string;
    };
    'omni-add-button': HTMLAttributes<HTMLElement> & {
      disabled?: 'true' | undefined;
    };
  }
}
