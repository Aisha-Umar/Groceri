const mongoose = require('mongoose');

const grocerySchema = new mongoose.Schema({ 
    item:{ 
        type : String,
        required : true,
        trim: true 
    }
})
const Grocery = mongoose.model('Grocery', grocerySchema)

module.exports = Grocery