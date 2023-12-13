// Minimal example.
class ExampleMinimal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `<p>This is a minimal component</p>`;
  }
}

customElements.define("example-minimal", ExampleMinimal);

// Counter: click event and styling.
class ExampleCounter extends HTMLElement {
  // Properties.
  count = 0;

  constructor() {
    super();
  }

  connectedCallback() {
    this.count = parseInt(this.getAttribute("count")) || 0;
    this.render();
  }

  // Specify the names of attributes to watch.
  static observedAttributes = ["count"];

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `Attribute ${name} has changed from ${oldValue} to ${newValue}.`
    );
    this[name] = newValue;
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="example-counter">
        <button>Increment</button>
        <p>count: <span>${this.count}</span></p>
      </div>

      <style>
        .example-counter {
          button {
            &:hover {
              color: red;
            }
          }
          & span {
            color: green;
          }
        }
      </style>
    `

    this.setIncrementHandler();
  }

  setIncrementHandler() {
    const button = this.querySelector("button");
    button.addEventListener("click", (event) => {
      ++this.count;
      this.render();
    });
  }
}

customElements.define("example-counter", ExampleCounter);
