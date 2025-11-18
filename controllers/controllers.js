const Grocery = require("../models/item.js");

//Get landing page
exports.getLanding = async(req, res) => {
  try{
    await res.render('landing')
  } catch(err){
    res.status(500).json({ message: err.message})
  }
}

// Get all items
exports.getList = async (req, res) => {
  try {
    //const storedItems = await Grocery.find();
    const storedItems = await Grocery.find().sort({ order: 1 }); // ascending order
    //res.json({ storedItems });
    res.render('index', {storedItems})
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new item
exports.addItem = async (req, res) => {
  const { newItem } = req.body;
  if (!newItem) {
    return res.status(400).json({ message: "Item name is required" });
  }
  try {
    await Grocery.create({ item: newItem });
    const storedItems = await Grocery.find();
    //res.json({ storedItems });
    res.render('index', {storedItems})
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
    res.render('index', {storedItems})
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
    res.render('index', {storedItems})
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

console.log('Controller triggered!')
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
      res.render('index', {storedItems})
  } catch(err){
    res.status(500).json({ message: err.message})
  }
}

exports.getSignUp = async(req,res) => {
  try{
    await res.render('signup')
  } catch(err){
    res.status(500).json({ message: err.message})
  }
}

exports.getLogin = async(req,res) => {
  try{
    await res.render('login')
  } catch(err){
    res.status(500).json({ message: err.message})
  }
}

exports.signup = async(req,res) => {
  try{
    await User.create({username:req.body.name, email:req.body.email, password:req.body.password })
    return res.redirect('/login')
  }catch(err){
    return res.status(500).json({message:'Try Again'})
  }
}