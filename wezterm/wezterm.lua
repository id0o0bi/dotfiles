local wezterm = require 'wezterm'
local theme = require('theme').main

return {
    keys = require('keys'),
    colors = theme.colors(),
    window_frame = theme.window_frame(),
    font = wezterm.font 'JetBrainsMono NFM',
    font_size = 12,
    default_cursor_style = 'BlinkingBlock',

    window_close_confirmation = 'NeverPrompt',
    hide_tab_bar_if_only_one_tab = true,

    enable_scroll_bar = false,
    use_fancy_tab_bar = false,
    window_padding = {
        top    = '0',
        right  = '0',
        bottom = '0',
        left   = '0',
    },

    enable_wayland = true,
    inactive_pane_hsb = {
        saturation = 0.6,
        brightness = 0.6,
    },

    window_background_opacity = 0.6,
    text_background_opacity = 1.0,
}
