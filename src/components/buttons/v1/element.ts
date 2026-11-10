import schemesheet from "@/shared/css/scheme.scss" with { type: "css" };
import presetsheet from "@/shared/css/preset.scss" with { type: "css" };
import utilities from "@/shared/css/utilities.scss" with { type: "css" };
import stylesheet from "./style.scss" with { type: "css" };
import { BaseButtonElement } from "@/components/buttons/base";

export class Button extends BaseButtonElement {
  static observedAttributes = [
    "type",
    "disabled",
    "variant",
    "size",
    "name",
    "value",
    "formaction",
    "formenctype",
    "formmethod",
    "formnovalidate",
    "formtarget",
    "command",
    "commandfor",
    "popovertarget",
    "popovertargetaction",
  ];

  render() {
    this._root.adoptedStyleSheets = [
      presetsheet,
      utilities,
      schemesheet,
      stylesheet,
    ];
    this._root.innerHTML = /* HTML */ `
      <button part="button" class="round-sm">
        <slot> </slot>
      </button>
    `;

    this.bindings();
  }

  private bindings() {
    this._button = this._root.querySelector("button")!;
    for (const name of Button.observedAttributes) {
      if (["variant", "size"].includes(name)) continue;

      const value = this.getAttribute(name);
      if (value !== null) this._button.setAttribute(name, value);
    }

    this._button.addEventListener("click", () => {
      switch (this._button!.type) {
        case "submit":
          this.form?.requestSubmit();
          break;
        case "reset":
          this.form?.reset();
          break;
        default:
          this._button!.onclick = this.onclick;
          break;
      }
    });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue !== newValue && this.isConnected) this.render();
  }
}

if (!customElements.get("sample-button-v1")) {
  customElements.define("sample-button-v1", Button);
}
