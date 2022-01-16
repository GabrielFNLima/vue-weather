<template>
  <main>
    <div class="serach-box">
      <div class="search-box-item">
        <input
          type="text"
          class="search-bar"
          :placeholder="weather.name ? weather.name : 'Search for a location'"
          v-model="searchBarText"
          @keypress="fetchWeather"
          :disabled="$nuxt.isOffline"
        />
        <button
          :disabled="$nuxt.isOffline"
          type="button"
          class="search-button"
          @click="fetchWeather"
        >
          <v-icon>mdi-magnify</v-icon>
        </button>
      </div>
      <div class="search-box-item buttons">
        <button
          type="button"
          class="button-refresh"
          @click="fetchWeather($event, 'refresh')"
          :disabled="$nuxt.isOffline"
        >
          <v-icon>mdi-refresh</v-icon>
        </button>
        <button
          type="button"
          class="track-location"
          @click="tracking"
          :disabled="$nuxt.isOffline"
        >
          <v-icon>{{
            trackingIsEnable ? "mdi-crosshairs-gps" : "mdi-crosshairs"
          }}</v-icon>
        </button>
      </div>
    </div>
    <div class="error-message" v-if="showError === true">
      {{ weather.message }}
    </div>
    <div class="loading-message" v-if="showLoading === true">Loading...</div>
    <div class="weather--wrap" v-if="typeof weather.main != 'undefined'">
      <div class="weather--item--location">
        <div class="location-box">
          <div class="location">
            <div class="city">
              {{ weather.name }}, {{ weather.sys.country }}
            </div>
            <div class="date">{{ dateBuilder(weather.dt) }}</div>
          </div>
        </div>
      </div>
      <div class="weather--item--weather-details">
        <div class="weather--data">
          <div class="weather--icon">
            <img
              :src="
                !$nuxt.isOffline
                  ? 'http://openweathermap.org/img/wn/' +
                    weather.weather[0].icon +
                    '@2x.png'
                  : '/weather-sunny-off.svg'
              "
              :style="!$nuxt.isOffline ? '' : 'margin:25px 0'"
            />
          </div>
          <div class="weather--temp">
            {{ Math.round(weather.main.temp) }}
            <span class="deg">&#8451;</span>
          </div>
          <div class="weather--description">
            {{ weather.weather[0].description }}
            <div class="separator">|</div>
            <div class="weather--wind">
              <div class="wind-speed">
                {{ weather.wind.speed }}
                <span class="wind-speed-unit">m/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="weather--item--forecast">
        <div
          class="forecast--item"
          :key="index"
          v-for="(item, index) in forecast.daily"
          v-if="typeof forecast != 'undefined'"
        >
          <div class="forecast--item--date">
            <span class="day">{{ dateBuilder(item.dt, "day") }}</span>
            <span class="date">{{ dateBuilder(item.dt) }}</span>
          </div>
          <div class="forecast--item--icon">
            <img
              :src="
                !$nuxt.isOffline
                  ? 'http://openweathermap.org/img/wn/' +
                    weather.weather[0].icon +
                    '@2x.png'
                  : '/weather-sunny-off.svg'
              "
              :style="!$nuxt.isOffline ? '' : 'margin:25px 0'"
            />

            <div class="forecast--item--description">
              {{ item.weather[0].description }}
            </div>
          </div>
          <div class="forecast--item--temp">
            {{ Math.round(item.temp.day) }}
            <span class="deg">&#8451;</span>
          </div>
          <div class="forecast--item--temp--min-max">
            <span class="temp-min">
              <v-icon color="blue darken-2"> mdi-menu-down </v-icon
              >{{ Math.round(item.temp.min) }}
              <span class="deg">&#8451;</span>
            </span>
            <span class="temp-max">
              <v-icon color="blue darken-2"> mdi-menu-up </v-icon>
              {{ Math.round(item.temp.max) }}
              <span class="deg">&#8451;</span>
            </span>
          </div>
          <div class="forecast--item--sunrise">
            <div class="sunrise">
              <v-icon color="blue darken-2"> mdi-weather-sunset-up </v-icon>
              {{ dateBuilder(item.sunrise, "time") }}
            </div>
            <div class="sunset">
              <v-icon color="blue darken-2"> mdi-weather-sunset-down </v-icon>
              {{ dateBuilder(item.sunset, "time") }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="isOffline" v-if="$nuxt.isOffline">
      <v-icon color="#fff">mdi-alert</v-icon>
      You are offline
    </div>

    <div class="develope-by">
      <a href="https://github.com/GabrielFNLima">Developed by Gabriel Lima</a>
      <div class="separator">|</div>
          <a
            href="https://github.com/GabrielFNLima/vue-weather"
            target="_blank"
          >
            vue-weather repository
          </a>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      searchBarText: "",
      weather: {},
      forecast: {
        lat: 33.44,
        lon: -94.04,
        timezone: "America/Chicago",
        timezone_offset: -21600,
        current: {
          dt: 1642267533,
          sunrise: 1642252799,
          sunset: 1642289448,
          temp: 2.78,
          feels_like: -3.03,
          pressure: 1015,
          humidity: 65,
          dew_point: -2.78,
          uvi: 2.08,
          clouds: 100,
          visibility: 10000,
          wind_speed: 8.94,
          wind_deg: 301,
          wind_gust: 16.09,
          weather: [
            {
              id: 804,
              main: "Clouds",
              description: "overcast clouds",
              icon: "04d",
            },
          ],
        },
        daily: [
          {
            dt: 1642269600,
            sunrise: 1642252799,
            sunset: 1642289448,
            moonrise: 1642282320,
            moonset: 1642246800,
            moon_phase: 0.43,
            temp: {
              day: 2.82,
              min: 0.3,
              max: 11.15,
              night: 3.45,
              eve: 0.41,
              morn: 9.21,
            },
            feels_like: { day: -2.65, night: -1.57, eve: -5.2, morn: 5.87 },
            pressure: 1015,
            humidity: 63,
            dew_point: -3.11,
            wind_speed: 8.76,
            wind_deg: 319,
            wind_gust: 14.64,
            weather: [
              {
                id: 616,
                main: "Snow",
                description: "rain and snow",
                icon: "13d",
              },
            ],
            clouds: 100,
            pop: 0.83,
            rain: 0.89,
            snow: 1.04,
            uvi: 2.49,
          },
          {
            dt: 1642356000,
            sunrise: 1642339185,
            sunset: 1642375903,
            moonrise: 1642371780,
            moonset: 1642336380,
            moon_phase: 0.46,
            temp: {
              day: 6.87,
              min: -0.15,
              max: 9.5,
              night: 2.62,
              eve: 5.51,
              morn: 0.22,
            },
            feels_like: { day: 4.73, night: -0.05, eve: 3.26, morn: -4.33 },
            pressure: 1018,
            humidity: 60,
            dew_point: -0.35,
            wind_speed: 6.96,
            wind_deg: 338,
            wind_gust: 12.57,
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "clear sky",
                icon: "01d",
              },
            ],
            clouds: 7,
            pop: 0.77,
            uvi: 2.87,
          },
          {
            dt: 1642356000,
            sunrise: 1642339185,
            sunset: 1642375903,
            moonrise: 1642371780,
            moonset: 1642336380,
            moon_phase: 0.46,
            temp: {
              day: 6.87,
              min: -0.15,
              max: 9.5,
              night: 2.62,
              eve: 5.51,
              morn: 0.22,
            },
            feels_like: { day: 4.73, night: -0.05, eve: 3.26, morn: -4.33 },
            pressure: 1018,
            humidity: 60,
            dew_point: -0.35,
            wind_speed: 6.96,
            wind_deg: 338,
            wind_gust: 12.57,
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "clear sky",
                icon: "01d",
              },
            ],
            clouds: 7,
            pop: 0.77,
            uvi: 2.87,
          },
          {
            dt: 1642356000,
            sunrise: 1642339185,
            sunset: 1642375903,
            moonrise: 1642371780,
            moonset: 1642336380,
            moon_phase: 0.46,
            temp: {
              day: 6.87,
              min: -0.15,
              max: 9.5,
              night: 2.62,
              eve: 5.51,
              morn: 0.22,
            },
            feels_like: { day: 4.73, night: -0.05, eve: 3.26, morn: -4.33 },
            pressure: 1018,
            humidity: 60,
            dew_point: -0.35,
            wind_speed: 6.96,
            wind_deg: 338,
            wind_gust: 12.57,
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "clear sky",
                icon: "01d",
              },
            ],
            clouds: 7,
            pop: 0.77,
            uvi: 2.87,
          },
          {
            dt: 1642356000,
            sunrise: 1642339185,
            sunset: 1642375903,
            moonrise: 1642371780,
            moonset: 1642336380,
            moon_phase: 0.46,
            temp: {
              day: 6.87,
              min: -0.15,
              max: 9.5,
              night: 2.62,
              eve: 5.51,
              morn: 0.22,
            },
            feels_like: { day: 4.73, night: -0.05, eve: 3.26, morn: -4.33 },
            pressure: 1018,
            humidity: 60,
            dew_point: -0.35,
            wind_speed: 6.96,
            wind_deg: 338,
            wind_gust: 12.57,
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "clear sky",
                icon: "01d",
              },
            ],
            clouds: 7,
            pop: 0.77,
            uvi: 2.87,
          },
        ],
        alerts: [
          {
            sender_name: "NWS Shreveport (Shreveport)",
            event: "Wind Advisory",
            start: 1642248000,
            end: 1642291200,
            description:
              "...WIND ADVISORY IN EFFECT FROM 6 AM THIS MORNING TO 6 PM CST\nTHIS EVENING...\n* WHAT...Northwest winds 20 mph with higher gusts up to 30-35 mph.\n* WHERE...Portions of northwest Louisiana, southwest Arkansas\nand east and northeast Texas.\n* WHEN...From 6 AM this morning to 6 PM this evening.\n* IMPACTS...Strong and gusty winds will persist for much of the\ndaylight hours and make for difficult driving with cross winds\nacross portions of I-20 and I-30. In addition, we will see a\nrough chop with waves on area lakes which will create hazardous\nconditions for small craft.",
            tags: ["Wind"],
          },
        ],
      },
      showContent: false,
      showError: false,
      showLoading: false,
      trackingIsEnable: false,
      trackingCoords: {},
    };
  },
  async fetch() {
    this.weather = localStorage.getItem("weather")
      ? JSON.parse(localStorage.getItem("weather"))
      : {};
    this.trackingIsEnable = Boolean(localStorage.getItem("trackingIsEnable"));
  },
  methods: {
    dateBuilder(dt, type) {
      let d = new Date(dt * 1000);
      let months = [
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
      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();
      let hours = d.getHours();
      let minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();

      // return `${month} ${date}, ${year}`;
      switch (type) {
        case "day":
          return day;
        case "month":
          return month;
        case "time":
          return `${hours}:${minutes}`;
        default:
          return `${month} ${date}`;
      }
    },
    async loadWeather(coords) {
      console.log(coords);
      await fetch(
        `${process.env.API_BASE_URL}/weather?${
          coords
            ? "lat=" + coords.latitude + "&lon=" + coords.longitude
            : "q=" + this.searchBarText
        }&lang=pt_br&appid=${process.env.API_KEY}&units=metric`
      )
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          localStorage.setItem("weather", JSON.stringify(res));
          this.weather = JSON.parse(localStorage.getItem("weather"));
          this.showLoading = false;
          if (res.cod != "404") {
            this.searchBarText = "";
          }
        });
      if (
        this.weather.cod == "404" ||
        this.weather.cod == "400" ||
        this.weather.cod == "401"
      ) {
        this.showError = true;
      } else {
        this.showError = false;
      }
      if (
        this.weather.cod != "404" ||
        this.weather.cod != "400" ||
        this.weather.cod != "401"
      ) {
        await fetch(
          `${process.env.API_BASE_URL}/onecall?lat=${
            coords != "undefined" ? this.weather.coord.lat : coords.latitude
          }&lon=${
            coords != "undefined" ? this.weather.coord.lon : coords.longitude
          }&lang=pt_br&exclude=hourly,minutely&appid=${
            process.env.API_KEY
          }&units=metric`
        )
          .then((res) => {
            return res.json();
          })
          .then((res) => (this.forecast = res));
      }
    },
    async fetchWeather(e, type) {
      if (e.key == "Enter" || e.type == "click") {
        this.showLoading = true;
        this.weather = {};

        if (type == "refresh") {
          this.searchBarText = JSON.parse(localStorage.getItem("weather")).name;
        }
        if (this.searchBarText == "") {
          this.showError = true;
          this.weather.message = "Please enter a valid city name";
          this.showLoading = false;
          return;
        }

        this.loadWeather();
      }
    },
    tracking() {
      if (!("geolocation" in navigator)) {
        this.showError = true;
        this.weather.message = "Geolocation is not available.";
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.showError = false;
          this.trackingIsEnable = true;
          this.trackingCoords = pos.coords;
          console.log(this.trackingCoords);
          this.loadWeather(pos.coords);
          console.log(this.weather);
        },
        (err) => {
          this.showError = true;
          this.weather.message = err.message;
          console.log(err.message);
        }
      );

      // if (this.trackingIsEnable) {
      //   this.trackingIsEnable = false;
      //   localStorage.setItem("trackingIsEnable", false);
      // } else {
      //   this.trackingIsEnable = true;
      //   localStorage.setItem("trackingIsEnable", true);
      // }
    },
    toggleTracking() {
      //
    },
  },
};
</script>
