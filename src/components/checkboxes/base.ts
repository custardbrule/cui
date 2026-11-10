import { BaseInputElement } from "@/components/inputs/base";
import { FORWARDED, HANDLER_ATTRS } from "@/shared/constants";

class BaseCheckboxElement extends BaseInputElement implements HTMLInputElement {
  static formAssociated = true;
  static observedAttributes = [...FORWARDED, ...HANDLER_ATTRS, "label"];

  get checkbox() {
    return this._input;
  }

  protected get defaultType() {
    return "checkbox";
  }

  protected syncAttributeToChild(name: string) {
    if (!this._input) return;

    const target = name.startsWith("c-on") ? name.slice(2) : name;
    const value = this.getAttribute(name);
    if (value !== null) this._input.setAttribute(target, value);
    else if (target === "type") this._input.type = this.defaultType;
    else this._input.removeAttribute(target);
    this.syncFormState();
  }

  protected bindCheckboxEvents() {
    if (!this._input) return;

    this._input.addEventListener("input", () => {
      this.syncFormState();
      this.dispatchEvent(new Event("input", { composed: true, bubbles: true }));
    });

    this._input.addEventListener("change", () => {
      this.syncFormState();
      this.dispatchEvent(
        new Event("change", { composed: true, bubbles: true }),
      );
    });

    this.syncFormState();
  }

  constructor() {
    super();
    this.setAttribute("c-checkbox", "");
  }
}

export { BaseCheckboxElement };
