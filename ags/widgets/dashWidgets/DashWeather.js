import weather from '../../services/Weather.js'
import { clock } from '../../variables/System.js';

export const WeatherInfo = () => Widget.Box({
    className: 'weather-info',
    vertical: true,
    children: [
        Widget.Label({
            class_name: 'weather',
            wrap: true,
            justification: 'center',
            setup: self => self.hook(weather, () => {
                self.label = [
                    weather.getCurrentIcon(),
                    clock.value.format('%F %A,'),
                    weather.getCurrentTemp()
                ].filter(a => a).join(' ');
            })
        }),
    ],
})

export const WeatherForcast = () => Widget.Box({
    vertical: false, 
    class_name: 'weather-forcast',
    homogeneous: true,
    children: weather.bind('data').as(d => {
        let cast = weather.getHourlyForcast(5);

        return cast.map(c => {
            return Widget.Box({
                className: 'forcast-item',
                vertical: true,
                children: [
                    Widget.Label(weather.transformToIcon(c.weatherCode)), 
                    Widget.Label(c.time < 1000 ? `0${c.time/100}:00` : `${c.time/100}:00`),
                    Widget.Label(`${c.tempC}°C`)
                ]
            })
        });
    })
})
