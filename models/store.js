const mongoose = require ('mongoose')

const storeSchema = new mongoose.Schema({
    store:{
        type:String,
        required:true,
        trim:true
    }
})

const Store = mongoose.model('Store', storeSchema)
module.exports = Store