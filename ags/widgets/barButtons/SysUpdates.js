import updates from '../../services/Updates.js';
import UpdatesLabel from '../templates/UpdatesLabel.js'

// check updates every 5 mins
export default () => Widget.Button({
    className: 'updates', 
    child: UpdatesLabel(),
    setup: self => self.hook(updates, (self) => {
        self.visible = (updates.packages?.length || 0) > 0;
    })
})

