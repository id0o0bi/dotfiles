import updates from '../../services/Updates.js';

export default () => Widget.Label({
    class_name: 'icon',
    setup: self => self.hook(updates, () => {
        self.label = updates.packages?.length ? '󰘿' : '󰅠';
    })
})
