import icons from '../../core/icons.js';
import updates from '../../services/Updates.js';
import runtime from '../../services/Runtime.js';
import { headRevealer } from '../../variables/Widget.js';
import BatteryLabel from '../templates/BatteryLabel.js'

const Battery = await Service.import("battery")

let packages = updates.bind('packages');

const themeButton = () => Widget.Button({
    label: '󰔎',
    class_name: 'round-button',
    on_clicked: () => runtime.qsHeadRevealer = 'themeSelector',
})

const batteryButton = () => Widget.Button({
    class_name: 'battery round-button', 
    on_clicked: () => runtime.qsHeadRevealer = 'batteryInfo',
    child: BatteryLabel()
})

const commandButton = () => Widget.Button({
    class_name: 'battery round-button', 
    label: '󰘳',
    on_clicked: () => runtime.qsHeadRevealer = 'commandHelp',
})

const systemButton = () => Widget.Button({
    label: '',
    class_name: 'round-button',
    on_clicked: () => runtime.qsHeadRevealer = 'systemActions',
})

const updateButton = () => Widget.Button({
    label: packages.as(p => p.length > 0 ? '󰘿' : '󰅠'),
    class_name: 'sys-update round-button',
    on_clicked: () => runtime.qsHeadRevealer = 'updatePackages',
})

export default () => Widget.Box({
    hexpand: true,
    vexpand: false,
    vertical: false,
    homogeneous: true,
    class_name: 'head-control',
    children: [
        Widget.Box({
            // children: [themeButton(), batteryButton(), commandButton()]
            children: [themeButton(), commandButton()]
        }),
        Widget.Box({
            hpack: 'end',
            children: [systemButton()]
        }),
    ]
});
