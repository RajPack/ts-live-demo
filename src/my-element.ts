import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";
import { LiveboardEmbed, AuthType, init } from "@thoughtspot/visual-embed-sdk";

@customElement("my-element")
export class MyElement extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  @query(".container") vizcont: any;

  connectedCallback(): void {
    super.connectedCallback();
    init({
      thoughtSpotHost: "team2.thoughtspot.cloud",
      authType: AuthType.None,
      // getAuthToken: async () => "14fd36b9-fd9f-4bf1-8875-716c2d803ee4",
    });
    debugger;
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    console.log(this.vizcont);
    const lb = new LiveboardEmbed(this.vizcont, {
      frameParams: {
        width: "100%",
        height: "100%",
      },
      // liveboardId: "26bdf658-9fbc-4c36-87a7-a7f657cc4627",
      liveboardId: "22e79c21-eec4-40bf-997b-7454c6e3a2a5",
    });

    // Do not forget to call render.
    lb.render();
  }

  render() {
    return html` <div class="container">elem</div> `;
  }
}
