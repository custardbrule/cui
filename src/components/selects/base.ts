export abstract class BaseSelectElement extends HTMLElement {
  static formAssociated = true;
  protected _root: ShadowRoot;
  protected _internals: ElementInternals;
  protected _select: HTMLSelectElement | null = null;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
    this._internals = this.attachInternals();
  }

  //----public API----
  get name() {
    return this.getAttribute("name") ?? "";
  }
  get placeholder() {
    return this.getAttribute("placeholder") ?? "";
  }
  get multiple() {
    return this.hasAttribute("multiple");
  }
  get required() {
    return this.hasAttribute("required");
  }
  get value() {
    return this._select?.value ?? "";
  }
  set value(v: string) {
    this._select!.value = v;
  }

  //----integrate form----
  get form() {
    return this._internals.form;
  }
  get validity() {
    return this._internals.validity;
  }
  get validationMessage() {
    return this._internals.validationMessage;
  }
  checkValidity() {
    return this._internals.checkValidity();
  }
  reportValidity() {
    return this._internals.reportValidity();
  }
}
