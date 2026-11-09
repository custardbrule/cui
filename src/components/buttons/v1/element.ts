import schemesheet from "@/shared/css/scheme.scss" with { type: "css" };
import presetsheet from "@/shared/css/preset.scss" with { type: "css" };
import utilities from "@/shared/css/utilities.scss" with { type: "css" };
import stylesheet from "./style.scss" with { type: "css" };
import { esc } from "@/shared/utils";
import { BaseButtonElement } from "@/components/buttons/base";

const buttonTypes = ["button", "submit", "reset"] as const;

export class Button extends BaseButtonElement {
  static observedAttributes = ["type", "disabled", "variant", "size", "label"];

  get label() {
    return this.getAttribute("label") || "";
  }

  render() {
    const type =
      buttonTypes.find(
        (buttonType) => buttonType === this.getAttribute("type"),
      ) ?? "button";

    this._root.adoptedStyleSheets = [
      presetsheet,
      utilities,
      schemesheet,
      stylesheet,
    ];
    this._root.innerHTML = /* HTML */ `
      <button
        part="button"
        class="round-sm"
        type="${type}"
        ${this.disabled ? "disabled" : ""}
      >
        <slot>${esc(this.label)}</slot>
      </button>
    `;

    this.bindings();
  }

  private bindings() {
    this._button = this._root.querySelector("button")!;
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
