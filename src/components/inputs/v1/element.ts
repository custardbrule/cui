import sheet from "@/shared/css/styles.css" with { type: "css" };
import presetsheet from "@/shared/css/preset.css" with { type: "css" };
import stylesheet from "./style.css" with { type: "css" };
import { FORWARDED, HANDLER_ATTRS } from "@/shared/constants";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const HOST_HANDLED = new Set(["name", "value"]);
const SYNCED = [...FORWARDED, ...HANDLER_ATTRS].filter(
  (n) => !HOST_HANDLED.has(n),
);

/**
 * Text input with a label and icon slots.
 *
 * @tagname sample-input-v1
 * @attr {string} label - Text shown before the input.
 * @attr {string} name - Name used when the form is submitted.
 * @attr {string} value - Initial value (use the `value` property for live updates).
 * @attr {boolean} required - Marks the field required and shows an asterisk.
 * @attr {string} placeholder - Forwarded to the inner input.
 * @attr {string} c-oninput - Handler code, becomes `oninput` on the inner input.
 * @attr {string} c-onchange - Handler code, becomes `onchange` on the inner input.
 *
 * @slot left-icon - Placed before the input.
 * @slot right-icon - Placed after the input.
 *
 * @csspart input - The inner `<input>`.
 */
export class Input extends HTMLElement {
  static formAssociated = true;
  private internals = this.attachInternals();
  private _input!: HTMLInputElement;

  get input() {
    return this._input;
  }

  // NEW: form-facing API
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
    return ["label", "value", ...SYNCED];
  }

  private build() {
    const root = this.attachShadow({ mode: "open", delegatesFocus: true });

    root.addEventListener("input", () => this.syncForm());
    root.addEventListener("change", () => {
      this.syncForm();
      // native `change` is not composed, so re-emit it from the host
      this.dispatchEvent(new Event("change", { bubbles: true }));
    });
    root.addEventListener("keydown", (e) => {
      const k = e as KeyboardEvent;
      if (k.key === "Enter" && !k.isComposing) this.form?.requestSubmit();
    });
  }

  render() {
    const root = this.shadowRoot!;
    const label = this.getAttribute("label");
    const required = this.hasAttribute("required");

    const typed = this._input?.value;

    root.adoptedStyleSheets = [sheet, presetsheet, stylesheet];
    root.innerHTML = /* HTML */ ` <div class="wrapper">
      ${
        label
          ? `<label id="input-label" class="font-semibold text-md text-primary">${esc(label)}${
              required ? `<span class="required">*</span>` : ""
            }</label>`
          : ""
      }
      <div id="input-container" class="text-primary border-medium">
        <slot name="left-icon"></slot>
        <input id="inner-input" part="input" />
        <slot name="right-icon"></slot>
      </div>
    </div>`;

    this._input = root.querySelector<HTMLInputElement>("[part=input]")!;
    for (const name of SYNCED) this.syncAttributeToChild(name);

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
    const i = this._input;
    if (!i) return;
    this.internals.setFormValue(i.value);
    if (i.validity.valid) this.internals.setValidity({});
    else this.internals.setValidity(i.validity, i.validationMessage, i);
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
    "sample-input-v1": Input;
  }
}

if (!customElements.get("sample-input-v1")) {
  customElements.define("sample-input-v1", Input);
}
