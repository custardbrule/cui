import sheet from "@/shared/css/styles.css" with { type: "css" };
import presetsheet from "@/shared/css/preset.css" with { type: "css" };
import stylesheet from "./style.css" with { type: "css" };
import { TEXTAREA_FORWARDED, HANDLER_ATTRS } from "@/shared/constants";
import { esc } from "@/shared/utils";

export class Textarea extends HTMLElement {
  static formAssociated = true;
  private internals = this.attachInternals();
  private _input!: HTMLTextAreaElement;

  get input() {
    return this._input;
  }

  get value() {
    return this._input?.value ?? "";
  }
  set value(v: string) {
    if (!this._input) return;
    this._input.value = v;
    this.syncForm();
  }

  get name() {
    return this.getAttribute("name") ?? "";
  }
  get form() {
    return this.internals.form;
  }
  get validity() {
    return this.internals.validity;
  }
  get validationMessage() {
    return this.internals.validationMessage;
  }
  checkValidity() {
    return this.internals.checkValidity();
  }
  reportValidity() {
    return this.internals.reportValidity();
  }

  static get observedAttributes() {
    return ["label", "value", ...TEXTAREA_FORWARDED, ...HANDLER_ATTRS];
  }

  private build() {
    const root =
      this.shadowRoot ||
      this.attachShadow({ mode: "open", delegatesFocus: true });

    root.addEventListener("input", () => this.syncForm());
    root.addEventListener("change", () => {
      this.syncForm();
      // native `change` is not composed, so re-emit it from the host
      this.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  render() {
    const root =
      this.shadowRoot ||
      this.attachShadow({ mode: "open", delegatesFocus: true });
    const label = this.getAttribute("label");
    const required = this.hasAttribute("required");

    const typed = this._input?.value;

    root.adoptedStyleSheets = [sheet, presetsheet, stylesheet];
    root.innerHTML = /* HTML */ ` <div class="wrapper">
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
        class="text-primary border-medium"
      ></textarea>
    </div>`;

    this._input = root.querySelector<HTMLTextAreaElement>("[part=textarea]")!;
    for (const name of Textarea.observedAttributes)
      this.syncAttributeToChild(name);

    // keep typed text across re-renders, else use the value attribute
    this._input.value = typed ?? this.getAttribute("value") ?? "";
    this.syncForm();
  }

  connectedCallback() {
    if (!this.shadowRoot) this.build();
    this.render();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue || !this._input) return;

    if (name === "label" || name === "required") {
      this.render();
    } else if (name === "value") {
      this._input.value = newValue ?? "";
      this.syncForm();
    } else {
      this.syncAttributeToChild(name);
      this.syncForm();
    }
  }

  private syncAttributeToChild(name: string) {
    if (!this._input) return;

    const target = name.startsWith("c-on") ? name.slice(2) : name;
    const value = this.getAttribute(name);
    if (value !== null) this._input.setAttribute(target, value);
    else this._input.removeAttribute(target);
  }

  private syncForm() {
    const t = this._input;
    if (!t) return;
    this.internals.setFormValue(t.value);
    if (t.validity.valid) this.internals.setValidity({});
    else this.internals.setValidity(t.validity, t.validationMessage, t);
  }

  formResetCallback() {
    this._input.value = this.getAttribute("value") ?? "";
    this.syncForm();
  }
  formDisabledCallback(disabled: boolean) {
    this._input.disabled = disabled; // also fires for <fieldset disabled>
  }
  formStateRestoreCallback(state: string) {
    this._input.value = state; // back/forward navigation, autofill
    this.syncForm();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sample-textarea-v1": Textarea;
  }
}

if (!customElements.get("sample-textarea-v1")) {
  customElements.define("sample-textarea-v1", Textarea);
}
