import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { DeleteButton } from './DeleteButton.js';

const styleSheet = new CSSStyleSheet();

styleSheet.replaceSync(`
  :host {
    display: inline-flex;
    position: relative;
    padding: 0.4rem 0.35rem 0.25rem;
    border: 1px dashed color-mix(in srgb, currentColor 22%, transparent);
    border-radius: 0.4rem;
  }

  :host::before {
    content: 'react';
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
    display: grid;
    place-content: center;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    border: none;
    border-radius: 0.25rem;
    background: none;
    color: inherit;
    cursor: pointer;
    opacity: 0.55;
    transition: opacity 120ms ease-in-out, background-color 120ms ease-in-out;
  }

  button:hover:not(:disabled),
  button:focus-visible {
    opacity: 1;
    background-color: color-mix(in srgb, currentColor 15%, transparent);
  }

  button:disabled {
    cursor: default;
    opacity: 0.25;
  }

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`);

export class OmniDeleteButton extends HTMLElement {
  public static readonly observedAttributes = ['label', 'disabled'];

  readonly #container: HTMLDivElement;
  #root: Root | null = null;
  #pendingUnmount = false;

  public constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.adoptedStyleSheets = [styleSheet];

    this.#container = document.createElement('div');
    shadowRoot.append(this.#container);
  }

  /**
   * Accessible label of the button.
   */
  public get label(): string {
    return this.getAttribute('label') ?? 'Delete';
  }

  public set label(value: string) {
    this.setAttribute('label', value);
  }

  /**
   * Whether the button is disabled.
   */
  public get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  public set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  public connectedCallback(): void {
    this.#pendingUnmount = false;
    this.#root ??= createRoot(this.#container);
    this.#render();
  }

  public disconnectedCallback(): void {
    this.#pendingUnmount = true;

    queueMicrotask(() => {
      if (this.#pendingUnmount) {
        this.#pendingUnmount = false;
        this.#root?.unmount();
        this.#root = null;
      }
    });
  }

  public attributeChangedCallback(): void {
    if (this.#root !== null) {
      this.#render();
    }
  }

  #render(): void {
    this.#root?.render(
      createElement(DeleteButton, {
        label: this.label,
        disabled: this.disabled,
        onDelete: this.#onDelete,
      }),
    );
  }

  #onDelete = (): void => {
    this.dispatchEvent(
      new CustomEvent('delete-click', { bubbles: true, composed: true }),
    );
  };
}

customElements.define('omni-delete-button', OmniDeleteButton);

declare global {
  interface HTMLElementTagNameMap {
    'omni-delete-button': OmniDeleteButton;
  }
}
