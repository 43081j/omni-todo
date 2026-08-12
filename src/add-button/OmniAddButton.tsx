/** @jsxImportSource solid-js */
import { customElement } from 'solid-element';
import type { JSX } from 'solid-js';

export interface AddButtonProps {
  disabled: boolean;
}

const styles = `
  :host {
    display: inline-flex;
    position: relative;
    padding: 0.4rem 0.35rem 0.25rem;
    border: 1px dashed color-mix(in srgb, currentColor 22%, transparent);
    border-radius: 0.4rem;
  }

  :host::before {
    content: 'solid';
    position: absolute;
    top: -0.4rem;
    left: 0.3rem;
    padding: 0 0.25rem;
    background-color: var(--omni-todo-background, #fff);
    font-size: 0.5rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.45;
  }

  button {
    padding: 0.5rem 0.9rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--omni-todo-accent, #2f6fed);
    color: #fff;
    font: inherit;
    cursor: pointer;
  }

  button:disabled {
    cursor: default;
    opacity: 0.45;
  }

  button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 1px;
  }
`;

export const OmniAddButton = customElement(
  'omni-add-button',
  { disabled: false },
  (props, { element }): JSX.Element => {
    const onClick = (): void => {
      element.dispatchEvent(
        new CustomEvent('add-click', { bubbles: true, composed: true }),
      );
    };

    return (
      <>
        <style>{styles}</style>
        <button
          type="button"
          part="button"
          disabled={props.disabled}
          onClick={onClick}
        >
          Add
        </button>
      </>
    );
  },
);

declare global {
  interface HTMLElementTagNameMap {
    'omni-add-button': InstanceType<typeof OmniAddButton>;
  }
}
