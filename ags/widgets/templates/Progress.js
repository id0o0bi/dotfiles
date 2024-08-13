export default ({
    height = 18,
    width = 180,
    vertical = false,
    child
}) => {
    const fill = Widget.Box({
        class_name: 'fill',
        hexpand: vertical,
        vexpand: !vertical,
        hpack: vertical ? 'fill' : 'start',
        vpack: vertical ? 'end' : 'fill',
        children: [child],
    });

    const container = Widget.Box({
        class_name: "progress",
        child: fill,
        css: `
            min-width: ${width}px;
            min-height: ${height}px;
        `,
    });

    return Object.assign(container, {
        setValue(value) {
            if (value < 0) 
                return
            value = Math.min(1, value);

            const axis = vertical ? 'height' : 'width';
            const vxis = vertical ? height : width;
            const min  = vertical ? width : height;
            const size = (vxis - min) * value + min;
            fill.css = `min-${axis}: ${size}px`;
        }
    })
};
