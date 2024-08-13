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

const samplerBox = Widget.Revealer({
    transitionDuration: 200,
    child: Widget.Box({
        // child: Widget.Label('brightness box')
    })
})

const brightToggler = ToggleArrow({
    open: () => samplerBox.reveal_child = true,
    shut: () => samplerBox.reveal_child = false,
})

export default () => Widget.Box({
    vertical: true,
    children: [
        Widget.Box({
            vertical: false, 
            children: [
                brightIcon,
                brightSlider, 
                brightToggler
            ]
        }), 
        samplerBox
    ]
})
