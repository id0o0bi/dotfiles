local wezterm = require 'wezterm'
require('events')

return {
  -- { key = 'LeftArrow',  mods = 'ALT', action = wezterm.action.ActivateTabRelative(-1) },
  -- { key = 'RightArrow', mods = 'ALT', action = wezterm.action.ActivateTabRelative(1) },
  -- { key = 'LeftArrow',  mods = 'CTRL|SHIFT', action = wezterm.action.ActivateTabRelative(-1) },
  -- { key = 'RightArrow', mods = 'CTRL|SHIFT', action = wezterm.action.ActivateTabRelative(1) },
  { key = '1', mods = 'ALT', action = wezterm.action.ActivateTab(0) },
  { key = '2', mods = 'ALT', action = wezterm.action.ActivateTab(1) },
  { key = '3', mods = 'ALT', action = wezterm.action.ActivateTab(2) },
  { key = '4', mods = 'ALT', action = wezterm.action.ActivateTab(3) },
  { key = '5', mods = 'ALT', action = wezterm.action.ActivateTab(4) },
  { key = '6', mods = 'ALT', action = wezterm.action.ActivateTab(5) },
  { key = '7', mods = 'ALT', action = wezterm.action.ActivateTab(6) },
  { key = '8', mods = 'ALT', action = wezterm.action.ActivateTab(7) },
  { key = 'h', mods = 'CTRL|SHIFT', action = wezterm.action.ActivatePaneDirection 'Left'},
  { key = 'j', mods = 'CTRL|SHIFT', action = wezterm.action.ActivatePaneDirection 'Down'},
  { key = 'k', mods = 'CTRL|SHIFT', action = wezterm.action.ActivatePaneDirection 'Up'},
  { key = 'l', mods = 'CTRL|SHIFT', action = wezterm.action.ActivatePaneDirection 'Right'},
  { key = 'p', mods = 'CTRL', action = wezterm.action.EmitEvent 'padding-off' },
  { key = 'b', mods = 'CTRL', action = wezterm.action.EmitEvent 'toggle-opacity' },
}
