import sheet from "@/shared/css/styles.css" with { type: "css" };
import presetsheet from "@/shared/css/preset.css" with { type: "css" };
import radiosheet from "@/shared/css/radio.css" with { type: "css" };
import stylesheet from "./style.css" with { type: "css" };
import { BaseRadioElement } from "@/components/radios/base";

export class Radio extends BaseRadioElement {
  render() {
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });
    const label = this.getAttribute("label") || "";
    const name = this.getAttribute("name") || "";
    const value = this.getAttribute("value") || "";
    const checked = this.hasAttribute("checked");
    const disabled = this.hasAttribute("disabled");
    const required = this.hasAttribute("required");

    root.adoptedStyleSheets = [sheet, presetsheet, radiosheet, stylesheet];
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
        type="radio"
        part="input"
        tabindex="-1"
      />
      <span part="label">${label}</span>
    </div>`;

    this.bindings();
    this.sync();
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
    if (oldValue === newValue || !this._radio) return;

    this.render();
  }

  //----integrate form----
  sync() {
    const checked = this.radio?.checked ?? false;
    this._internals.setFormValue(checked ? this.value : null);
  }

  private bindings() {
    this._radio = this._root.querySelector("input[type=radio]")!;
    this._radio.addEventListener("change", (event) => {
      const scope = (this._internals.form ?? this.getRootNode()) as ParentNode;
      scope
        .querySelectorAll<Radio>(`[c-radio][name="${this.name}"]`)
        .forEach((input: BaseRadioElement) => {
          if (input.value !== this.value) {
            input.radio!.checked = false;
          }

          const checked = input.checked ?? false;
          input.internals.setFormValue(checked ? input.value : null);
        });
      this.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }
}

if (!customElements.get("sample-radio-v1")) {
  customElements.define("sample-radio-v1", Radio);
}
