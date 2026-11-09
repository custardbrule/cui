import schemesheet from "@/shared/css/scheme.scss" with { type: "css" };
import presetsheet from "@/shared/css/preset.scss" with { type: "css" };
import utilities from "@/shared/css/utilities.scss" with { type: "css" };
import radiosheet from "@/shared/css/radio.scss" with { type: "css" };
import stylesheet from "./style.scss" with { type: "css" };
import { esc } from "@/shared/utils";
import { BaseRadioElement, type SyncEvent } from "@/components/radios/base";

export class Radio extends BaseRadioElement {
  render() {
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });
    const label = this.getAttribute("label") || "";
    const name = this.getAttribute("name") || "";
    const value = this.getAttribute("value") || "";
    const checked = this.hasAttribute("checked");
    const disabled = this.hasAttribute("disabled");
    const required = this.hasAttribute("required");

    root.adoptedStyleSheets = [
      schemesheet,
      presetsheet,
      utilities,
      radiosheet,
      stylesheet,
    ];
    root.innerHTML = /* HTML */ `<div
      part="container"
      class="text-md text-primary"
    >
      <input
        name="${name}"
        value="${value}"
        ${checked ? "checked" : ""}
        ${disabled ? "disabled" : ""}
        ${required ? "required" : ""}
        type="radio"
        part="input"
        class="shadow-on-interaction"
        tabindex="-1"
      />
      <span part="label">
        <slot name="label">
          <span ${label ? "" : "hidden"}>${esc(label)}</span>
        </slot>
      </span>
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
    if (oldValue === newValue || !this._radio) return;

    this.render();
  }

  //----integrate form----
  private bindings() {
    this._radio = this._root.querySelector("input[type=radio]")!;

    this._radio.addEventListener("sync", (event: Event) => {
      const checked = this._radio!.value === (event as SyncEvent).detail.value;
      this._radio!.checked = checked;
      this._internals.setFormValue(checked ? this.value : null);
    });

    this._radio.addEventListener("change", (event) => {
      const scope = (this._internals.form ?? this.getRootNode()) as ParentNode;
      scope
        .querySelectorAll<BaseRadioElement>(`[c-radio][name="${this.name}"]`)
        .forEach((ele) => {
          ele.radio?.dispatchEvent(
            new CustomEvent("sync", {
              bubbles: true,
              composed: true,
              detail: { value: this.value },
            }),
          );
        });
      this.dispatchEvent(
        new Event("change", { composed: true, bubbles: true }),
      );
    });

    // init checked state
    if (this.checked) {
      this._radio.dispatchEvent(
        new Event("change", { composed: true, bubbles: true }),
      );
    }
  }
}

if (!customElements.get("sample-radio-v1")) {
  customElements.define("sample-radio-v1", Radio);
}
