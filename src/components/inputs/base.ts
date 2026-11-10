class BaseInputElement extends HTMLElement {
  static formAssociated = true;

  _root: ShadowRoot;
  _internals: ElementInternals;
  _input: HTMLInputElement | null = null;

  protected get defaultType() {
    return "text";
  }

  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open", delegatesFocus: true });
    this._internals = this.attachInternals();
  }

  protected setInputAttribute(
    name: string,
    value: string | number | boolean | null,
  ) {
    if (typeof value === "boolean") this.toggleAttribute(name, value);
    else if (value === null) this.removeAttribute(name);
    else this.setAttribute(name, String(value));
  }

  protected syncFormState() {
    if (!this._input) return;

    const formValue =
      (this._input.type === "checkbox" || this._input.type === "radio") &&
      !this._input.checked
        ? null
        : this._input.value;
    this._internals.setFormValue(formValue);
    if (this._input.validity.valid) this._internals.setValidity({});
    else
      this._internals.setValidity(
        this._input.validity,
        this._input.validationMessage,
        this._input,
      );
  }

  get input() {
    return this._input;
  }

  get internals() {
    return this._internals;
  }

  get accept() {
    return this._input?.accept ?? this.getAttribute("accept") ?? "";
  }

  get autocomplete(): AutoFill {
    return this._input?.autocomplete ?? "off";
  }

  get checked() {
    return this._input?.checked ?? this.hasAttribute("checked");
  }
  set checked(value: boolean) {
    if (this._input) this._input.checked = value;
    else this.toggleAttribute("checked", value);
    this.syncFormState();
  }

  get defaultChecked() {
    return this._input?.defaultChecked ?? this.hasAttribute("checked");
  }

  get defaultValue() {
    return this._input?.defaultValue ?? this.getAttribute("value") ?? "";
  }

  get disabled() {
    return this._input?.disabled ?? this.hasAttribute("disabled");
  }

  get files() {
    return this._input?.files ?? null;
  }
  set files(value: FileList | null) {
    if (this._input) this._input.files = value;
  }

  get form() {
    return this._internals.form;
  }

  get indeterminate() {
    return this._input?.indeterminate ?? false;
  }
  set indeterminate(value: boolean) {
    if (this._input) this._input.indeterminate = value;
  }

  get labels(): NodeListOf<HTMLLabelElement> {
    return this._internals.labels as NodeListOf<HTMLLabelElement>;
  }

  get max() {
    return this._input?.max ?? this.getAttribute("max") ?? "";
  }

  get maxLength() {
    return (
      this._input?.maxLength ?? (Number(this.getAttribute("maxlength")) || -1)
    );
  }

  get min() {
    return this._input?.min ?? this.getAttribute("min") ?? "";
  }

  get minLength() {
    return (
      this._input?.minLength ?? (Number(this.getAttribute("minlength")) || -1)
    );
  }

  get multiple() {
    return this._input?.multiple ?? this.hasAttribute("multiple");
  }

  get name() {
    return this._input?.name ?? this.getAttribute("name") ?? "";
  }

  get pattern() {
    return this._input?.pattern ?? this.getAttribute("pattern") ?? "";
  }

  get placeholder() {
    return this._input?.placeholder ?? this.getAttribute("placeholder") ?? "";
  }

  get readOnly() {
    return this._input?.readOnly ?? this.hasAttribute("readonly");
  }

  get required() {
    return this._input?.required ?? this.hasAttribute("required");
  }

  get size() {
    return this._input?.size ?? (Number(this.getAttribute("size")) || 20);
  }

  get step() {
    return this._input?.step ?? this.getAttribute("step") ?? "";
  }

  get type() {
    return this._input?.type ?? this.getAttribute("type") ?? this.defaultType;
  }

  get value() {
    return this._input?.value ?? this.getAttribute("value") ?? "";
  }
  set value(value: string) {
    if (this._input) this._input.value = value;
    else this.setInputAttribute("value", value);
    this.syncFormState();
  }

  get valueAsDate() {
    return this._input?.valueAsDate ?? null;
  }
  set valueAsDate(value: Date | null) {
    if (this._input) this._input.valueAsDate = value;
    this.syncFormState();
  }

  get valueAsNumber() {
    return this._input?.valueAsNumber ?? Number.NaN;
  }
  set valueAsNumber(value: number) {
    if (this._input) this._input.valueAsNumber = value;
    this.syncFormState();
  }

  get willValidate() {
    return this._input?.willValidate ?? this._internals.willValidate;
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

  setCustomValidity(error: string) {
    this._input?.setCustomValidity(error);
    this.syncFormState();
  }

  select() {
    this._input?.select();
  }

  setRangeText(replacement: string): void;
  setRangeText(
    replacement: string,
    start: number,
    end: number,
    selectionMode?: SelectionMode,
  ): void;
  setRangeText(
    replacement: string,
    start?: number,
    end?: number,
    selectionMode?: SelectionMode,
  ) {
    if (!this._input) return;
    if (start === undefined || end === undefined)
      this._input.setRangeText(replacement);
    else this._input.setRangeText(replacement, start, end, selectionMode);
    this.syncFormState();
  }

  setSelectionRange(
    start: number | null,
    end: number | null,
    direction?: SelectionDirection,
  ) {
    this._input?.setSelectionRange(start, end, direction);
  }

  stepDown(n?: number) {
    this._input?.stepDown(n);
    this.syncFormState();
  }

  stepUp(n?: number) {
    this._input?.stepUp(n);
    this.syncFormState();
  }

  showPicker() {
    this._input?.showPicker();
  }

  formDisabledCallback(disabled: boolean) {
    if (this._input)
      this._input.disabled = disabled || this.hasAttribute("disabled");
  }

  formResetCallback() {
    if (!this._input) return;

    this._input.value = this._input.defaultValue;
    this._input.checked = this._input.defaultChecked;
    this.syncFormState();
  }
}

export { BaseInputElement };
