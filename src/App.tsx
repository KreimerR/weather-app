import { useState, useEffect } from "react"
import DayForecast from "./components/DayForecast.tsx"
import WeekForecast from "./components/WeekForecast.tsx"
import weatherIcon from "./assets/weather-icon.png"
import logo from "./assets/logo.png"
import list from "./assets/list.png"
import map from "./assets/map.png"
import storm from "./assets/storm.png"
import clouds from "./assets/clouds.png"
import sun from "./assets/sun.png"
import heavyRain from "./assets/heavy-rain.png"
import cloudySun from "./assets/cloudysun.png"
import drop from "./assets/drop.png"
import wind from "./assets/wind.png"
import temperature from "./assets/temperature.png"
import sunIcon from "./assets/sun-icon.png"
import snow from "./assets/snow.png"
import fetchCurrentWeather from "./api/weatherApi.ts"

export default function App() {
  const [weather, setWeather] = useState<any>(null)
  const [city, setCity] = useState<string>("London")

  async function getWeather() {
    const data = await fetchCurrentWeather(city)
    setWeather(data)
  }

  useEffect(() => {
    getWeather()
  }, [])

  useEffect(() => {
    getWeather()
  }, [city])

  if (weather !== null) {
    console.log("Weather:", weather)
  }

  function weatherType() {
    if(weather !== null) {
      if(
        weather.current.condition.text === "Sunny" ||
        weather.current.condition.text === "Clear"

      ) {
        return sun
      } else if(
        weather.current.condition.text === "Partly Cloudy" ||
        weather.current.condition.text === "Partly cloudy"
      ) {
        return cloudySun
      } else if(
        weather.current.condition.text === "Cloudy" ||
        weather.current.condition.text === "Overcast" ||
        weather.current.condition.text === "Mist" ||
        weather.current.condition.text === "Fog" ||
        weather.current.condition.text === "Freezing fog"
      ) {
        return clouds
      } else if(
        weather.current.condition.text === "Patchy freezing drizzle nearby" ||
        weather.current.condition.text === "Patchy rain nearby" ||
        weather.current.condition.text === "Patchy light drizzle" ||
        weather.current.condition.text === "Light drizzle" ||
        weather.current.condition.text === "Freezing drizzle" ||
        weather.current.condition.text === "Heavy freezing drizzle" ||
        weather.current.condition.text === "Patchy light rain" ||
        weather.current.condition.text === "Light rain" ||
        weather.current.condition.text === "Moderate rain at times" ||
        weather.current.condition.text === "Moderate rain" ||
        weather.current.condition.text === "Heavy rain at times" ||
        weather.current.condition.text === "Heavy rain" ||
        weather.current.condition.text === "Light freezing rain" ||
        weather.current.condition.text === "Moderate or heavy freezing rain" ||
        weather.current.condition.text === "Light rain shower" ||
        weather.current.condition.text === "Moderate or heavy rain shower" ||
        weather.current.condition.text === "Torrential rain shower"
      ) {
        return heavyRain
      } else if(
        weather.current.condition.text === "Thundery outbreaks in nearby" ||
        weather.current.condition.text === "Patchy light rain in area with thunder" ||
        weather.current.condition.text === "Moderate or heavy rain in area with thunder" ||
        weather.current.condition.text === "Patchy light snow in area with thunder" ||
        weather.current.condition.text === "Moderate or heavy snow in area with thunder"
      ) {
        return storm
      } else if(
        weather.current.condition.text === "Blizzard" ||
        weather.current.condition.text === "Light snow" ||
        weather.current.condition.text === "Blowing snow" ||
        weather.current.condition.text === "Patchy snow nearby" ||
        weather.current.condition.text === "Patchy sleet nearby" ||
        weather.current.condition.text === "Light sleet" ||
        weather.current.condition.text === "Light sleet showers" ||
        weather.current.condition.text === "Moderate or heavy sleet" ||
        weather.current.condition.text === "Moderate or heavy sleet showers" ||
        weather.current.condition.text === "Light snow showers" ||
        weather.current.condition.text === "Moderate or heavy snow showers" ||
        weather.current.condition.text === "Light showers of ice pellets" ||
        weather.current.condition.text === "Moderate or heavy showers of ice pellets" ||
        weather.current.condition.text === "Patchy light snow" ||
        weather.current.condition.text === "Patchy moderate snow" ||
        weather.current.condition.text === "Moderate snow" ||
        weather.current.condition.text === "Patchy heavy snow" ||
        weather.current.condition.text === "Heavy snow" ||
        weather.current.condition.text === "Ice pellets"
      ) {
        return snow
      }
    } else {
      return sun
    }
  }

  return (
    <div className="app-container">
      <div className="left-menu-container">
        <img src={logo} alt="Logo" width="60" height="60" className="logo" />

        <div className="left-menu-button">
          <img src={weatherIcon} alt="Weather icon" width="20" height="20" className="weather-icon" />
          <h5 className="active">Weather</h5>
        </div>

        <div className="left-menu-button">
          <img src={list} alt="Cities icon" width="20" height="20" className="cities-icon" />
          <h5>Cities</h5>
        </div>

        <div className="left-menu-button">
          <img src={map} alt="Map icon" width="20" height="20" className="map-icon" />
          <h5>Map</h5>
        </div>
      </div>

      <main>
        <input
          onChange={(e) => setCity(e.target.value)}
          type="text"
          placeholder="Search for cities"
          className="search-input"
        />

        <div className="weather-info-container">
          <div className="left-weather-info-container">
            <div className="upper-left-weather-info-container">
              <h1 className="weather-info-place">{weather === null ? "null" : weather.location.name}</h1>
              <p>{weather === null ? "null" : weather.location.country}</p>
            </div>

            <h1 className="weather-info-degrees">{weather === null ? "0" : weather.current.temp_c}°</h1>
          </div>

          <img src={weatherType()} alt="Weather type" className="weather-type" />
        </div>

        <div className="day-forecast-container">
          <h5>TODAY'S FORECAST</h5>

          <div className="day-forecasts-container">
            <DayForecast />
            <DayForecast />
            <DayForecast />
            <DayForecast />
            <DayForecast />
            <DayForecast />
            <DayForecast />
          </div>
        </div>

        <div className="air-conditions-container">
          <h5>AIR CONDITIONS</h5>

          <div className="air-condition-types-upper-container">
            <div className="air-condition-container">
              <img src={temperature} width="20" height="20" alt="Real feel icon" className="real-feel-icon" />

              <div className="air-condition-info-container">
                <h5>Real Feel</h5>
                <h2>{weather === null ? "0" : weather.current.feelslike_c}°</h2>
              </div>
            </div>

            <div className="air-condition-container">
              <img src={wind} width="20" height="20" alt="Wind icon" className="wind-icon" />

              <div className="air-condition-info-container">
                <h5>Wind</h5>
                <h2>{weather === null ? "0" : weather.current.wind_kph} km/h</h2>
              </div>
            </div>
          </div>

          <div className="air-condition-types-bottom-container">
            <div className="air-condition-container">
              <img src={drop} width="20" height="20" alt="Humidity icon" className="humidity-icon" />

              <div className="air-condition-info-container">
                <h5>Humidity</h5>
                <h2>{weather === null ? "0" : weather.current.humidity}%</h2>
              </div>
            </div>

            <div className="air-condition-container">
              <img src={sunIcon} width="20" height="20" alt="UV Index icon" className="uv-index-icon" />

              <div className="air-condition-info-container">
                <h5>UV-Index</h5>
                <h2>{weather === null ? "0" : weather.current.uv}</h2>
              </div>
            </div>
          </div>

        </div>
      </main>

      <div className="week-forecasts-container">
        <h5 className="week-forecasts-title">7-DAY FORECAST</h5>

        <WeekForecast />
        <WeekForecast />
        <WeekForecast />
        <WeekForecast />
        <WeekForecast />
        <WeekForecast />
        <WeekForecast />
      </div>
    </div>
  )
}