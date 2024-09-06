import runtime    from '../../services/Runtime.js'
import updates    from '../../services/Updates.js'
import ControlBox from '../templates/ControlBox.js'

const packages = updates.bind('packages');

const updateItem = (updateStr) => {
    let pac = updateStr.split(/\s+/);
    return Widget.Box({
        vertical: true,
        hexpand: true,
        class_name: 'update-item',
        children: [
            Widget.Label({
                wrap: true, 
                hpack: 'start',
                justification: 'left',
                class_name: 'update-title', 
                truncate: 'end',
                label: pac[0]
            }), 
            Widget.Label({
                wrap: true, 
                hpack: 'start',
                justification: 'left',
                truncate: 'end',
                class_name: 'update-version', 
                label: `${pac[1]}${pac[3]}`
            }), 
        ]
    });
}

const updatePackages = () => Widget.Scrollable({
    vscroll: 'automatic',
    hscroll: 'never',
    css: 'min-height: 180px;',
    class_name: 'switch-body update-packages',
    child: Widget.Box({
        vertical: true,
        children: packages.as(p => {
            return [
                Widget.Label({
                    class_name: 'empty',
                    hexpand: true,
                    visible: packages.as(p => p.length === 0), 
                    label: 'All Packages Updated!'
                }),
                ...p.map(s => updateItem(s))
            ]
        })
    })
});

let updateHeader = ControlBox({
    title: 'Updates', 
    controls: [
        // Widget.Button({label: '󰏌'}),
        Widget.Button({label: '', on_clicked: () => updates.check()}),
    ], 
    content: updatePackages()
})

export default () => Widget.Revealer({
    child: updateHeader,
    setup: self => self.hook(runtime, () => {
        self.reveal_child = runtime.qsSwitchWindow === 'updates';
    })
})
