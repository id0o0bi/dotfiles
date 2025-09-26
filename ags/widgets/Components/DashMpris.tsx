import { createBinding, For } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import AstalMpris from "gi://AstalMpris?version=0.1";
import { ASSETS, CENTER, END, VERTICAL } from "../../services/vars";
import Pango from "gi://Pango?version=1.0";
import Adw from "gi://Adw?version=1";
import { fileExists, formatSeconds } from "../../services/util";
import { clearNotifications, notifd } from "./Notification";

const PLAY_ICON = "media-playback-start-symbolic";
const PAUSEICON = "media-playback-pause-symbolic";
const PREV_ICON = "media-skip-backward-symbolic";
const NEXT_ICON = "media-skip-forward-symbolic";

const SHUFFLE_ICON = "media-playlist-shuffle-symbolic";

const LOOP_SONG_ICON = "media-playlist-repeat-song-symbolic";
const LOOP_LIST_ICON = "media-playlist-repeat-symbolic";
const LOOP_NONE_ICON = "media-playlist-consecutive-symbolic";

const FORMAT = "%hh:%mm:%ss";
const MUSICICON = `${ASSETS}/music.jpg`;

const { PLAYING, PAUSED, STOPPED } = AstalMpris.PlaybackStatus;
const ShuffleStatus = AstalMpris.Shuffle;
const { NONE, UNSUPPORTED, TRACK, PLAYLIST } = AstalMpris.Loop;

let mpris = AstalMpris.get_default();
let stack: Gtk.Stack;

const Player = (p: AstalMpris.Player): Gtk.Box => {
  const CoverArt = () => (
    <Adw.Avatar
      class="coverArt"
      size={72}
      customImage={createBinding(p, "coverArt").as((a) =>
        Gdk.Texture.new_from_filename(fileExists(a ?? "") ? a : MUSICICON),
      )}
      iconName={p.entry ?? "applications-multimedia-symbolic"}
    />
  );

  const MusicTitle = () => (
    <Gtk.Inscription
      text={createBinding(p, "title")}
      wrapMode={Pango.WrapMode.NONE}
      hexpand={true}
      // vexpand={true}
      textOverflow={Gtk.InscriptionOverflow.ELLIPSIZE_END}
    />
  );

  const MusicApp = () => (
    <Gtk.Inscription
      // text={p.album || p.identity || p.entry}
      text={createBinding(p, "album")}
      wrapMode={Pango.WrapMode.NONE}
      hexpand={true}
      valign={Gtk.Align.BASELINE}
      // xalign={0}
      sensitive={false}
      textOverflow={Gtk.InscriptionOverflow.ELLIPSIZE_END}
    />
  );

  const MusicArtist = () => (
    <Gtk.Inscription
      sensitive={false}
      wrapMode={Pango.WrapMode.NONE}
      hexpand={true}
      text={createBinding(p, "artist").as((a) => (a ? a : ""))}
      textOverflow={Gtk.InscriptionOverflow.ELLIPSIZE_END}
    />
  );

  const ProgressBar = () => (
    <Gtk.ProgressBar
      showText={false}
      hexpand
      fraction={createBinding(p, "position").as((pos) => {
        let len = Math.max(p.length, 0);
        return len > 0 ? Math.max(pos, 0) / len : 0;
      })}
    />
  );

  const PositionLabel = () => (
    <Gtk.Label
      $type="end"
      sensitive={false}
      valign={Gtk.Align.BASELINE}
      label={createBinding(
        p,
        "position",
      )((position) => {
        let pos = formatSeconds(position, FORMAT);
        let len = formatSeconds(p.length, FORMAT);
        return `${pos}/${len}`;
      })}
    />
  );

  /**
   * |------------------
   * | CoverArt | MusicPanel
   * |------------------
   * | ControlPanel
   * |------------------
   */
  return (
    <Gtk.Box
      $type="named"
      class="mprisBox"
      orientation={VERTICAL}
      name={p.busName}
    >
      <Gtk.Box class="musicPanel">
        <CoverArt />
        <Gtk.CenterBox orientation={VERTICAL} hexpand class="info">
          <MusicTitle $type="start" />
          <MusicArtist $type="center" />
          <Gtk.Box $type="end" valign={END} hexpand>
            <MusicApp />
            <PositionLabel />
          </Gtk.Box>
        </Gtk.CenterBox>
      </Gtk.Box>
      <Gtk.Box class="controlPanel" orientation={VERTICAL}>
        <ProgressBar />
        <Gtk.CenterBox hexpand class="playerControls">
          <Gtk.Box $type="start">
            <Gtk.Button
              onClicked={() => p.set_volume(p.get_volume() > 0 ? 0 : 0.65)}
              iconName={createBinding(p, "volume").as((v) => {
                return v > 0
                  ? "audio-volume-high-symbolic"
                  : "audio-volume-muted-symbolic";
              })}
            />
            {/*<Gtk.Scale
              orientation={HORIZONTAL}
              adjustment={createBinding(p, "volume").as((v) => {
                return (
                  <Gtk.Adjustment
                    lower={0}
                    upper={1}
                    stepIncrement={0.05}
                    pageIncrement={0.1}
                    value={v}
                  />
                ) as Gtk.Adjustment;
              })}
              onValueChanged={() => p.set_volume(0.5)}
            />*/}
          </Gtk.Box>
          <Gtk.Box $type="center">
            <Gtk.Button
              visible={createBinding(p, "canGoPrevious")}
              onClicked={() => p.previous()}
              iconName={PREV_ICON}
            />
            <Gtk.Button
              visible={p.canPlay && p.canPause}
              onClicked={() => {
                p.playbackStatus === PLAYING ? p.pause() : p.play();
              }}
              iconName={createBinding(p, "playbackStatus").as((s) => {
                return s === PLAYING ? PAUSEICON : PLAY_ICON;
              })}
            />
            <Gtk.Button
              visible={createBinding(p, "canGoNext")}
              onClicked={() => p.next()}
              iconName={NEXT_ICON}
            />
          </Gtk.Box>
          <Gtk.Box $type="end">
            <Gtk.Button
              visible={createBinding(p, "shuffleStatus").as(
                (s) => s !== ShuffleStatus.UNSUPPORTED,
              )}
              onClicked={() => p.shuffle()}
              iconName={createBinding(p, "shuffleStatus").as((s) => {
                if (s === ShuffleStatus.ON) return SHUFFLE_ICON;
                return LOOP_NONE_ICON;
              })}
            />
            <Gtk.Button
              visible={createBinding(p, "loopStatus").as(
                (s) => s !== UNSUPPORTED,
              )}
              onClicked={() => p.loop()}
              iconName={createBinding(p, "loopStatus").as((s) => {
                if (s === TRACK) return LOOP_SONG_ICON;
                if (s === PLAYLIST) return LOOP_LIST_ICON;
                return LOOP_NONE_ICON;
              })}
            />
          </Gtk.Box>
        </Gtk.CenterBox>
      </Gtk.Box>
    </Gtk.Box>
  ) as Gtk.Box;
};

