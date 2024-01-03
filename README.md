# collector
 

A persistant collector, useful when making long requests for data.  This will continuously write data to a local JSON file, to persist, even in the event of network errors, or anything else that would normall cause you to loose the data in memory.

```javascript
const Collector = require("@ryanforever/collector")
const collector = new Collector({
	name: "test",
	savePath: "../tmp"
})

let requests = [
	axios.get("https://example.com/data/1").then(res => collector.push(res.data),
	axios.get("https://example.com/data/2").then(res => collector.push(res.data),
	axios.get("https://example.com/data/3").then(res => collector.push(res.data)
]

let result = await Promise.all(requests)

console.log(collector.get())
```