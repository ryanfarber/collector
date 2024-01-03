# collector
 
A persistant collector, useful when making long polling requests for data.  This will continuously write data to a local JSON file, to persist, even in the event of network errors, or anything else that would normall cause you to loose the data in memory.

```javascript
const Collector = require("@ryanforever/collector")
const collector = new Collector({
	name: "test",
	savePath: "../tmp"
})

longPollingFunction.on("data", data => {
	collector.push(data)

	// if data is an array
	collector.push(...data)
})

longPollingFunction.on("done", () => {
	let result = collector.get()
	console.log(result)
})
```


## methods
```javascript
collector.push("key", value) // will create a new key if not exist, and push data into it
collector.add("key", value) // alias for .push()

collector.get("key") // get collector by key
collector.get() // get all collector arrays

collector.has("key") // returns true if key exists

collector.clear("key") // clear a single collector array
collector.clear() // clear all collector arrays

collector.delete() // ⚠️ deletes the actual json file of the collector
```