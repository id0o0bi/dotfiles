import updates from '../../services/Updates.js';
import runtime from '../../services/Runtime.js';
import theme from './../../services/Theme.js';
import icons from "../../core/icons.js";
import { headRevealer } from '../../variables/Widget.js';

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
                hexpand: true, 
                vertical: false,
                homogeneous: true, 
                class_name: 'battery-info', 
                children:[
                    Widget.Label({
                        setup: self => self.hook(Battery, () => {
                            let percent = `${Battery.percent}%`;
                            self.label = Battery.charging ? `󱐋 ${percent}` : `${percent}`;
                        })
                    })
                ]
            })
        ]
    }) 
    
})

const updateItem = (updateStr) => {
    let pac = updateStr.split(/\s+/);
    return Widget.Box({
        vertical: true,
        class_name: 'update-item',
        children: [
            Widget.Label({
                wrap: true, 
                hpack: 'start',
                justification: 'left',
                class_name: 'update-title', 
                label: pac[0]
            }), 
            Widget.Label({
                wrap: true, 
                hpack: 'start',
                justification: 'left',
                class_name: 'update-version', 
                label: `${pac[1]}${pac[3]}`
            }), 
        ]
    });
}

const updatePackages = () => Widget.Revealer({
    // revealChild: runtime.bind('qsHeadRevealer').as(r => r === 'updatePackages'),
    transition: 'none',
    child: Widget.Scrollable({
        vscroll: 'automatic',
        hscroll: 'never',
        css: 'min-height: 180px;',
        class_name: 'update-packages',
        child: Widget.Box({
            vertical: true,
            children: packages.as(p => {
                return [
                    Widget.Label({
                        visible: packages.as(p => p.length === 0), 
                        label: 'All Packages Updated!'
                    }),
                    ...p.map(s => updateItem(s))
                ]
            })
        })
    })
});

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
