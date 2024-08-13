import UpdatesLabel         from "../templates/UpdatesLabel.js";
import { GroupToggleArrow } from '../templates/ToggleArrow.js'
import updates              from '../../services/Updates.js';
import runtime              from '../../services/Runtime.js'

const updateInfo = Widget.Box({
    vertical: true,
    hpack: 'start',
    children: [
        Widget.Label({
            justification: 'left',
            hpack: 'start',
            label: 'Updates'
        }),
        Widget.Label({
            useMarkup: true,
            class_name: 'muted',
            hpack: 'start',
            justification: 'left',
            setup: self => self.hook(updates, () => {
                self.visible = updates.packages.length > 0;
                self.label = `<sub>${updates.packages.length} updates</sub>`;
            })
        })
    ]
})

export default () => Widget.Box({
    vertical: false,
    class_name: 'switch-box',
    children: [
        Widget.Button({
            hexpand: true,
            hpack: 'start', 
            vpack: 'center',
            class_name: 'switch',
            on_clicked: () => {}, 
            child: Widget.Box({
                children: [
                    UpdatesLabel(), 
                    updateInfo
                ]
            })
        }), 
        GroupToggleArrow({
            state: {key: 'qsSwitchWindow', val: 'updates'}, 
            open: () => { runtime.qsSwitchWindow = 'updates' },
            shut: () => { runtime.qsSwitchWindow = '' }
        })
    ]
})

