// --- MODAL LOGIC ---
// 1. Target the NEW button using its class
const addItemBtn1 = document.querySelector('.add-item-button');
const addItemBtn2 = document.querySelector('.nav-item.add-item'); // Your footer plus button
const modalOverlay = document.getElementById('addItemModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const saveItemBtn = document.getElementById('saveItemBtn');

// Function to open modal
function openModal() {
    modalOverlay.classList.add('active');
}

// Function to close modal
function closeModal() {
    modalOverlay.classList.remove('active');
}

// Event Listeners
// **This is the connection point for your new button**
    if(addItemBtn1) addItemBtn1.addEventListener("click", openModal);

    if(addItemBtn2) addItemBtn2.addEventListener('click', openModal);
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if(cancelBtn) cancelBtn.addEventListener('click', closeModal);

// Close if clicking outside the modal card (on the blurred background)
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Save Button logic
    saveItemBtn.addEventListener('click', async(e) => {
         const item = document.getElementById('itemName').value
         const store = document.getElementById('itemStore').value
         const quantity = document.getElementById("itemQty").value
         const note = document.getElementById("itemNote").value

            try{
                const res = await fetch('/api/saveItem', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body:JSON.stringify({item,quantity,store,note})
                })
                if(!res.ok){ 
                    throw new Error("Save item failed.")
                }
                const newItem = await res.json()
                closeModal()
                // Clear inputs for the next entry
                itemNameInput.value = '';
                itemQtyInput.value = '1';
                itemStoreSelect.value = 'Walmart'; 
                itemNoteInput.value = '';
                renderNewListItem(newItem)
                function renderNewListItem(newItem){
                    const itemList = document.querySelector('.item-list')
                    const liItem = document.createElement('li')
                    liItem.classList.add('.list-item')
                    liItem.textContent = newItem
                    itemList.append(liItem)
                }
            }
             catch(err){
               console.error('Error:',err)
               alert("Failed to save item. Check console for details")
            }
        })
    
            
