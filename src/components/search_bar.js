class SearchBar extends HTMLElement {
  static api_key = "AIzaSyDXBFsx0NNWUwBP1XQbTufr2RN_MQ2xbnM";
  autocomplete;

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <section class="search-bar">
      <input id="autocomplete" type="text" value="" />
    </section>
    `;
  }

  initAutocomplete() {
    const input = this.querySelector("#autocomplete");
    this.autocomplete = new google.maps.places.Autocomplete(input, {});
    this.autocomplete.addListener("place_changed", () => {
      const place = this.autocomplete.getPlace();
      if (!place.geometry) {
        input.placeholder = "Enter a place";
        return;
      }

      const city = place.name;
      const lat = place.geometry.location.lat();
      const lon = place.geometry.location.lng();

      const favorite = localStorage.getItem(city) !== null;
      const favoriteCity = document.querySelector("favorite-city");
      if (favoriteCity.getSelect().value !== city) {
        favoriteCity.resetSelect();
      }
      document
        .querySelector("current-weather")
        .updateState({ lat: lat, lon: lon, city: city, favorite: favorite });
    });
  }

  reset() {
    this.querySelector("#autocomplete").value = "";
  }
}

customElements.define("search-bar", SearchBar);

function initAutocomplete() {
  const searchBar = document.querySelector("search-bar");
  searchBar.initAutocomplete();
}
