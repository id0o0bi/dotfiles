// import updates from '../../services/Updates.js';
import HeadControl from './HeadControl.js';
import HeadContext from './HeadContext.js';

// let packages = updates.bind('packages');

export default () => Widget.Box({
    // hexpand: false,
    // vexpand: true,
    vertical: true,
    // homogeneous: true,
    class_name: 'settings-head',
    children: [
        HeadControl(),
        HeadContext(),
    ]
});
