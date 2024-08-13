import Progress from './templates/Progress.js';
import Brightness from '../services/Brightness.js';
import { getAudioTypeIcon } from '../core/utils.js';
import icons from '../core/icons.js';

const audio = await Service.import('audio')
const DELAY = 2000

function OnScreenProgress() {
    const indicator = Widget.Icon({
        size: 32, 
        vpack: 'start'
    })

    const progress = Progress({
        vertical: true, 
        width: 32, 
        height: 300,
        child: indicator
    })

    const revealer = Widget.Revealer({
        transition: 'slide_left', 
        revealChild: false,
        child: progress, 
    })

    let count = 0;
    function show(value, icon) {
        revealer.revealChild = true
        indicator.icon = icon
        progress.setValue(value)
        count++
        // console.log("Progress >>>> ", icon, "\t", count);
        Utils.timeout(DELAY, () => {
            count--
            if (count === 0)
                revealer.revealChild = false
            // console.log("Progress >>>> \t", count);
        })
    }

    return revealer
        .hook(Brightness, () => show(
            Brightness.screen,
            icons.brightness.screen,
        ), "notify::screen")
        .hook(audio.speaker, () => show(
            audio.speaker.volume,
            getAudioTypeIcon(audio.speaker.icon_name || "", icons.audio.type.speaker),
        ), "notify::volume")

}

function MicrophoneMute() {
    const icon = Widget.Icon({
        class_name: "microphone",
    })

    const revealer = Widget.Revealer({
        transition: "slide_up",
        child: icon,
        reveal_child: false,
    })

    let count = 0
    let mute = audio.microphone.stream?.is_muted ?? false

    return revealer.hook(audio.microphone, () => Utils.idle(() => {
        if (mute !== audio.microphone.stream?.is_muted) {
            mute = audio.microphone.stream.is_muted
            icon.icon = icons.audio.mic[mute ? "muted" : "high"]
            revealer.reveal_child = true
            count++
            // console.log("Microphone >>>> \t", count);

            Utils.timeout(DELAY, () => {
                count--
                if (count === 0)
                    revealer.reveal_child = false
                // console.log("Microphone >>>> \t", count);
            })
        }
    }))
}


/** @param {number} monitor */
export default monitor => Widget.Window({
    name: `indicator${monitor}`,
    monitor,
    class_name: 'indicator',
    layer: 'overlay',
    click_through: true,
    anchor: ["right", "left", "top", "bottom"],
    child: Widget.Box({
        css: "padding: 2px", 
        expand: true, 
        child: Widget.Overlay(
            { child: Widget.Box({ expand: true }) }, 
            Widget.Box({
                hpack: 'end', 
                vpack: 'center',
                child: OnScreenProgress()
            }),
            Widget.Box({
                hpack: 'center', 
                vpack: 'end',
                child: MicrophoneMute()
            })
        )
    })
});
