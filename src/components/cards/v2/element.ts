import sheet from "@/shared/css/styles.scss" with { type: "css" };
import presetsheet from "@/shared/css/preset.scss" with { type: "css" };

export class Card extends HTMLElement {
  static get observedAttributes() {
    return ["title", "description", "detail", "button-label"];
  }

  /** The current state of the card. Since this sample means to be generic
   * so the state wont affect the rendering of the card, it mainly serves as
   * a way to support binding object value to the element without showing in the UI
   * and reuse for event handling.
   */
  private _state: unknown = null;

  setState(state: unknown) {
    this._state = state;
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
    const buttonLabel = this.getAttribute("button-label") || "Action";

    root.adoptedStyleSheets = [sheet, presetsheet];
    root.innerHTML = `
      <style>
        #action-button {
            box-shadow: 0 0px 0px transparent;
            transition: box-shadow 0.2s ease-in-out;
        }
          #action-button:hover {
              box-shadow: 0 4px 6px rgb(from var(--bg-secondary, var(--fallback-bg-secondary)) r g b / 0.4);
          }
      </style>
      <div
        class="bg-primary text-primary shadow-md"
        style="
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 540px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 20px 16px;
          box-sizing: border-box;
        "
      >
        <div style="display: flex; gap: 12px; align-items: center;">
          <slot name="card-image"></slot>
          <div>
            <h2 class="text-lg font-bold">${title}</h2>
            <p class="text-tertiary text-sm font-semibold">
              ${description}
            </p>
          </div>
        </div>

        <p class="text-secondary text-md">
          ${detail}
        </p>

        <button id="action-button" type="button" class="bg-contrast text-contrast text-md font-bold" style="
          display: block;
          width: 100%;
          border: 0;
          border-radius: 10px;
          padding: 12px;
          cursor: pointer;
          font-family: inherit;
        ">${buttonLabel}</button>
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
          detail: { target: button, state: this._state },
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

if (!customElements.get("sample-card-v2")) {
  customElements.define("sample-card-v2", Card);
}
