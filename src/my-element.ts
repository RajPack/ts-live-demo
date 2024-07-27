import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { LiveboardEmbed, AuthType, init } from "@thoughtspot/visual-embed-sdk";
import { EmbedEvent } from "@thoughtspot/visual-embed-sdk";
import { repeat } from "lit/directives/repeat.js";

@customElement("my-element")
export class MyElement extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
      .container {
        width: 100vw;
        height: calc(100vh - 260px);
      }
      .event-tracker {
        height: 250px;
        width: 100vw;
        background: lightblue;
        border: 1px solid lightgray;
      }
    `,
  ];

  @query(".container") vizcont: any;
  @state() eventTracker: any[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    init({
      thoughtSpotHost: "team2.thoughtspot.cloud",
      authType: AuthType.Basic,
      username: "letsthinkbetter@gmail.com",
      password: "ltb@MAX55",
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
      liveboardId: "26bdf658-9fbc-4c36-87a7-a7f657cc4627",
      // liveboardId: "22e79c21-eec4-40bf-997b-7454c6e3a2a5",
    });

    // Do not forget to call render.
    lb.render();
    this.bindEvents(lb);
  }

  bindEvents(lb: LiveboardEmbed) {
    lb.on(EmbedEvent.ALL, (filters) => {
      this.eventTracker.push(filters);
      console.log(this.eventTracker);
    });
    // lb.on(EmbedEvent.VizPointClick, (clickviz) => {
    //   this.eventTracker.push(clickviz);
    //   console.log(this.eventTracker);
    // });
  }

  render() {
    return html`
      <div class="event-tracker">
        <div class="note">Host app context</div>
        <div class="tracker">
          ${repeat(
            this.eventTracker,
            (t) => t,
            (t) => {
              if (t.type !== "cross-filter-changed") {
                return nothing;
              }
              return html`
                Type: ${t.type} ---- Action: ${t.data.action} --- content:
                ${JSON.stringify(t.data)}
                <br />
                <br />
                <br />
              `;
            }
          )}
        </div>
      </div>
      <div class="container">elem</div>
    `;
  }
}
