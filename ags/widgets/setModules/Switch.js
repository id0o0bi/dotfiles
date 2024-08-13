import SwitchBluetooth from './SwitchBluetooth.js';
import SwitchUpdates   from './SwitchUpdates.js';
import SwitchMenuBluetooth from './SwitchMenuBluetooth.js';
import SwitchMenuUpdates from './SwitchMenuUpdates.js';

const head = () => Widget.Box({
    hexpand: true,
    vertical: false,
    homogeneous: true,
    class_name: 'switch-group',
    children: [
        SwitchBluetooth(),
        SwitchUpdates(),
    ]
});

export default () => Widget.Box({
    hexpand: true,
    vertical: true,
    children: [
        head(), 
        SwitchMenuBluetooth(),
        SwitchMenuUpdates(),
    ]
})
