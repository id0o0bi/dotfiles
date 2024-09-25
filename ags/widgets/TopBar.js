import { Workspaces, ClientTitle } from './barButtons/Workspaces.js';
import Notification from './barButtons/Notification.js';
import Datetime from './barButtons/Datetime.js';
import Weather from './barButtons/Weather.js';
import SysTray from './barButtons/SysTray.js';
import Updates from './barButtons/SysUpdates.js';
import { Volume, Mic } from './barButtons/Audio.js';
import Battery from './barButtons/Battery.js';
import Bluetooth from './barButtons/Bluetooth.js';
// import ColorPicker from './barButtons/ColorPicker.js';
import SysUsage from './barButtons/SysUsage.js';
import ScreenRecord from './barButtons/ScreenRecord.js';
import PanelButton from './templates/PanelButton.js'

const Start = () => Widget.Box({
    className: 'bar-left',
    children: [
        Workspaces(),
        ClientTitle(),
    ],
});

const Center = () => Widget.Box({
    className: 'bar-center',
    children: [
        PanelButton({
            window: 'dashboard', 
            children: [
                Notification(),
                Datetime(),
                Weather()
            ]
        }),
    ],
});

const End = () => Widget.Box({
    hpack: 'end',
    className: 'bar-right',
    children: [
        SysTray(),
        ScreenRecord(),
        // ColorPicker(),
        SysUsage(),
        PanelButton({
            window: 'settings', 
            children: [
                Updates(),
                Bluetooth(),
                Mic(),
                Volume(),
                Battery(),
            ]
        })
    ],
});

export default monitor => Widget.Window({
    name: `bar-${monitor}`,
    exclusivity: 'exclusive',
    monitor,
    anchor: ['top', 'left', 'right'],
    child: Widget.CenterBox({
        className: 'ags-bar', 
        startWidget: Start(),
        centerWidget: Center(),
        endWidget: End(),
    }),
});
