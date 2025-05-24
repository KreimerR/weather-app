// import storm from "../assets/storm.png"
// import clouds from "../assets/clouds.png"
import sun from "../assets/sun.png"
// import heavyRain from "../assets/heavy-rain.png"
// import cloudySun from "../assets/cloudysun.png"

export default function WeekForecast() {
    return (
        <div className="week-forecast-container">
            <h5 className="week-forecast-date">Today</h5>

            <div className="week-forecast-type-container">
                <img src={sun} width="32" height="32" alt="Week forecast type icon" className="week-forecast-type-icon" />
                <h5>Sunny</h5>
            </div>

            <h5 className="week-forecast-degrees"><span>36</span> /22</h5>
        </div>
    )
}