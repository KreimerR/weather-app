import { API_KEY } from "./apiKeys.ts"

const BASE_URL = "http://api.weatherapi.com/v1"

export default async function fetchForecast(lat: string, lon: string) {
    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}`

    const response = await fetch(url)

    if(!response.ok) {
        throw new Error("Failed to fetch from the API")
    }

    return response.json()
}