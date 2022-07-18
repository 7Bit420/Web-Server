class Tile {

    #texture
    #element = document.createElement('img')

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

export default Tile