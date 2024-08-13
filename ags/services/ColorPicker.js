import icons from '../core/icons.js'
import { bash, dependencies } from '../core/utils.js'

const COLORS_CACHE = Utils.CACHE_DIR + "/colorpicker.json"
const MAX_NUM_COLORS = 10

class ColorPicker extends Service {
    static {
        Service.register(this, {}, {
            "colors": ["jsobject"],
        })
    }

    #notifID = 0
    #colors = JSON.parse(Utils.readFile(COLORS_CACHE) || "[]")

    get colors() { return [...this.#colors] }
    set colors(colors) {
        this.#colors = colors
        this.changed("colors")
    }

    // TODO: doesn't work?
    async wlCopy(color) {
        console.log('coping ', color);
        if (dependencies(['wl-copy']))
            bash(`wl-copy ${color}`)
    }

    pick = async () => {
        if (!dependencies(['hyprpicker']))
            return

        console.log('picking start')
        const color = await bash("hyprpicker -a -r")
        if (!color)
            return

        console.log('picking end')
        // this.wlCopy(color)
        // console.log('await wl-copy')
        const list = this.colors
        if (!list.includes(color)) {
            list.push(color)
            if (list.length > MAX_NUM_COLORS)
                list.shift()

            this.colors = list
            Utils.writeFile(JSON.stringify(list, null, 2), COLORS_CACHE)
        }

        this.#notifID = await Utils.notify({
            id: this.#notifID,
            appName: 'hyprpicker',
            iconName: icons.ui.colorpicker,
            actions: {
                'Copy to Clipboard': (self, color) => { self.wlCopy(color) },
            },
            summary: 'Color Copied',
            body: color
        })
    }
}

export default new ColorPicker

