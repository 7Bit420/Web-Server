class Game {

    #gameElement = class t extends HTMLElement {

        constructor() {
            super()

            this.attachShadow({ mode: 'open' })
        }
    }

    static #init = false

    #width = 10
    #height = 10
    #scale = 16
    #loop = 0
    #canvas = document.createElement('canvas')
    #ctx = this.#canvas.getContext('2d');
    #container = this.#gameElement.prototype
    #guis = []

    #layers = {
        background: document.createElement('canvas'),
        entities: document.createElement('canvas')
    };

    grid = [
        [new Tile()]
    ];

    #poz = {
        x: 0,
        y: 0
    }

    #tick() {

        var bgCTX = this.#layers.background.getContext('2d')

        for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {
                const tile = this.grid[y][x];
                bgCTX.drawImage(tile.element, y * this.#scale, x * this.#scale, this.#scale, this.#scale)
            }
        }

        for (const layer in this.#layers) {
            this.#ctx.drawImage(this.#layers[layer], 0, 0, this.#canvas.width, this.#canvas.height)
        }

    }

    setDimentions(width = this.#width, height = this.#height, scale = this.#scale) {
        this.#width = width
        this.#canvas.width = width * scale

        this.#height = height
        this.#canvas.height = height * scale

        this.#scale = scale

        if (
            this.#height >
            this.#width
        ) {
            this.#canvas.style.width = `${this.#container.offsetWidth}px`
            this.#canvas.style.height = `${((this.#height / 100) * this.#width) * this.#container.offsetWidth}px`
        } else {
            this.#canvas.style.height = `${this.#container.offsetHeight}px`
            this.#canvas.style.width = `${((this.#width / 100) * this.#height) * this.#container.offsetHeight}px`
        }

        for (const layer in this.#layers) {
            this.#layers[layer].width = width * scale
            this.#layers[layer].height = height * scale
        }
    }

    async loadMap(url) {
        var level = JSON.parse(await (await fetch(url)).text())
        this.setDimentions(
            level.map.width,
            level.map.height,
            level.map.scale
        )

        for (let y = 0; y < this.#height; y++) {
            this.grid[y] = this.grid[y] || []
            for (let x = 0; x < this.#width; x++) {
                this.grid[y][x] = new Tile(level.map.urls[y]?.[x] || "./assets/dirt-tile.png")
            }
        }

        return level;
    }

    addGui(gui) {
        this.#guis.push(gui)
    }

    constructor(width = 10, height = 10, scale = 16) {
        if (!Game.#init) {
            customElements.define('game-container', this.#gameElement)

            Game.#init = true
        }

        this.#container = document.createElement('game-container')

        this.#width = width
        this.#canvas.width = width * scale

        this.#height = height
        this.#canvas.height = height * scale

        this.#scale = scale
        this.#loop = setInterval(() => this.#tick(), 100)

        this.#canvas = this.#container.appendChild(this.#canvas)
        this.#ctx = this.#canvas.getContext('2d');

        for (let y = 0; y < height; y++) {
            this.grid[y] = this.grid[y] ? this.grid[y] : []
            for (let x = 0; x < width; x++) {
                const tile = this.grid[y][x];
                this.grid[y][x] = (tile ? tile : new Tile())
            }
        }

        for (const layer in this.#layers) {
            this.#layers[layer].width = width * scale
            this.#layers[layer].height = height * scale
        }

        this.#container.shadowRoot.appendChild(this.#canvas);

        var obs = new ResizeObserver((ev) => {
            if (
                this.#height >
                this.#width
            ) {
                this.#canvas.style.width = `${this.#container.offsetWidth}px`
                this.#canvas.style.height = `${((this.#height / 100) * this.#width) * this.#container.offsetWidth}px`
            } else {
                this.#canvas.style.height = `${this.#container.offsetHeight}px`
                this.#canvas.style.width = `${((this.#width / 100) * this.#height) * this.#container.offsetHeight}px`
            }
        })

        obs.observe(this.#container)

    }

    get canvas() {
        return this.#canvas
    }

    get gameFrame() {
        return this.#container
    }
}

export default Game