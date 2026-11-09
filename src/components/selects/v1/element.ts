import schemesheet from "@/shared/css/scheme.scss" with { type: "css" };
import presetsheet from "@/shared/css/preset.scss" with { type: "css" };
import utilities from "@/shared/css/utilities.scss" with { type: "css" };
import selectsheet from "@/shared/css/select.scss" with { type: "css" };
import closeSvg from "@/shared/icons/close-square-svgrepo-com.svg";
import stylesheet from "./style.scss" with { type: "css" };
import { esc } from "@/shared/utils";
import { BaseSelectElement } from "@/components/selects/base";

export class Select extends BaseSelectElement {
  static observedAttributes = [
    "name",
    "label",
    "value",
    "disabled",
    "required",
    "multiple",
    "placeholder",
  ];
  _display: HTMLParagraphElement | null = null;
  _options: (HTMLOptionElement | HTMLOptGroupElement)[] = [];

  render() {
    const label = this.getAttribute("label") || "";

    this._root.adoptedStyleSheets = [
      schemesheet,
      presetsheet,
      utilities,
      selectsheet,
      stylesheet,
    ];
    this._root.innerHTML = /* HTML */ `<div
      style="display: flex;gap: 8px;align-items: baseline;"
      class="text-md text-primary"
    >
      ${
        label
          ? `<label part="label" for="${this.name}" style="white-space:pre;" class="font-semibold">${esc(label)}${
              this.required ? `<span class="required">*</span>` : ""
            }</label>`
          : ""
      }
      <div
        part="container"
        tabindex="0"
        class="${this.multiple ? "dropdown-container shadow-on-interaction" : ""} text-primary"
        style="display:flex;flex-direction:column;gap:8px;align-items:center;position:relative;outline:none;width:100%;"
      >
        <p
          part="display"
          class="border-medium round-sm"
          style="display:flex;gap:4px;align-items:center;cursor:pointer;width:100%;box-sizing:border-box;"
          ${this.multiple ? "" : "hidden"}
        >
          ${this.placeholder}
        </p>
        <select
          id="${this.name}"
          part="select"
          class="border-medium round-md"
          name="${this.name}"
          ${this.multiple ? "multiple" : ""}
          ${this.required ? "required" : ""}
        ></select>
      </div>
      <slot hidden></slot>
    </div>`;

    this.bindings();
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {}

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue) return;
    this.render();
  }

  formResetCallback() {
    if (!this._select) return;

    const options = Array.from(this._select.options);
    options.forEach((option) => {
      option.selected = option.defaultSelected;
    });
    if (!this.multiple && !options.some((option) => option.selected)) {
      this._select.selectedIndex = 0;
    }
    this.syncFormValue();
  }

  //----integrate form----
  private renderDisplayItem = (opt: HTMLOptionElement) => {
    const item = document.createElement("span");
    item.className = "bg-primary text-secondary tag round-md";
    item.innerHTML = /* HTML */ ` ${closeSvg}${opt.value} `;
    item.querySelector("svg")!.onclick = function (e) {
      opt.click();
    };

    return item;
  };
  private bindings() {
    this._select = this._root.querySelector("[part=select]")!;
    this._display = this._root.querySelector("[part=display]")!;

    // bind to element self => keep state for next rerender
    this.querySelectorAll(":scope > option, :scope > optgroup").forEach((el) =>
      this._options!.push(el as any),
    );
    this._options.forEach((el) => this._select!.append(el));

    this._select.addEventListener("change", () => this.syncFormValue());
    this.syncFormValue();
  }

  private syncFormValue() {
    if (!this._select || !this._display) return;

    const selected = Array.from(this._select.selectedOptions);
    this._display.replaceChildren(
      ...(selected.length
        ? selected.map((option) => this.renderDisplayItem(option))
        : [this.placeholder]),
    );

    if (this.multiple) {
      const formData = new FormData();
      selected.forEach((option) => formData.append(this.name, option.value));
      this._internals.setFormValue(formData);
    } else {
      this._internals.setFormValue(this._select.value);
    }
  }
}

if (!customElements.get("sample-select-v1")) {
  customElements.define("sample-select-v1", Select);
}
