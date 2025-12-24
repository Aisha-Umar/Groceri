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

const form = document.getElementById('addItemForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Grab values from inputs
  const item = document.getElementById('itemName').value;
  const quantity = document.getElementById('itemQty').value;
  const store = document.getElementById('itemStore').value;
  const note = document.getElementById('itemNote').value;

  try {
    // Send to server
    const res = await fetch('/api/saveItem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials:'same-origin',
      body: JSON.stringify({ item, quantity, store, note })
    });

    if (!res.ok) throw new Error('Save item failed');

    const newItem = await res.json(); // get saved item from server

    // Clear inputs for next entry
    form.reset();

    // Dynamically create list element
    renderNewListItem(newItem);

  } catch (err) {
    console.error(err);
    alert('Failed to save item. Check console.');
  }
});

function renderNewListItem(newItem) {
  // Find the right store list container
  let itemList = document.querySelector('.item-list');

  // If the store group doesn't exist yet, create it
  if (!itemList) {
    const storeGroup = document.createElement('div');
    storeGroup.classList.add('store-group');
    storeGroup.dataset.store = newItem.store;

    const header = document.createElement('h3');
    header.classList.add('store-header');
    header.textContent = `🛒 ${newItem.store}`;

    itemList = document.createElement('ul');
    itemList.classList.add('item-list');

    storeGroup.appendChild(header);
    storeGroup.appendChild(itemList);
    document.querySelector('.content').appendChild(storeGroup);
  }

  // Create the list item
  const li = document.createElement('li');
  li.classList.add('list-item');
  li.dataset.store = newItem.store;

  li.innerHTML = `
    <input type="checkbox" class="item-checkbox" data-id="${newItem._id}">
    <label for="item-${newItem._id}" class="item-details">
      <span class="emoji"></span>${newItem.item}
    </label>
    <span class="item-info">${newItem.quantity}</span>
    ${newItem.note ? `<span class="item-note">${newItem.note}</span>` : ''}
    <i class="fas fa-pencil-alt edit-icon"></i>
  `;

  itemList.appendChild(li);
}

            
//===================== EDIT AN ITEM =======================//

// const itemList = document.querySelector(".item-list");

itemList.addEventListener("click", (e) =>{
//get item being edited
if (e.target.classList.contains("edit-icon")) {
  const li = e.target.closest(".list-item");
  const itemBeingEdited = li.dataset.item;
  const itemId = li.dataset.id;
  openModal()
  //select input in modal
  const itemName = document.getElementById("itemName");
  itemName.value = itemBeingEdited;

const saveBtn = document.querySelector(".btn-primary");
saveBtn.addEventListener("click", async (e) => {
  //send itemBeingEdited and itemBeingEditedId to the editItem controller
  try {
    const res = await fetch("/api/editItem", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ itemBeingEdited, itemId }),
    });
    if (!res.ok) throw new Error("Edit failed");
    const updatedItem = await res.json();
    li.querySelector('.item-details').innerText = updatedItem;
  } catch (err) {
    alert("Failed to update item.");
  }
});
}
  });
  
  