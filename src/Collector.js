// Collector.js

const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const path = require("path")
const fs = require("fs")
const logger = console



class Collector {
	constructor(config = {}) {

		if (!config.savePath) throw new Error(`please input a filepath for where the collector should save to`)

		this.name = undefined
		this.savePath = config.savePath
		this.dbPath = undefined

		if (config.name) this.name = `${config.name}_collector`
		else this.name = `collector_${Date.now()}`
		

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

			if (arguments.length == 1) throw new Error(`you must specify a key for the collector, and a value to push into it\ni.e. collector.push("items", "apple")`)
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
			if (!this.exists(key)) return logger.warn(`WARNING you are trying to clear key "${key}", but that does not exist`)
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


module.exports = Collector

