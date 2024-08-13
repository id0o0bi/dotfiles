export default ({
    title = '',
    controls = [],
    content = null
}) => {
    let head = Widget.Box({
        class_name: 'control-head', 
        vertical: false, 
        children: [
            Widget.Label({
                class_name: 'control-title', 
                justification: 'left',
                hexpand: true,
                hpack: 'start',
                label: title,
            }),
            ...controls
        ]
    });

    let body = Widget.Box({
        class_name: 'control-body',
        vertical: false,
        child: content
    })

    return Widget.Box({
        class_name: 'control-box', 
        vertical: true,
        children: [head, body]
    })
}

