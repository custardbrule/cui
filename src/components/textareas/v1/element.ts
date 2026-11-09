import schemesheet from "@/shared/css/scheme.scss" with { type: "css" };
import presetsheet from "@/shared/css/preset.scss" with { type: "css" };
import utilities from "@/shared/css/utilities.scss" with { type: "css" };
import stylesheet from "./style.scss" with { type: "css" };
import { TEXTAREA_FORWARDED, HANDLER_ATTRS } from "@/shared/constants";
import { esc } from "@/shared/utils";
import { BaseTextAreaElement } from "@/components/textareas/base";

export class Textarea extends BaseTextAreaElement {
  static get observedAttributes() {
    return ["label", "value", ...TEXTAREA_FORWARDED, ...HANDLER_ATTRS];
  }

  private syncAttributeToChild(name: string) {
    if (!this._input) return;

    const target = name.startsWith("c-on") ? name.slice(2) : name;
    const value = this.getAttribute(name);
    if (value !== null) this._input.setAttribute(target, value);
    else this._input.removeAttribute(target);
  }

  private bindings() {
    this._input =
      this._root.querySelector<HTMLTextAreaElement>("[part=textarea]")!;

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

    for (const name of Textarea.observedAttributes)
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
      ${
        label
          ? `<label for="inner-textarea" class="font-semibold text-md text-primary">${esc(label)}${
              required ? `<span class="required">*</span>` : ""
            }</label>`
          : ""
      }
      <textarea
        id="inner-textarea"
        part="textarea"
        class="text-primary border-medium shadow-on-interaction round-sm"
      ></textarea>
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

if (!customElements.get("sample-textarea-v1")) {
  customElements.define("sample-textarea-v1", Textarea);
}
