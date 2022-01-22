<template>
  <main>
    <div class="serach-box">
      <div class="search-box-item toggle-darkmode">
        <button @click="toggleDarkMode">
          <v-icon>mdi-theme-light-dark</v-icon>
        </button>
      </div>
      <div class="search-box-item input">
        <input
          type="text"
          class="search-bar"
          :placeholder="weather.name ? weather.name : 'Search for a location'"
          v-model="searchBarText"
          @keypress="searchWeatherSuggestions"
          :disabled="$nuxt.isOffline"
        />
        <button
          :disabled="$nuxt.isOffline"
          type="button"
          class="search-button"
          @click="fetchWeather($event)"
        >
          <v-icon>mdi-magnify</v-icon>
        </button>
      </div>
      <div class="search-box-item buttons">
        <button
          type="button"
          class="button-refresh"
          @click="loadWeather"
          :disabled="$nuxt.isOffline"
        >
          <v-icon>mdi-refresh</v-icon>
        </button>
        <button
          type="button"
          class="track-location"
          @click="toggleTracking"
          :disabled="$nuxt.isOffline"
        >
          <v-icon>{{
            trackingIsEnable == true ? "mdi-crosshairs-gps" : "mdi-crosshairs"
          }}</v-icon>
        </button>
      </div>
    </div>
    <!-- TODO:DONE: add style to search suggestion -->
    <!-- NOTE: in the style set to absolute -->
    <!-- NOTE: Always show weather info -->
    <div class="search-suggestions" v-if="showSearchSuggestions">
      <span
        :key="index"
        v-for="(item, index) in searchSuggestions"
        @click="selectSearchSuggestion(searchSuggestions[index])"
      >
        {{ item.text }} <br />
        {{ item.place_name }} <br />
      </span>
    </div>
    <div class="error-message" v-if="showError">
      {{ errorMessage }}
    </div>
    <div class="loading-message" v-if="showLoading">Loading...</div>
    <div class="weather--wrap" v-if="showWeather">
      <div class="weather--item--location">
        <div class="location-box">
          <div class="location">
            <div class="city">
              {{ weather.name }}
            </div>
            <div class="date">{{ dateBuilder(weather.dt) }}</div>
          </div>
        </div>
      </div>
      <div class="weather--item--weather-details">
        <div class="weather--data">
          <div class="weather--icon">
            <!-- <img
              :src="
                'http://openweathermap.org/img/wn/' +
                weather.weather[0].icon +
                '@2x.png'
              "
              :style="!$nuxt.isOffline ? '' : 'margin:25px 0'"
              v-if="!$nuxt.isOffline"
            /> -->
            <img
              :src="
                !darkMode
                  ? '/weather-sunny-off-dark.svg'
                  : '/weather-sunny-off-light.svg'
              "
              style="margin: 25px 0"
              v-if="$nuxt.isOffline"
            />
          </div>
          <div class="weather--temp">
            {{ Math.round(weather.temp) }}
            <span class="deg">&#8451;</span>
          </div>
          <div class="weather--description">
            <!-- {{ weather.weather[0].description }} -->
            <div class="separator">|</div>
            <div class="weather--wind">
              <div class="wind-speed">
                {{ weather.wind_speed }}
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
          v-for="(item, index) in forecast"
          v-if="typeof forecast != 'undefined'"
        >
          <div class="forecast--item--date">
            <span class="day">{{ dateBuilder(item.dt, "day") }}</span>
            <span class="date">{{ dateBuilder(item.dt) }}</span>
          </div>
          <div class="forecast--item--icon">
            <img
              :src="
                'http://openweathermap.org/img/wn/' +
                item.weather[0].icon +
                '@2x.png'
              "
              :style="!$nuxt.isOffline ? '' : 'margin:25px 0'"
              v-if="!$nuxt.isOffline"
            />
            <img
              :src="
                !darkMode
                  ? '/weather-sunny-off-dark.svg'
                  : '/weather-sunny-off-light.svg'
              "
              style="margin: 25px 0"
              v-if="$nuxt.isOffline"
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
      <a href="https://github.com/GabrielFNLima/vue-weather" target="_blank">
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
      forecast: {},
      showError: false,
      errorMessage: "",
      showLoading: false,
      trackingIsEnable: false,
      geoLocation: {},
      darkMode: false,

      showWeather: false,

      switchSearch: false,

      searchSuggestions: [],
      searchSuggestion: {},
      showSearchSuggestions: false,
    };
  },
  async fetch() {
    this.weather = localStorage.getItem("weather")
      ? JSON.parse(localStorage.getItem("weather"))
      : {};
    this.forecast = localStorage.getItem("forecast")
      ? JSON.parse(localStorage.getItem("forecast"))
      : {};
    this.searchSuggestion = localStorage.getItem("searchSuggestion")
      ? JSON.parse(localStorage.getItem("searchSuggestion"))
      : {};
    this.trackingIsEnable =
      localStorage.getItem("trackingIsEnable") === "true" ? true : false;

    document.querySelector("body").addEventListener("click", () => {
      if (this.showSearchSuggestions) {
        this.showSearchSuggestions = false;
        this.searchBarText = "";
      }
    });

    // localStorage.clear();

    if (localStorage.getItem("weather") != null) {
      this.showWeather = true;
    }else{
      this.showWeather = false;
      // localStorage.setItem("weather", "{}");

    }


    if (
      this.trackingIsEnable == false &&
      localStorage.getItem("weather") == null
    ) {
      // this.weather = {};
      localStorage.setItem("trackingIsEnable", false);
      // localStorage.setItem("weather", "{}");
    }

    if (
      window.matchMedia("(prefers-color-scheme: dark)").matches &&
      localStorage.getItem("darkMode") !== "false"
    ) {
      localStorage.setItem("darkMode", true);
      this.loadDarkMode();
    } else {
      this.loadDarkMode();
    }
  },
  created() {},
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
    async loadWeather(e) {
      this.showLoading = true;
      this.showError = false;
      this.showWeather = false;
      this.weather = {};

      const optionsParams = new URLSearchParams({
        units: "metric",
        lang: "pt",
        appid: process.env.API_KEY,
        exclude: "minutely,hourly,",
      });

      // TODO: DONE: verify why the coords from the geolocation is not working
      const paramsOneCall = new URLSearchParams();

      if (this.switchSearch) {
        paramsOneCall.append("lat", this.geoLocation.latitude);
        paramsOneCall.append("lon", this.geoLocation.longitude);

        const suggestion = await this.mapboxRequest(
          `${this.geoLocation.longitude},${this.geoLocation.latitude}`
        );
        await localStorage.setItem(
          "searchSuggestion",
          JSON.stringify(suggestion.features[0])
        );

        this.searchSuggestion = JSON.parse(
          localStorage.getItem("searchSuggestion")
        );
      } else {
        paramsOneCall.append("lat", this.searchSuggestion.center[1]);
        paramsOneCall.append("lon", this.searchSuggestion.center[0]);
      }


      const resultOneCall = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?${paramsOneCall}${
          "&" + optionsParams
        }`
      );

      const onceCallData = await resultOneCall.json();

      await localStorage.setItem(
        "forecast",
        JSON.stringify(onceCallData.daily)
      );

      this.forecast = JSON.parse(localStorage.getItem("forecast"));

      await localStorage.setItem(
        "weather",
        JSON.stringify({
          ...onceCallData.current,
          name: this.searchSuggestion.text,
        })
      );
      this.weather = JSON.parse(localStorage.getItem("weather"));

      this.showLoading = false;
      this.showWeather = true;

      if (onceCallData.cod != "404") {
        this.searchBarText = "";
      }

      if (
        onceCallData.cod == "404" ||
        onceCallData.cod == "400" ||
        onceCallData.cod == "401"
      ) {
        this.showError = true;
        this.errorMessage = this.weather.message;
        return;
      } else {
        this.showError = false;
      }
    },
    async fetchWeather(e, type) {
      if (e.key == "Enter" || e.type == "click") {
        if (this.searchBarText == "" && type != "refresh") {
          this.showError = true;
          this.errorMessage = "Please enter a valid city name";
          this.showLoading = false;
          this.showWeather = false;
          return;
        }

        const suggestion = await this.mapboxRequest(this.searchBarText);
        this.showSearchSuggestions = false;
        this.switchSearch = false

        await localStorage.setItem(
          "searchSuggestion",
          JSON.stringify(suggestion.features[0])
        );

        this.searchSuggestion = JSON.parse(
          localStorage.getItem("searchSuggestion")
        );
        await this.loadWeather(e);
        // return
      }
      // await this.loadWeather(e);
    },
    async searchWeatherSuggestions(e) {
      this.showWeather = true;
      this.showSearchSuggestions = true;


      const searchData = await this.mapboxRequest(this.searchBarText);

      this.searchSuggestions = searchData.features;

    },
    async selectSearchSuggestion(suggestion) {
      this.showSearchSuggestions = false;
      this.switchSearch = false;
      await localStorage.setItem(
        "searchSuggestion",
        JSON.stringify(suggestion)
      );
      this.searchSuggestion = JSON.parse(
        localStorage.getItem("searchSuggestion")
      );

      this.loadWeather();
    },
    async mapboxRequest(query, limit) {
      const params = new URLSearchParams({
        access_token:process.env.API_KEY_MAPBOX,
      });
      const result = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?${params}`
      );

      return result.json();
    },
    tracking() {
      if (!("geolocation" in navigator)) {
        this.showError = true;
        this.showWeather = false;
        this.errorMessage = "Geolocation is not available.";
        return;
      }

      if (this.trackingIsEnable) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.showError = false;
            this.trackingIsEnable = true;
            this.switchSearch = true;
            this.showWeather = true;

            localStorage.setItem("trackingIsEnable", true);
            this.geoLocation = pos.coords;
            this.loadWeather();
          },
          (err) => {
            this.showError = true;
            this.errorMessage = err.message;
            this.showWeather = false;
            this.switchSearch = false;
            this.trackingIsEnable = false;

            localStorage.setItem("trackingIsEnable", false);
          }
        );
      } else {
        localStorage.setItem("trackingIsEnable", false);
        this.showError = true;
        this.errorMessage = "Geolocation is disable.";

        setTimeout(() => {
          this.showError = false;
          this.errorMessage = "";
        }, 3000);
      }
    },
    toggleTracking() {
      this.trackingIsEnable = !this.trackingIsEnable;

      this.tracking();
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;

      localStorage.setItem("darkMode", this.darkMode);
      this.loadDarkMode();
    },
    loadDarkMode() {
      if (
        this.darkMode === true ||
        localStorage.getItem("darkMode") === "true"
      ) {
        document.body.classList.add("darkmode-enabled");
      } else {
        document.body.classList.remove("darkmode-enabled");
      }
    },
  },
  watch: {
    searchBarText(newValue) {
      if (newValue == "" && this.showSearchSuggestions) {
        this.showSearchSuggestions = false;
      }
    },
  },
};
</script>
