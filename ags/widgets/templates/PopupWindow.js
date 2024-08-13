import AgsWindow from 'resource:///com/github/Aylur/ags/widgets/window.js';
import GObject from 'gi://GObject';

class PopupWindow extends AgsWindow {

    static { GObject.registerClass(this); }

    constructor({ name, child, transition = 'none', on_show = null, on_hide = null, visible = false, ...rest }) {
        super({
            ...rest,
            name,
            // popup: true,
            keymode: 'on-demand',
            class_names: ['popup-window', name],
        });

        child.toggleClassName('window-content');
        this.revealer = Widget.Revealer({
            transition,
            child,
            transitionDuration: 300,
            setup: self => self.hook(App, (_, wname, visible) => {
                if (wname !== name) 
                    return ;

                this.revealer.reveal_child = visible;
                if (visible === true && typeof on_show === 'function') 
                    on_show()
                else if (typeof on_hide === 'function')
                    on_hide()
            })
        });

        this.keybind('Escape', () => App.closeWindow(this.name));

        this.child = Widget.Box({
            css: 'padding: 1px;',
            child: this.revealer,
        });

        this.show_all();
        this.visible = visible;
    }

    set transition(dir) { this.revealer.transition = dir; }
    get transition() { return this.revealer.transition; }
}

export default config => new PopupWindow(config);
