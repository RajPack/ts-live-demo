import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import {
  LiveboardEmbed,
  AuthType,
  init,
  Action,
} from "@thoughtspot/visual-embed-sdk";
import { EmbedEvent } from "@thoughtspot/visual-embed-sdk";
import { repeat } from "lit/directives/repeat.js";

@customElement("my-element")
export class MyElement extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        box-sizing: border-box;
      }
      .app {
        width: 100vw;
        height: 100vh;
        padding: 12px;
        background: #e4e4e4;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      .ts-container {
        width: 100%;
      }
      .container {
        padding: 12px;
        background: #d9d98c;
        width: 100%;
        height: calc(100vh - 280px);
        box-sizing: border-box;
      }
      .event-tracker {
        height: 250px;
        width: 100%;
        background: #2f2f2e;
        color: white;
        border: 1px solid lightgray;
        .title {
          border: 1px solid white;
        }
      }
      .title {
        font-weight: bold;
        font-size: 16px;
        display: flex;
        justify-content: center;
      }
      .tracker {
        font-family: "courier new";
        font-size: 14px;
        height: 80%;
        overflow: auto;
      }
    `,
  ];

  @query(".container") vizcont: any;
  @state() eventTracker: any[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    init({
      thoughtSpotHost: "team2.thoughtspot.cloud",
      autoLogin: true,
      authType: AuthType.Basic,
      username: "letsthinkbetter@gmail.com",
      password: "}g!V~#7K7)$B}%M",
    });
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    console.log(this.vizcont);
    const lb = new LiveboardEmbed(this.vizcont, {
      visibleActions: [
        Action.AddFilter,
        Action.CrossFilter,
        Action.RemoveCrossFilter,
        Action.DrillDown,
      ],
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
      this.eventTracker = [...this.eventTracker];
      console.log(this.eventTracker);
    });
    // lb.on(EmbedEvent.VizPointClick, (clickviz) => {
    //   this.eventTracker.push(clickviz);
    //   console.log(this.eventTracker);
    // });
  }

  render() {
    return html`
      <div class="app">
        <div class="event-tracker">
          <div class="title">Host app (available context propogation)</div>
          <div class="tracker">
            ${repeat(
              this.eventTracker,
              (t) => t,
              (t) => {
                if (t.type !== "cross-filter-changed") {
                  return nothing;
                }
                return html`
                  Type: <b>${t.type}</b> ---- Action:
                  <b>${t.data.action}</b> --- content: ${JSON.stringify(t.data)}
                  <br />
                  <br />
                  <br />
                `;
              }
            )}
          </div>
        </div>
        <div class="ts-container">
          <div class="title">ThoughtSpot Iframe</div>
          <div class="container">elem</div>
        </div>
      </div>
    `;
  }
}
