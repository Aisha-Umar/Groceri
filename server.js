const express = require('express')
const cors = require('cors')
const app = express()
const routes = require('./routes')
const path = require("path")
const mongoose = require('mongoose')
require('dotenv').config()

app.use(express.json())
app.use(express.static('public'))
app.use(cors())
app.use('/', routes)
app.use('/api', routes)

app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))

const uri = process.env.MONGO_URI
const PORT = process.env.PORT || 3000

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB (GroceriDB) with Mongoose!");
  } catch (err) {
    console.error("❌ Connection error:", err);
  }
}
run();

app.listen(PORT, () =>{
    console.log(`server running on http://localhost:${PORT}`)
})