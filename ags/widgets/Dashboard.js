import PopupWindow from './templates/PopupWindow.js';
import DashMpris   from './dashWidgets/DashMpris.js'
import DashNotify  from './dashWidgets/DashNotify.js'
import DashClock   from './dashWidgets/DashClock.js'
import Calendar    from './dashWidgets/DashCalendar.js'
import { WeatherInfo, WeatherForcast } from './dashWidgets/DashWeather.js'

const Left = () => Widget.Box({
    vertical: true,
    className: 'dash-left',
    children: [
        DashMpris(),
        DashNotify(), 
    ]
})

const Right = () => Widget.Box({
    vertical: true,
    className: 'dash-right',
    children: [
        DashClock(),
        WeatherInfo(),
        // DashDate(),
        Calendar(),
        WeatherForcast()
    ],
})

export default () => PopupWindow({
    name: 'dashboard',
    anchor: ['top'], 
    transition: 'crossfade',
    child: Widget.Box({
        children: [ Left(), Right() ]
    }),
});
