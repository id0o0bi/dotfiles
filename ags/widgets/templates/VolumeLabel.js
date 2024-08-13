const audio = await Service.import("audio")

export default () => Widget.Icon({
    class_name: 'icon',
    icon: audio.speaker.bind('volume').as(v => {
        const icons = ['low', 'medium', 'high', 'overamplified'];
        const vol   = Math.floor(Math.min(1, v)*3);

        return audio.speaker.is_muted || v === 0
            ? `audio-volume-muted-symbolic`
            : `audio-volume-${icons[vol]}-symbolic`;
    })
})

