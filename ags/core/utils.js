import cairo from 'cairo';
import Gdk from 'gi://Gdk';
import GLib from 'gi://GLib';
import icons from '../core/icons.js';

const Mpris = Service.import('mpris');

export function range(length, start = 1) {
    return Array.from({ length }, (_, i) => i + start);
}

export function substitute(collection, item) {
    return collection.find(([from]) => from === item)?.[1] || item;
}

export function forMonitors(widget) {
    const n = Gdk.Display.get_default().get_n_monitors();
    return range(n, 0).map(widget);
}

export function createSurfaceFromWidget(widget) {
    const alloc = widget.get_allocation();
    const surface = new cairo.ImageSurface(
        cairo.Format.ARGB32,
        alloc.width,
        alloc.height,
    );
    const cr = new cairo.Context(surface);
    cr.setSourceRGBA(255, 255, 255, 0);
    cr.rectangle(0, 0, alloc.width, alloc.height);
    cr.fill();
    widget.draw(cr);

    return surface;
}

/** @type {function(string): string}*/
export function getAudioTypeIcon(icon) {
    const substitues = [
        ['audio-headset-bluetooth', icons.audio.type.headset],
        ['audio-card-analog-usb', icons.audio.type.speaker],
        ['audio-card-analog-pci', icons.audio.type.card],
    ];

    for (const [from, to] of substitues) {
        if (from === icon)
            return to;
    }

    return icon;
}

export function activePlayer() {
    let active;
    globalThis.mpris = () => active || Mpris.players[0];
    Mpris.connect('player-added', (mpris, bus) => {
        mpris.getPlayer(bus)?.connect('changed', player => {
            active = player;
        });
    });
}

export function launchApp(app) {
    let cmd = app.desktop.endsWith(".desktop") 
        ? ['hyprctl', 'dispatch', 'exec', 'gio', 'launch', app.app.filename]
        : ['hyprctl', 'dispatch', 'exec', `sh -c ${app.executable}`];
    Utils.execAsync(cmd);
    app.frequency += 1;
}

/** @param {Array<string>} bins */
export function dependencies(bins) {
    const deps = bins.map(bin => {
        const has = Utils.exec(`which ${bin}`);
        if (!has)
            print(`missing dependency: ${bin}`);

        return !!has;
    });

    return deps.every(has => has);
}

/**
 * @returns execAsync(["bash", "-c", cmd])
 */
export async function bash(strings) {
    const cmd = typeof strings === "string" ? strings : strings
        .flatMap((str, i) => str + `${i ?? ""}`)
        .join("")

    return Utils.execAsync(["bash", "-c", cmd]).catch(err => {
        console.error(cmd, err)
        return ""
    })
}

/**
 * @returns execAsync(cmd)
 */
export async function sh(cmd) {
    return Utils.execAsync(cmd).catch(err => {
        console.error(typeof cmd === "string" ? cmd : cmd.join(" "), err)
        return ""
    })
}

/**
 * return a string representing how much time has passed
 * eg: 2 seconds, 3 days...
 */
export function timeElapsed(now, ts) {
    let time = now.to_unix();
    let diff = time - ts;

    if (diff < 60) 
        return 'just  now';
    else if (diff < 3600)
        return `${Math.ceil(diff / 60)} minutes ago`;
    else if (diff < 86400) 
        return `${Math.ceil(diff / 3600)} hours ago`;
    else if (diff < 604800) 
        return `${Math.ceil(diff / 86400)} days ago`;
    else 
        return GLib.DateTime.new_from_unix_local(ts).format('%H:%M %d/%m');

    return `some time ago`;
}
