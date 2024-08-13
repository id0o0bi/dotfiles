import icons from '../../core/icons.js';

const Bluetooth = await Service.import("bluetooth")

export default () => Widget.Label({
    class_name: 'icon',
    setup: self => self.hook(Bluetooth, () => {
        self.label = icons.bluetooth[Bluetooth.enabled ? 'enabled' : 'disabled'];
        self.className = Bluetooth.devices.length > 0 ? 'connected icon':'icon';
    })
});
