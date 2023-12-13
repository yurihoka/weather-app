class FavoriteCity extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initOptions();
    this.setEventHandler();
  }

  render() {
    this.innerHTML = `
    <select>
      <option value="_default" disabled selected>Favorite City</option>
    </select>
    `;
  }

  setEventHandler() {
    const select = this.getSelect();
    select.addEventListener("change", (event) => {
      const city = select.value;
      const json = this.getFavorite(city);
      document.querySelector("search-bar").reset();
      document.querySelector("current-weather").updateState({lat: json.lat, lon: json.lon, city: city, favorite: true});
    });
  }

  addFavorite({lon, lat, city}) {
    localStorage.setItem(city, JSON.stringify({ lon: lon, lat: lat }));
    this.addOption(city);
  }

  addOption(city) {
    const select = this.getSelect();
    if (select.querySelector(`option[value=${city}]`)) {
      return;
    }
    const opt = document.createElement("option");
    opt.value = city;
    opt.innerText = city;
    select.appendChild(opt);
  }

  removeFavorite(city) {
    localStorage.removeItem(city);
    const select = this.getSelect();
    const opt = select.querySelector(`option[value="${city}"]`);
    select.removeChild(opt);
  }

  getFavorite(city) {
    const json = localStorage.getItem(city);
    return JSON.parse(json);
  }

  initOptions() {
    for (let i = 0; i < localStorage.length; ++i) {
      let key = localStorage.key(i);
      this.addOption(key);
    }
  }

  resetSelect() {
    this.getSelect().value = "_default";
  }

  getSelect() {
    return this.querySelector("select");
  }
}

customElements.define("favorite-city", FavoriteCity);
