const express = require('express')
const cors = require('cors')
const app = express()
const indexRoutes = require('./routes/index')
const authRoutes = require('./routes/auth')
const path = require("path")
require('dotenv').config()
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
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


app.use(cors())
app.use(express.static('public'))
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))


app.use('/', indexRoutes)
app.use('/', authRoutes)
app.use('/api', indexRoutes)


const uri = process.env.MONGO_URI
const PORT = process.env.PORT || 3000

// Connect to MongoDB with retry/backoff and only start server after successful connection
async function connectWithRetry(retries = 5, delay = 2000) {
  if (!uri) throw new Error('MONGO_URI not set')

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting MongoDB connection (attempt ${i + 1}/${retries})`)
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
      console.log('✅ Connected to MongoDB (GroceriDB) with Mongoose!')
      return
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err.message || err)
      if (i < retries - 1) {
        const wait = delay * Math.pow(2, i)
        console.log(`Retrying in ${wait}ms...`)
        await new Promise((r) => setTimeout(r, wait))
      } else {
        throw err
      }
    }
  }
}

async function start() {
  try {
    await connectWithRetry()
    app.listen(PORT, () => {
      console.log(`server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to connect to MongoDB after multiple attempts:', err)
    process.exit(1)
  }
}

start()