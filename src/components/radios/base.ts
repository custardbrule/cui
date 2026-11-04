class BaseRadioElement extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = [
    "checked",
    "disabled",
    "required",
    "value",
    "name",
    "label",
  ];
  _root: ShadowRoot;
  _internals: ElementInternals;
  _radio: HTMLInputElement | null = null;

  //----public API----
  get internals() {
    return this._internals;
  }

  get radio() {
    return this._radio;
  }

  get checked() {
    return this._radio?.checked || false;
  }

  get value() {
    return this._radio?.value || "on";
  }

  get name() {
    return this._radio?.name || "";
  }

  get disabled() {
    return this._radio?.disabled || false;
  }

  get required() {
    return this._radio?.required || false;
  }

  get type() {
    return "radio";
  }

  get form() {
    return this.internals.form;
  }

  get labels() {
    return this.internals.labels;
  }

  get willValidate() {
    return this.internals.willValidate;
  }

  //----integrate form----
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

  constructor() {
    super();
    this.setAttribute("c-radio", "");
    this._root = this.attachShadow({ mode: "open" });
    this._internals = this.attachInternals();
  }
}

interface SyncEvent extends CustomEvent {
  detail: {
    checked: boolean;
    value: any;
  };
}

export { BaseRadioElement };
export type { SyncEvent };
