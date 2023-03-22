import { BLACK } from "./colour.js"
import { on } from "./event.js"
import { keyDown } from "./keyboard.js"
import { Options } from "./options.js"

export const Stage = class {
	static options = {
		default: "context",
		isDefault: (v) => Array.isArray(v) || typeof v === "string",
		context: () => "2d",
		speed: () => 1.0,
		paused: () => false,
		start: () => () => {},
		resize: () => () => {},
		tick: () => () => {},
		update: () => () => {},
	}

	constructor(head, tail) {
		const options = new Options(Stage.options)(head, tail)

		const layered = typeof options.context !== "string"

		const contextTypes = layered ? options.context : [options.context]
		const layers = contextTypes.map((v) => new Layer(v))
		const context = layered ? layers.map((v) => v.context) : layers[0].context

		const internal = {
			layered,
			layers,
			context,
			clock: 0.0,
		}

		Object.assign(this, {
			...options,
			...internal,
		})

		if (document.body === null) {
			addEventListener("load", () => {
				requestAnimationFrame(() => this.fireStart())
			})
		} else {
			requestAnimationFrame(() => this.fireStart())
		}
	}

	fireStart = () => {
		document.body.style["background-color"] = BLACK
		document.body.style["margin"] = "0px"
		document.body.style["overflow"] = "hidden"

		for (const layer of this.layers) {
			layer.context = layer.start()
		}

		this.context = this.layered ? this.layers.map((v) => v.context) : this.layers[0].context

		on("resize", () => this.fireResize())
		on(keyDown(" "), () => (this.paused = !this.paused))

		this.fireResize()
		this.start(this.context)
		this.fireTick()
	}

	fireResize = () => {
		for (const layer of this.layers) {
			layer.resize(layer.context)
		}

		this.resize(this.context)
	}

	fireTick = (time) => {
		this.clock += this.speed
		while (this.clock > 0) {
			if (!this.paused) this.update(this.context, time)
			this.tick(this.context, time)
			this.clock--
		}

		requestAnimationFrame((time) => this.fireTick(time))
	}
}

const LayerTemplate = class {
	start() {}
	resize() {}
}

const CanvasLayer = class extends LayerTemplate {
	start() {
		const canvas = document.createElement("canvas")
		canvas.style["position"] = "absolute"
		document.body.appendChild(canvas)
		return canvas.getContext("2d")
	}

	resize(context) {
		const { canvas } = context
		canvas.width = Math.round(innerWidth)
		canvas.height = Math.round(innerHeight)
		canvas.style["width"] = canvas.width
		canvas.style["height"] = canvas.height
	}
}

const HTMLLayer = class extends LayerTemplate {
	start() {
		const div = document.createElement("div")
		div.style["position"] = "absolute"
		div.style["top"] = "0px"
		div.style["left"] = "0px"
		div.style["width"] = "100%"
		div.style["height"] = "100%"
		document.body.appendChild(div)
		return div
	}
}

const SVGLayer = class extends LayerTemplate {
	start() {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
		svg.style["position"] = "absolute"
		svg.style["top"] = "0px"
		svg.style["left"] = "0px"
		svg.style["width"] = "100%"
		svg.style["height"] = "100%"
		document.body.appendChild(svg)
		return svg
	}
}

const Layer = class {
	static types = {
		"2d": CanvasLayer,
		"html": HTMLLayer,
		"svg": SVGLayer,
	}

	constructor(type) {
		const Constructor = Layer.types[type]
		const layer = new Constructor()
		layer.type = type
		layer.context = null
		return layer
	}
}
