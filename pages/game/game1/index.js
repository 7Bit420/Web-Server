

class component extends EventTarget {

    constructor() {

    }
}

class gui {

    #canvas = document.createElement('canvas')
    #ctx = this.#canvas.getContext('2d');
    static #uis = []
    static get allUis() {
        return gui.#uis
    }


    document = new Document()

    constructor() {

    }

    static loadFromHTML(data) {
        var ui = new gui()

        ui.document = data
    }
}

class manager extends EventTarget {

    name

    constructor() {
        super()
    }

}

class entityManager extends manager {

    drawn = true

    #canvas = document.createElement('canvas')
    #ctx = this.#canvas.getContext('2d')
    #entities = []
    type = "enitiy"
    #scale = 16
    #poz = {
        X: 0,
        Y: 0
    }
    #dim = {
        width: 0,
        height: 0
    }

    addEntity(e) {
        this.#entities.push(e)
    }

    get canvas() {
        return this.#canvas
    }

    set canvasDIM(v) {
        this.#dim = v
        this.#canvas.width = v.width * this.#scale
        this.#canvas.height = v.height * this.#scale
    }

    set gamePozY(Y) {
        this.#poz.Y = Y
    }

    set gamePozX(X) {
        this.#poz.X = X
    }

    set scale(scale) {
        this.#scale = scale
    }

    get scale() {
        return this.#scale
    }

    constructor() {
        super()

        this.addEventListener('tick', () => {
            this.#ctx.clearRect(0, 0, this.#dim.width * this.#scale, this.#dim.height * this.#scale)
            this.#entities.forEach((e) => {
                if (
                    (
                        e.poz.y < this.#poz.Y ||
                        e.poz.y - this.#dim.height > this.#poz.Y
                    ) &&
                    (
                        e.poz.x < this.#poz.X ||
                        e.poz.x - this.#dim.width > this.#poz.X
                    )
                ) return;


                this.#ctx.drawImage(
                    e.texture,
                    (e.poz.x - this.#poz.X) * this.#scale,
                    (e.poz.y - this.#poz.Y) * this.#scale,
                    (e.dimentions.width) * this.#scale,
                    (e.dimentions.height) * this.#scale
                )


            })
        })
    }
}

class entity extends EventTarget {

    #poz = {
        x: 0,
        y: 0
    }
    #dimentions = {
        width: 0,
        height: 0
    }
    #texture = document.createElement('img')
    #game = Game.prototype

    constructor({ width = 0, height = 0 }, texture, game) {
        super()

        this.#dimentions.width = width
        this.#dimentions.height = height

        this.#texture = document.createElement('img')
        this.#texture.src = texture

        this.#texture.width = width
        this.#texture.height = height

        this.#game = game
    }

    get texture() {
        return this.#texture
    }

    get poz() {
        return {
            x: this.#poz.x,
            y: this.#poz.y
        }
    }

    get dimentions() {
        return this.#dimentions
    }

    move(x = 0, y = 0) {
        if (
            !this.#game.grid[Math.ceil(this.#poz.x + x)]?.[Math.ceil(this.#poz.y + y)]?.solid
        ) {
            this.#poz.x += x
            this.#poz.y += y
        }
    }

    setPoz(x = 0, y = 0) {
        if (
            !this.#game.grid[Math.ceil(this.#poz.x + x)]?.[Math.ceil(this.#poz.y + y)]?.solid
        ) {
            this.#poz.x = x
            this.#poz.y = y
        }
    }

    addComponent(compnt) {
        if (!(compnt instanceof component)) throw new TypeError()

        compnt

    }

    addManager(mangr) {
        if (!(mangr instanceof manager)) throw new TypeError()

        this.addEventListener('tick', () => {
            mangr.dispatchEvent('tick')
        })
    }

}

class Tile {

    #texture
    #element = document.createElement('img')
    solid = false

    constructor(texture = "./assets/dirt-tile.png") {
        this.#element.classList.add('tile')
        this.#texture = texture
        this.#element.src = this.#texture
    }

    get element() {
        return this.#element
    }

    get texture() {
        return this.#texture
    }

