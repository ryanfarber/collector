// Collector.js

const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const path = require("path")
const fs = require("fs")
const kindof = require("kind-of")
const Logger = require("@ryanforever/logger").v2
const logger = new Logger("collector", {debug: false})





class Collector {
	constructor(config = {}) {

		if (!config.savePath) throw new Error(`please input a filepath for where the collector should save to`)

		this.name = config.name || `collector_${Date.now()}`
		this.savePath = config.savePath
		this.dbPath = undefined
		

		if (!fs.existsSync(this.savePath)) fs.mkdirSync(this.savePath)
		let filename = `${this.name}.json`
		this.dbPath = path.join(this.savePath, filename)

		// init db
		const adapter = new FileSync(this.dbPath)
		const db = low(adapter)

		// set defaults
		db.defaults({name: this.name, dbPath: this.dbPath, createdAt: new Date(), updatedAt: new Date(), counts: {}, data: {}}).write()

	
		// push data into a collector
		this.push = function(key, ...data) {
			let keypath = `data.${key}`
			if (!this.has(key)) db.set(keypath, []).write()
			let ts = new Date()

			db.get(keypath).push(...data).write()

			let count = this.db.get(`counts.${key}`).value()
			if (count == undefined) count = 0
			let newCount = count += data.length
			this.counts[key] = newCount
			db.set(`counts.${key}`, newCount).write()
		}

		// get all, or get a single collector
		this.get = function(key) {
			if (key) return this.db.get(keypath(key)).value()
			else return db.get("data").value() 
		}

		// has collector
		this.has = function(key) {
			return db.has(keypath(key)).value()
		}

		// clear one or all collectors
		this.clear = function(key) {
			if (!this.exists(key)) return logger.warn(`you are trying to clear key "${key}", but that does not exist`)
			if (key) db.set(keypath(key), []).write()
			else db.set("data", {}).write()
		}

		// delete db JSON file
		this.delete = function() {
			if (fs.existsSync(this.dbPath)) fs.unlinkSync(this.dbPath)
		}

		// form keypath i.e. data.items
		function keypath(key) {
			return `data.${key}`
		}


		Object.defineProperties(this, {
			add: {value: this.push},
			exists: {value: this.has},
			getAll: {value: () => this.get()},
			db: {value: db, enumerable: false},
			counts: {
				get() {return db.get("counts").value()}
			}
		})

	}

}


const collector = new Collector({
	name: "test",
	savePath: "./tmp"
})


// console.log(collector)

let array = [1,2,3,56,2,67,7,235,34]
collector.add("tests", ...array)
collector.add("ex", ...array)
collector.push("boopers", ...array)
// collector.push("testa", 1)
// console.log(collector)


// console.log(collector.getAll())



// collector.db.set("hey.booper", 2).write()


// console.log(collector.getAll())

// console.log(collector.counts())

// collector.delete()

// collector.clear("boopers")

console.log(collector.counts)

