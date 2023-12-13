/**
 * Component to show the current weather.
 * Rendering process:
 * 1. Set lat, lon, and city.
 * 2. Get weather data using lat and lon.
 * 3. Set properties using data from API.
 * 4. Render HTML.
 */
class CurrentWeather extends HTMLElement {
  api_key = "d66d8d3bdcc55387098dd5d067b27758";
  google_api_key = "AIzaSyDXBFsx0NNWUwBP1XQbTufr2RN_MQ2xbnM";

  lat;
  lon;
  city;

  props = {
    city: "",
    temp: "",
    tempFeelsLike: "",
    tempHigh: "",
    tempLow: "",
    weatherIconUrl: "",
    weatherDesc: "",
    humidity: "",
    favorite: false,
  };

  constructor() {
    super();
  }

  connectedCallback() {
    this.initStateWithCurrentLocation();
  }

  initStateWithCurrentLocation() {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&location_type=APPROXIMATE&key=${this.google_api_key}`,
      )
        .then((r) => r.json())
        .then((json) => {
          const city = json.results[0].address_components.find(
            (c) =>
              c.types.includes("sublocality_level_1") ||
              c.types.includes("locality"),
          ).short_name;
          const favorite = localStorage.getItem(city) !== null;
          this.updateState({ lat: lat, lon: lon, city: city, favorite: favorite });
        });
    });
  }

  updateState({ lat, lon, city, favorite }) {
    this.lat = lat;
    this.lon = lon;
    this.city = city;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.api_key}`,
    )
      .then((response) => response.json())
      .then((json) => {
        this.props.city = city;
        this.props.temp = json.main.temp;
        this.props.tempFeelsLike = json.main.feels_like;
        this.props.tempHigh = json.main.temp_max;
        this.props.tempLow = json.main.temp_min;
        this.props.weatherIconUrl = `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;
        this.props.weatherDesc = json.weather[0].description;
        this.props.humidity = json.main.humidity;
        this.props.favorite = favorite;

        this.render();

        document
          .querySelector("fivedays-weather")
          .updateState({ lat: this.lat, lon: this.lon });
      });
  }

  render() {
    this.innerHTML = `
    <section class="current-weather">
      <div class="flex header">
        <h2>${this.props.city}</h2>
        <p class="favorite">${this.props.favorite ? "&#9733;" : "&#9734;"}</p>
      </div>
      <div class="flex">
        <div class="temp">
          <p class="current">${this.props.temp}°C</p>
          <p class="feels-like">Feels like ${this.props.tempFeelsLike} °C</p>
        </div>
        <div class="weather">
          <img alt="weather icon" src="${this.props.weatherIconUrl}" />
          <p class="desc">${this.props.weatherDesc}</p>
        </div>
      </div>
      <div class="flex misc">
	<div class="high-low">
          <dl>
            <dt>High:</dt>
            <dd>${this.props.tempHigh} °C</dd>
            <dt>Low:</dt>
            <dd>${this.props.tempLow} °C</dd>
          </dl>
	</div>
	<div>
	  <p>Humidity: ${this.props.humidity} %</p>
	</div>
      </div>
    </section>

    <style>
      .current-weather {
         text-align: center;

        .flex {
          display: flex;
          justify-content: center;
          align-content: center;
        }

        .header {
          .favorite {
            padding-left: 1rem;
            line-height: 1.5rem;
            cursor: pointer;
          }
        }

        .temp {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-right: 2rem;
          .current {
            padding-bottom: 1rem;
            font-size: 2rem;
          }
        }

        .misc {
          .high-low {
            padding-right: 2rem;
            dl {
              display: flex;
              flex-wrap: wrap;
            }
            dt {
              width: 60%;
              text-align: right;
              padding-right: 1rem;
            }
            dd {
              width: 40%;
              text-align: left;
              margin-left: 0;
            }
          }
        }
      }
    </style>
`;
    this.setFavoriteHandler();
  }

  setFavoriteHandler() {
    this.querySelector(".favorite").addEventListener("click", (e) => {
      this.props.favorite = !this.props.favorite;
      if (this.props.favorite) {
        document
          .querySelector("favorite-city")
          .addFavorite({ lat: this.lat, lon: this.lon, city: this.city });
      } else {
        document.querySelector("favorite-city").removeFavorite(this.city);
      }
      this.render();
    });
  }
}

customElements.define("current-weather", CurrentWeather);
