import BatteryLabel from '../templates/BatteryLabel.js';

export default () => Widget.Button({
    className: 'battery',
    child: BatteryLabel()
});

