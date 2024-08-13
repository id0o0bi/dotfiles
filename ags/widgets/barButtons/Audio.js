import Hardware from '../../services/Hardware.js';
import VolumeLabel from '../templates/VolumeLabel.js';

const Audio = await Service.import("audio")

export const Mic = () => Widget.Button({
    label: '',
    setup: self => self.hook(Audio, () => {
        self.visible = Audio.microphone['is-muted'];
    })
})

export const Volume = () => Widget.Button({
    className: 'volume',
    child: VolumeLabel(),
});
