import GLib  from "gi://GLib?version=2.0"
import Gio   from "gi://Gio"
import opts  from './options.js';
import icons from './icons.js';
import theme from '../services/Theme.js';
import weather from '../services/OpenWeather.js';
import { bash, dependencies } from "./utils.js"

const { message, messageAsync } = await Service.import("hyprland")
const Battery = await Service.import("battery")

const TMPDIR  = `${GLib.get_tmp_dir()}/id0o0bi`;
Utils.ensureDirectory(TMPDIR)

const settings = new Gio.Settings({schema: "org.gnome.desktop.interface"})

await resetStyle();

export function init() {

    App.addIcons(`${App.configDir}/assets`)
    warnOnLowBattery();

    monitorFiles();
    initWallpaper();

    // monitorHardware();

    theme.connect('changed', (theme) => {
        let colors = [];
        for (let k in theme.colors) 
            colors.push(`$${k}: ${theme.colors[k]};`);


        let scheme = theme.name === 'dawn' ? 'light' : 'dark';
        settings.set_string("color-scheme", `prefer-${scheme}`)
        Utils.writeFile(colors.join("\n"), `${App.configDir}/styles/colors.scss`)
        blurWindows();
    });

    // change theme after sunrise or sun set
    weather.connect('changed', (weather) => {
        if (!weather.city.sunrise || !weather.city.sunset) return ;

        let sr = new Date(weather.city.sunrise*1000);
        let ss = new Date(weather.city.sunset*1000);
        let ts = new Date();

        sr = sr.getMinutes() + 60*sr.getHours();
        ss = ss.getMinutes() + 60*ss.getHours();
        ts = ts.getMinutes() + 60*ts.getHours();

        theme.name = (ts < sr || ts > ss) ? 'rose' : 'dawn';
    })

    blurWindows();
}

function initWallpaper() {
    if (!dependencies(['swww']))
        return;

    Utils.execAsync([
        'swww', 'img',
        '--transition-type', 'simple',
        '--transition-step', '20',
        '--transition-fps', '30',
        opts.wallpaper,
    ]).catch(err => console.error(err));
}

function monitorFiles() {
    Utils.monitorFile(`${App.configDir}/styles/`, resetStyle)

    Utils.monitorFile('/home/derren/Pictures/bing/bing.jpg', () => {
        initWallpaper();
    });
}

async function resetStyle() {
    if (!dependencies(["sass", "fd"]))
        return

    try {
        const src = `${TMPDIR}/main.scss`
        const dst = `${TMPDIR}/main.css`

        const fd = await bash(`fd ".scss" ${App.configDir}/styles/`)
        const files = fd.split(/\s+/)
        const imports = files.map(f => `@import '${f}';`)

        await Utils.writeFile(imports.join("\n"), src)
        await bash(`sass ${src} ${dst}`)

        App.applyCss(dst, true)
    } catch (error) {
        // console.log(error)
        error instanceof Error
            ? logError(error)
            : console.error(error)
    }
}

function warnOnLowBattery() {
    Battery.connect('notify::percent', ({ percent, charging }) => {
        if (charging ||
            opts.batteryLow.indexOf(percent) === -1)
            return ;
        
        Utils.notify({
            summary: `Battery Low !`,
            body: `${percent}% Battery Left`,
            iconName: "battery-empty-symbolic",
            urgency: "critical",
        })
    });
}

function blurWindows() {
    let blurs = App.windows.flatMap(({ name }) => [
        `layerrule unset, ${name}`,
        `layerrule blur, ${name}`,
        `layerrule ignorealpha ${/* based on shadow color */.29}, ${name}`,
    ]).map(x => `keyword ${x}`).join("; ")

    // console.log(blurs);
    messageAsync(`[[BATCH]]/${blurs}`);
}
