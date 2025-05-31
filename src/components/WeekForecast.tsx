type Props = {
    date: () => string | undefined
    maxTemperature: string | number
    minTemperature: string | number
    weatherType2: () => string | undefined
    weatherType3: () => string | undefined
}

export default function WeekForecast({ date, maxTemperature, minTemperature, weatherType2, weatherType3 }: Props) {
    return (
        <div className="week-forecast-container">
            <h5 className="week-forecast-date">{date()}</h5>

            <div className="week-forecast-type-container">
                <img 
                    src={weatherType2()} 
                    width="32" 
                    alt="Week forecast type icon" 
                    className="week-forecast-type-icon" 
                />
                <h5>{weatherType3()}</h5>
            </div>

            <h5 className="week-forecast-degrees"><span>{maxTemperature}°</span> / {minTemperature}°</h5>
        </div>
    )
}