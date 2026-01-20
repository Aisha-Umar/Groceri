// --- MODAL LOGIC ---
// 1. Target the NEW button using its class
const addItemBtn1 = document.querySelector(".add-item-button");
const addItemBtn2 = document.querySelector(".nav-item.add-item"); // Your footer plus button
const modalOverlay = document.getElementById("addItemModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");


let editingItemId = null;
let editingLi = null;
let mode = "add";

// Function to open modal
function openModal() {
  modalOverlay.classList.add("active");
}

// Function to close modal
function closeModal() {
  modalOverlay.classList.remove("active");
}

// Event Listeners
if (addItemBtn1) addItemBtn1.addEventListener("click", openModal);
if (addItemBtn2) addItemBtn2.addEventListener("click", openModal);
if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

// Close if clicking outside the modal card (on the blurred background)
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

//===================== EDIT AN ITEM =======================//
const itemList = document.querySelector(".item-list");
if(itemList){ 
itemList.addEventListener("click", (e) => {
  //get item being edited
  if (!e.target.classList.contains("edit-icon")) return
    li = e.target.closest(".list-item");

    editingItemId = li.dataset.id;
    editingLi = li;
    mode = "edit";

    //select input in modal
    document.getElementById("itemName").value = li.dataset.item;
    document.getElementById("itemQty").value =
      li.querySelector(".item-info").innerText;

      openModal()
});
}
//==================== FORM SUBMISSION FOR EDITING AND ADDING ITEM ==================//

const form = document.getElementById("addItemForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Grab values from inputs
  const item = document.getElementById("itemName").value;
  const quantity = document.getElementById("itemQty").value;
  const store = document.getElementById("itemStore").value;
  const lastsWeeks = document.getElementById("weeksLasting").value;

  try {
    //------------------- ADD ITEM ---------------------
    if(mode === 'add'){
    // Send to server
    const res = await fetch("/api/saveItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ item, quantity, store, lastsWeeks }),
    });

    if (!res.ok) throw new Error("Save item failed");

    const newItem = await res.json(); // get saved item from server

    // Clear inputs for next entry
    form.reset();

    // Dynamically create list element
    renderNewListItem(newItem);
    }

    //--------------------- EDIT ITEM ----------------------------

    if (mode === "edit") {
      const item = document.getElementById("itemName").value;
      const quantity = document.getElementById("itemQty").value;
      console.log("EDIT MODE:", {
        mode,
        editingItemId,
        item,
        quantity,
      });

      const res = await fetch("/api/editItem", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          editedItem: item,
          quantity,
          itemId: editingItemId,
        }),
      });
      if (!res.ok) throw new Error("Edit failed");
      const updatedItem = await res.json();
      editingLi.querySelector(".item-details").innerText = updatedItem.item;
      editingLi.dataset.item = updatedItem.item;
      editingLi.querySelector(".item-info").innerText = updatedItem.quantity;
    }

    form.reset()
    closeModal()

  } catch (err) {
    console.error(err);
    alert("Opertaion failed");
  }
});



function renderNewListItem(newItem) {
  // Find the right store list container
  
  let itemList = document.querySelector(".item-list");

  // If the store group doesn't exist yet, create it
  if (!itemList) {
    const storeGroup = document.createElement("div");
    storeGroup.classList.add("store-group");
    storeGroup.dataset.store = newItem.store;

    const header = document.createElement("h3");
    header.classList.add("store-header");
    header.textContent = `🛒 ${newItem.store}`;

    itemList = document.createElement("ul");
    itemList.classList.add("item-list");

    storeGroup.appendChild(header);
    storeGroup.appendChild(itemList);
    document.querySelector(".content").appendChild(storeGroup);
  }

  // Create the list item
  const li = document.createElement("li");
  li.classList.add("list-item");
  li.dataset.store = newItem.store;

  li.innerHTML = `
    <input type="checkbox" class="item-checkbox" data-id="${newItem._id}">
    <label for="item-${newItem._id}" class="item-details">
      <span class="emoji"></span>${newItem.item}
    </label>
    <span class="item-info">${newItem.quantity}</span>
    ${newItem.weeksLasting ? `<span class="item-note">${newItem.lastsWeeks}</span>` : ""}
    <i class="fas fa-pencil-alt edit-icon"></i>
  `;

  itemList.appendChild(li);
}
