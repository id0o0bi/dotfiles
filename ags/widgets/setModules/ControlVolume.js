import ToggleArrow from '../templates/ToggleArrow.js'
import ControlBox  from '../templates/ControlBox.js'
import VolumeLabel from '../templates/VolumeLabel.js'

const audio = await Service.import("audio")

const volumeSlider = Widget.Slider({
    draw_value: false,
    hexpand: true,
    on_change: ({ value }) => audio.speaker.volume = value,
    setup: self => self.hook(audio.speaker, () => {
        self.value = audio.speaker.volume || 0
    })
})

const SinkItem = (stream) => Widget.Button({
    hexpand: true,
    class_name: 'sink-item',
    on_clicked: () => audio.speaker = stream,
    child: Widget.Box({
        children: [
            Widget.Icon({
                icon: 'audio-card-symbolic',
                tooltip_text: stream.icon_name || "",
            }),
            // Widget.Label((stream.description || "").split(" ").slice(7).join(" ")),
            Widget.Label(stream.description.replace('Alder Lake PCH-P High Definition Audio Controller ', '')),
            // Alder Lake PCH-P High Definition Audio Controller
            Widget.Icon({
                icon: 'object-select-symbolic',
                hexpand: true,
                hpack: "end",
                visible: audio.speaker.bind("stream").as(s => s.id === stream.id),
            }),
        ],
    }),
})

const sinkSelector = Widget.Revealer({
    transitionDuration: 200,
    child: ControlBox({
        title: 'Audio Output Sink', 
        controls: [], 
        content: Widget.Box({
            vertical: true,
            class_name: 'sink-selector', 
            children: audio.bind("speakers").as(a => a.map(SinkItem))
        })
    })
})

// const volumeToggler = ToggleArrow({revealer: sinkSelector})
const volumeToggler = ToggleArrow({
    open: () => sinkSelector.reveal_child = true, 
    shut: () => sinkSelector.reveal_child = false, 
})

export default () => Widget.Box({
    vertical: true,
    children: [
        Widget.Box({
            vertical: false, 
            children: [
                VolumeLabel(),
                volumeSlider, 
                volumeToggler
            ]
        }), 
        sinkSelector
    ]
})

