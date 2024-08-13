import runtime from '../../services/Runtime.js'
import ControlBox from '../templates/ControlBox.js'

const bluetooth = await Service.import("bluetooth")

const DeviceItem = (device) => Widget.Box({
    class_name: "bluetooth-device",
    children: [
        Widget.Box({
            vertical: true, 
            class_name: 'icon',
            hpack: 'center',
            vpack: 'center',
            children: [
                Widget.Icon({
                    hpack: 'center',
                    icon: device.icon_name + "-symbolic"
                }),
                Widget.LevelBar({
                    visible: device.bind('battery_percentage').as(p => p > 0),
                    tooltip_text: device.bind('battery_percentage').as(p => `${p.toString()}%`),
                    value: device.bind('battery_percentage').as(p => p/100),
                })
            ]
        }),
        Widget.Label({
            class_name: 'device-name',
            truncate: 'end',
            label: device.name
        }),
        Widget.Box({ hexpand: true }),
        Widget.Spinner({
            active: device.bind("connecting"),
            visible: device.bind("connecting"),
        }),
        Widget.Switch({
            active: device.connected,
            visible: device.bind("connecting").as(p => !p),
            setup: self => self.on("notify::active", () => {
                device.setConnection(self.active)
            }),
        }),
    ],
})

const DeviceList = () => Widget.Box({
    class_name: "bluetooth-devices",
    hexpand: true,
    vertical: true,
    children: bluetooth.bind("devices").as(ds => ds
        .filter(d => d.name)
        .map(DeviceItem)),
})

export default () => Widget.Revealer({
    child: ControlBox({
        title: 'Bluetooth', 
        controls: [
            Widget.Button({
                label: '', 
                'tooltip-text': 'open Blueman Manager',
                on_clicked: () => Utils.execAsync(['blueman-manager'])
            }), 
            // Widget.Button({label: ''}), 
        ], 
        content: DeviceList()
    }),
    setup: self => self.hook(runtime, () => {
        self.reveal_child = runtime.qsSwitchWindow === 'bluetooth';
    })
})
