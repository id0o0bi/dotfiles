import clock from '../templates/ClockLabel.js';

export default () => Widget.Button({
    className: 'calendar',
    child: clock({format:'%H:%M %d/%b'}),
});

