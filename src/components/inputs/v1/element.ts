import schemesheet from "@/shared/css/scheme.scss" with { type: "css" };
import presetsheet from "@/shared/css/preset.scss" with { type: "css" };
import utilities from "@/shared/css/utilities.scss" with { type: "css" };
import stylesheet from "./style.scss" with { type: "css" };
import { FORWARDED, HANDLER_ATTRS } from "@/shared/constants";
import { esc } from "@/shared/utils";
import { BaseInputElement } from "@/components/inputs/base";

export class Input extends BaseInputElement {
  static get observedAttributes() {
    return ["label", "value", ...FORWARDED, ...HANDLER_ATTRS];
  }

  private syncAttributeToChild(name: string) {
    if (!this._input) return;

    const target = name.startsWith("c-on") ? name.slice(2) : name;
    const value = this.getAttribute(name);
    if (value !== null) this._input.setAttribute(target, value);
    else this._input.removeAttribute(target);
  }

  private bindings() {
    this._input = this._root.querySelector<HTMLInputElement>("[part=input]")!;

    this._input.addEventListener("change", () => {
      this.internals.setFormValue(this._input!.value);
      if (this._input!.validity.valid) this.internals.setValidity({});
      else
        this.internals.setValidity(
          this._input!.validity,
          this._input!.validationMessage,
          this._input!,
        );

      this.dispatchEvent(new Event("change", { bubbles: true }));
    });

    this._input.addEventListener("keydown", (e) => {
      const k = e as KeyboardEvent;
      if (k.key === "Enter" && !k.isComposing) this.form?.requestSubmit();
    });

    for (const name of Input.observedAttributes)
      this.syncAttributeToChild(name);
    this._input.dispatchEvent(new Event("change"));
  }

  render() {
    const label = this.getAttribute("label");
    const required = this.hasAttribute("required");

    this._root.adoptedStyleSheets = [
      presetsheet,
      utilities,
      schemesheet,
      stylesheet,
    ];
    this._root.innerHTML = /* HTML */ ` <div class="wrapper">
      <slot name="label">
        <label
          id="input-label"
          class="font-semibold text-md text-primary"
          ${label ? "" : "hidden"}
          >${esc(label || "")}${required ? `<span class="required">*</span>` : ""}</label
        >
      </slot>
      <div
        id="input-container"
        class="text-primary border-medium shadow-on-interaction round-sm"
      >
        <slot name="left-icon"></slot>
        <input id="inner-input" part="input" />
        <slot name="right-icon"></slot>
      </div>
    </div>`;

    this.bindings();
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue || !this._input) return;
    this.render();
  }
}

if (!customElements.get("sample-input-v1")) {
  customElements.define("sample-input-v1", Input);
}
