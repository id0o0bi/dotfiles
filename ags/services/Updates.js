class Updates extends Service {
    static {
        Service.register(this, {}, {
            'packages': ['array', 'r'],
        });
    }

    #packages = [];

    get packages() { return this.#packages; }

    constructor() {
        super();
        this.check();
        setInterval(() => {this.check()}, 60000);
    }

    check() {
        Utils.execAsync(['bash', '-c', 'checkupdates']).then(res => {
            this.#packages = res.split("\n");
        }).catch(e => {
            this.#packages = [];
            // this.#packages = ['test 0.0.1 -> 0.0.2', 'why 0.9a -> 1.0'];
            // console.log(e);
        });

        this.changed('packages');
    }
}

// export to use in other modules
const updates = new Updates;
export default updates;
