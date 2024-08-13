import weather from '../../services/Weather.js';

// Update weather evrey 20 mins
export default () => Widget.Button({
    className: 'weather', 
    child: Widget.Label({
        label: weather.bind('data').as(d => weather.getCurrentIcon())
    })
})

