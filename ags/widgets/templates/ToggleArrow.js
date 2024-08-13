import runtime from '../../services/Runtime.js'

export const GroupToggleArrow = ({
    icons = ['', ''],
    state = null,
    open = () => {}, 
    shut = () => {}
}) => {
    return Widget.Button({
        class_name: 'arrow-button', 
        setup: self => self.hook(runtime, () => {
            self.label = runtime[state.key] === state.val ? icons[1] : icons[0]
        }), 
        on_clicked: () => runtime[state.key] === state.val ? shut() : open()
    })
}

export default ({
    icons = ['', ''],
    state = Variable(false),
    open = () => {}, 
    shut = () => {}
}) => {
    return Widget.Button({
        class_name: 'arrow-button', 
        label: state.bind().as(v => v ? icons[1] : icons[0]),
        on_clicked: () => {
            if (state.value) {
                state.setValue(false);
                shut();
            } else {
                state.setValue(true);
                open();
            }
        }
    })
}
