const express = require('express')
const cors = require('cors')
const app = express()
const routes = require('./routes')
const path = require("path")
require('dotenv').config()
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

app.use(session({
  secret:'keyboard cat',
  resave: false,
  saveUninitialized:false
}))

app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
app.use(cors())

app.use('/', require('./routes/auth'))
app.use('/', routes)
app.use('/login', routes)
app.use('/signup', routes)
app.use('/api', routes)



const uri = process.env.MONGO_URI
const PORT = process.env.PORT || 3000

async function run() {
  try {
    //console.log("🔍 MONGO_URI:", uri);
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