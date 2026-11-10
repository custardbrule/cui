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
  }

  get button() {
    return this._button;
  }

  get disabled() {
    return this.hasAttribute("disabled") || this._formDisabled;
  }

  get type(): "button" | "reset" | "submit" {
    const type = this._button?.type ?? this.getAttribute("type");
    return type === "reset" || type === "submit" ? type : "button";
  }

  get form() {
    return this._internals.form;
  }

  get name() {
    return this.getAttribute("name") ?? "";
  }

  get value() {
    return this.getAttribute("value") ?? "";
  }

  get formAction() {
    return this._button?.formAction ?? this.getAttribute("formaction") ?? "";
  }

  get formEnctype() {
    return this._button?.formEnctype ?? this.getAttribute("formenctype") ?? "";
  }

  get formMethod() {
    return this._button?.formMethod ?? this.getAttribute("formmethod") ?? "";
  }

  get formNoValidate() {
    return this.hasAttribute("formnovalidate");
  }

  get formTarget() {
    return this._button?.formTarget ?? this.getAttribute("formtarget") ?? "";
  }

  get command() {
    return this._button?.command ?? this.getAttribute("command") ?? "";
  }

  get commandForElement() {
    return this._button?.commandForElement ?? null;
  }

  get popoverTargetAction() {
    return (
      this._button?.popoverTargetAction ??
      this.getAttribute("popovertargetaction") ??
      "toggle"
    );
  }

  get willValidate() {
    return this._button?.willValidate ?? false;
  }

  get validity() {
    return this._button?.validity ?? this._internals.validity;
  }

  get validationMessage() {
    return this._button?.validationMessage ?? "";
  }

  get labels(): NodeListOf<HTMLLabelElement> {
    return this._internals.labels as NodeListOf<HTMLLabelElement>;
  }

  checkValidity() {
    return this._button?.checkValidity() ?? true;
  }

  reportValidity() {
    return this._button?.reportValidity() ?? true;
  }

  setCustomValidity(error: string) {
    this._button?.setCustomValidity(error);
  }

  click() {
    this._button?.click();
  }

  formDisabledCallback(disabled: boolean) {
    this._formDisabled = disabled;
    if (this._button) this._button.disabled = this.disabled;
  }
}
