import sheet from "@/shared/css/styles.scss" with { type: "css" };
import presetsheet from "@/shared/css/preset.scss" with { type: "css" };
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
      sheet,
      presetsheet,
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
        class="${this.multiple ? "dropdown-container" : ""} text-primary"
        style="display:flex;flex-direction:column;gap:8px;align-items:center;position:relative;outline:none;width:100%;"
      >
        <p
          part="display"
          class="border-medium"
          style="display:flex;gap:4px;align-items:center;cursor:pointer;width:100%;box-sizing:border-box;"
          ${this.multiple ? "" : "hidden"}
        >
          ${this.placeholder}
        </p>
        <select
          id="${this.name}"
          part="select"
          class="border-medium"
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

  //----integrate form----
  private renderDisplayItem = (opt: HTMLOptionElement) => {
    const item = document.createElement("span");
    item.className = "bg-primary text-secondary tag";
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

    this._select.addEventListener("change", (event) => {
      if (this.multiple) {
        const eles: HTMLElement[] = [];
        const fd = new FormData();
        [...this._select!.querySelectorAll("option")]
          .filter((opt) => opt.selected)
          .forEach((opt) => {
            fd.append(this._select!.name, opt.value);
            eles.push(this.renderDisplayItem(opt));
          });

        this._display!.replaceChildren(
          ...(eles.length ? eles : [this.placeholder]),
        );
        this._internals.setFormValue(fd);
      } else {
        this._internals.setFormValue(this._select!.value);
      }
    });

    const selected = [...this._select!.querySelectorAll("option")]
      .filter((otp) => otp.selected)
      .map((otp) => this.renderDisplayItem(otp));
    this._display!.replaceChildren(
      ...(selected.length ? selected : [this.placeholder]),
    );
  }
}

if (!customElements.get("sample-select-v1")) {
  customElements.define("sample-select-v1", Select);
}
