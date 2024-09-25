import updates from '../../services/Updates.js';
import runtime from '../../services/Runtime.js';
import theme from './../../services/Theme.js';
import icons from "../../core/icons.js";
import { headRevealer } from '../../variables/Widget.js';
import { uptime } from '../../variables/System.js';

const Battery = await Service.import("battery")

let packages = updates.bind('packages');
let themes = [['dawn','Dawn'],['rose','Rosé Pine'],['moon','Moon']];

const themeSelector = () => Widget.Revealer({
    setup: self => self.hook(runtime, () => 
        self.revealChild = runtime.qsHeadRevealer === 'themeSelector'),
    transition: 'none',
    child: Widget.Box({
        hexpand: true,
        vertical: false,
        homogeneous: true,
        class_name: 'theme-selector', 
        children: themes.map(t => Widget.Button({
            class_name: t[0],
            on_clicked: () => {theme.name = t[0]}, 
            child: Widget.Label({vpack: 'center', hpack: 'center', label: t[1]})
        }))
    })
});

const helpLabel = (s) => Widget.Label({
    label: s, 
    hpack: 'start', 
    justification: 'left'
})

const commandHelp = () => Widget.Revealer({
    setup: self => self.hook(runtime, () => 
        self.revealChild = runtime.qsHeadRevealer === 'commandHelp'),
    transition: 'none',
    child: Widget.Box({
        hexpand: true,
        vertical: true,
        homogeneous: true,
        class_name: 'command-help', 
        children: [
            Widget.Box({
                homogeneous: true, 
                hexpand: true,
                children: [helpLabel('󰘳+󰘶+S: ScreenShot'), helpLabel('󰘳+󰘶+R: ScreenCast')]
            }), 
            Widget.Box({
                homogeneous: true, 
                hexpand: true,
                children: [helpLabel('󰘳+󰘶+P: ColorPicker'), helpLabel('󰘳+󰘶+X: Kill')]
            }),
        ]
    })
});

const batteryInfo = () => Widget.Revealer({
    setup: self => self.hook(runtime, () =>
        self.revealChild = runtime.qsHeadRevealer === 'batteryInfo'),
    transition: 'none',
    child: Widget.Overlay({
        child: Widget.LevelBar({
            class_name: 'battery-bar', 
            value: Battery.bind('percent').as(p => p/100),
        }), 
        overlays: [
            Widget.Box({
                hpack: 'center',
                vertical: false,
                homogeneous: true, 
                class_name: 'battery-info', 
                children:[
                    Widget.Label({
                        hpack: 'end',
                        justification: 'right',
                        label: Battery.bind('percent').as(p => `${p}%`)
                    }), 
                    Widget.Box({
                        vertical: true, 
                        class_name: 'battery-tip', 
                        hpack: 'start', 
                        vpack: 'center',
                        children: [
                            Widget.Label({
                                hpack: 'start', 
                                justification: 'left',
                                label: Battery.bind('charging').as(c => c ? '󱐋 Charging' : 'Not Charging')
                            }),
                            Widget.Label({
                                hpack: 'start', 
                                justification: 'left',
                                label: uptime.bind().as(t => `󰥔 ${t}`),
                                // label: 'Up: 1h33m'
                            })
                        ]
                    })
                ]
            })
        ]
    })
})

const systemActions = () => Widget.Revealer({
    setup: self => self.hook(runtime, () =>
        self.revealChild = runtime.qsHeadRevealer === 'systemActions'),
    transition: 'none',
    child: Widget.Box({
        vertical: false,
        homogeneous: true,
        class_name: 'system-actions',
        children: [
            Widget.Button({child: Widget.Icon(icons.powermenu['shutdown'])}), 
            Widget.Button({child: Widget.Icon(icons.powermenu['logout'])}), 
            Widget.Button({child: Widget.Icon(icons.powermenu['reboot'])}), 
            Widget.Button({child: Widget.Icon(icons.powermenu['sleep'])}), 
        ]
    })
});

export default () => Widget.Box({
    vertical: true,
    class_name: 'head-context',
    children: [
        themeSelector(),
        batteryInfo(),
        commandHelp(),
        systemActions(),
    ]
});
