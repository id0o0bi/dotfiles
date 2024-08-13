import PopupWindow      from './templates/PopupWindow.js';
import Head             from './setModules/Head.js';
import Control          from './setModules/Control.js';
import Switch           from './setModules/Switch.js';
import { headRevealer } from '../variables/Widget.js';
import runtime          from '../services/Runtime.js';

export default () => PopupWindow({
    name: 'settings',
    anchor: ['top', 'right', 'bottom'], 
    // on_show: self => self.hook(runtime, {
    //     runtime.qs
    // }),
    on_show: () => runtime.qsHeadRevealer = 'themeSelector',
    transition: 'crossfade',
    child: Widget.Box({
        class_name: 'settings',
        vertical: true,
        children: [
            Head(),
            Control(),
            Switch(),
            // Widget.Separator({ orientation: 1 }),
            // Widget.Label('foot'),
        ],
    }),
});
