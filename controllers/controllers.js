const Grocery = require("../models/Grocery");

// Get all items
exports.getList = async (req, res) => {
  try {
    const storedItems = await Grocery.find();
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
    //res.json({ storedItems });
    res.render('index', {storedItems})
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
