import schemesheet from "@/shared/css/scheme.scss" with { type: "css" };
import presetsheet from "@/shared/css/preset.scss" with { type: "css" };
import utilities from "@/shared/css/utilities.scss" with { type: "css" };
import stylesheet from "./style.scss" with { type: "css" };
import { BaseCheckboxElement } from "@/components/checkboxes/base";

export class Checkbox extends BaseCheckboxElement {
  render() {
    this._root.adoptedStyleSheets = [
      presetsheet,
      utilities,
      schemesheet,
      stylesheet,
    ];
    this._root.innerHTML = /* HTML */ `
      <div class="toggle-checkbox-wrapper">
        <input
          type="checkbox"
          part="input"
          tabindex="-1"
          class="toggle-checkbox"
          id="toggle"
        />
        <label class="slider-btn" for="toggle"></label>
      </div>
    `;

    this.bindings();
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {}

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue || !this._input) return;

    if (name !== "label") this.syncAttributeToChild(name);
  }

  private bindings() {
    this._input = this._root.querySelector<HTMLInputElement>("[part=input]")!;
    for (const name of BaseCheckboxElement.observedAttributes) {
      if (name !== "label") this.syncAttributeToChild(name);
    }
    this.bindCheckboxEvents();
  }
}

if (!customElements.get("sample-checkbox-v2")) {
  customElements.define("sample-checkbox-v2", Checkbox);
}
