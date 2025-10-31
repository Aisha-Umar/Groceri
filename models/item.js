const mongoose = require('mongoose');

const grocerySchema = new mongoose.Schema({ 
    item:{ 
        type : String,
        required : true,
        trim: true 
    },
    order:{
        type:Number,
         default: 0, // so new items appear at the end if no order specified
        index: true  // speeds up sorting queries
}
})
const Grocery = mongoose.model('Grocery', grocerySchema)

module.exports = Grocery