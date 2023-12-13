class HourlySection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const now = new Date();
    const nowDateStr = () => {
      if (now.getDate() < 10) {
        return (
          now.getFullYear() + "-" + (now.getMonth() + 1) + "-0" + now.getDate()
        );
      } else {
        return (
          now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()
        );
      }
    };

    this.render();
  }
  render() {
    this.innerHTML = `<h1>three hours gaps section</h1>
        <div class="threeHoursSection">
          <div class="hourCard hourCard-T1">
            <h2 class="hourly-time">10:00 am</h2>
            <img src="" alt="" />
            <h3 class="hourly-weather">Sunny</h3>
            <p class="hourly-temp">3°C</p>
          </div>
          <div class="hourCard hourCard-T2">
            <h2 class="hourly-time">13:00 am</h2>
            <img src="" alt="" />
            <h3 class="hourly-weather">Sunny</h3>
            <p class="hourly-temp">3°C</p>
          </div>
          <div class="hourCard hourCard-T3">
            <h2 class="hourly-time">16:00 am</h2>
            <img src="" alt="" />
            <h3 class="hourly-weather">Sunny</h3>
            <p class="hourly-temp">3°C</p>
          </div>
          <div class="hourCard hourCard-T4">
            <h2 class="hourly-time">19:00 am</h2>
            <img src="" alt="" />
            <h3 class="hourly-weather">Sunny</h3>
            <p class="hourly-temp">3°C</p>
          </div>
          <div class="hourCard hourCard-T5">
            <h2 class="hourly-time">19:00 am</h2>
            <img src="" alt="" />
            <h3 class="hourly-weather">Sunny</h3>
            <p class="hourly-temp">3°C</p>
          </div>
          <div class="hourCard hourCard-T6">
            <h2 class="hourly-time">19:00 am</h2>
            <img src="" alt="" />
            <h3 class="hourly-weather">Sunny</h3>
            <p class="hourly-temp">3°C</p>
          </div>
          <div class="hourCard hourCard-T7">
            <h2 class="hourly-time">19:00 am</h2>
            <img src="" alt="" />
            <h3 class="hourly-weather">Sunny</h3>
            <p class="hourly-temp">3°C</p>
          </div>
          <div class="hourCard hourCard-T8">
            <h2 class="hourly-time">19:00 am</h2>
            <img src="" alt="" />
            <h3 class="hourly-weather">Sunny</h3>
            <p class="hourly-temp">3°C</p>
          </div>
        </div>`;
  }

  updateState({ lat, lon, dateFromFiveDays }) {
    const apiKey = "e26dbe6d19bb098e7b1e7d8abfd97a63";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric`;

    fetch(apiUrl + "&appid=" + apiKey)
      .then((response) => response.json())
      .then((data) => {
        this.updateInfo(dateFromFiveDays, data);
      })
      .catch((error) => console.error("fetch error: ", error));

    // this.render();
  }

  updateInfo(dateFromFiveDays, json) {
    this.setDate(dateFromFiveDays);
    this.setTemp(dateFromFiveDays, json);
    // this.setWeather(json);
  }
  setDate(date) {
    const dt = document.querySelector(".container_threeHoursGaps h1");
    dt.innerText = date.slice(5);
  }
  setTemp(dateFromFiveDays, json) {
    const firstDateIndex = json.list
      .map((d) => d.dt_txt.split(" ")[0])
      .findIndex((date) => date === dateFromFiveDays);
    //find the last index of the date in this array.
    let LastDateIndex = 0;
    if (firstDateIndex > 32) {
      LastDateIndex = 39;
    } else {
      LastDateIndex = json.list
        .map((d) => d.dt_txt)
        .findIndex((date) => date === dateFromFiveDays + " 21:00:00");
    }

    const numberOfCards = LastDateIndex - firstDateIndex + 1;

    const hourTempList = document.querySelectorAll(".hourCard p");

    for (let i = 0; i < numberOfCards; i++) {
      hourTempList[i].innerHTML =
        json.list[i + firstDateIndex].main.temp + "°C";
      document.querySelector(`.hourCard-T${i + 1}`).style.display = "flex";
    }

    for (let i = numberOfCards; i < 8; i++) {
      document.querySelector(`.hourCard-T${i + 1}`).style.display = "none";
    }

    //---set weather----//
    this.setWeather(json, firstDateIndex, numberOfCards);
  }

  setWeather(json, startIndex, numOfCards) {
    const hourWeatherImgList = document.querySelectorAll(".hourCard img");
    const hourWeatherCaptionList = document.querySelectorAll(".hourly-weather");
    const hourTimeList = document.querySelectorAll(".hourCard .hourly-time");
    let weatherName = "";
    let time = [];
    for (let i = 0; i < numOfCards; i++) {
      time = json.list[i + startIndex].dt_txt.split(" ");
      weatherName = json.list[i + startIndex].weather[0].main;
      hourWeatherImgList[i].src = `./assets/${weatherName}.jpg`;
      hourWeatherCaptionList[i].innerHTML = `${weatherName}`;
      hourTimeList[i].innerHTML = time[1].slice(0, 5);
    }
  }
}

customElements.define("hourly-section", HourlySection);
