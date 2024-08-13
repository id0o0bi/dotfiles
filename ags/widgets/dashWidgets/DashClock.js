import Gtk from 'gi://Gtk';
import { clock } from '../../variables/System.js';

const getId = (n) => {
    return () => {
        return n;
    }
}

const digitMap = [
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1], // 0
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1], // 1
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1], // 2
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1], // 3
    [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1], // 4
    [1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1], // 5
    [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1], // 6
    [1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0], // 7
    [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1], // 8
    [1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1]  // 9
];

const gridCol = ([n, pos]) => {
    let g = new Gtk.Grid({
        column_homogeneous: true,
        row_homogeneous: true, 
    });

    for (let i = 0; i<3; i++) {
        for (let j = 0; j<5; j++) {
            let value = getId(n)
            let label = Widget.Label({
                label: n.toString().padStart(2, '0'),
                setup: self => self.hook(clock, (self) => {
                    let hh = clock.value.format('%H');
                    let mm = clock.value.format('%M');
                    let ss = clock.value.format('%S');

                    self.className = '';
                    if (value() == ss) {
                        self.toggleClassName('second');
                    }

                    let s = [hh[0], hh[1], mm[0], mm[1]][pos];
                    let k = value()%15;
                    if (digitMap[s][k])
                        self.toggleClassName('on')
                })
            });

            g.attach(label, i, j, 1, 1);
            n++;
        }
    }

    return g;
}

export default () => Widget.Box({
    className: 'clock',
    hpack: 'center', 
    vpack: 'center', 
    children: [
        ...[[0, 0], [15, 1]].map(gridCol),
        Widget.Separator(),
        ...[[30, 2], [45, 3]].map(gridCol)
    ]
})
