/** @jsxImportSource preact */
import type { JSX } from 'preact';
import register from 'preact-custom-element';

export interface OmniInputProps {
  value?: string;
}

export interface InputChangeDetail {
  value: string;
}

const styleSheet = new CSSStyleSheet();

styleSheet.replaceSync(`
  :host {
    display: flex;
    flex: 1;
    position: relative;
    padding: 0.4rem 0.35rem 0.25rem;
    border: 1px dashed color-mix(in srgb, currentColor 22%, transparent);
    border-radius: 0.4rem;
  }

  :host::before {
    content: 'preact';
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

  input {
    flex: 1;
    min-width: 0;
    padding: 0.5rem 0.65rem;
    border: 1px solid color-mix(in srgb, currentColor 25%, transparent);
    border-radius: 0.5rem;
    background: none;
    color: inherit;
    font: inherit;
  }

  input:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 1px;
  }
`);

const emit = (target: EventTarget, type: string, detail?: unknown): void => {
  target.dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true }),
  );
};

export const OmniInput = (props: OmniInputProps): JSX.Element => {
  const { value = '' } = props;

  return (
    <input
      type="text"
      part="input"
      placeholder="What needs doing?"
      aria-label="New todo"
      value={value}
      onInput={(event) => {
        const detail: InputChangeDetail = { value: event.currentTarget.value };

        emit(event.currentTarget, 'input-change', detail);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          emit(event.currentTarget, 'input-submit');
        }
      }}
    />
  );
};

register(OmniInput, 'omni-input', ['value'], {
  shadow: true,
  adoptedStyleSheets: [styleSheet],
});
