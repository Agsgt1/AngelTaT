const Habitat = {}

//=======//
// Array //
//=======//
{
	
	const install = (global) => {
	
		Reflect.defineProperty(global.Array.prototype, "last", {
			get() {
				return this[this.length-1]
			},
			set(value) {
				Reflect.defineProperty(this, "last", {value, configurable: true, writable: true, enumerable: true})
			},
			configurable: true,
			enumerable: false,
		})
		
		Reflect.defineProperty(global.Array.prototype, "clone", {
			get() {
				return [...this]
			},
			set(value) {
				Reflect.defineProperty(this, "clone", {value, configurable: true, writable: true, enumerable: true})
			},
			configurable: true,
			enumerable: false,
		})
		
		Reflect.defineProperty(global.Array.prototype, "at", {
			value(position) {
				if (position >= 0) return this[position]
				return this[this.length + position]
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Reflect.defineProperty(global.Array.prototype, "shuffle", {
			value() {
				for (let i = this.length - 1; i > 0; i--) {
					const r = Math.floor(Math.random() * (i+1))
					;[this[i], this[r]] = [this[r], this[i]]
				}
				return this
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Reflect.defineProperty(global.Array.prototype, "trim", {
			value() {
				if (this.length == 0) return this
				let start = this.length - 1
				let end = 0
				for (let i = 0; i < this.length; i++) {
					const value = this[i]
					if (value !== undefined) {
						start = i
						break
					}
				}
				for (let i = this.length - 1; i >= 0; i--) {
					const value = this[i]
					if (value !== undefined) {
						end = i + 1
						break
					}
				}
				this.splice(end)
				this.splice(0, start)
				return this
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Reflect.defineProperty(global.Array.prototype, "repeat", {
			value(n) {
				if (n === 0) {
					this.splice(0)
					return this
				}
				if (n < 0) {
					this.reverse()
					n = n - n - n 
				}
				const clone = [...this]
				for (let i = 1; i < n; i++) {
					this.push(...clone)
				}
				return this
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Habitat.Array.installed = true
		
	}
	
	Habitat.Array = {install}
	
}

//=======//
// Async //
//=======//
{
	const sleep = (duration) => new Promise(resolve => setTimeout(resolve, duration))
	const install = (global) => {
		global.sleep = sleep
		Habitat.Async.installed = true
	}
	
	Habitat.Async = {install, sleep}
}

//=========//
// Console //
//=========//
{
	const print = console.log.bind(console)
	const dir = (value) => console.dir(Object(value))
	
	let print9Counter = 0
	const print9 = (message) => {
		if (print9Counter >= 9) return
		print9Counter++
		console.log(message)
	}
	
	const install = (global) => {
		global.print = print
		global.dir = dir
		global.print9 = print9
		
		Reflect.defineProperty(global.Object.prototype, "d", {
			get() {
				const value = this.valueOf()
				console.log(value)
				return value
			},
			set(value) {
				Reflect.defineProperty(this, "d", {value, configurable: true, writable: true, enumerable: true})
			},
			configurable: true,
			enumerable: false,
		})
		
		Reflect.defineProperty(global.Object.prototype, "dir", {
			get() {
				console.dir(this)
				return this.valueOf()
			},
			set(value) {
				Reflect.defineProperty(this, "dir", {value, configurable: true, writable: true, enumerable: true})
			},
			configurable: true,
			enumerable: false,
		})
		
		let d9Counter = 0
		Reflect.defineProperty(global.Object.prototype, "d9", {
			get() {
				const value = this.valueOf()
				if (d9Counter < 9) {
					console.log(value)
					d9Counter++
				}
				return value
			},
			set(value) {
				Reflect.defineProperty(this, "d9", {value, configurable: true, writable: true, enumerable: true})
			},
			configurable: true,
			enumerable: false,
		})
		
		Habitat.Console.installed = true
		
	}
	
	Habitat.Console = {install, print, dir, print9}
}

//==========//
// Document //
//==========//
{

	const $ = (...args) => document.querySelector(...args)
	const $$ = (...args) => document.querySelectorAll(...args)

	const install = (global) => {
	
	
		global.$ = $
		global.$$ = $$
		
		if (global.Node === undefined) return
		
		Reflect.defineProperty(global.Node.prototype, "$", {
			value(...args) {
				return this.querySelector(...args)
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Reflect.defineProperty(global.Node.prototype, "$$", {
			value(...args) {
				return this.querySelectorAll(...args)
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Habitat.Document.installed = true
		
	}
	
	Habitat.Document = {install, $, $$}
	
}


//=======//
// Event //
//=======//
{

	const install = (global) => {
	
		Reflect.defineProperty(global.EventTarget.prototype, "on", {
			get() {
				return new Proxy(this, {
					get: (element, eventName) => (...args) => element.addEventListener(eventName, ...args),
				})
			},
			set(value) {
				Reflect.defineProperty(this, "on", {value, configurable: true, writable: true, enumerable: true})
			},
			configurable: true,
			enumerable: false,
		})
		
		Reflect.defineProperty(global.EventTarget.prototype, "trigger", {
			value(name, options = {}) {
				const {bubbles = true, cancelable = true, ...data} = options
				const event = new Event(name, {bubbles, cancelable})
				for (const key in data) event[key] = data[key]
				this.dispatchEvent(event)
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Habitat.Event.installed = true
		
	}
	
	Habitat.Event = {install}
	
}


//======//
// HTML //
//======//
{

	Habitat.HTML = (...args) => {
		const source = String.raw(...args)
		const template = document.createElement("template")
		template.innerHTML = source
		return template.content
	}

	Habitat.HTML.install = (global) => {
		global.HTML = Habitat.HTML
		Habitat.HTML.installed = true
	}
	
}


//============//
// JavaScript //
//============//
{
	
	Habitat.JavaScript = (...args) => {
		const source = String.raw(...args)
		const code = `return ${source}`
		const func = new Function(code)()
		return func
	}
	
	Habitat.JavaScript.install = (global) => {
		global.JavaScript = Habitat.JavaScript	
		Habitat.JavaScript.installed = true
	}
	
}


//==========//
// Keyboard //
//==========//
{

	const Keyboard = Habitat.Keyboard = {}
	Reflect.defineProperty(Keyboard, "install", {
		value(global) {
			global.Keyboard = Keyboard
			global.addEventListener("keydown", e => {
				Keyboard[e.key] = true
			})
			
			global.addEventListener("keyup", e => {
				Keyboard[e.key] = false
			})
			
			Reflect.defineProperty(Keyboard, "installed", {
				value: true,
				configurable: true,
				enumerable: false,
				writable: true,
			})
		},
		configurable: true,
		enumerable: false,
		writable: true,
	})
	
}


//======//
// Main //
//======//
Habitat.install = (global) => {

	if (Habitat.installed) return

	if (!Habitat.Array.installed)      Habitat.Array.install(global)
	if (!Habitat.Async.installed)      Habitat.Async.install(global)
	if (!Habitat.Console.installed)    Habitat.Console.install(global)
	if (!Habitat.Document.installed)   Habitat.Document.install(global)
	if (!Habitat.Event.installed)      Habitat.Event.install(global)
	if (!Habitat.HTML.installed)       Habitat.HTML.install(global)
	if (!Habitat.JavaScript.installed) Habitat.JavaScript.install(global)
	if (!Habitat.Keyboard.installed)   Habitat.Keyboard.install(global)
	if (!Habitat.Math.installed)       Habitat.Math.install(global)
	if (!Habitat.MotherTode.installed) Habitat.MotherTode.install(global)
	if (!Habitat.Mouse.installed)      Habitat.Mouse.install(global)
	if (!Habitat.Number.installed)     Habitat.Number.install(global)
	if (!Habitat.Object.installed)     Habitat.Object.install(global)
	if (!Habitat.Property.installed)   Habitat.Property.install(global)
	if (!Habitat.Random.installed)     Habitat.Random.install(global)
	if (!Habitat.Stage.installed)      Habitat.Stage.install(global)
	if (!Habitat.Term.installed)       Habitat.Term.install(global)
	if (!Habitat.Touch.installed)      Habitat.Touch.install(global)
	if (!Habitat.Type.installed)       Habitat.Type.install(global)
	
	Habitat.installed = true
	
}

//======//
// Math //
//======//
{
	
	const gcd = (...numbers) => {
		const [head, ...tail] = numbers
		if (numbers.length === 1) return head
		if (numbers.length  >  2) return gcd(head, gcd(...tail))
		
		let [a, b] = [head, ...tail]
		
		while (true) {
			if (b === 0) return a
			a = a % b
			if (a === 0) return b
			b = b % a
		}
		
	}
	
	const reduce = (...numbers) => {
		const divisor = gcd(...numbers)
		return numbers.map(n => n / divisor)
	}
	
	const install = (global) => {
		global.Math.gcd = Habitat.Math.gcd
		global.Math.reduce = Habitat.Math.reduce
		Habitat.Math.installed = true
	}
	
	
	Habitat.Math = {install, gcd, reduce}
	
}


//============//
// MotherTode //
//============//
{

	
	
	Habitat.MotherTode = (...args) => {
		const source = String.raw(...args)
		const result = Term.term("MotherTode", Habitat.MotherTode.scope)(source, {indentSize: 0})
		if (!result.success) {
			console.error(`MotherTode Error`)
			result.log()
			return result
		}
		const func = new Function("scope", "return " + result.output.d)
		const finalResult = func()
		
		finalResult.success = result.success
		finalResult.output = result.output
		finalResult.source = result.source
		finalResult.tail = result.tail
		finalResult.input = result.input
		finalResult.args = result.args
		finalResult.error = result.error
		finalResult.log = () => {
			result.log()
			return finalResult
		}
		
		for (let i = 0; i < result.length; i++) {
			finalResult[i] = result[i]
		}
		
		return finalResult
	}
	
	Habitat.MotherTode.scope = {}
	
	Habitat.MotherTode.install = (global) => {
		global.MotherTode = Habitat.MotherTode	
		Habitat.MotherTode.installed = true
		
		// Shorthand
		const scope = Habitat.MotherTode.scope
		const Term = Habitat.Term
		
		//========//
		// Source //
		//========//
		scope.MotherTode = Term.error(
			Term.emit(
				Term.list([
					Term.term("Source", scope),
					Term.eof,
				]),
				([{output}]) => output,
			),
			(result) => result.error,
		)
		
		scope.Source = Term.or([
			Term.term("Term", scope),
			//Term.term("TermLiteralInner", scope),
		])
		
		//======//
		// Term //
		//======//
		scope.Term = Term.or([
			
			Term.term("HorizontalList", scope),
			Term.term("Maybe", scope),
			Term.term("Many", scope),
			
			Term.term("VerticalGroup", scope),
			Term.term("VerticalGroupSingle", scope),
			Term.term("HorizontalGroup", scope),
			Term.term("HorizontalGroupSingle", scope),
			
			Term.term("String", scope),
			Term.term("RegExp", scope),
			//Term.term("TermReference", scope),
		])
		
		//========//
		// Basics //
		//========//
		scope.Letter = Term.regExp(/[a-zA-Z_$]/)
		scope.TermName = Term.many(Term.term("Letter", scope))
		scope.Gap = Term.maybe(Term.many(Term.regExp(/[ |	]/)))
		
		//========//
		// Indent //
		//========//
		scope.Indent = Term.check(
			Term.list([
				Term.term("Gap", scope),
				Term.string("\n"),
				Term.term("Gap", scope),
			]),
			(indent) => {
				const [gap, newline, margin] = indent
				indent.args.indentSize++
				return margin.output === ["	"].repeat(indent.args.indentSize).join("")
			},
		)
		
		scope.Unindent = Term.error(
			Term.check(
				Term.list([
					Term.term("Gap", scope),
					Term.string("\n"),
					Term.term("Gap", scope),
				]),
				(indent) => {
					const [gap, newline, margin] = indent
					indent.args.indentSize--
					return margin.output === ["	"].repeat(indent.args.indentSize).join("")
				},
			),
			([gap, newline, indent]) => `UNINDENT ERROR`
		)
		
		scope.NewLine = Term.error(
			Term.check(
				Term.list([
					Term.term("Gap", scope),
					Term.string("\n"),
					Term.term("Gap", scope),
				]),
				(indent) => {
					const [gap, newline, margin] = indent
					return margin.output === ["	"].repeat(indent.args.indentSize).join("")
				},
			),
			([gap, newline, indent]) => `UNINDENT ERROR`
		)
		
		//===========//
		// Primitive //
		//===========//
		scope.String = Term.emit(
			Term.list([
				Term.string('"'),
				Term.maybe(Term.many(Term.regExp(/[^"]/))),  //"
				Term.string('"'),
			]),
			([left, inner, right]) => `Term.string(\`${inner}\`)`
		)
		
		scope.RegExp = Term.emit(
			Term.list([
				Term.string('/'),
				Term.maybe(Term.many(Term.regExp(/[^/]/))),
				Term.string('/'),
			]),
			([left, inner, right]) => `Term.regExp(/${inner}/)`
		)
		
		// Can't do this yet until I've made declarations
		/*scope.TermReference = Term.emit(
			Term.term("TermName", scope),
			(name) => `Term.term(\`${name}\`, scope)`
		)*/
		
		//===========//
		// Operators //
		//===========//
		scope.Many = Term.emit(
			Term.list([
				Term.except(Term.term("Term", scope), [Term.term("Many", scope)]),
				Term.term("Gap", scope),
				Term.string("+"),
			]),
			([term]) => `Term.many(${term})`,
		)
		
		scope.Maybe = Term.emit(
			Term.list([
				Term.except(Term.term("Term", scope), [Term.term("Maybe", scope)]),
				Term.term("Gap", scope),
				Term.string("?"),
			]),
			([term]) => `Term.maybe(${term})`,
		)
		
		//================//
		// HorizontalList //
		//================//
		scope.HorizontalList = Term.emit(
			Term.term("HorizontalListInner", scope),
			(line) => `Term.list([${line}])`,
		)
		
		scope.HorizontalListInner = Term.emit(
			Term.list([
				Term.except(Term.term("Term", scope), [Term.term("HorizontalList", scope)]),
				Term.term("Gap", scope),
				Term.or([
					Term.term("HorizontalListInner", scope),
					Term.except(Term.term("Term", scope), [Term.term("HorizontalList", scope)]),
				]),
			]),
			([left, gap, right]) => `${left}, ${right}`,
		)
		
		//=================//
		// HorizontalGroup //
		//=================//
		scope.HorizontalGroup = Term.emit(
			Term.list([
				Term.string("("),
				Term.term("Gap", scope),
				Term.term("HorizontalListInner", scope),
				Term.term("Gap", scope),
				Term.string(")"),
			]),
			([open, gap, inner]) => `Term.list([` + inner + `])`,
		)
		
		scope.HorizontalGroupSingle = Term.emit(
			Term.list([
				Term.string("("),
				Term.term("Gap", scope),
				Term.any(Term.term("Term", scope)),
				Term.term("Gap", scope),
				Term.string(")"),
			]),
			([open, gap, inner]) => inner.output,
		)
		
		//===============//
		// VerticalGroup //
		//===============//
		scope.VerticalGroup = Term.emit(
			Term.list([
				Term.string("("),
				Term.term("Indent", scope),
				Term.term("VerticalGroupInner", scope),
				Term.term("Unindent", scope),
				Term.string(")"),
			]),
			([open, indent, inner]) => `Term.list([\n` + inner.output.split("\n").map(l => "	".repeat(indent.args.indentSize) + l).join("\n") + `\n])`,
		)
		
		scope.VerticalGroupInner = Term.emit(
			Term.list([
				Term.term("Term", scope),
				Term.term("NewLine", scope),
				Term.or([
					Term.term("VerticalGroupInner", scope),
					Term.term("Term", scope),
				]),
			]),
			([left, gap, right]) => `${left},\n${right}`,
		)
		
		scope.VerticalGroupSingle = Term.emit(
			Term.list([
				Term.string("("),
				Term.term("Indent", scope),
				Term.term("Term", scope),
				Term.term("Unindent", scope),
				Term.string(")"),
			]),
			([open, indent, inner]) => inner.output,
		)
		
	}
}


//=======//
// Mouse //
//=======//
{

	const Mouse = Habitat.Mouse = {
		position: [undefined, undefined],
	}
	
	const buttonMap = ["Left", "Middle", "Right", "Back", "Forward"]
	
	Reflect.defineProperty(Mouse, "install", {
		value(global) {
			global.Mouse = Mouse
			global.addEventListener("mousedown", e => {
				const buttonName = buttonMap[e.button]
				Mouse[buttonName] = true
			})
			
			global.addEventListener("mouseup", e => {
				const buttonName = buttonMap[e.button]
				Mouse[buttonName] = false
			})
			
			global.addEventListener("mousemove", e => {
				Mouse.position[0] = event.clientX
				Mouse.position[1] = event.clientY
			})
			
			Reflect.defineProperty(Mouse, "installed", {
				value: true,
				configurable: true,
				enumerable: false,
				writable: true,
			})
		},
		configurable: true,
		enumerable: false,
		writable: true,
	})
	
}


//========//
// Number //
//========//
{
	
	const install = (global) => {
		
		Reflect.defineProperty(global.Number.prototype, "to", {
			value: function* (v) {
				let i = this.valueOf()
				if (i <= v) {
					while (i <= v) {
						yield i
						i++
					}
				}
				else {
					while (i >= v) {
						yield i
						i--
					}
				}
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Habitat.Number.installed = true
		
	}
	
	Habitat.Number = {install}
	
}

//========//
// Object //
//========//
{
	Habitat.Object = {}
	Habitat.Object.install = (global) => {
		
		Reflect.defineProperty(global.Object.prototype, Symbol.iterator, {
			value: function*() {
				for (const key in this) {
					yield this[key]
				}
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Reflect.defineProperty(global.Object.prototype, "keys", {
			value() {
				return Object.keys(this)
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Reflect.defineProperty(global.Object.prototype, "values", {
			value() {
				return Object.values(this)
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Reflect.defineProperty(global.Object.prototype, "entries", {
			value() {
				return Object.entries(this)
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Habitat.Object.installed = true
		
	}
	
}

//==========//
// Property //
//==========//
{
	
	const install = (global) => {
	
		Reflect.defineProperty(global.Object.prototype, "_", {
			get() {
				return new Proxy(this, {
					set(object, propertyName, descriptor) {
						Reflect.defineProperty(object, propertyName, descriptor)
					},
					get(object, propertyName) {
						const editor = {
							get value() {
								const descriptor = Reflect.getOwnPropertyDescriptor(object, propertyName) || {}
								const {value} = descriptor
								return value
							},
							set value(value) {
								const {enumerable, configurable, writable} = Reflect.getOwnPropertyDescriptor(object, propertyName) || {enumerable: true, configurable: true, writable: true}
								const descriptor = {value, enumerable, configurable, writable}
								Reflect.defineProperty(object, propertyName, descriptor)
							},
							get get() {
								const descriptor = Reflect.getOwnPropertyDescriptor(object, propertyName) || {}
								const {get} = descriptor
								return get
							},
							set get(get) {
								const {set, enumerable, configurable} = Reflect.getOwnPropertyDescriptor(object, propertyName) || {enumerable: true, configurable: true}
								const descriptor = {get, set, enumerable, configurable}
								Reflect.defineProperty(object, propertyName, descriptor)
							},
							get set() {
								const descriptor = Reflect.getOwnPropertyDescriptor(object, propertyName) || {}
								const {set} = descriptor
								return set
							},
							set set(set) {
								const {get, enumerable, configurable} = Reflect.getOwnPropertyDescriptor(object, propertyName) || {enumerable: true, configurable: true}
								const descriptor = {get, set, enumerable, configurable}
								Reflect.defineProperty(object, propertyName, descriptor)
							},
							get enumerable() {
								const descriptor = Reflect.getOwnPropertyDescriptor(object, propertyName) || {}
								const {enumerable} = descriptor
								return enumerable
							},
							set enumerable(v) {
								const descriptor = Reflect.getOwnPropertyDescriptor(object, propertyName) || {configurable: true, writable: true}
								descriptor.enumerable = v
								Reflect.defineProperty(object, propertyName, descriptor)
							},
							get configurable() {
								const descriptor = Reflect.getOwnPropertyDescriptor(object, propertyName) || {}
								const {configurable} = descriptor
								return configurable
							},
							set configurable(v) {
								const descriptor = Reflect.getOwnPropertyDescriptor(object, propertyName) || {enumerable: true, writable: true}
								descriptor.configurable = v
								Reflect.defineProperty(object, propertyName, descriptor)
							},
							get writable() {
								const descriptor = Reflect.getOwnPropertyDescriptor(object, propertyName) || {}
								const {writable} = descriptor
								return writable
							},
							set writable(v) {
								const oldDescriptor = Reflect.getOwnPropertyDescriptor(object, propertyName) || {enumerable: true, configurable: true}
								const {get, set, writable, ...rest} = oldDescriptor
								const newDescriptor = {...rest, writable: v}
								Reflect.defineProperty(object, propertyName, newDescriptor)
							},
						}
						return editor
					},
				})
			},
			set(value) {
				Reflect.defineProperty(this, "_", {value, configurable: true, writable: true, enumerable: true})
			},
			configurable: true,
			enumerable: false,
		})
		
		
		Habitat.Property.installed = true
		
	}
	
	Habitat.Property = {install}
	
}

//========//
// Random //
//========//
{
	Habitat.Random = {}
	
	const maxId8 = 2 ** 16
	const u8s = new Uint8Array(maxId8)
	let id8 = maxId8
	const getRandomUint8 = () => {
		
		if (id8 >= maxId8) {
			crypto.getRandomValues(u8s)
			id8 = 0
		}
		
		const result = u8s[id8]
		id8++
		return result
	}
	
	Reflect.defineProperty(Habitat.Random, "Uint8", {
		get: getRandomUint8,
		configurable: true,
		enumerable: true,
	})
	
	const maxId32 = 2 ** 14
	const u32s = new Uint32Array(maxId32)
	let id32 = maxId32
	const getRandomUint32 = () => {
		
		if (id32 >= maxId32) {
			crypto.getRandomValues(u32s)
			id32 = 0
		}
		
		const result = u32s[id32]
		id32++
		return result
	}
	
	Reflect.defineProperty(Habitat.Random, "Uint32", {
		get: getRandomUint32,
		configurable: true,
		enumerable: true,
	})
	
	Habitat.Random.oneIn = (n) => {
		const result = getRandomUint32()
		return result % n === 0
	}
	
	Habitat.Random.maybe = (chance) => {
		return Habitat.Random.oneIn(1 / chance)
	}
	
	Habitat.Random.install = (global) => {
		global.Random = Habitat.Random
		global.oneIn = Habitat.Random.oneIn
		global.maybe = Habitat.Random.maybe
		Habitat.Random.installed = true
	}
	
}

//=======//
// Stage //
//=======//
{
	
	Habitat.Stage = {}
	Habitat.Stage.make = () => {
		
		const canvas = document.createElement("canvas")
		const context = canvas.getContext("2d")
		
		const stage = {
			canvas,
			context,
			update: () => {},
			draw: () => {},
			tick: () => {
				stage.update()
				stage.draw()
				requestAnimationFrame(stage.tick)
			},
		}
		
		requestAnimationFrame(stage.tick)
		return stage
	}
	
	Habitat.Stage.install = (global) => {
		global.Stage = Habitat.Stage
		Habitat.Stage.installed = true
		
	}
	
}

//======//
// Term //
//======//
{
	
	const Term = {}
	
	const makeLog = (result) => {
		const errors = []
		for (const child of result) {
			const childDebug = makeLog(child)
			errors.push(childDebug)
		}
		if (errors.length === 0) return result.error
		return [result.error, errors] 
	}
	
	const printTree = (value) => {
		if (typeof value === "string") {
			console.groupCollapsed(value)
			console.groupEnd()
			return
		}
		console.groupCollapsed(value[0])
		printTreeValue(value[1])
		console.groupEnd()
		
	}
	
	const printTreeValue = (value) => {
		for (const v of value) {
			if (typeof v === "string") console.log(v)
			else printTree(v)
		}
	}
	
	Term.result = ({success, source, output = source, tail, term, error = "", children = []} = {}) => {
		const self = (input, args) => {			
			const result = [...children]
			result.success = success
			result.output = output
			result.source = source
			result.tail = tail === undefined? input : tail
			result.term = term
			result.error = error
			
			result.input = input
			result.args = {...args}
			result.toString = function() { return this.output }
			result.log = () => {
				printTree(makeLog(result))
				return result
			}
			return result
		}
		return self
	}
	
	Term.succeed = (properties = {}) => Term.result({...properties, success: true})
	Term.fail    = (properties = {}) => Term.result({...properties, success: false})
	
	Term.string = (string) => {
		const term = (input, args = {}) => {
			const snippet = input.slice(0, term.string.length)
			const success = snippet === term.string
			if (!success) return Term.fail({
				term,
				error: `Expected '${term.string}' but found '${snippet}'`,
			})(input, args)
			return Term.succeed({
				source: term.string,
				tail: input.slice(term.string.length),
				term,
				children: [],
				error: `Found '${term.string}'`
			})(input, args)
		}
		term.string = string
		return term
	}
	
	Term.regExp = (regExp) => {
		const term = (input, args = {}) => {
			const finiteRegExp = new RegExp("^" + term.regExp.source + "$")
			let i = 0
			while (i <= input.length) {
				const snippet = input.slice(0, i)
				const success = finiteRegExp.test(snippet)
				if (success) return Term.succeed({
					source: snippet,
					tail: input.slice(snippet.length),
					term,
					children: [],
					error: `Found /${term.regExp.source}/ with '${snippet}'`,
				})(input, args)
				i++
			}
			return Term.fail({
				term,
				error: `Expected /${term.regExp.source}/ but found: '${input}'`,
			})(input, args)
		}
		term.regExp = regExp
		return term
	}
	
	Term.list = (terms) => {
		const self = (input, args) => {
			
			const state = {
				input,
				i: 0,
				args,
			}
			
			const results = []
			
			while (state.i < self.terms.length) {
				const term = self.terms[state.i]
				const result = term(state.input, state.args)
				results.push(result)
				if (!result.success) break
				else {
					state.input = result.tail
					state.args = result.args
				}
				state.i++
			}
			
			const success = state.i >= self.terms.length
			if (!success) {
				const error = `Expected list of ${self.terms.length} terms`
				return Term.fail({
					self,
					children: results,
					error,
				})(input, args)
			}
			
			const error = `Found list of ${self.terms.length} terms`
			return Term.succeed({
				output: results.map(result => result.output).join(""),
				source: results.map(result => result.source).join(""),
				tail: state.input,
				term: self,
				children: results,
				error,
			})(input, args)
			
		}
		self.terms = terms
		return self
	}
	
	Term.or = (terms) => {
		const self = (input, args = {exceptions: []}) => {
			
			const state = {i: 0}
			const exceptions = args.exceptions === undefined? [] : args.exceptions
			const results = []
			
			const terms = self.terms.filter(t => !exceptions.includes(t))
			
			while (state.i < terms.length) {
				const term = terms[state.i]
				const result = term(input, args)
				results.push(result)
				if (result.success) {
					return result
				}
				state.i++
			}
			
			return Term.fail({
				term: self,
				error: `Expected one of ${terms.length} terms`,
				children: results,
			})(input, args)
		}
		self.terms = terms
		return self
	}
	
	Term.maybe = (term) => {
		const self = (input, args) => {
			const result = self.term(input, args)
			if (!result.success) {
				result.success = true
				result.source = result.source === undefined? "": result.source
				result.output = result.output === undefined? "": result.output
			}
			result.error = `(Optional) ` + result.error
			return result
		}
		self.term = term
		return self
	}
	
	Term.many = (term) => {
		const self = (input, args) => {
			
			const state = {
				input,
				i: 0,
			}
			
			const results = []
			
			while (true) {
				const result = self.term(state.input, args)
				results.push(result)
				if (!result.success) break
				state.input = result.tail
				state.i++
			}
			
			const success = results.length > 1
			if (!success) {
				return Term.fail({
					term: self,
					children: results,
					error: `Expected multiple terms`,
				})(input, args)
			}
			
			return Term.succeed({
				output: results.map(result => result.output).join(""),
				source: results.map(result => result.source).join(""),
				tail: state.input,
				term: self,
				children: results,
				error: `Found ${results.length-1} terms`,
			})(input, args)
		}
		self.term = term
		return self
	}
	
	Term.emit = (term, func) => {
		const self = (input, args) => {
			const result = self.term(input, args)
			if (result.success) result.output = self.func(result)
			return result
		}
		self.term = term
		self.func = func
		return self
	}
	
	Term.error = (term, func) => {
		const self = (input, args) => {
			const result = self.term(input, args)
			result.error = self.func(result)
			return result
		}
		self.term = term
		self.func = func
		return self
	}
	
	Term.check = (term, func) => {
		const self = (input, args) => {
			const result = self.term(input, args)
			if (!result.success) return result
			const checkResult = self.func(result)
			if (checkResult) return result
			return Term.fail({
				term: self.term,
				children: result.children,
				error: `Failed check`,
			})(input, args)
		}
		self.term = term
		self.func = func
		return self
	}
	
	Term.eof = (input, args) => {
		if (input.length === 0) return Term.succeed({
			source: "",
			tail: "",
			term: Term.eof,
			error: `Found end of file`,
		})(input, args)
		return Term.fail({
			term: Term.eof,
			error: `Expected end of file but got '${input}'`,
		})(input, args)
	}
	
	Term.except = (term, exceptions) => {
		const self = (input, args = {}) => {
			const exceptions = args.exceptions === undefined? [] : args.exceptions
			return self.term(input, {...args, exceptions: [...exceptions, ...self.exceptions]})
		}
		self.term = term
		self.exceptions = exceptions
		return self
	}
	
	Term.any = (term) => {
		const self = (input, args = {exceptions: []}) => self.term(input, {...args, exceptions: []})
		self.term = term
		return self
	}
	
	const caches = new Map()
	Term.term = (key, object) => {
		
		let cache = caches.get(object)
		if (cache === undefined) {
			cache = {}
			caches.set(object, cache)
		}
		if (cache[key] !== undefined) {
			return cache[key]
		}
		
		const self = (input, args) => {
			
			const term = object[key]
			
			if (term === undefined) throw new Error(`[Habitat.Term] Unrecognised term: '${key}'`)
			const result = term(input, args)
			if (result.success) {
				result.error = `Found ${key}: ` + result.error
			}
			else {
				result.error = `Expected ${key}: ` + result.error
			}
			return result
		}
		
		cache[key] = self
		
		return self
	}
	
	Term.chain = (first, second) => {
		const self = (input, args) => {
			const firstResult = self.first(input, args)
			if (!firstResult.success) {
				//firstResult.error = `Expected translation: ` + firstResult.error
				return firstResult
			}
			
			const secondResult = self.second(firstResult.output, args)
			//secondResult.error = `Found translation: ` + firstResult.error + "\n\n" + secondResult.error
			return secondResult
			
		}
		self.first = first
		self.second = second
		return self
	}
	
	Habitat.Term = Term
	Habitat.Term.install = (global) => {
		global.Term = Habitat.Term	
		Habitat.Term.installed = true
	}
	
}


//=======//
// Touch //
//=======//
{

	const Touch = Habitat.Touch = []
	
	const trim = (a) => {
		if (a.length == 0) return a
		let start = a.length - 1
		let end = 0
		for (let i = 0; i < a.length; i++) {
			const value = a[i]
			if (value !== undefined) {
				start = i
				break
			}
		}
		for (let i = a.length - 1; i >= 0; i--) {
			const value = a[i]
			if (value !== undefined) {
				end = i + 1
				break
			}
		}
		a.splice(end)
		a.splice(0, start)
		return a
	}
	
	Reflect.defineProperty(Touch, "install", {
		value(global) {
			
			global.Touch = Touch
			global.addEventListener("touchstart", e => {
				for (const changedTouch of e.changedTouches) {
					const x = changedTouch.clientX
					const y = changedTouch.clientY
					const id = changedTouch.identifier
					if (Touch[id] === undefined) Touch[id] = [undefined, undefined]
					const touch = Touch[id]
					touch[0] = x
					touch[1] = y
				}
			})
			
			global.addEventListener("touchmove", e => {
				for (const changedTouch of e.changedTouches) {
					const x = changedTouch.clientX
					const y = changedTouch.clientY
					const id = changedTouch.identifier
					if (Touch[id] === undefined) Touch[id] = {position: [undefined, undefined]}
					const touch = Touch[id]
					touch.position[0] = x
					touch.position[1] = y
				}
			})
			
			global.addEventListener("touchend", e => {
				for (const changedTouch of e.changedTouches) {
					const id = changedTouch.identifier
					Touch[id] = undefined
				}
				trim(Touch)
			})
			
			
			Reflect.defineProperty(Touch, "installed", {
				value: true,
				configurable: true,
				enumerable: false,
				writable: true,
			})
		},
		configurable: true,
		enumerable: false,
		writable: true,
	})
	
	
}


//======//
// Type //
//======//
{

	const Int = {
		check: (n) => n % 1 == 0,
		convert: (n) => parseInt(n),
	}

	const Positive = {
		check: (n) => n >= 0,
		convert: (n) => Math.abs(n),
	}

	const Negative = {
		check: (n) => n <= 0,
		convert: (n) => -Math.abs(n),
	}

	const UInt = {
		check: (n) => n % 1 == 0 && n >= 0,
		convert: (n) => Math.abs(parseInt(n)),
	}

	const UpperCase = {
		check: (s) => s == s.toUpperCase(),
		convert: (s) => s.toUpperCase(),
	}

	const LowerCase = {
		check: (s) => s == s.toLowerCase(),
		convert: (s) => s.toLowerCase(),
	}

	const WhiteSpace = {
		check: (s) => /^[ |	]*$/.test(s),
	}

	const PureObject = {
		check: (o) => o.constructor == Object,
	}

	const Primitive = {
		check: p => p.is(Number) || p.is(String) || p.is(RegExp) || p.is(Symbol),
	}
	
	const install = (global) => {
	
		global.Int = Int
		global.Positive = Positive
		global.Negative = Negative
		global.UInt = UInt
		global.UpperCase = UpperCase
		global.LowerCase = LowerCase
		global.WhiteSpace = WhiteSpace
		global.PureObject = PureObject
		global.Primitive = Primitive
	
		Reflect.defineProperty(global.Object.prototype, "is", {
			value(type) {
				if ("check" in type) {
					try { return type.check(this) }
					catch {}
				}
				try   { return this instanceof type }
				catch { return false }
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Reflect.defineProperty(global.Object.prototype, "as", {
			value(type) {
				if ("convert" in type) {
					try { return type.convert(this) }
					catch {}
				}
				return type(this)
			},
			configurable: true,
			enumerable: false,
			writable: true,
		})
		
		Habitat.Type.installed = true
		
	}
	
	Habitat.Type = {install, Int, Positive, Negative, UInt, UpperCase, LowerCase, WhiteSpace, PureObject, Primitive}
	
}