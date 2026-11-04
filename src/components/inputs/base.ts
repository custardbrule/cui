class BaseInputElement extends HTMLElement {
  static formAssociated = true;

  _root: ShadowRoot;
  _internals: ElementInternals;
  _input: HTMLInputElement | null = null;

  //----public API----
  get internals() {
    return this._internals;
  }

  get input() {
    return this._input;
  }

  get value() {
    return this._input?.value || "";
  }

  get name() {
    return this._input?.name || "";
  }

  get disabled() {
    return this._input?.disabled || false;
  }

  get required() {
    return this._input?.required || false;
  }

  get type() {
    return this._input?.type || "";
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
    this._root = this.attachShadow({ mode: "open", delegatesFocus: true });
    this._internals = this.attachInternals();
  }
}

export { BaseInputElement };
