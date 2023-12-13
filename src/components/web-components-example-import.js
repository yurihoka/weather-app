// Use other Web Components and override styles.
class ExampleImporter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <ul class="example-importer">
        <li><example-minimal /></li>
        <li><example-counter /></li>
      </ul>

      <style>
        .example-importer {
          border: 5px black solid;
          & .example-counter {
            & span {
              color: orange;
            }
          }
        }
      </style>
`;
  }
}

customElements.define("example-importer", ExampleImporter);
