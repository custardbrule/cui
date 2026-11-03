import sheet from "@/shared/css/styles.css" with { type: "css" };
import presetsheet from "@/shared/css/preset.css" with { type: "css" };
import stylesheet from "./style.css" with { type: "css" };
import html from "./template.html";

// parse the HTML once, clone it per instance
const template = document.createElement("template");
template.innerHTML = html;

export class Input extends HTMLElement {
  private inputChild!: HTMLInputElement;
  private labelEl!: HTMLLabelElement;
  private observer?: MutationObserver;

  static get observedAttributes() {
    return ["label", "required"];
  }

  private build() {
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });
    if (this.inputChild) return; // already built

    root.adoptedStyleSheets = [sheet, presetsheet, stylesheet];
    root.appendChild(template.content.cloneNode(true));

    this.inputChild = root.getElementById("inner-input") as HTMLInputElement;
    this.labelEl = root.getElementById("label") as HTMLLabelElement;
  }

  private updateLabel() {
    const label = this.getAttribute("label");
    const required = this.hasAttribute("required");

    this.labelEl.hidden = !label;
    this.labelEl.replaceChildren();
    if (!label) return;

    this.labelEl.append(label); // text node, so no HTML injection
    if (required) {
      const star = document.createElement("span");
      star.className = "required";
      star.textContent = "*";
      this.labelEl.append(star);
    }
  }

  connectedCallback() {
    this.build();
    this.updateLabel();

    for (const attr of this.attributes) {
      this.syncAttributeToChild(attr.name);
    }

    this.observer ??= new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName) {
          this.syncAttributeToChild(m.attributeName);
        }
      }
    });
    this.observer.observe(this, { attributes: true });
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue || !this.labelEl) return;
    this.updateLabel();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  private syncAttributeToChild(name: string) {
    if (!this.inputChild || !(name in this.inputChild)) return;
    const value = this.getAttribute(name);
    if (value !== null) this.inputChild.setAttribute(name, value);
    else this.inputChild.removeAttribute(name);
  }
}

if (!customElements.get("sample-input-v2")) {
  customElements.define("sample-input-v2", Input);
}
