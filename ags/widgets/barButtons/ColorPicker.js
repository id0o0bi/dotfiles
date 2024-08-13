import ColorPicker from '../../services/ColorPicker.js'
import Gdk from "gi://Gdk"

export default () => {
    const menu = Widget.Menu({
        class_name: "colorpicker",
        children: ColorPicker.bind("colors").as(c => c.map(color => Widget.MenuItem({
            child: Widget.Label(color),
            css: `color: ${color}`,
            on_activate: () => ColorPicker.wlCopy(color),
        }))),
    });

    return Widget.Button({
        class_name: "color-picker",
        // child: Widget.Icon("color-select-symbolic"),
        child: Widget.Label("󰴱"),
        tooltip_text: ColorPicker.bind("colors").as(v => `${v.length} colors`),
        on_clicked: ColorPicker.pick,
        on_secondary_click: self => {
            if (ColorPicker.colors.length === 0)
                return

            menu.popup_at_widget(self, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null)
        },
    });
}

