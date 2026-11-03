import sheet from "@/shared/css/styles.css" with { type: "css" };
import presetsheet from "@/shared/css/preset.css" with { type: "css" };
import stylesheet from "./style.css" with { type: "css" };

export class Card extends HTMLElement {
  static get observedAttributes() {
    return ["title", "description", "detail"];
  }

  render() {
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });
    const title = this.getAttribute("title") || "Default Card";
    const description =
      this.getAttribute("description") ||
      "This card uses the default size variant.";
    const detail =
      this.getAttribute("detail") ||
      'The card component supports a size prop that defaults to "default" for standard spacing and sizing.';

    root.adoptedStyleSheets = [sheet, presetsheet, stylesheet];
    root.innerHTML = /* HTML */ `
      <div class="bg-primary text-primary shadow-md card">
        <div class="card-header">
          <slot name="card-image"></slot>
          <div>
            <h2 class="text-lg font-bold">${title}</h2>
            <p class="text-secondary text-sm font-semibold">${description}</p>
          </div>
        </div>

        <p class="text-tertiary text-md">${detail}</p>
      </div>
    `;
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue === newValue) return;
    if (this.isConnected) {
      this.render();
    }
  }
}

if (!customElements.get("sample-card-v1")) {
  customElements.define("sample-card-v1", Card);
}
