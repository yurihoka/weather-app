class FivedaysWeather extends HTMLElement {
  apiKey = "c54decd8137c19d79f34bcb2b31922a3";

  props = {
    date: [],
    temperatures: [],
    max: [],
    min: [],
    image: [],
  };

  dates = [];

  constructor() {
    super();
  }

  addHandler(lat, lon) {
    const dayCard = this.querySelectorAll(".dayCard");

    for (let i = 0; i < dayCard.length; i++) {
      dayCard[i].addEventListener("click", () => {
        const d = this.dates[i];
        document
          .querySelector("hourly-section")
          .updateState({ lat: lat, lon: lon, dateFromFiveDays: d });
      });
    }
  }

  connectedCallback() {
    this.updateState({ lat: 49.2827291, lon: -123.1207375 });
  }

  updateState({ lat, lon }) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=c54decd8137c19d79f34bcb2b31922a3`
    )
      .then((response) => response.json())
      .then((data) => {
        const monthList = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const now = new Date();
        const startIndex = data.list
          .map((d) => d.dt)
          .findIndex((date) => date * 1000 >= now.getTime());

        for (let i = startIndex; i < 33 + startIndex; i += 8) {
          const date = new Date(data.list[i].dt * 1000);
          const dateStr = monthList[date.getMonth()] + " " + date.getDate();
          const weatherName = data.list[i].weather[0].main;
          const temperature = data.list[i].main.temp;
          const max = data.list[i].main.temp_max;
          const min = data.list[i].main.temp_min;
          const index = (i - startIndex) / 8;

          this.dates[index] = data.list[i].dt_txt.split(" ")[0];
          this.props.date[index] = dateStr;
          this.props.image[index] = `./assets/${weatherName}.jpg`;
          this.props.temperatures[index] = temperature;
          this.props.max[index] = max;
          this.props.min[index] = min;
        }
        this.render();
        this.addHandler(lat, lon);
        document
          .querySelector("hourly-section")
          .updateState({ lat: lat, lon: lon, dateFromFiveDays: this.dates[0] });
      });
  }

  render() {
    // <h1>five days section</h1>
    this.innerHTML = `
  <div class="fivedaysSection">
    <div class="dayCard">
      <h2 class="fivedays">${this.props.date[0]}</h2>
      <img src="${this.props.image[0]}" alt="" />
      <h2 class="temperature">${this.props.temperatures[0]}℃</h2>
      <p class="max">Max ${this.props.max[0]}℃</p>
      <p class="min">Min ${this.props.min[0]}℃</p>
    </div>
    <div class="dayCard">
    <h2 class="fivedays">${this.props.date[1]}</h2>
    <img src="${this.props.image[1]}" alt="" />
    <h2 class="temperature">${this.props.temperatures[1]}℃</h2>
      <p class="max">Max ${this.props.max[1]}℃</p>
      <p class="min">Min ${this.props.min[1]}℃</p>
    </div>
    <div class="dayCard">
    <h2 class="fivedays">${this.props.date[2]}</h2>
    <img src="${this.props.image[2]}" alt="" />
    <h2 class="temperature">${this.props.temperatures[2]}℃</h2>
      <p class="max">Max ${this.props.max[2]}℃</p>
      <p class="min">Min ${this.props.min[2]}℃</p>
    </div>
    <div class="dayCard">
    <h2 class="fivedays">${this.props.date[3]}</h2>
    <img src="${this.props.image[3]}" alt="" />
      <h2 class="temperature">${this.props.temperatures[3]}℃</h2>
      <p class="max">Max ${this.props.max[3]}℃</p>
      <p class="min">Min ${this.props.min[3]}℃</p>
    </div>
    <div class="dayCard">
    <h2 class="fivedays">${this.props.date[4]}</h2>
    <img src="${this.props.image[4]}" alt="" />
      <h2 class="temperature">${this.props.temperatures[4]}℃</h2>
      <p class="max">Max ${this.props.max[4]}℃</p>
      <p class="min">Min ${this.props.min[4]}℃</p>
    </div>
  </div>
`;
  }
}

customElements.define("fivedays-weather", FivedaysWeather);
