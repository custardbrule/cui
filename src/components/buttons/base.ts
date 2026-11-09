export abstract class BaseButtonElement extends HTMLElement {
  static formAssociated = true;

  protected _root: ShadowRoot;
  protected _internals: ElementInternals;
  protected _button: HTMLButtonElement | null = null;
  protected _formDisabled = false;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open", delegatesFocus: true });
    this._internals = this.attachInternals();
    this._internals.setFormValue(null);
  }

  get button() {
    return this._button;
  }

  get disabled() {
    return this._button?.disabled || false;
  }

  get type() {
    return this._button?.type || "button";
  }

  get form() {
    return this._internals.form;
  }

  click() {
    this._button?.click();
  }

  formDisabledCallback(disabled: boolean) {
    this._formDisabled = disabled;
    if (this._button) this._button.disabled = this.disabled;
  }
}
