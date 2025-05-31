import { useState, useEffect } from "react"
import { City } from "country-state-city"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"

import DayForecast from "./components/DayForecast.tsx"
import WeekForecast from "./components/WeekForecast.tsx"

import fetchCurrentWeather from "./api/weatherApi.ts"
import fetchCurrentWeather2 from "./api/weatherApi2.ts"

import weatherIcon from "./assets/weather-icon.png"
import logo from "./assets/logo.png"
import list from "./assets/list.png"
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
import lightTheme from "./assets/light-theme.png"
import darkTheme from "./assets/dark-theme.png"
import star from "./assets/star.png"
import starFilled from "./assets/star-filled.png"

export default function App() {
  const [weather, setWeather] = useState<any>(() => {
    const stored = localStorage.getItem("weather")
    return stored ? JSON.parse(stored) as any : null
  })

  const [weather2, setWeather2] = useState<any>(() => {
    const stored = localStorage.getItem("weather2")
    return stored ? JSON.parse(stored) as any : null
  })

  const [city, setCity] = useState<string>(() => {
    const stored = localStorage.getItem("city")
    return stored ? JSON.parse(stored) as string : "Berlin"
  })

  const [location, setLocation] = useState<string[]>(() => {
    const stored = localStorage.getItem("location")
    return stored ? JSON.parse(stored) as string[] : ["52.52437000", "13.41053000"]
  })
  
  const [savedLocations, setSavedLocations] = useState<{ city: string, location: string[] }[]>(() => {
    const stored = localStorage.getItem("savedLocations")
    return stored ? JSON.parse(stored) as { city: string, location: string[] }[] : []
  })

  const [search, setSearch] = useState<string>(() => {
    const stored = localStorage.getItem("search")
    return stored ? JSON.parse(stored) as string : ""
  })

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("theme")
    return stored ? JSON.parse(stored) as "light" | "dark" : "light"
  })

  const [currentPage, setCurrentPage] = useState<"Weather" | "Cities">(() => {
    const stored = localStorage.getItem("currentPage")
    return stored ? JSON.parse(stored) as "Weather" | "Cities" : "Weather"
  })

  const [windowWidth, setWindowWidth] = useState<any>(() => {
    const stored = localStorage.getItem("windowWidth")
    return stored ? JSON.parse(stored) as any : window.innerWidth
  })

  async function getWeather() {
    const data = await fetchCurrentWeather(location[0], location[1])
    const data2 = await fetchCurrentWeather2(location[0], location[1])
    setWeather(data)
    setWeather2(data2)
  }

  useEffect(() => {
    getWeather()
  }, [location])

  useEffect(() => {
    document.documentElement.setAttribute("theme", theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("weather", JSON.stringify(weather))
  }, [weather])

  useEffect(() => {
    localStorage.setItem("weather2", JSON.stringify(weather2))
  }, [weather2])

  useEffect(() => {
    localStorage.setItem("city", JSON.stringify(city))
  }, [city])

  useEffect(() => {
    localStorage.setItem("location", JSON.stringify(location))
  }, [location])

  useEffect(() => {
    localStorage.setItem("savedLocations", JSON.stringify(savedLocations))
  }, [savedLocations])

  useEffect(() => {
    localStorage.setItem("search", JSON.stringify(search))
  }, [search])

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    localStorage.setItem("currentPage", JSON.stringify(currentPage))
  }, [currentPage])

  useEffect(() => {
    localStorage.setItem("windowWidth", JSON.stringify(windowWidth))
  }, [windowWidth])

  useEffect(() => {
    const images = [weatherIcon, logo, list, storm, clouds, sun, heavyRain, cloudySun, drop, wind, temperature, sunIcon, snow, lightTheme, darkTheme, star, starFilled]
    images.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  function toggleTheme() {
    setTheme(prev => prev === "dark" ? "light" : "dark")
  }

  function setCityFromSearchResult(latitude: any, longitude: any, currentCity: string) {
    setLocation([latitude, longitude])
    setSearch("")
    setCity(currentCity)
  }

  const cities = City.getAllCities()

  const searchResults = cities
    .filter(city => 
      search.toLowerCase() === city.name.toLowerCase() || 
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      search.toLowerCase().includes(`${city.name.toLowerCase()}, ${city.latitude?.split(".")[0]}, ${city.longitude?.split(".")[0]}`) ||
      search.toLowerCase() === `${city.latitude}, ${city.longitude}`
    )
    .slice(0, 5)
    .map(currentCity => (
      <li
        key={`${currentCity.name}--${currentCity.countryCode}--${currentCity.stateCode}`}
        onClick={() => setCityFromSearchResult(currentCity.latitude, currentCity.longitude, currentCity.name)}
      >
        {currentCity.name}, {currentCity.latitude}, {currentCity.longitude}
      </li>
    ))

  function getDays(daysFromToday: number, type: number) {
    if(type === 0) {
      return "Today"
    } else {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const today = new Date()
      const index = (today.getDay() + daysFromToday) % 7
      return daysOfWeek[index]
    }
  }

  function toggleSavedLocations() {
    setSavedLocations(prev => {
      const exists = prev.some(
        item =>
          item.city === city &&
          item.location[0] === location[0] &&
          item.location[1] === location[1]
      )

      if(exists) {
        return prev.filter(
          item =>
            item.city !== city ||
            item.location[0] !== location[0] &&
            item.location[1] !== location[1]
        )
      } else {
        return [...prev, { city, location }]
      }
    })
  }

  function removeSavedLocation(chosenCity: string, chosenLocation: string[]) {
    setSavedLocations(savedLocations.filter(
      item =>
        item.city !== chosenCity ||
        item.location[0] !== chosenLocation[0] &&
        item.location[1] !== chosenLocation[1]
    ))
  }

  function setNewCity(chosenCity: string, chosenLocation: string[]) {
    setCity(chosenCity)
    setLocation(chosenLocation)
  }

  const savedCities = savedLocations.map(location => {
    return (
      <div
        key={`${location.city}--${location.location[0]}--${location.location[1]}`}
        className="saved-city"
      >
        <div
          onClick={() => setNewCity(location.city, location.location)}  
          className="city-info-container"
        >
          <h1>{location.city}</h1>
          <p>{location.location[0]}, {location.location[1]}</p>
        </div>

        <div 
          onClick={() => removeSavedLocation(location.city, location.location)} 
          className="icon-container"
        >
          <img 
            src={starFilled} 
            alt="Delete" 
            width="32" 
          />
        </div>
      </div>
    )
  })

  const path = weather === null ? null : weather.current.condition.text

  function pathFinder(num: number) {
    return weather === null ? null : weather.forecast.forecastday[0].hour[num].condition.text
  }

  function pathFinder2(num: number) {
    return weather2 === null ? null : weather2.daily.weatherCode[num]
  }

  function weatherType(path: any) {
    if (weather !== null) {
      if (
        path === "Sunny" ||
        path === "Sunny " ||
        path === "Clear" ||
        path === "Clear "

      ) {
        return sun
      } else if (
        path === "Partly Cloudy" ||
        path === "Partly Cloudy " ||
        path === "Partly cloudy"
      ) {
        return cloudySun
      } else if (
        path === "Cloudy" ||
        path === "Cloudy " ||
        path === "Overcast" ||
        path === "Overcast " ||
        path === "Mist" ||
        path === "Mist " ||
        path === "Fog" ||
        path === "Fog " ||
        path === "Freezing fog" ||
        path === "Freezing fog "
      ) {
        return clouds
      } else if (
        path === "Patchy freezing drizzle nearby" ||
        path === "Patchy rain nearby" ||
        path === "Patchy light drizzle" ||
        path === "Light drizzle" ||
        path === "Freezing drizzle" ||
        path === "Heavy freezing drizzle" ||
        path === "Patchy light rain" ||
        path === "Light rain" ||
        path === "Moderate rain at times" ||
        path === "Moderate rain" ||
        path === "Heavy rain at times" ||
        path === "Heavy rain" ||
        path === "Light freezing rain" ||
        path === "Moderate or heavy freezing rain" ||
        path === "Light rain shower" ||
        path === "Moderate or heavy rain shower" ||
        path === "Torrential rain shower " ||
        path === "Patchy freezing drizzle nearby " ||
        path === "Patchy rain nearby " ||
        path === "Patchy light drizzle " ||
        path === "Light drizzle " ||
        path === "Freezing drizzle " ||
        path === "Heavy freezing drizzle " ||
        path === "Patchy light rain " ||
        path === "Light rain " ||
        path === "Moderate rain at times " ||
        path === "Moderate rain " ||
        path === "Heavy rain at times " ||
        path === "Heavy rain " ||
        path === "Light freezing rain " ||
        path === "Moderate or heavy freezing rain " ||
        path === "Light rain shower " ||
        path === "Moderate or heavy rain shower " ||
        path === "Torrential rain shower" ||
        path === "Torrential rain shower "
      ) {
        return heavyRain
      } else if (
        path === "Thundery outbreaks in nearby" ||
        path === "Patchy light rain in area with thunder" ||
        path === "Moderate or heavy rain in area with thunder" ||
        path === "Moderate or heavy rain with thunder" ||
        path === "Patchy light snow in area with thunder" ||
        path === "Moderate or heavy snow in area with thunder" ||
        path === "Moderate or heavy snow with thunder" ||
        path === "Thundery outbreaks in nearby " ||
        path === "Patchy light rain in area with thunder " ||
        path === "Patchy light rain with thunder" ||
        path === "Moderate or heavy rain in area with thunder " ||
        path === "Patchy light snow in area with thunder " ||
        path === "Moderate or heavy snow in area with thunder "
      ) {
        return storm
      } else if (
        path === "Blizzard" ||
        path === "Light snow" ||
        path === "Blowing snow" ||
        path === "Patchy snow nearby" ||
        path === "Patchy sleet nearby" ||
        path === "Light sleet" ||
        path === "Light sleet showers" ||
        path === "Moderate or heavy sleet" ||
        path === "Moderate or heavy sleet showers" ||
        path === "Light snow showers" ||
        path === "Moderate or heavy snow showers" ||
        path === "Light showers of ice pellets" ||
        path === "Moderate or heavy showers of ice pellets" ||
        path === "Patchy light snow" ||
        path === "Patchy moderate snow" ||
        path === "Moderate snow" ||
        path === "Patchy heavy snow" ||
        path === "Heavy snow" ||
        path === "Ice pellets" ||
        path === "Blizzard " ||
        path === "Light snow " ||
        path === "Blowing snow " ||
        path === "Patchy snow nearby " ||
        path === "Patchy sleet nearby " ||
        path === "Light sleet " ||
        path === "Light sleet showers " ||
        path === "Moderate or heavy sleet " ||
        path === "Moderate or heavy sleet showers " ||
        path === "Light snow showers " ||
        path === "Moderate or heavy snow showers " ||
        path === "Light showers of ice pellets " ||
        path === "Moderate or heavy showers of ice pellets " ||
        path === "Patchy light snow " ||
        path === "Patchy moderate snow " ||
        path === "Moderate snow " ||
        path === "Patchy heavy snow " ||
        path === "Heavy snow " ||
        path === "Ice pellets "
      ) {
        return snow
      }
    } else {
      return sun
    }
  }

  function weatherType2(path: any) {
    if (weather2 !== null) {
      if (
        path === 0 ||
        path === 1
      ) {
        return sun
      } else if(
        path === 2
      ) {
        return cloudySun
      } else if (
        path === 3 ||
        path === 45 ||
        path === 48
      ) {
        return clouds
      } else if (
        path === 51 ||
        path === 53 ||
        path === 55 ||
        path === 56 ||
        path === 57 ||
        path === 61 ||
        path === 63 ||
        path === 65 ||
        path === 66 ||
        path === 67 ||
        path === 80 ||
        path === 81 ||
        path === 82
      ) {
        return heavyRain
      } else if (
        path === 71 ||
        path === 73 ||
        path === 75 ||
        path === 77 ||
        path === 85 ||
        path === 86
      ) {
        return snow
      } else if (
        path === 95 ||
        path === 96 ||
        path === 99
      ) {
        return storm
      } else {
        return sun
      }
    }
  }

  function weatherType3(path: any) {
    if (weather2 !== null) {
      if (
        path === 0 ||
        path === 1
      ) {
        return "Sunny"
      } else if(
        path === 2
      ) {
        return "Partly cloudy"
      } else if (
        path === 3 ||
        path === 45 ||
        path === 48
      ) {
        return "Cloudy"
      } else if (
        path === 51 ||
        path === 53 ||
        path === 55 ||
        path === 56 ||
        path === 57 ||
        path === 61 ||
        path === 63 ||
        path === 65 ||
        path === 66 ||
        path === 67 ||
        path === 80 ||
        path === 81 ||
        path === 82
      ) {
        return "Rainy"
      } else if (
        path === 71 ||
        path === 73 ||
        path === 75 ||
        path === 77 ||
        path === 85 ||
        path === 86
      ) {
        return "Snowy"
      } else if (
        path === 95 ||
        path === 96 ||
        path === 99
      ) {
        return "Stormy"
      } else {
        return "Sunny"
      }
    }
  }

  return (
    <div className="app-container">
      <div className="left-menu-container">
        <img 
          src={logo} 
          alt="Logo" 
          width="60" 
          className="logo" 
        />

        <div 
          onClick={() => setCurrentPage("Weather")} 
          className={
            currentPage === "Weather" ? 
            "left-menu-button active" : 
            "left-menu-button not-active"
          }
        >
          <img 
            src={weatherIcon} 
            alt="Weather icon" 
            width="20" 
            className={
              currentPage === "Weather" ? 
              "active-img" : 
              "not-active-img"
            } 
          />
          <h5 
            className={
              currentPage === "Weather" ? 
              "active-h5" : 
              "not-active-h5"
            }
          >
            Weather
          </h5>
        </div>

        <div 
          onClick={() => setCurrentPage("Cities")} 
          className={
            currentPage === "Cities" ? 
            "left-menu-button active" : 
            "left-menu-button not-active"
          }
        >
          <img 
            src={list} 
            alt="Cities icon" 
            width="20" 
            className={
              currentPage === "Cities" ? 
              "active-img" : 
              "not-active-img"
            } 
          />
          <h5 
            className={
              currentPage === "Cities" ? 
              "active-h5" : 
              "not-active-h5"
            }
          >
            Cities
          </h5>
        </div>

        <img 
          onClick={toggleTheme} 
          src={
            theme === "dark" ? 
            darkTheme : 
            lightTheme
          } 
          alt="Theme toggler" 
          width="40" 
          className="theme-toggler" 
        />
      </div>

      <main>
        {currentPage === "Weather" ?  
          <>
            <div className="search-containers">
              <div className="search-container">
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search for cities"
                  className="search-input"
                  value={search}
                />

                {search === "" || searchResults.length === 0 ? null :
                  <ul className="search-results-container">
                    {searchResults}
                  </ul>
                }
              </div>

              <button 
                onClick={toggleSavedLocations} 
                className="add-favorite-location-btn"
              >
                <img 
                  src={
                    savedLocations.some(
                      item =>
                        item.city === city &&
                        item.location[0] === location[0] &&
                        item.location[1] === location[1]
                    ) ?
                    starFilled :
                    star
                  } 
                  alt="Add favorite location" 
                  className="add-favorite-location-img" 
                  width="25" 
                />
              </button>
            </div>

            <div className="weather-info-container">
              <div className="left-weather-info-container">
                <div className="upper-left-weather-info-container">
                  <h1 className="weather-info-place">{city}</h1>
                  <p>{location[0]}, {location[1]}</p>
                </div>

                <h1 
                  className="weather-info-degrees"
                >
                  {weather === null ? "0" : weather.current.temp_c}°
                </h1>
              </div>

              <img 
                src={weatherType(path)} 
                alt="Weather type" 
                className="weather-type" 
              />
            </div>

            <div className="day-forecast-container">
              <h5>TODAY'S FORECAST</h5>

              <div className="day-forecasts-container">
                <Swiper
                  spaceBetween={50}
                  slidesPerView={windowWidth > 768 ? 7 : 4}
                >
                  <SwiperSlide>
                    <DayForecast
                      hour="0:00"
                      weatherType={() => weatherType(pathFinder(0))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[0].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="1:00"
                      weatherType={() => weatherType(pathFinder(1))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[1].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="2:00"
                      weatherType={() => weatherType(pathFinder(2))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[2].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="3:00"
                      weatherType={() => weatherType(pathFinder(3))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[3].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="4:00"
                      weatherType={() => weatherType(pathFinder(4))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[4].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="5:00"
                      weatherType={() => weatherType(pathFinder(5))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[5].temp_c}
                    />
                  </SwiperSlide>
                  
                  <SwiperSlide>  
                    <DayForecast
                      hour="6:00"
                      weatherType={() => weatherType(pathFinder(6))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[6].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="7:00"
                      weatherType={() => weatherType(pathFinder(7))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[7].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="8:00"
                      weatherType={() => weatherType(pathFinder(8))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[8].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="9:00"
                      weatherType={() => weatherType(pathFinder(9))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[9].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="10:00"
                      weatherType={() => weatherType(pathFinder(10))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[10].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="11:00"
                      weatherType={() => weatherType(pathFinder(11))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[11].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="12:00"
                      weatherType={() => weatherType(pathFinder(12))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[12].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>  
                    <DayForecast
                      hour="13:00"
                      weatherType={() => weatherType(pathFinder(13))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[13].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="14:00"
                      weatherType={() => weatherType(pathFinder(14))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[14].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="15:00"
                      weatherType={() => weatherType(pathFinder(15))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[15].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="16:00"
                      weatherType={() => weatherType(pathFinder(16))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[16].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="17:00"
                      weatherType={() => weatherType(pathFinder(17))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[17].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="18:00"
                      weatherType={() => weatherType(pathFinder(18))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[18].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="19:00"
                      weatherType={() => weatherType(pathFinder(19))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[19].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>  
                    <DayForecast
                      hour="20:00"
                      weatherType={() => weatherType(pathFinder(20))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[20].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="21:00"
                      weatherType={() => weatherType(pathFinder(21))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[21].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="22:00"
                      weatherType={() => weatherType(pathFinder(22))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[22].temp_c}
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <DayForecast
                      hour="23:00"
                      weatherType={() => weatherType(pathFinder(23))}
                      degrees={weather === null ? "0" : weather.forecast.forecastday[0].hour[23].temp_c}
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>

            <div className="air-conditions-container">
              <h5 className="air-conditions-h5">AIR CONDITIONS</h5>

              <div className="air-conditions-general-container">
                <div className="air-condition-types-upper-container">
                  <div className="air-condition-container">
                    <img 
                      src={temperature} 
                      width="20" 
                      alt="Real feel icon" 
                      className="air-conditions-icon" 
                    />

                    <div className="air-condition-info-container">
                      <h5>Real Feel</h5>
                      <h2>{weather === null ? "0" : weather.current.feelslike_c}°</h2>
                    </div>
                  </div>

                  <div className="air-condition-container">
                    <img 
                      src={wind} 
                      width="20" 
                      alt="Wind icon" 
                      className="air-conditions-icon" 
                    />

                    <div className="air-condition-info-container">
                      <h5>Wind</h5>
                      <h2>{weather === null ? "0" : weather.current.wind_kph} km/h</h2>
                    </div>
                  </div>
                </div>

                <div className="air-condition-types-bottom-container">
                  <div className="air-condition-container">
                    <img 
                      src={drop} 
                      width="20" 
                      alt="Humidity icon" 
                      className="air-conditions-icon" 
                    />

                    <div className="air-condition-info-container">
                      <h5>Humidity</h5>
                      <h2>{weather === null ? "0" : weather.current.humidity}%</h2>
                    </div>
                  </div>

                  <div className="air-condition-container">
                    <img 
                      src={sunIcon} 
                      width="20" 
                      alt="UV Index icon" 
                      className="air-conditions-icon" 
                    />

                    <div className="air-condition-info-container">
                      <h5>UV-Index</h5>
                      <h2>{weather === null ? "0" : weather.current.uv}</h2>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </>
        : null}

        {currentPage === "Cities" ?
          <>
            <div className="saved-cities-container">
              {savedLocations.length === 0 ?
                <h1>There are currently no saved cities</h1> :
                savedCities
              }
            </div>
          </>
        : null}
      </main>

      <div className="week-forecasts-container">
        <h5 className="week-forecasts-title">7-DAY FORECAST</h5>

        <div className="week-forecasts-general-container">
          <WeekForecast
            date={() => getDays(0, 0)}
            maxTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMax[0].toString().split('.')[0].slice(0, 2))}
            minTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMin[0].toString().split('.')[0].slice(0, 2))}
            weatherType2={() => weatherType2(pathFinder2(0))}
            weatherType3={() => weatherType3(pathFinder2(0))}
          />
          <WeekForecast
            date={() => getDays(1, 1)}
            maxTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMax[1].toString().split('.')[0].slice(0, 2))}
            minTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMin[1].toString().split('.')[0].slice(0, 2))}
            weatherType2={() => weatherType2(pathFinder2(1))}
            weatherType3={() => weatherType3(pathFinder2(1))}
          />
          <WeekForecast
            date={() => getDays(2, 1)}
            maxTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMax[2].toString().split('.')[0].slice(0, 2))}
            minTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMin[2].toString().split('.')[0].slice(0, 2))}
            weatherType2={() => weatherType2(pathFinder2(2))}
            weatherType3={() => weatherType3(pathFinder2(2))}
          />
          <WeekForecast
            date={() => getDays(3, 1)}
            maxTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMax[3].toString().split('.')[0].slice(0, 2))}
            minTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMin[3].toString().split('.')[0].slice(0, 2))}
            weatherType2={() => weatherType2(pathFinder2(3))}
            weatherType3={() => weatherType3(pathFinder2(3))}
          />
          <WeekForecast
            date={() => getDays(4, 1)}
            maxTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMax[4].toString().split('.')[0].slice(0, 2))}
            minTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMin[4].toString().split('.')[0].slice(0, 2))}
            weatherType2={() => weatherType2(pathFinder2(4))}
            weatherType3={() => weatherType3(pathFinder2(4))}
          />
          <WeekForecast
            date={() => getDays(5, 1)}
            maxTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMax[5].toString().split('.')[0].slice(0, 2))}
            minTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMin[5].toString().split('.')[0].slice(0, 2))}
            weatherType2={() => weatherType2(pathFinder2(5))}
            weatherType3={() => weatherType3(pathFinder2(5))}
          />
          <WeekForecast
            date={() => getDays(6, 1)}
            maxTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMax[6].toString().split('.')[0].slice(0, 2))}
            minTemperature={weather2 === null ? "null" : Number(weather2.daily.temperature2mMin[6].toString().split('.')[0].slice(0, 2))}
            weatherType2={() => weatherType2(pathFinder2(6))}
            weatherType3={() => weatherType3(pathFinder2(6))}
          />
        </div>

      </div>
    </div>
  )
}