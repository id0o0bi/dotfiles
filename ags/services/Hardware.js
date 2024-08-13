// Check if Some Hardware is been accessed!
class Hardware extends Service {
    static {
        Service.register(this, {}, {
            'mic': ['bool', 'r'],
            'cam': ['bool', 'r'],
        });
    }

    // prefix means private in JS
    #mic = false;
    #cam = false;

    get mic() { return this.#mic; }

    get cam() { return this.#cam; }

    constructor() {
        super();

        try {
            console.log(`can't monitor file read event`);
            Utils.monitorFile(`/dev/snd/`, (f, e) => {
                console.log(f, e);
            });
        } catch (e) {
            console.error(e)
        };
    }
}

// export to use in other modules
const hardware = new Hardware;
export default hardware;
