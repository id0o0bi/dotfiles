import weather from '../../services/OpenWeather.js'
import { clock } from '../../variables/System.js';

const icon_path = `${App.configDir}/assets/openweathermap/`;
const icon_file = {
    'na' : `${icon_path}na.svg`,
    'tp' : `${icon_path}thermometer.svg`,
    'hu' : `${icon_path}humidity.svg`,
    'ba' : `${icon_path}barometer.svg`,
    'wi' : `${icon_path}wind.svg`,
    'ho' : `${icon_path}horizon.svg`,
    'sr' : `${icon_path}sunrise.svg`,
    'mr' : `${icon_path}moonrise.svg`,
    'ss' : `${icon_path}sunset.svg`,
    'ms' : `${icon_path}moonset.svg`,
}

const weatherExt = (icon, label) => Widget.Box({ children: [Widget.Icon(icon), label] })

const wiLabel = Widget.Label({ label: weather.bind('today').as(t => `${t.wind?.speed || ''}km/h`) })
const tpLabel = Widget.Label({ label: weather.bind('today').as(t => `${t.main?.temp || ''}°C`) })
const huLabel = Widget.Label({ label: weather.bind('today').as(t => `${t.main?.humidity || ''}%`) })
const srLabel = Widget.Label({ label: weather.bind('city').as(c => getHourMinutes(c.sunrise)) })
const ssLabel = Widget.Label({ label: weather.bind('city').as(c => getHourMinutes(c.sunset)) })

const getHourMinutes = (ts) => {
    let d = new Date(ts*1000);
    let h = d.getHours().toString().padStart(2, '0');
    let m = d.getMinutes().toString().padStart(2, '0');

    return `${h}:${m}`;
}

export const WeatherInfo = () => Widget.Box({
    class_name: 'weather-info', 
    vertical: false,
    children: [
        Widget.Box({
            vertical: true,
            children: [
                Widget.Icon({
                    class_name: 'weather-icon',
                    icon: weather.bind('today').as(t => weather.getWeatherIcon(t))
                }), 
            ]
        }), 
        Widget.Box({
            hexpand: true, 
            vertical: true, 
            vpack: 'center',
            class_name: 'weather-ext',
            children: [
                Widget.Box({
                    homogeneous: true, 
                    children: [
                        weatherExt(icon_file.sr, srLabel),
                        weatherExt(icon_file.hu, huLabel),
                        // weatherExt(icon_file.wi, wiLabel),
                    ]
                }), 
                Widget.Box({
                    homogeneous: true, 
                    children: [
                        weatherExt(icon_file.mr, ssLabel),
                        weatherExt(icon_file.tp, tpLabel),
                    ]
                }),
                Widget.Label({
                    hpack: 'start', 
                    justification: 'left',
                    label: Utils.merge([weather.bind('city'), clock.bind()], (ct, c) => {
                        return ct.name
                            ? `${ct.name}, ${c.format('%F %A')}`
                            : `${c.format('%F %A')}`;
                    })
                })
            ]
        })
    ]
})

export const WeatherForcast = () => Widget.Box({
    vertical: false, 
    class_name: 'weather-forcast',
    homogeneous: true,
    children: weather.bind('hours').as(h => {
        return h.map(c => {
            return Widget.Box({
                className: 'forcast-item',
                vertical: true,
                children: [
                    Widget.Icon(weather.getWeatherIcon(c)), 
                    Widget.Label(getHourMinutes(c.dt)),
                    Widget.Label(`${parseInt(c.main?.temp)}°C`)
                ]
            })
        });
    })
})

