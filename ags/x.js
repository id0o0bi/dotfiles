#!/usr/bin/env -S ags --run-file

const Cairo      = imports.cairo;
const Clutter    = imports.gi.Clutter;
const Gdk        = imports.gi.Gdk;
const GtkClutter = imports.gi.GtkClutter;
const Gio        = imports.gi.Gio;
const GLib       = imports.gi.GLib;
const Gtk        = imports.gi.Gtk;

const clock = Variable(GLib.DateTime.new_now_local(), {
    poll: [1000, () => GLib.DateTime.new_now_local()],
})

const getId = (n) => {
    return () => {
        return n;
    }
}

// const style = `
// grid { padding: 4px; }
// grid label {
//   margin: 1px;
//   border-radius: 3px;
//   min-height: 16px;
//   min-width: 16px;
//   font-size: 8px;
//   transition: 200ms;
//   font-size: 0;
//   font-family: 'UbuntuMono Nerd Font Propo';
//   background: lightgrey;
// }
// grid label.on {background: grey}
// grid label.second {font-size: 12px;background: white;color: goldenrod}
// `;

const style = `label {color: red; background: white}`

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

const box = () => Widget.Box({
    className: 'digits',
    css: `label {color:red;background:white}`,
    children: [
        ...[[0, 0], [15, 1]].map(gridCol),
        Widget.Separator(),
        ...[[30, 2], [45, 3]].map(gridCol)
    ]
})

const win = () => Widget.Window({
    name: 'cairo', 
    anchor: ['bottom', 'right'],
    exclusivity: 'normal',
    layer: 'top',
    setup: self => {setTimeout(() => {self.destroy()}, 10000)},
    child: box()
})

w = win();

