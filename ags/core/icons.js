export default {
    lock: 'system-lock-screen-symbolic',
    fallback: {
        executable: 'application-x-executable-symbolic',
    },
    audio: {
        mic: {
            muted: 'microphone-disabled-symbolic',
            low: 'microphone-sensitivity-low-symbolic',
            medium: 'microphone-sensitivity-medium-symbolic',
            high: 'microphone-sensitivity-high-symbolic',
        },
        volume: {
            muted: 'audio-volume-muted-symbolic',
            low: 'audio-volume-low-symbolic',
            medium: 'audio-volume-medium-symbolic',
            high: 'audio-volume-high-symbolic',
            overamplified: 'audio-volume-overamplified-symbolic',
        },
        type: {
            headset: 'audio-headphones-symbolic',
            speaker: 'audio-speakers-symbolic',
            card: 'audio-card-symbolic',
        },
        mixer: '',
    },
    asusctl: {
        profile: {
            Balanced: 'power-profile-balanced-symbolic',
            Quiet: 'power-profile-power-saver-symbolic',
            Performance: 'power-profile-performance-symbolic',
        },
        mode: {
            Integrated: '',
            Hybrid: '󰢮',
        },
    },
    apps: {
        apps: 'view-app-grid-symbolic',
        search: 'folder-saved-search-symbolic',
    },
    battery: {
        charging: '󰂄',
        critical: '󰂃',
        10: '󰁺',
        20: '󰁻',
        30: '󰁼',
        40: '󰁽',
        50: '󰁾',
        60: '󰁿',
        70: '󰁿',
        80: '󰂁',
        90: '󰂂',
        100: '󰁹',
    },
    bluetooth: {
        enabled: '󰂯',
        disabled: '󰂲',
    },
    brightness: {
        indicator: 'display-brightness-symbolic',
        keyboard: 'keyboard-brightness-symbolic',
        screen: 'display-brightness-symbolic',
        25: '󰃝',
        50: '󰃞',
        75: '󰃟',
        100: '󰃠',
    },
    powermenu: {
        sleep: 'weather-clear-night-symbolic',
        reboot: 'system-reboot-symbolic',
        logout: 'system-log-out-symbolic',
        shutdown: 'system-shutdown-symbolic',
    },
    recorder: {
        recording: 'media-record-symbolic',
    },
    notifications: {
        noisy: 'preferences-system-notifications-symbolic',
        silent: 'notifications-disabled-symbolic',
        message: "chat-bubbles-symbolic",
    },
    trash: {
        full: 'user-trash-full-symbolic',
        empty: 'user-trash-symbolic',
    },
    mpris: {
        fallback: 'audio-x-generic-symbolic',
        shuffle: {
            enabled: '󰒟',
            disabled: '󰒟',
        },
        loop: {
            none: '󰓦',
            track: '󰓦',
            playlist: '󰑐',
        },
        playing: '󰏦',
        paused: '󰐍',
        stopped: '󰐍',
        prev: '󰒮',
        next: '󰒭',
    },
    ui: {
        close: 'window-close-symbolic',
        info: 'info-symbolic',
        menu: 'open-menu-symbolic',
        link: 'external-link-symbolic',
        settings: 'emblem-system-symbolic',
        tick: 'object-select-symbolic',
        sync: '󱍸',
        arrow: {
            right: 'pan-end-symbolic',
            left: 'pan-start-symbolic',
            down: 'pan-down-symbolic',
            up: 'pan-up-symbolic',
        },
    },
    system: {
        cpu: 'org.gnome.SystemMonitor-symbolic',
        ram: 'drive-harddisk-solidstate-symbolic',
        temp: 'temperature-symbolic',
    },
    dialog: {
        Search: '',
        Applauncher: '󰵆',
        Bar: '',
        Border: '󰃇',
        Color: '󰏘',
        Desktop: '',
        Font: '',
        General: '󰒓',
        Miscellaneous: '󰠱',
        Theme: '󰃟',
        Notifications: '󰂚 ',
    },
};
