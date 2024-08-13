const Notifications = await Service.import("notifications")

// we don't need dunst or any other notification daemon
// because the Notifications module is a notification daemon itself
export default () => Widget.Box({
    className: 'notification',
    setup: self => self.hook(Notifications, () => {
        self.children = [
            Widget.Label({
                label: Notifications.notifications.length > 0 ? '' : '', 
                visible: Notifications.popups.length > 0
            }), 
        ];
    })
});

