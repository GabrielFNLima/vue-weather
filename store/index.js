export const state = () => ({
  counter: 0,
  searchBarText: "",
  weather: {
    coord: { lon: -0.1257, lat: 51.5085 },
    weather: [
      { id: 800, main: "Clear", description: "clear sky", icon: "01n" },
    ],
    base: "stations",
    main: {
      temp: 4.05,
      feels_like: 2.2,
      temp_min: 1.46,
      temp_max: 6.1,
      pressure: 1034,
      humidity: 89,
    },
    visibility: 10000,
    wind: { speed: 2.06, deg: 90 },
    clouds: { all: 4 },
    dt: 1642182509,
    sys: {
      type: 2,
      id: 2019646,
      country: "GB",
      sunrise: 1642147217,
      sunset: 1642177097,
    },
    timezone: 0,
    id: 2643743,
    name: "London",
    cod: 200,
  },
  baseUrl: "https://api.openweathermap.org/data/2.5/",
  api_key:'b8f9f8f9f9f9f9f9f9f9f9f9f9f9f9f9',
});

export const mutations = {
  increment(state) {
    state.counter++;
  },
  setSearchBarText(state, text) {
    state.searchBarText = text;
  },
  fetchWeather (e) {
    if (e.key == "Enter") {
      fetch(`${state.url_base}weather?q=${state.searchBarText}&units=metric&APPID=${state.api_key}`)
        .then(res => {
          return res.json();
        }).then(state.weather)
    }
  },
  fetchForecast (e) {
    if (e.key == "Enter") {
      fetch(`${state.url_base}weather?q=${state.searchBarText}&units=metric&APPID=${state.api_key}`)
        .then(res => {
          return res.json();
        }).then(this.setResults);
    }
  },
};
