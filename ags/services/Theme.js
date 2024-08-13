class Theme extends Service {
    static {
        Service.register(this, {}, {
            'name': ['string', 'rw'],
            'palette': ['object', 'r'],
            'colors': ['object', 'r']
        });
    }

    // 'rose', 'dawn', 'moon'
    #name = 'rose';

    #colors = {};

    // Rose Pine Color Pallete, [Rose Pine, Dawn, Moon]
    #palette = {
        blur          : ['0.2', '0.2', '0.2'],
        base_blur     : ['transparentize(#232136, $blur)', 'transparentize(#faf4ed, $blur)', 'transparentize(#232136, $blur)'],
        surface_blur  : ['transparentize(#2a273f, $blur)', 'transparentize(#fffaf3, $blur)', 'transparentize(#2a273f, $blur)'],
        overlay_blur  : ['transparentize(#393552, $blur)', 'transparentize(#f2e9e1, $blur)', 'transparentize(#393552, $blur)'],
        base          : ['#232136', '#faf4ed', '#232136'],
        surface       : ['#2a273f', '#fffaf3', '#2a273f'],
        overlay       : ['#393552', '#f2e9e1', '#393552'],
        muted         : ['#6e6a86', '#9893a5', '#6e6a86'],
        subtle        : ['#908caa', '#797593', '#908caa'],
        text          : ['#e0def4', '#575279', '#e0def4'],
        love          : ['#eb6f92', '#b4637a', '#eb6f92'],
        gold          : ['#f6c177', '#ea9d34', '#f6c177'],
        rose          : ['#ea9a97', '#d7827e', '#ea9a97'],
        pine          : ['#3e8fb0', '#286983', '#3e8fb0'],
        foam          : ['#9ccfd8', '#56949f', '#9ccfd8'],
        iris          : ['#c4a7e7', '#907aa9', '#c4a7e7'],
        highlightLow  : ['#2a283e', '#f4ede8', '#2a283e'],
        highlightMed  : ['#44415a', '#dfdad9', '#44415a'],
        highlightHigh : ['#56526e', '#cecacd', '#56526e'],
        contrastWhite : ['#ffffff', '#000000', '#ffffff'],
        contrastBlack : ['#000000', '#ffffff', '#000000'],
    }

    constructor() { super(); }

    get name() { return this.#name; }

    get palette() { return this.#palette; }

    get colors() {
        let index = ['rose', 'dawn', 'moon'].indexOf(this.#name);
        for (let k in this.#palette) 
            this.#colors[k] = this.#palette[k][index];

        return this.#colors;
    }

    set name(name) {
        if (['rose', 'dawn', 'moon'].indexOf(name) < 0) 
            return ;

        this.#name = name;
        this.changed('name');
    }

}

// export to use in other modules
const theme = new Theme;
export default theme;
