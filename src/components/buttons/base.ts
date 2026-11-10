export abstract class BaseButtonElement
  extends HTMLElement
  implements HTMLButtonElement
{
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

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get type(): "button" | "reset" | "submit" {
    const type = this._button?.type ?? this.getAttribute("type");
    return type === "reset" || type === "submit" ? type : "button";
  }

  set type(value: "button" | "reset" | "submit") {
    this.setAttribute("type", value);
  }

  get form() {
    return this._internals.form;
  }

  get name() {
    return this.getAttribute("name") ?? "";
  }

  set name(value: string) {
    this.setAttribute("name", value);
  }

  get value() {
    return this.getAttribute("value") ?? "";
  }

  set value(value: string) {
    this.setAttribute("value", value);
  }

  get formAction() {
    return this._button?.formAction ?? this.getAttribute("formaction") ?? "";
  }

  set formAction(value: string) {
    this.setAttribute("formaction", value);
  }

  get formEnctype() {
    return this._button?.formEnctype ?? this.getAttribute("formenctype") ?? "";
  }

  set formEnctype(value: string) {
    this.setAttribute("formenctype", value);
  }

  get formMethod() {
    return this._button?.formMethod ?? this.getAttribute("formmethod") ?? "";
  }

  set formMethod(value: string) {
    this.setAttribute("formmethod", value);
  }

  get formNoValidate() {
    return this.hasAttribute("formnovalidate");
  }

  set formNoValidate(value: boolean) {
    this.toggleAttribute("formnovalidate", value);
  }

  get formTarget() {
    return this._button?.formTarget ?? this.getAttribute("formtarget") ?? "";
  }

  set formTarget(value: string) {
    this.setAttribute("formtarget", value);
  }

  get command() {
    return this._button?.command ?? this.getAttribute("command") ?? "";
  }

  set command(value: string) {
    this.setAttribute("command", value);
  }

  get commandForElement() {
    return this._button?.commandForElement ?? null;
  }

  set commandForElement(value: Element | null) {
    if (!value) this.removeAttribute("commandfor");
    if (this._button) this._button.commandForElement = value;
  }

  get popoverTargetAction() {
    return (
      this._button?.popoverTargetAction ??
      this.getAttribute("popovertargetaction") ??
      "toggle"
    );
  }

  set popoverTargetElement(value: Element | null) {
    if (!value) this.removeAttribute("popovertarget");
    if (this._button) this._button.popoverTargetElement = value;
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
