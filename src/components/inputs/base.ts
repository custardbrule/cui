class BaseInputElement extends HTMLElement implements HTMLInputElement {
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

  //----native input API----
  get input() {
    return this._input;
  }

  get internals() {
    return this._internals;
  }

  get accept() {
    return this._input?.accept ?? this.getAttribute("accept") ?? "";
  }
  set accept(value: string) {
    this.setInputAttribute("accept", value);
    if (this._input) this._input.accept = value;
  }

  get align() {
    return this._input?.align ?? this.getAttribute("align") ?? "";
  }
  set align(value: string) {
    this.setInputAttribute("align", value);
    if (this._input) this._input.align = value;
  }

  get alt() {
    return this._input?.alt ?? this.getAttribute("alt") ?? "";
  }
  set alt(value: string) {
    this.setInputAttribute("alt", value);
    if (this._input) this._input.alt = value;
  }

  get autocomplete(): AutoFill {
    return this._input?.autocomplete ?? "off";
  }
  set autocomplete(value: AutoFill) {
    this.setInputAttribute("autocomplete", value);
    if (this._input) this._input.autocomplete = value;
  }

  get capture() {
    return this._input?.capture ?? "";
  }
  set capture(value: string) {
    this.setInputAttribute("capture", value);
    if (this._input) this._input.capture = value;
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
  set defaultChecked(value: boolean) {
    this.setInputAttribute("checked", value);
    if (this._input) this._input.defaultChecked = value;
  }

  get defaultValue() {
    return this._input?.defaultValue ?? this.getAttribute("value") ?? "";
  }
  set defaultValue(value: string) {
    this.setInputAttribute("value", value);
    if (this._input) this._input.defaultValue = value;
  }

  get dirName() {
    return this._input?.dirName ?? this.getAttribute("dirname") ?? "";
  }
  set dirName(value: string) {
    this.setInputAttribute("dirname", value);
    if (this._input) this._input.dirName = value;
  }

  get disabled() {
    return this._input?.disabled ?? this.hasAttribute("disabled");
  }
  set disabled(value: boolean) {
    this.setInputAttribute("disabled", value);
    if (this._input) this._input.disabled = value;
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

  get formAction() {
    return this._input?.formAction ?? this.getAttribute("formaction") ?? "";
  }
  set formAction(value: string) {
    this.setInputAttribute("formaction", value);
    if (this._input) this._input.formAction = value;
  }

  get formEnctype() {
    return this._input?.formEnctype ?? this.getAttribute("formenctype") ?? "";
  }
  set formEnctype(value: string) {
    this.setInputAttribute("formenctype", value);
    if (this._input) this._input.formEnctype = value;
  }

  get formMethod() {
    return this._input?.formMethod ?? this.getAttribute("formmethod") ?? "";
  }
  set formMethod(value: string) {
    this.setInputAttribute("formmethod", value);
    if (this._input) this._input.formMethod = value;
  }

  get formNoValidate() {
    return this._input?.formNoValidate ?? this.hasAttribute("formnovalidate");
  }
  set formNoValidate(value: boolean) {
    this.setInputAttribute("formnovalidate", value);
    if (this._input) this._input.formNoValidate = value;
  }

  get formTarget() {
    return this._input?.formTarget ?? this.getAttribute("formtarget") ?? "";
  }
  set formTarget(value: string) {
    this.setInputAttribute("formtarget", value);
    if (this._input) this._input.formTarget = value;
  }

  get height() {
    return this._input?.height ?? (Number(this.getAttribute("height")) || 0);
  }
  set height(value: number) {
    this.setInputAttribute("height", value);
    if (this._input) this._input.height = value;
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

  get list() {
    return this._input?.list ?? null;
  }

  get max() {
    return this._input?.max ?? this.getAttribute("max") ?? "";
  }
  set max(value: string) {
    this.setInputAttribute("max", value);
    if (this._input) this._input.max = value;
  }

  get maxLength() {
    return (
      this._input?.maxLength ?? (Number(this.getAttribute("maxlength")) || -1)
    );
  }
  set maxLength(value: number) {
    this.setInputAttribute("maxlength", value);
    if (this._input) this._input.maxLength = value;
  }

  get min() {
    return this._input?.min ?? this.getAttribute("min") ?? "";
  }
  set min(value: string) {
    this.setInputAttribute("min", value);
    if (this._input) this._input.min = value;
  }

  get minLength() {
    return (
      this._input?.minLength ?? (Number(this.getAttribute("minlength")) || -1)
    );
  }
  set minLength(value: number) {
    this.setInputAttribute("minlength", value);
    if (this._input) this._input.minLength = value;
  }

  get multiple() {
    return this._input?.multiple ?? this.hasAttribute("multiple");
  }
  set multiple(value: boolean) {
    this.setInputAttribute("multiple", value);
    if (this._input) this._input.multiple = value;
  }

  get name() {
    return this._input?.name ?? this.getAttribute("name") ?? "";
  }
  set name(value: string) {
    this.setInputAttribute("name", value);
    if (this._input) this._input.name = value;
  }

  get pattern() {
    return this._input?.pattern ?? this.getAttribute("pattern") ?? "";
  }
  set pattern(value: string) {
    this.setInputAttribute("pattern", value);
    if (this._input) this._input.pattern = value;
  }

  get popoverTargetAction() {
    return this._input?.popoverTargetAction ?? "toggle";
  }
  set popoverTargetAction(value: string) {
    if (this._input) this._input.popoverTargetAction = value;
  }

  get popoverTargetElement() {
    return this._input?.popoverTargetElement ?? null;
  }
  set popoverTargetElement(value: Element | null) {
    if (this._input) this._input.popoverTargetElement = value;
  }

  get placeholder() {
    return this._input?.placeholder ?? this.getAttribute("placeholder") ?? "";
  }
  set placeholder(value: string) {
    this.setInputAttribute("placeholder", value);
    if (this._input) this._input.placeholder = value;
  }

  get readOnly() {
    return this._input?.readOnly ?? this.hasAttribute("readonly");
  }
  set readOnly(value: boolean) {
    this.setInputAttribute("readonly", value);
    if (this._input) this._input.readOnly = value;
  }

  get required() {
    return this._input?.required ?? this.hasAttribute("required");
  }
  set required(value: boolean) {
    this.setInputAttribute("required", value);
    if (this._input) this._input.required = value;
  }

  get selectionDirection() {
    return this._input?.selectionDirection ?? null;
  }
  set selectionDirection(value: SelectionDirection | null) {
    if (this._input) this._input.selectionDirection = value;
  }

  get selectionEnd() {
    return this._input?.selectionEnd ?? null;
  }
  set selectionEnd(value: number | null) {
    if (this._input && value !== null) this._input.selectionEnd = value;
  }

  get selectionStart() {
    return this._input?.selectionStart ?? null;
  }
  set selectionStart(value: number | null) {
    if (this._input && value !== null) this._input.selectionStart = value;
  }

  get size() {
    return this._input?.size ?? (Number(this.getAttribute("size")) || 20);
  }
  set size(value: number) {
    this.setInputAttribute("size", value);
    if (this._input) this._input.size = value;
  }

  get src() {
    return this._input?.src ?? this.getAttribute("src") ?? "";
  }
  set src(value: string) {
    this.setInputAttribute("src", value);
    if (this._input) this._input.src = value;
  }

  get step() {
    return this._input?.step ?? this.getAttribute("step") ?? "";
  }
  set step(value: string) {
    this.setInputAttribute("step", value);
    if (this._input) this._input.step = value;
  }

  get type() {
    return this._input?.type ?? this.getAttribute("type") ?? this.defaultType;
  }
  set type(value: string) {
    this.setInputAttribute("type", value);
    if (this._input) this._input.type = value;
  }

  get useMap() {
    return this._input?.useMap ?? this.getAttribute("usemap") ?? "";
  }
  set useMap(value: string) {
    this.setInputAttribute("usemap", value);
    if (this._input) this._input.useMap = value;
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

  get webkitEntries() {
    return this._input?.webkitEntries ?? [];
  }

  get webkitdirectory() {
    return this._input?.webkitdirectory ?? this.hasAttribute("webkitdirectory");
  }
  set webkitdirectory(value: boolean) {
    this.setInputAttribute("webkitdirectory", value);
    if (this._input) this._input.webkitdirectory = value;
  }

  get width() {
    return this._input?.width ?? (Number(this.getAttribute("width")) || 0);
  }
  set width(value: number) {
    this.setInputAttribute("width", value);
    if (this._input) this._input.width = value;
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
