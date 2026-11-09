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

  formResetCallback() {
    const scope = (this.form ?? this.getRootNode()) as ParentNode;
    const group = Array.from(
      scope.querySelectorAll<BaseRadioElement>("[c-radio]"),
    ).filter((radio) => radio.name === this.name && radio.form === this.form);
    if (!group.includes(this)) group.push(this);
    const checkedRadio = group
      .filter((radio) => radio.hasAttribute("checked"))
      .at(-1);

    for (const radio of group) {
      if (!radio._radio) continue;

      radio._radio.checked = radio === checkedRadio;
      radio.internals.setFormValue(radio._radio.checked ? radio.value : null);
    }
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
