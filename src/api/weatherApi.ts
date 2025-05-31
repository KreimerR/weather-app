const API_KEY = "b5d613f036ff45459a2120229252305"
const BASE_URL = "http://api.weatherapi.com/v1"

export default async function fetchForecast(lat: string, lon: string) {
    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}`

    const response = await fetch(url)

    if(!response.ok) {
        throw new Error("Failed to fetch from the API")
    }

    return response.json()
}