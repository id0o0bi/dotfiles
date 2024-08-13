import record from '../../services/ScreenRecord.js'
import icons from '../../core/icons.js'

export default () => Widget.Button({
    class_name: "recorder",
    vpack: 'center',
    on_clicked: () => record.stop(),
    visible: record.bind("recording"),
    // visible: true,
    child: Widget.Box({
        hpack: 'center',
        children: [
            Widget.Label(''),
            Widget.Label({
                // label: '10:08'
                label: record.bind("timer").as(time => {
                    const sec = time % 60
                    const min = Math.floor(time / 60)
                    return `${min}:${sec < 10 ? "0" + sec : sec}`
                }),
            }),
        ],
    }),
})

