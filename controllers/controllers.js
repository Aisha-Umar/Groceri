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

exports.getPantryItems = async (req, res) =>{
  try{
  const allItems = await Pantry.find({user:req.user.id})
  res.json({pantryItems:allItems})
}catch(err){
  res.status(500).json({message: err.message})
}
}

exports.moveToPantry = async (req, res) => {
  try {
    const { selectedItemIds } = req.body;

    if (!selectedItemIds || !selectedItemIds.length) {
      return res.status(400).json({ message: "No items selected" });
    }

    const items = await Grocery.find({ _id: { $in: selectedItemIds } });

    if (!items.length) {
      return res.status(404).json({ message: "No items found" });
    }

    const addedPantryItems = await Pantry.insertMany(
      items.map((item) => ({
        item: item.item,
        quantity: item.quantity,
        user: item.user,
      }))
    );

    const itemIds = items.map((item) => item._id);
    await Grocery.deleteMany({ _id: { $in: itemIds } });

    res.status(200).json({ movedItems: addedPantryItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//============GET AI RECIPE SUGGESTIONS =====================

//get the pantry items
exports.getAiRecipes = async (req, res) => {
  try {
    const pantryItems = await Pantry.find({ user: req.user.id });
    const Items = pantryItems.map((item) => item.item);

    // If no pantry items, return empty recipes array
    if (!Items.length) {
      return res.status(200).json({ recipes: [] });
    }

    //write the prompt
    const prompt = `
I have the following pantry items: ${Items.join(", ")}.
Please suggest 3 recipes that I can make using only these ingredients.
Return the recipes in JSON format with these fields for each recipe:
- name
- ingredients (list)
- steps (list of instructions)
Keep the recipes simple and realistic.
`;

    // Ensure fetch is available (Node 18+ has global fetch, otherwise dynamic import node-fetch)
    const fetchFn = globalThis.fetch ?? (await import('node-fetch')).then(m => m.default);

    // Try a few common HTTP endpoints and payload shapes
    const endpoints = [
      { url: 'http://127.0.0.1:11434/v1/generate', body: { model: 'phi3', prompt: prompt, max_tokens: 500 } },
      { url: 'http://127.0.0.1:11434/v1/outputs', body: { model: 'phi3', input: prompt } },
    ];

    let text = null;

    for (const ep of endpoints) {
      try {
        const r = await fetchFn(ep.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ep.body),
        });

        if (!r.ok) {
          // try the next endpoint if 404 or other non-OK
          console.warn(`Endpoint ${ep.url} returned status ${r.status}`);
          continue;
        }

        const json = await r.json();

        // Extract text from known response shapes
        if (json.choices && json.choices.length) {
          const choice = json.choices[0];
          if (typeof choice.content === 'string') text = choice.content;
          else if (Array.isArray(choice.content)) text = choice.content.map((c) => c.text || '').join('');
          else text = JSON.stringify(choice.content);
        } else if (typeof json.text === 'string') {
          text = json.text;
        } else if (json.output || json.outputs) {
          // Some APIs return 'output' or 'outputs'
          const out = json.output ?? json.outputs;
          if (typeof out === 'string') text = out;
          else if (Array.isArray(out)) text = out.map(o => o?.content || o?.text || JSON.stringify(o)).join('\n');
          else text = JSON.stringify(out);
        } else {
          text = JSON.stringify(json);
        }

        // stop after we get a valid response
        if (text) break;
      } catch (fetchErr) {
        console.warn(`Fetch to ${ep.url} failed:`, fetchErr.message || fetchErr);
        continue;
      }
    }

    // Fallback to CLI if HTTP endpoints didn't return usable text
    if (!text) {
      try {
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);
        // Use JSON.stringify to safely quote the prompt argument
        const cmd = `ollama run phi3 ${JSON.stringify(prompt)}`;
        console.log('Falling back to CLI:', cmd.slice(0, 200));
        const { stdout, stderr } = await execAsync(cmd, { timeout: 15000 });
        if (stderr) console.warn('ollama stderr:', stderr);
        text = String(stdout || '').trim();
      } catch (cliErr) {
        console.error('Both HTTP and CLI attempts to call Ollama failed:', cliErr);
        throw new Error('Ollama not reachable via HTTP and CLI fallback failed');
      }
    }

    // Strip JSON code fences if present
    text = text.replace(/```(?:json)?\n?/g, '').replace(/```$/g, '').trim();

    // Try parse as JSON, otherwise return raw text (for debugging)
    let recipes;
    try {
      recipes = JSON.parse(text);
    } catch (parseErr) {
      console.warn('Failed to parse AI output as JSON:', parseErr);
      return res.status(200).json({ recipes: null, raw: text });
    }

    // Send parsed recipes
    return res.json({ recipes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get AI recipes" });
  }
}



