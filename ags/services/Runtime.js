// rumtime variables
class Runtime extends Service {
    static {
        Service.register(this, {}, {
            // themeSelector, batteryInfo, systemActions
            'qsHeadRevealer': ['string', 'rw'],
            'qsSwitchWindow': ['string', 'rw'],
        });
    }

    // prefix means private in JS
    #qsHeadRevealer = '';
    #qsSwitchWindow = '';

    get qsHeadRevealer() { return this.#qsHeadRevealer; }

    get qsSwitchWindow() { return this.#qsSwitchWindow; }

    set qsHeadRevealer(s) {
        this.#qsHeadRevealer = s;
        this.changed('qsHeadRevealer');
    }

    set qsSwitchWindow(s) {
        this.#qsSwitchWindow = s;
        this.changed('qsSwitchWindow');
    }

    constructor() {
        super();
    }
}

// export to use in other modules
const runtime = new Runtime;
export default runtime;
