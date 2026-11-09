import schemesheet from "@/shared/css/scheme.scss" with { type: "css" };
import presetsheet from "@/shared/css/preset.scss" with { type: "css" };
import utilities from "@/shared/css/utilities.scss" with { type: "css" };

export class Card extends HTMLElement {
  render() {
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });

    root.adoptedStyleSheets = [presetsheet, utilities, schemesheet];
    root.innerHTML = `
      <div
        class="bg-primary text-primary shadow-md round-lg"
        style="
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 540px;
          min-width: 360px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 20px 16px;
          box-sizing: border-box;
        "
      >
        <slot name="card-header">
          <h2 class="text-lg font-bold">header</h2>
        </slot>

        <slot name="card-body">
          <p class="text-tertiary text-md">detail</p>
        </slot>

        <slot name="card-footer">
          <p class="text-tertiary text-md">footer</p>
        </slot>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const button = this.shadowRoot?.getElementById("action-button");
    if (button) {
      button.addEventListener("click", (e) => {
        e.stopPropagation();

        const event = new CustomEvent("card-btn-click", {
          detail: { target: button },
          bubbles: true,
          composed: true, // Escapes Shadow DOM
        });

        this.dispatchEvent(event);
      });
    }
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    const button = this.shadowRoot?.getElementById("action-button");
    if (button) {
      button.removeEventListener("click", () => {});
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue === newValue) return;
    if (!this.isConnected) return;
    this.render();
  }
}

if (!customElements.get("sample-card-v3")) {
  customElements.define("sample-card-v3", Card);
}
