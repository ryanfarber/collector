// test.js


const Collector = require("../src")
const collector = new Collector({
	name: "test",
	savePath: "../tmp"
})


// console.log(collector)

let array = [1,2,3,56,2,67,7,235,34]
collector.push("testicles", 1)
// collector.add("ex", ...array)
// collector.push("boopers", ...array)

console.log(collector.get())