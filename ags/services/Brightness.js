import { bash, dependencies, sh } from "../core/utils.js"

const get = (args) => Number(Utils.exec(`brightnessctl ${args}`))
const screen = await bash`ls -w1 /sys/class/backlight | head -1`

class Brightness extends Service {
    static {
        Service.register(this, {}, {
            "screen": ["float", "rw"],
        })
    }

    #screenMax = get("max")
    #screen = get("get") / (get("max") || 1)

    get screen() { return this.#screen }

    set screen(percent) {
        if (percent < 0)
            percent = 0

        if (percent > 1)
            percent = 1

        sh(`brightnessctl set ${Math.floor(percent * 100)}% -q`).then(() => {
            this.#screen = percent
            this.changed("screen")
        })
    }

    constructor() {
        super()

        const screenPath = `/sys/class/backlight/${screen}/brightness`

        Utils.monitorFile(screenPath, async f => {
            const v = await Utils.readFileAsync(f)
            this.#screen = Number(v) / this.#screenMax
            this.changed("screen")
        })
    }
}

export default new Brightness