export default function DashMpris() {
  return (
    <Gtk.Box class="dashMpris" orientation={VERTICAL}>
      <stack
        transitionType={Gtk.StackTransitionType.CROSSFADE}
        $={(ref) => (stack = ref)}
      >
        <For each={createBinding(mpris, "players")}>
          {(p: AstalMpris.Player) => {
            return Player(p);
          }}
        </For>
      </stack>
      <Gtk.Box class="separator">
        <Gtk.Box class="notify">
          <Gtk.Button
            tooltipText="Don't Disturb"
            onClicked={() => notifd.set_dont_disturb(!notifd.dontDisturb)}
            label={createBinding(notifd, "dontDisturb").as((d) =>
              d ? "󱏨" : "󰂟",
            )}
          />
          <Gtk.Button
            tooltipText="Clear All"
            onClicked={clearNotifications}
            label="󰎟"
          />
        </Gtk.Box>
        <Gtk.Separator hexpand valign={CENTER} />
        <Gtk.Box
          class="switcher"
          halign={END}
          visible={createBinding(mpris, "players")((ps) => ps.length > 0)}
        >
          <For each={createBinding(mpris, "players")}>
            {(p: AstalMpris.Player) => (
              <Gtk.ToggleButton
                active={createBinding(
                  stack,
                  "visibleChildName",
                )((n) => n == p.busName)}
                iconName={p.entry ?? "emoji-symbols-symbolic"}
                onClicked={(self) => {
                  stack.set_visible_child_name(p.busName);
                  self.active = stack.get_visible_child_name() === p.busName;
                }}
              />
            )}
          </For>
        </Gtk.Box>
      </Gtk.Box>
    </Gtk.Box>
  );
}
