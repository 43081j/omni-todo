import { LitElement, css, html } from 'lit';
import type { PropertyValues } from 'lit';

export interface CheckboxChangeDetail {
  checked: boolean;
}

export class OmniCheckbox extends LitElement {
  public static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      position: relative;
      padding: 0.45rem 0.4rem 0.3rem;
      border: 1px dashed color-mix(in srgb, currentColor 22%, transparent);
      border-radius: 0.4rem;
    }

    :host::before {
      content: 'lit';
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
      appearance: none;
      margin: 0;
      width: 1.15rem;
      height: 1.15rem;
      border: 2px solid currentColor;
      border-radius: 0.25rem;
      color: inherit;
      cursor: pointer;
      display: grid;
      place-content: center;
    }

    input::before {
      content: '';
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 0.1rem;
      transform: scale(0);
      transition: transform 120ms ease-in-out;
      background-color: currentColor;
    }

    input:checked::before {
      transform: scale(1);
    }

    input:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
  `;

  public static override properties = {
    checked: { type: Boolean, reflect: true },
    label: { type: String },
  };

  /**
   * Whether the checkbox is checked.
   */
  declare public checked: boolean;

  /**
   * Accessible label of the checkbox.
   */
  declare public label: string;

  public constructor() {
    super();

    this.checked = false;
    this.label = '';
  }

  public override render() {
    return html`
      <input
        type="checkbox"
        .checked=${this.checked}
        aria-label=${this.label}
        @change=${this.#onChange}
      />
    `;
  }

  protected override firstUpdated(changed: PropertyValues<this>): void {
    super.firstUpdated(changed);

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'presentation');
    }
  }

  #onChange = (event: Event): void => {
    const input = event.target as HTMLInputElement;

    this.checked = input.checked;

    this.dispatchEvent(
      new CustomEvent<CheckboxChangeDetail>('checkbox-change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

customElements.define('omni-checkbox', OmniCheckbox);

declare global {
  interface HTMLElementTagNameMap {
    'omni-checkbox': OmniCheckbox;
  }
}
