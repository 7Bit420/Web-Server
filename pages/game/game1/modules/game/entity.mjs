class entity extends EventTarget {

    #poz = {
        x: 0,
        y: 0
    }
    #dimentions = {
        width: 0,
        height: 0
    }
    #canvas = document.createElement('canvas')
    #ctx = this.#canvas.getContext('2d')

    constructor({ width = 0, height = 0 }) {
        super()

        this.#dimentions.width = width
        this.#dimentions.height = height

        this.#canvas.width = width
        this.#canvas.height = height
    }

    get texture() {
        return this.#ctx.createImageData(this.#dimentions.width, this.#dimentions.height)
    }

    get dimentions () {
        return this.#dimentions
    }

    addComponent(compnt) {
        if (!(compnt instanceof component)) throw new TypeError()

        compnt

    }

    addManager(mangr) {
        if (!(mangr instanceof manager)) throw new TypeError()

        this.addEventListener(tick, () => {
            mangr.dispatchEvent('tick')
        })
    }

}

export default entity