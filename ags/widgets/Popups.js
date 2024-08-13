import Notification from './templates/Notification.js'

const notifications = await Service.import("notifications")

export default function Bubbles(monitor = 0) {
    const list = Widget.Box({
        vertical: true,
        children: notifications.popups.map(Notification),
    })

    function onNotified(_, id) {
        const n = notifications.getNotification(id)
        if (n)
            list.children = [Notification(n), ...list.children]
    }

    function onDismissed(_, id) {
        list.children.find(n => n.attribute.id === id)?.destroy()
    }

    list.hook(notifications, onNotified, "notified")
        .hook(notifications, onDismissed, "dismissed")
        .hook(notifications, onDismissed, "closed")

    return Widget.Window({
        monitor,
        name: `notifications${monitor}`,
        class_name: "notification-bubbles",
        anchor: ["top", "right"],
        child: Widget.Box({
            class_name: "notification-list",
            vertical: true,
            child: list,
        }),
    })
}
