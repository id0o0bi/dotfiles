const notifications = await Service.import('notifications');

/** @param {import('resource:///com/github/Aylur/ags/service/notifications.js').Notification} n */
function NotificationIcon({ app_entry, app_icon, image }) {
    // console.log("notificaition >>> ", "\nentry: ", app_entry, "\nicon: ", app_icon, "\nimage: ",image)
    if (image) {
        return Widget.Box({
            vpack: "start",
            hexpand: false,
            css: `background-image: url("${image}");`,
        })
    }

    let icon = "dialog-information-symbolic"
    if (Utils.lookUpIcon(app_icon))
        icon = app_icon

    if (app_entry && Utils.lookUpIcon(app_entry))
        icon = app_entry

    return Widget.Box({
        vpack: 'center', 
        hpack: 'center',
        child: Widget.Icon(icon),
    })
}

/** @param {import('resource:///com/github/Aylur/ags/service/notifications.js').Notification} n */
export default function Notification(n) {
    const icon = Widget.Box({
        vpack: "start",
        class_name: "notification-icon",
        child: NotificationIcon(n),
    })

    const title = Widget.Label({
        class_name: "notification-title",
        xalign: 0,
        justification: "left",
        hexpand: true,
        max_width_chars: 24,
        truncate: "end",
        wrap: true,
        label: n.summary,
        use_markup: true,
    })

    const acts = Widget.Box({
        class_name: 'title-acts',
        vpack: 'center',
        hpack: 'end',
        children: [
            Widget.Button({
                vpack: 'center', 
                label: '✗',
                on_clicked: n.close
            }), 
        ]
    })

    const head = Widget.Box({
        vexpand: false, 
        vertical: false, 
        class_name: "notification-head",
        children: [
            title, 
            acts
        ]
    })

    const body = Widget.Box({
        child: Widget.Label({
            class_name: "notification-body",
            hexpand: true,
            // lines: 2,
            max_width_chars: 28,
            use_markup: true,
            xalign: 0,
            justification: "left",
            label: n.body || n.summary,
            setup: self => {
                self.set_line_wrap(true);
                // self.set_lines(2);
            }
        })
    });

    const actions = Widget.Box({
        class_name: "actions",
        children: n.actions.map(({ id, label }) => Widget.Button({
            class_name: "notification-button rose-button",
            on_clicked: () => {
                n.invoke(id)
                n.dismiss()
            },
            hexpand: true,
            label: label,
        })),
    })

    return Widget.EventBox(
        {
            attribute: { id: n.id },
            on_primary_click: n.dismiss,
        },
        Widget.Box(
            {
                class_name: `notification-box ${n.urgency}`,
                vertical: true,
            },
            Widget.Box([
                icon,
                Widget.Box(
                    { vertical: true },
                    head,
                    body,
                ),
            ]),
            actions,
        ),
    )
}
