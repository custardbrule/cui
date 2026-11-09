import schemesheet from "@/shared/css/scheme.scss" with { type: "css" };
import presetsheet from "@/shared/css/preset.scss" with { type: "css" };
import utilities from "@/shared/css/utilities.scss" with { type: "css" };
import checkboxsheet from "@/shared/css/checkbox.scss" with { type: "css" };
import stylesheet from "./style.scss" with { type: "css" };
import { esc } from "@/shared/utils";
import { BaseCheckboxElement } from "@/components/checkboxes/base";

export class Checkbox extends BaseCheckboxElement {
  render() {
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });
    const label = this.getAttribute("label") || "";
    const name = this.getAttribute("name") || "";
    const value = this.getAttribute("value") || "";
    const checked = this.hasAttribute("checked");
    const disabled = this.hasAttribute("disabled");
    const required = this.hasAttribute("required");

    root.adoptedStyleSheets = [
      schemesheet,
      presetsheet,
      utilities,
      checkboxsheet,
      stylesheet,
    ];
    root.innerHTML = /* HTML */ `<div
      part="container"
      class="text-md text-primary"
    >
      <input
        name="${name}"
        value="${value}"
        ${checked ? "checked" : ""}
        ${disabled ? "disabled" : ""}
        ${required ? "required" : ""}
        type="checkbox"
        part="input"
        class="shadow-on-interaction"
        tabindex="-1"
      />
      <span part="label">
        <slot name="label">
          <span ${label ? "" : "hidden"}>${esc(label)}</span>
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
    if (oldValue === newValue || !this._checkbox) return;

    this.render();
  }

  //----integrate form----
  private bindings() {
    this._checkbox = this._root.querySelector("input[type=checkbox]")!;

    this._checkbox.addEventListener("change", (event) => {
      this._internals.setFormValue(this._checkbox?.checked ? this.value : null);

      this.dispatchEvent(
        new Event("change", { composed: true, bubbles: true }),
      );
    });

    if (this._checkbox.checked) {
      this._checkbox.dispatchEvent(
        new Event("change", { composed: true, bubbles: true }),
      );
    }
  }
}

if (!customElements.get("sample-checkbox-v1")) {
  customElements.define("sample-checkbox-v1", Checkbox);
}
