import GLib            from 'gi://GLib';
import icons           from '../../core/icons.js'
import { clock }       from '../../variables/System.js'
import { timeElapsed } from '../../core/utils.js'
import Notification    from "../templates/Notification.js";

const notifications = await Service.import('notifications')
const notifs        = notifications.bind("notifications")

const Animated = (n) => Widget.Revealer({
    transition_duration: 200,
    transition: "slide_down",
    child: Widget.Box({
        class_name: 'box-wrapper', 
        vertical: true,
        children: [
            Notification(n), 
            Widget.Box({
                homogeneous: true,
                class_name: 'notification-status', 
                children: [
                    Widget.Label({
                        hpack: 'start',
                        label: clock.bind().as(t => timeElapsed(t, n.time))
                    }), 
                    Widget.Label({
                        hpack: 'end',
                        label:n['app-name'],
                    })
                ]
            })
        ]
    }),
    setup: self => Utils.timeout(200, () => {
        if (!self.is_destroyed)
            self.reveal_child = true
    }),
})

const NotificationList = () => {
    const map = {};
    const box = Widget.Box({
        vertical: true,
        children: notifications.notifications.sort((a, b) => a.time < b.time).map(n => {
            const w = Animated(n)
            map[n.id] = w;
            return w
        }),
        visible: notifs.as(n => n.length > 0),
    })

    function remove(_, id) {
        const n = map[id]
        if (n) {
            n.reveal_child = false
            Utils.timeout(200, () => {
                n.destroy()
                delete(map[id]);
            })
        }
    }

    return box
        .hook(notifications, remove, "closed")
        .hook(notifications, (_, id) => {
            if (id !== undefined) {
                if (map[id] !== undefined)
                    remove(null, id)

                const n = notifications.getNotification(id)

                const w = Animated(n)
                map[id] = w;
                box.children = [w, ...box.children]
            }
        }, "notified")
}

const Placeholder = () => Widget.Box({
    class_name: "placeholder",
    vertical: true,
    vpack: "center",
    hpack: "center",
    vexpand: true,
    hexpand: true,
    visible: notifs.as(n => n.length === 0),
    children: [
        Widget.Label("󱇦"),
    ],
})

const ClearButton = () => Widget.Button({
    on_clicked: notifications.clear,
    sensitive: notifs.as(n => n.length > 0),
    hpack: 'end',
    vpack: 'center',
    label: 'Clear All',
    class_name: 'clear rose-button',
});

const DndSwitch = () => Widget.Button({
    class_name: 'dnd rose-button', 
    hpack: 'start', 
    vpack: 'center',
    label: notifications.bind('dnd').as(t => t ? '󱏨' : '󰂟'),
    on_clicked: () => notifications.dnd = !notifications.dnd,
}); 

export default () => Widget.Box({
    className: 'dash-notify',
    vertical: true,
    children: [
        Widget.Scrollable({
            vexpand: true,
            hscroll: "never",
            class_name: "notification-scrollable",
            child: Widget.Box({
                vertical: true,
                children: [
                    NotificationList(),
                    Placeholder(),
                ],
            }),
        }),
        Widget.Box({
            className: 'foot',
            homogeneous: true,
            children: [
                DndSwitch(),
                ClearButton()
            ]
        }),
    ]
})
