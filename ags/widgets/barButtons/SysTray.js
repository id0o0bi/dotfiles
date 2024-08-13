const SystemTray    = await Service.import("systemtray")

export default () => Widget.Box({
    className: 'systemtray',
    setup: self => self.hook(SystemTray, () => {
        self.children = SystemTray.items.filter(i => i.id).map(item => Widget.Button({
            child: Widget.Icon({ 
                icon: item.bind('icon'), 
                "tooltip-markup": item.bind("tooltip-markup")
            }),
            onPrimaryClick: (_, event) => item.activate(event),
            onSecondaryClick: (_, event) => item.openMenu(event),
        }));
    })
});

