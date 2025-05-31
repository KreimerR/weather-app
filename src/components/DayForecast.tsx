type Props = {
    hour: string
    weatherType: () => string | undefined
    degrees: number
}

export default function DayForecast({ hour, weatherType, degrees }: Props) {
    return (
        <div className="day-forecast">
            <h5>{hour}</h5>
            <img 
                src={weatherType()} 
                alt="Day foreact icon" 
                className="day-forecast-icon" 
            />
            <h3>{degrees}°</h3>
        </div>
    )
}