const Hyprland      = await Service.import("hyprland")

export const Workspaces = () => Widget.Box({
    className: 'workspaces',
    children: ["󰎤", "󰎧", "󰎪", "󰎭", "󰎱", "󰎳", "󰎶", "󱗜"].map((n, i) => Widget.Button({
        child: Widget.Label(`${n}`),
        vpack: 'center',
        onClicked: () => Utils.execAsync(`hyprctl dispatch workspace ${i+1}`),
        setup: self => self.hook(Hyprland, () => {
            self.toggleClassName("active", Hyprland.active.workspace.id === i+1)
            self.toggleClassName("occupied", (Hyprland.getWorkspace(i+1)?.windows || 0) > 0)
        })
    }))
});

export const ClientTitle = () => Widget.Button({
    className: 'client-title',
    vpack: 'center',
    child: Widget.Label({
        truncate: 'end',
        wrap: true,
        label: Hyprland.active.client.bind('title')
    })
});
