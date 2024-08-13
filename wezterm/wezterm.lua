local wezterm = require 'wezterm'
require('events')

return {
  -- front_end = "WebGpu",
  color_scheme = 'rose-pine',
  window_frame = {
    active_titlebar_bg = '#333333',
    inactive_titlebar_bg = '#333333',
  },
  use_fancy_tab_bar = false,

  -- disable font ligatures 
  font = wezterm.font_with_fallback {
    {
      family = 'Fira Code',
      harfbuzz_features = { 'calt=0', 'clig=0', 'liga=0' },
    },
    {
      family = 'Source Han Sans CN',
      harfbuzz_features = { 'calt=0', 'clig=0', 'liga=0' },
    }
  },
  font_size = 12,
  default_cursor_style = 'BlinkingBar',

  default_prog = { 'fish' },
  window_close_confirmation = 'NeverPrompt',
  hide_tab_bar_if_only_one_tab = true,

  enable_scroll_bar = false;
  enable_wayland = true;
  window_padding = {
    -- top    = '0.5cell',
    -- right  = '1cell',
    -- bottom = '0.5cell',
    -- left   = '1cell',
    top    = '0',
    right  = '0',
    bottom = '0',
    left   = '0',
  },

  inactive_pane_hsb = {
    saturation = 0.5,
    brightness = 0.5,
  },

  window_background_opacity = 0.7,
  text_background_opacity = 1.0,
  keys = require('keys')
}
