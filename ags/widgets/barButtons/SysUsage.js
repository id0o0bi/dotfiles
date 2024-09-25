import { cpu, ram } from '../../variables/System.js';

const open = Variable(false);

// 󰸳 󰟃
const expander = Widget.Button({
    label: '󰟃',
    on_clicked: () => { open.value = !open.value }
})

// check updates every 5 mins
export default () => Widget.Box({
    className: 'usage', 
    children: [
        expander, 
        Widget.Label({
            visible: open.bind(),
            class_name: 'stats',
            label: Utils.merge([cpu.bind(), ram.bind()], (c, r) => {
                return `Cpu:${parseInt(c*100)}% Mem:${parseInt(r*100)}%`;
            })
        })
    ]
})
