// import updates from '../../services/Updates.js';
import ControlVolume from './ControlVolume.js';
import ControlBright from './ControlBright.js';

export default () => Widget.Box({
    hexpand: true,
    vertical: true,
    class_name: 'controls',
    children: [
        ControlBright(),
        ControlVolume(),
    ]
});

