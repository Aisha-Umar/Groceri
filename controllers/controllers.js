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
    const { editedItem, quantity, itemId } = req.body;

    const updatedItem = await Grocery.findOneAndUpdate(
      { _id: itemId, user: req.user.id }, // ✅ ownership check
      { item:editedItem, quantity:quantity },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to edit item' });
  }
};


// Delete an item
exports.deleteItem = async (req, res) => {
  const userId = req.user.id
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'No items selected' });
  }
  await Grocery.deleteMany({ _id: { $in: ids }, user: userId                                                                                                                  });
  res.json({ success: true });
}

// Save order of items
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

exports.moveToPantry = async (req, res) => {
  try {
    const { selectedItemIds } = req.body;
    const items = await Grocery.find({ _id: { $in: selectedItemIds } });
    const addedPantryItems = await Pantry.insertMany(items);
    res.json(addedPantryItems);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};