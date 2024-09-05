import weather from '../../services/OpenWeather.js';

// Update weather evrey 20 mins
export default () => Widget.Button({
    className: 'weather', 
    child: Widget.Icon({
        size: 18,
        icon: weather.bind('today').as(t => weather.getWeatherIcon(t))
    })
})

