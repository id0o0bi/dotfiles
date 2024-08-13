import BluetoothLabel       from "../templates/BluetoothLabel.js";
import { GroupToggleArrow } from '../templates/ToggleArrow.js'
import runtime              from '../../services/Runtime.js'

const bluetooth = await Service.import("bluetooth")

const bluetoothInfo = Widget.Box({
    vertical: true,
    hpack: 'start',
    children: [
        Widget.Label({
            justification: 'left',
            hpack: 'start',
            label: 'Bluetooth'
        }),
        Widget.Label({
            class_name: 'muted',
            useMarkup: true,
            hpack: 'start',
            visible: false,
            justification: 'left',
            setup: self => self.hook(bluetooth, () => {
                let len = bluetooth.devices.filter(d => d.connected).length;
                self.visible = len > 0;
                self.label = `<sub>${len} connected</sub>`;
            })
        })
    ]
})

export default () => Widget.Box({
    vertical: false,
    class_name: 'switch-box',
    children: [
        Widget.Button({
            hexpand: true,
            hpack: 'start',
            vpack: 'center',
            class_name: 'switch',
            on_clicked: () => {},
            child: Widget.Box({
                children: [
                    BluetoothLabel(),
                    bluetoothInfo
                ]
            })
        }),
        GroupToggleArrow({
            state: {key: 'qsSwitchWindow', val: 'bluetooth'}, 
            open: () => { runtime.qsSwitchWindow = 'bluetooth' },
            shut: () => { runtime.qsSwitchWindow = '' }
        })
    ]
})
