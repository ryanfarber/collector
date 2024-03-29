# collector
 
A persistant collector, useful when making long polling requests for data.  This will continuously write data to a local JSON file, to persist, even in the event of network errors, or anything else that would cause you to loose data if it was in-memory.

```javascript
const Collector = require("@ryanforever/collector")
const collector = new Collector({
	name: "test",
	savePath: "../tmp"
})

longPollingFunction.on("data", data => {
	collector.push("items", data) // push data with a key and value. collector will save it to the JSON file
	collector.push("items" ...data) // if data is an array
})

longPollingFunction.on("done", () => {
	let result = collector.get() // get 
	console.log(result)
	collector.delete() // delete the collector's json file
})
```

## usage

Initialize the collector.  This will create a JSON file at `../temp/test_collector.json`
```javascript
const Collector = require("@ryanforever/collector")
const collector = new Collector({
	name: "test",
	savePath: "../tmp"
})
````

Push data into a collector
```javascript
// push an array of items in, using the spread operator.  same functionality as javascripts Array.prototype.push
let arrayOfItems = ["apple", "orange", "banana", "pear"]
collector.push("items", ...arrayOfItems)

// push a single item
collector.push("items", "strawberry")
````

Get data from collector
```javascript
// get a single collector
let items = collector.get("items")

// get all collectors
let allCollectorData = collector.get()
````

---

## methods
```javascript
collector.push("key", value) // will create a new key if not exist, and push data into it
collector.add("key", value) // alias for .push()

collector.get("key") // get collector array by key
collector.get() // get all collector arrays

collector.has("key") // returns true if key exists

collector.clear("key") // clear a single collector array
collector.clear() // clear all collector arrays

collector.delete() // ⚠️ deletes the actual JSON file of the collector
```