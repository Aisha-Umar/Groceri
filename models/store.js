const mongoose = require ('mongoose')

const storeSchema = new mongoose.Schema({
    storeName:{
        type:String,
        required:true,
        trim:ture
    }
})

const Store = mongoose.model('Store', storeSchema)
module.exports = Store