import Brightness  from '../../services/Brightness.js';
import ToggleArrow from '../templates/ToggleArrow.js'

const brightIcon = Widget.Label({
    class_name: 'icon',
    label: Brightness.bind('screen')
        .as(s => ['󰃝', '󰃞', '󰃟', '󰃠'][Math.floor(s*3)] || '󰃝')
})

const brightSlider = Widget.Slider({
    draw_value: false,
    hexpand: true,
    on_change: ({ value }) => Brightness.screen = value,
    value: Brightness.bind('screen')
})

export default () => Widget.Box({
    vertical: true,
    children: [
        Widget.Box({
            vertical: false, 
            children: [
                brightIcon,
                brightSlider, 
            ]
        }), 
    ]
})
