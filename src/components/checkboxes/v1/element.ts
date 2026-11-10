import schemesheet from "@/shared/css/scheme.scss" with { type: "css" };
import presetsheet from "@/shared/css/preset.scss" with { type: "css" };
import utilities from "@/shared/css/utilities.scss" with { type: "css" };
import checkboxsheet from "@/shared/css/checkbox.scss" with { type: "css" };
import stylesheet from "./style.scss" with { type: "css" };
import { esc } from "@/shared/utils";
import { BaseCheckboxElement } from "@/components/checkboxes/base";

export class Checkbox extends BaseCheckboxElement {
  render() {
    const label = this.getAttribute("label") || "";

    this._root.adoptedStyleSheets = [
      schemesheet,
      presetsheet,
      utilities,
      checkboxsheet,
      stylesheet,
    ];
    this._root.innerHTML = /* HTML */ `<div
      part="container"
      class="text-md text-primary"
    >
      <input
        type="checkbox"
        part="input"
        class="shadow-on-interaction"
        tabindex="-1"
      />
      <span part="label">
        <slot name="label">
          <span part="fallback-label" ${label ? "" : "hidden"}
            >${esc(label)}</span
          >
        </slot>
      </span>
    </div>`;

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

    if (name === "label") {
      const fallback = this._root.querySelector<HTMLElement>(
        "[part=fallback-label]",
      );
      if (fallback) {
        fallback.textContent = newValue ?? "";
        fallback.hidden = newValue === null || newValue === "";
      }
    } else this.syncAttributeToChild(name);
  }

  private bindings() {
    this._input = this._root.querySelector<HTMLInputElement>("[part=input]")!;
    for (const name of BaseCheckboxElement.observedAttributes) {
      if (name !== "label") this.syncAttributeToChild(name);
    }
    this.bindCheckboxEvents();
  }
}

if (!customElements.get("sample-checkbox-v1")) {
  customElements.define("sample-checkbox-v1", Checkbox);
}
