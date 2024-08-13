import icons from '../../core/icons.js';

const Battery = await Service.import("battery")

export default () => Widget.Label({
    setup: self => self.hook(Battery, () => {

        let status = 'normal';
        if (Battery.percent <= 20) 
            status = 'critical';
        if (Battery.charging)
            status = 'charging';

        self.label = icons.battery[status] || icons.battery[Math.floor(Battery.percent / 10) * 10];
        self.className = status;
    })
});
