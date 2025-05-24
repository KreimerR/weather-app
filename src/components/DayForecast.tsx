// import storm from "../assets/storm.png"
import clouds from "../assets/clouds.png"
// import sun from "../assets/sun.png"
// import heavyRain from "../assets/heavy-rain.png"
// import cloudySun from "../assets/cloudysun.png"

export default function DayForecast() {
    return (
        <div className="day-forecast">
            <h5>6:00 AM</h5>
            <img src={clouds} alt="Day foreact icon" className="day-forecast-icon" />
            <h3>25°</h3>
        </div>
    )
}