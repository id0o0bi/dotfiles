import PopupWindow from "./templates/PopupWindow.js"
import icons from "../core/icons.js";

const actions = [
    {key: 'shutdown', cmd: 'shutdown now',      des: 'Shutdown'},
    {key: 'logout',   cmd: 'pkill Hyprland',    des: 'Log Out'},
    {key: 'reboot',   cmd: 'systemctl reboot',  des: 'Reboot'},
    {key: 'sleep',    cmd: 'systemctl suspend', des: 'Sleep'},
];

const act = () => {
    const ACTION = Variable({});           // which action to take...
    return {
        get: (k) => k ? ACTION.getValue()[k] : ACTION,
        set: (a) => ACTION.setValue(a || {}),
    }
}

const Action = act();
const AcBind = Action.get().bind();

const SysButton = (act) => Widget.Button({
    class_name: "system-button",
    on_clicked: () => Action.set(act),
    child: Widget.Box({
        vertical: true,
        children: [
            Widget.Icon(icons.powermenu[act.key]),
            Widget.Label(act.des),
        ],
    }),
});

const ConfirmDialog = () => Widget.Box({
    class_name: 'confirm',
    children: [
        Widget.Icon({icon: AcBind.as(a => icons.powermenu[a.key || 'sleep'])}),
        Widget.Box({
            vertical: true,
            vpack: "center",
            children: [
                Widget.Label({
                    hpack: 'start',
                    class_name: 'confirm-label',
                    label: AcBind.as(a => `Are you sure to ${a.des}?`)
                }), 
                Widget.Box({
                    class_name: 'confirm-buttons',
                    hpack: 'end',
                    children: [
                        Widget.Button({
                            class_name: 'rose-button',
                            label: 'No',
                            on_clicked: () => Action.set(),
                        }),
                        Widget.Button({
                            class_name: 'rose-button',
                            label: 'Yes',
                            on_clicked: () => Utils.exec(Action.get('cmd')),
                        }),
                    ]
                })
            ],
        })
    ]
});

export default () => PopupWindow({
    name: 'powermenu',
    on_show: Action.set, // unset ACTION
    on_hide: Action.set,
    child: Widget.Stack({
        class_name: 'power-menu', 
        children: {
            'buttons': Widget.Box({
                class_name: 'buttons',
                homogeneous: true,
                children: actions.map(SysButton)
            }), 
            'confirm': ConfirmDialog()
        }, 
        shown: AcBind.as(a => a.key ? 'confirm' : 'buttons'),
    })
});
