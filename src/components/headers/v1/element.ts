import sheet from "@/shared/css/styles.css" with { type: "css" };
import presetsheet from "@/shared/css/preset.css" with { type: "css" };

export class Header extends HTMLElement {
  static get observedAttributes() {
    return ["title"];
  }

  render() {
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });
    const title = this.getAttribute("title") || "Title";

    root.adoptedStyleSheets = [sheet, presetsheet];
    root.innerHTML = `
      <div class="bg-primary text-primary" style="padding-inline:40px; text-align: center; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <slot name="nav-logo"></slot>
          <h1>${title}</h1>
        </div>
        <div style="display: flex; gap: 25px;">
          <slot name="nav-links"></slot>
        </div>
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
    this.render();
  }

  disconnectedCallback() {}
}

if (!customElements.get("sample-header-v1")) {
  customElements.define("sample-header-v1", Header);
}
