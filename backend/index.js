const connectToMongoDB = require("./database.js")
const express = require("express")
const cors = require("cors")

connectToMongoDB();

const app = express()
const host = "0.0.0.0"
const port = 5000

app.use(cors())
app.use(express.json())

// Available Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/note", require("./routes/note"))

app.get("/", (req, res) => {
	// console.log(res)
	res.send("Welcome to Notes App.")
})

app.listen(port, host, () => {
	console.log(`Server listening at http://localhost:${port}`)
})
