import { fetchWeatherApi } from "openmeteo"

export type WeatherData = {
    hourly: {
        time: Date[]
        temperature2m: number[]
        weatherCode: number[]
        relativeHumidity2m: number[]
        windSpeed10m: number[]
    }
    daily: {
        time: Date[]
        weatherCode: number[]
        temperature2mMax: number[]
        temperature2mMin: number[]
    }
}

export default async function fetchWeather(lat: string, lon: string): Promise<WeatherData | null> {
    const params = {
        latitude: lat,
        longitude: lon,
        daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
        hourly: ["temperature_2m", "weather_code", "relative_humidity_2m", "wind_speed_10m"],
        timezone: "auto",
    }

    const url = "https://api.open-meteo.com/v1/forecast"

    try {
        const responses = await fetchWeatherApi(url, params)
        const response = responses[0]

        const utcOffsetSeconds = response.utcOffsetSeconds()
        const hourly = response.hourly()!
        const daily = response.daily()!

        const hourlyTimes = [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
            (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
        )
        const dailyTimes = [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
            (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
        )

        const weatherData: WeatherData = {
            hourly: {
                time: hourlyTimes,
                temperature2m: [...(hourly.variables(0)?.valuesArray() ?? [])],
                weatherCode: [...(hourly.variables(1)?.valuesArray() ?? [])],
                relativeHumidity2m: [...(hourly.variables(2)?.valuesArray() ?? [])],
                windSpeed10m: [...(hourly.variables(3)?.valuesArray() ?? [])],
            },
            daily: {
                time: dailyTimes,
                weatherCode: [...(daily.variables(0)?.valuesArray() ?? [])],
                temperature2mMax: [...(daily.variables(1)?.valuesArray() ?? [])],
                temperature2mMin: [...(daily.variables(2)?.valuesArray() ?? [])],
            },
        }

        return weatherData
    } catch (error) {
        console.error("Failed to fetch weather:", error)
        return null
    }
}
