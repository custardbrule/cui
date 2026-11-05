class BaseCheckboxElement extends HTMLElement {
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
  _checkbox: HTMLInputElement | null = null;

  //----public API----
  get internals() {
    return this._internals;
  }

  get checkbox() {
    return this._checkbox;
  }

  get checked() {
    return this._checkbox?.checked || false;
  }

  get value() {
    return this._checkbox?.value || "on";
  }

  get name() {
    return this._checkbox?.name || "";
  }

  get disabled() {
    return this._checkbox?.disabled || false;
  }

  get required() {
    return this._checkbox?.required || false;
  }

  get type() {
    return "checkbox";
  }

  get form() {
    return this.internals.form;
  }

  get labels() {
    return this.internals.labels;
  }

  //----integrate form----
  get validity() {
    return this.internals.validity;
  }
  get validationMessage() {
    return this.internals.validationMessage;
  }

  get willValidate() {
    return this.internals.willValidate;
  }

  checkValidity() {
    return this.internals.checkValidity();
  }
  reportValidity() {
    return this.internals.reportValidity();
  }

  constructor() {
    super();
    this.setAttribute("c-checkbox", "");
    this._root = this.attachShadow({ mode: "open" });
    this._internals = this.attachInternals();
  }
}

export { BaseCheckboxElement };
