const mongoose = require('mongoose')

const pantrySchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    item:{
        type:String,
        required:true,
        trim:true
    },
    quantity: {
        type:Number,
        default:1
    },
    weeksLasting:{
        type:Number
    }
  }, {timestamps: true})

const Pantry = mongoose.model('Pantry',pantrySchema)
module.exports = Pantry