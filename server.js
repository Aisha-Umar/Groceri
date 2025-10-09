const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose');
const uri = "mongodb+srv://ayshau:ashsWorld@cluster0.qfb1bcj.mongodb.net/GroceriDB?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB (GroceriDB) with Mongoose!");
  } catch (err) {
    console.error("❌ Connection error:", err);
  }
}
run();

const grocerySchema = new mongoose.Schema({ item: String })
const Grocery = mongoose.model('Grocery', grocerySchema)


app.use(express.json())
app.use(express.static('public'))
app.use(cors())

app.get('/api/getList', async(req,res) => {
 try{
  let storedItems = await Grocery.find()
  res.json(storedItems)  
 }
 catch(err){
  res.status(500).json({ message: err.message })
 }
})


app.post('/api/addItem', async (req, res) => {
  try {
    let { newItem } = req.body

    // create and save new item
    await Grocery.create({ item: newItem })

    // fetch all items
    const allItems = await Grocery.find()

    res.json({ success: true, storedItems: allItems })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: 'Database error' })
  }
})


app.delete('/api/deleteItem', (req,res) => {
    let {item} = req.body
    if(storedItems.includes(item)){
        storedItems = storedItems.filter(e => e !== item)
    }
    res.json({success:true, storedItems})
   // console.log(storedItems)
})

app.put('/api/editItem', (req, res) => {
  const { itemBeingEdited, newItem } = req.body

  storedItems = storedItems.map(item =>
    item === itemBeingEdited ? newItem : item
  )

  res.json({ success: true, storedItems })
})




app.listen(PORT, () =>{
    console.log(`server running on http://localhost:${PORT}`)
})