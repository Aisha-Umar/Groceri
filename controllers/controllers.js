const Grocery = require("../models/item.js")
const User = require("../models/user.js")
const Pantry = require("../models/pantry.js")

//Get landing page
exports.getLanding = async(req, res) => {
  try{
    await res.render('landing')
  } catch(err){
    res.status(500).json({ message: err.message})
  }
}

// Get all items
exports.getDashboard = async (req, res) => {
  try {
  const storedItems = await Grocery.find().sort({ order: 1 }); // ascending order
  await res.render('dashboard', {storedItems})
} catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new item
exports.saveItem = async (req, res) => {
const userId = req.user.id
    
const { item,quantity,store,note } = req.body;
  try {
    let savedItem = await Grocery.create({ user:userId, item:item,quantity:quantity,store:store,note:note});
    res.status(201).json(savedItem)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit an item
exports.editItem = async (req, res) => {
  try {
    const { itemBeingEdited, newItem } = req.body;
    console.log(req.body)
    await Grocery.findOneAndUpdate({ item: itemBeingEdited }, { item: newItem });
    const storedItems = await Grocery.find();
    //res.json({ storedItems });
    res.render('dashboard', {storedItems})
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const { item } = req.body;
    await Grocery.deleteOne({ item });
    const storedItems = await Grocery.find();
    console.log('Item deleted')
    //res.json({ storedItems });
    res.render('dashboard', {storedItems})
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.saveOrder = async (req, res) => {
  try{
    const {orderedList} = req.body
    console.log("Received orderedList:", orderedList)
    for(const{id, order} of orderedList){
      console.log("Looping:", id, order)
     const result = await Grocery.updateOne({_id:id},{order})
      console.log(`Updating ${id} → order ${order}:`, result)
    }
      const storedItems = await Grocery.find().sort({order:1})
      console.log(`This is the order after sorting by order ${storedItems}`)
     // res.status(200).json({ message: "Order updated"})
      res.render('dashboard', {storedItems})
  } catch(err){
    res.status(500).json({ message: err.message})
  }
}

exports.getAllItems = async (req, res) =>{
  try{
  const allItems = await Pantry.find({user:req.user.id})
  res.json(allItems)
}catch(err){
  res.status(500).json({message: err.message})
}
}

exports.moveToPantry = async (req, res) =>{
  try{
  const allItemsToAdd = req.body.items.map(item =>({
    ...item, userId: req.user.id
  }))
  await Pantry.insertMany(allItemsToAdd)
} catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
}