const express = require('express')
const cors = require('cors')
const app = express()
const indexRoutes = require('./routes/index')
const authRoutes = require('./routes/auth')
const path = require("path")
require('dotenv').config()
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
require("./config/passport")(passport)

app.use(express.urlencoded({extended:true}))
app.use(express.json())

//Sessions
app.use(session({
  secret:'keyboard cat',
  resave: false,
  saveUninitialized:false,
  cookie: { secure: false },
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Flash
app.use(flash())

//Make flash messages available in views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})



app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'))
app.use(cors())
app.use('/', indexRoutes)
app.use('/', authRoutes)
// app.use('/login', authroutes)
// app.use('/signup', authroutes)
app.use('/api', indexRoutes)


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