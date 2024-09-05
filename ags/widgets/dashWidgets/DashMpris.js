const mpris = await Service.import('mpris')
const players = mpris.bind("players")

const PLAY_ICON = "media-playback-start-symbolic"
const PAUSE_ICON = "media-playback-pause-symbolic"
const PREV_ICON = "media-skip-backward-symbolic"
const NEXT_ICON = "media-skip-forward-symbolic"

function padInt(i, len = 2, pad = '0') {
    return i.toString().padStart(len, pad);
}

/** @param {number} length */
function lengthStr(len) {

    len = parseInt(len);
    if (len === Infinity || isNaN(len) || len <= 0) 
        return '-:-';

    let hour = Math.floor(len / 3600)
    let min  = Math.floor((len%3600) / 60)
    let sec  = Math.floor(len % 60)

    return hour > 0 
        ? (hour > 99 
            ? `99:99` 
            : `${hour}:${padInt(min)}:${padInt(sec)}`)
        : `${min}:${padInt(sec)}`;
}

/** @param {import('types/service/mpris').MprisPlayer} player */
function Player(player) {

    const img = Widget.Box({
        class_name: "img",
        vpack: "center",
        setup: self => self.hook(player, () => {
            let artists = player.track_artists.filter(a => a);
            self['tooltip-markup'] = [
                `${player.track_title}`, 
                artists.length ? `<sub>󰠃 ${artists.join(', ')}</sub>` : null,
                player.track_album ? `<sub>󰻂 ${player.track_album}</sub>` : null,
                `<sub>󰽱 <b>${player.identity}</b></sub>`
            ].filter(n => n).join("\n");
        }),
        css: player.bind("cover_path")
            .transform(p => `background-image: url('${p ? p : App.configDir+"/assets/music-icon.png"}')`)
    })

    const title = Widget.Label({
        class_name: "title",
        wrap: true,
        truncate: 'end',
        hpack: "start",
        label: player.bind('track_title'),
    })

    const artist = Widget.Label({
        class_name: "artist",
        wrap: true,
        hpack: "start",
        truncate: 'end',
        label: player.bind('track_artists').transform(a => a.join(', ') || player.identity),
    })

    const positionSlider = Widget.Slider({
        class_name: "position",
        draw_value: false,
        on_change: ({ value }) => player.position = value * player.length,
        // visible: player.bind("length").as(l => l > 0),
        setup: self => {
            function update() {
                let pos = parseInt(player.position);
                let val = 0;
                if (pos > 0 && pos !== Infinity) 
                    val = pos/player.length;

                self.value = val;
            }
            self.hook(player, update)
            self.hook(player, update, "position")
            self.poll(1000, update)
        },
    })

    const positionLabel = Widget.Label({
        class_name: "position",
        hpack: "end",
        setup: self => {
            const update = (_, time) => {
                self.label = `${lengthStr(time || player.position)}/${lengthStr(player.length)}`
                self.visible = player.length > 0
            }

            self.hook(player, update, "position")
            self.poll(1000, update)
        },
    })

    const playPause = Widget.Button({
        class_name: "play-pause",
        on_clicked: () => player.playPause(),
        visible: player.bind("can_play"),
        child: Widget.Icon({
            icon: player.bind("play_back_status").transform(s => {
                switch (s) {
                    case "Playing": return PAUSE_ICON
                    case "Paused":
                    case "Stopped": return PLAY_ICON
                }
            }),
        }),
    })

    const prev = Widget.Button({
        on_clicked: () => player.previous(),
        visible: player.bind("can_go_prev"),
        child: Widget.Icon(PREV_ICON),
    })

    const next = Widget.Button({
        on_clicked: () => player.next(),
        visible: player.bind("can_go_next"),
        child: Widget.Icon(NEXT_ICON),
    })

    return Widget.Box(
        {
            class_name: "player", 
            // setup: self => self.hook(mpris, () => {
            //     console.log(player);
            // }),
            visible: player.bind('trackid').as(r => !r?.endsWith('/NoTrack'))
        },
        img,
        Widget.Box(
            {
                vertical: true,
                hexpand: true,
                vpack: 'center'
            },
            Widget.Box([title]),
            positionSlider,
            Widget.CenterBox({
                start_widget: artist,
                center_widget: Widget.Box([prev, playPause, next]),
                end_widget: positionLabel,
            }),
        ),
    )
}

export default () => Widget.Box({
    vertical: true,
    class_name: 'dash-mpris',
    visible: players.as(p => p.map(i => i.length > 0)),
    children: players.as(p => p.map(Player))
})