    set texture(value) {
        if (typeof value !== "string") throw new TypeError();

        this.#element.src = value
        this.#texture = value
    }
}

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
    #container = this.#canvas
    #guis = []
    #managers = []

    #layers = {
        background: document.createElement('canvas'),
        entities: document.createElement('canvas'),
    };

    grid = [
        [
            {
                "tile": new Tile(),
                "asset": ""
            }
        ]
    ];

    #poz = {
        x: 0,
        y: 0
    }

    #tick() {
        var bgCTX = this.#layers.background.getContext('2d')

        this.#managers.forEach((m) => m.dispatchEvent(new Event('tick')))

        this.#ctx.clearRect(0, 0, this.#width, this.#height)

        for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {
                const tile = this.grid[y][x];
                bgCTX.drawImage(tile.tile.element, y * this.#scale, x * this.#scale, this.#scale, this.#scale)
            }
        }

        for (const layer in this.#layers) {
            this.#ctx.drawImage(this.#layers[layer], 0, 0, this.#canvas.width, this.#canvas.height)
        }

        this.#managers.forEach((m) => { this.#ctx.drawImage(m.canvas, 0, 0, this.#width, this.#height) })
    }

    setDimentions(width = this.#width, height = this.#height, scale = this.#scale) {
        this.#width = width
        this.#canvas.height = width * scale

        this.#height = height
        this.#canvas.width = height * scale

        this.#scale = scale

        this.#canvas.style.height =
            this.#canvas.style.minWidth = '100%'

        for (const layer in this.#layers) {
            this.#layers[layer].width = width * scale
            this.#layers[layer].height = height * scale
        }

        this.upDateManagers()
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
                this.grid[y][x] = level.map.tiles[y]?.[x] ? level.map.tiles[y]?.[x] : { tile: undefined }
                this.grid[y][x].tile = new Tile(
                    level.map.tiles[y]?.[x]?.asset || "./assets/dirt-tile.png",
                    level.map.tiles[y]?.[x]?.options || {})
            }
        }

        this.upDateManagers()
        return level;
    }

    addGui(gui) {
        this.#guis.push(gui)
    }

    constructor(width = 10, height = 10, scale = 16, container = document.createElement('div')) {
        if (!Game.#init) {
            customElements.define('game-container', this.#gameElement)

            Game.#init = true
        }

        this.#width = width
        this.#canvas.width = width * scale

        this.#height = height
        this.#canvas.height = height * scale

        this.#scale = scale
        this.#loop = setInterval(() => this.#tick(), 100)

        this.#canvas = document.createElement('canvas')
        this.#ctx = this.#canvas.getContext('2d');

        this.#container = container
        this.#container.appendChild(this.#canvas)

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

        this.upDateManagers()
    }

    addManager(mgr) {
        this.#managers.push(mgr)
        switch (mgr.type) {
            case "enitiy":
                if (!(mgr instanceof entityManager)) return;

                mgr.gamePozX = this.#poz.x
                mgr.gamePozY = this.#poz.y

                mgr.canvasDIM = {
                    width: this.#width,
                    height: this.#height
                }

                mgr.scale = this.#scale

                this.#layers.entities = mgr.canvas

                break;
        }
    }

    upDateManagers() {
        this.#managers.forEach((mgr) => {

            switch (mgr.type) {
                case "enitiy":
                    if (!(mgr instanceof entityManager)) return;

                    mgr.gamePozX = this.#poz.x
                    mgr.gamePozY = this.#poz.y

                    mgr.canvasDIM = {
                        width: this.#width,
                        height: this.#height
                    }

                    mgr.scale = this.#scale

                    this.#layers.entities = mgr.canvas

                    break;
            }
        })
    }

    test() {
        for (let i = 0; i < 100; i++) {
            this.#ctx.fillRect(1, i * 2 + 1, 1, i)
        }
    }

    get canvas() {
        return this.#canvas
    }

    get gameFrame() {
        return this.#container
    }

    get scale() {
        return this.#scale
    }
}

class pathfinding extends component {

    speed
    #tick = 0

    constructor(speed) {
        this.addEventListener('tick', () => {
            if (this.#tick < speed) return this.#tick++;
            this.#tick = 0;


        })
    }
}


var game = new Game(10, 10, 16, document.getElementById('canvasContainer'))
var mgr = new entityManager()

var enitiy = new entity({ width: 1, height: 1 }, "./assets/trees.png", game)

mgr.addEntity(enitiy)

game.addManager(mgr)

game.gameFrame.style.width = `500px`
game.gameFrame.style.height = `500px`
game.gameFrame.style.display = `block`

game.loadMap('./levels/level2.json')

var keysDown = {
    w: 0,
    a: 0,
    s: 0,
    d: 0
}

document.addEventListener('keydown', (ev) => {
    switch (ev.key) {
        case "w":
            enitiy.move(0, -0.25), 500
            break;
        case "a":
            enitiy.move(-0.25), 500
            break;
        case "s":
            enitiy.move(0, 0.25), 500
            break;
        case "d":
            enitiy.move(0.25), 500
            break;
    }
})

game.gameFrame.addEventListener('click', (ev) => {
    enitiy.setPoz(ev.offsetX / game.scale, ev.offsetY / game.scale)
})