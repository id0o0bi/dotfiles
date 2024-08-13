import TopBar          from './widgets/TopBar.js';
import OSD             from './widgets/OSD.js';
import AppLauncher     from './widgets/AppLauncher.js';
import Settings        from './widgets/Settings.js';
import Dashboard       from './widgets/Dashboard.js';
import Bubbles         from './widgets/Bubbles.js';
import PowerMenu       from './widgets/PowerMenu.js';
import { init }        from './core/setup.js';
import { forMonitors } from './core/utils.js';

// Utils.timeout(1000, () => Utils.notify({
//     summary: "Notification Popup Example",
//     iconName: "info-symbolic",
//     body: "Lorem ipsum dolor sit amet, qui minim labore adipisicing "
//         + "minim sint cillum sint consectetur cupidatat.",
//     actions: {
//         "Cool": () => print("pressed Cool"),
//         "OK": () => print("pressed OK!"),
//         "Why": () => print("pressed Why!"),
//     },
// }))
//
// Utils.timeout(1000, () => Utils.notify({
//     summary: "Popup Example 2222",
//     iconName: "info-symbolic",
//     body: "Lorem ipsum dolor sit amet, qui minim labore adipisicing "
//         + "minim sint cillum sint consectetur cupidatat."
//         + "minim sint cillum sint consectetur cupidatat."
//         + "minim sint cillum sint consectetur cupidatat."
//         + "minim sint cillum sint consectetur cupidatat."
//         + "minim sint cillum sint consectetur cupidatat.",
//     actions: {
//         "Cool": () => print("pressed Cool"),
//         "Why": () => print("pressed Why!"),
//     },
// }))

App.config({
    onConfigParsed: () => {
        init()
    },
    windows: () => [
        ...forMonitors(TopBar),
        ...forMonitors(OSD),
        ...forMonitors(Bubbles),
        AppLauncher(),
        Settings(),
        PowerMenu(),
        Dashboard(),
    ],
})
