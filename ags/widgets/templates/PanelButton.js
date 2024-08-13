export default ({
    window = "",
    children,
    setup,
    ...rest
}) => Widget.Button({
    child: Widget.Box({ children: children }),
    setup: self => {
        let open = false

        self.toggleClassName("panel-button")
        self.toggleClassName(window)

        self.hook(App, (_, win, visible) => {
            if (win !== window)
                return

            if (open && !visible) {
                open = false
                self.toggleClassName("active", false)
            }

            if (visible) {
                open = true
                self.toggleClassName("active")
            }
        })

        if (window.trim()) 
            self.onClicked = () => App.toggleWindow(window);

        if (setup)
            setup(self)
    },
    ...rest,
})

