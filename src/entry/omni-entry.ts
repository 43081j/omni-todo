import { defineCustomElement } from 'vue';
import OmniEntry from './OmniEntry.vue';

export interface EntryToggleDetail {
  id: string;
  done: boolean;
}

export interface EntryDeleteDetail {
  id: string;
}

export const OmniEntryElement = defineCustomElement(OmniEntry);

customElements.define('omni-entry', OmniEntryElement);

declare global {
  interface HTMLElementTagNameMap {
    'omni-entry': InstanceType<typeof OmniEntryElement>;
  }
}
