const API_KEY = "b5d613f036ff45459a2120229252305"
const BASE_URL = "http://api.weatherapi.com/v1"

export default async function fetchForecast(city: string) {
    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}`

    const response = await fetch(url)

    if(!response.ok) {
        throw new Error(`Failed to fetch weather fro ${city}`)
    }

    return response.json()
}