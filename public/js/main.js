const input = document.querySelector(".inputItem");
// const form = document.querySelector("form");
const list = document.querySelector(".groceryList");



  /*==================TOGGLE-BTN=================*/
    const toggleBtn = document.getElementById('menu-toggle');       // Hamburger icon
    const sidebar = document.getElementById('sidebar');             
    const closeBtn = document.getElementById('close-sidebar');      // The new 'X' icon

    // Single function to toggle the class
    const toggleSidebar = () => {
        sidebar.classList.toggle('active');
    };

    // 1. Open Button (Hamburger)
    if (toggleBtn) {
        toggleBtn.onclick = toggleSidebar;
    }
    
    // 2. Close Button (X icon)
    if (closeBtn) {
        closeBtn.onclick = toggleSidebar;
    }

/*======================SEARCH BAR==========================*/  
const inputSearch = document.getElementById("inputSearch");
//params: input
//return: word matched, word not matched, display msg
//apple -> apple found

inputSearch.addEventListener('keyup', getAllItems)
async function getAllItems() {
  //get input
  let input = inputSearch.value;
  //get pantry items
  let res = await fetch("../api/getAllItems", {
    method: 'GET',
    headers: { "Content-Type": "application/json" },
  });
  let data = await res.json();
  //filter pantry with each input value
      Array.from(data).forEach(item =>{
        if(item.includes(input)){
          inputSearch.value=item
        }
        else if(item === input){
          //display item found
        }
        else{
          //display item not found
        }
      })
}

//==================== GET DASHBOARD WITH THE ITEMS LIST ============//









//=====================MOVE TO PANTRY ======================//
//select the checkboxes and the move to pantry button
const selectedCb = Array.from(document.querySelectorAll('.item-checkbox:checked'))
const moveToPantryBtn = document.querySelector('.move-to-pantry')

//go over the array of checkboxes, get item name and map into the array
const selectedItemIds = selectedCb.map(e =>{
  return e.dataset.id
})

//send to the moveToPantry controller
moveToPantryBtn.addEventListener('click', async(e) =>{
  try{
    const res = await fetch('/api/moveToPantry', {
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials:'same-origin',
      body: JSON.stringify({selectedItemIds})
    })
    if(!res.ok) throw new Error ('Adding to pantry failed.')
      const pantryItems = await res.json()
  }catch(err){
    console.error(err)
    alert('Failed to add item to pantry.')
  }
})








// list.addEventListener("click", (e) => {
//   if (e.target.closest(".btn-edit")) {
//     const li = e.target.closest("li");
//     itemBeingEdited = li.querySelector("span").textContent;
//     console.log(itemBeingEdited)
//     input.value = itemBeingEdited;
//     input.focus();
//   }
// })

// Form submit (add or edit)
// form.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const newItem = input.value.trim();
//   if (!newItem) return alert("Please enter an item name");

//   const url = itemBeingEdited ? "/api/editItem" : "/api/addItem";
//   const method = itemBeingEdited ? "PUT" : "POST";
//   const body = itemBeingEdited
//     ? JSON.stringify({ itemBeingEdited, newItem })
//     : JSON.stringify({ newItem });
//     console.log(itemBeingEdited,newItem)

//   try {
//     const res = await fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body,
//     });
//     if (!res.ok) throw new Error("Request failed");
//    location.reload(); // EJS refresh handles new list
//   } catch (err) {
//     console.error("Error:", err);
//   }
//   input.value=''
// });


//======================= DELETE ITEM =============================//

document.getElementById('deleteSelectedBtn').addEventListener('click', async () => {
  const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');

  if (checkedBoxes.length === 0) {
    alert('Select at least one item to delete.');
    return;
  }

  // Collect ids
  const ids = Array.from(checkedBoxes).map(cb => cb.dataset.id);
  try {
    const res = await fetch('/api/deleteItem', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials:'same-origin',
      body: JSON.stringify({ ids })
    });
    console.log(ids)
    if (!res.ok) throw new Error('Delete failed');

    // Remove from DOM
    checkedBoxes.forEach(cb => {
      cb.closest('li').remove();
    });

  } catch (err) {
    console.error(err);
    alert('Failed to delete items.');
  }
});




//make elements draggable
// let draggedItem = null;

// list.addEventListener("dragstart", (e) => {
//   draggedItem = e.target;
//   e.target.classList.add("dragging");
// });

// list.addEventListener("dragover", (e) => {
//   e.preventDefault(); // allows dropping
//   const afterElement = getDragAfterElement(list, e.clientY);
//   const dragging = document.querySelector(".dragging");
//   if (afterElement == null) {
//     list.appendChild(dragging);
//   } else {
//     list.insertBefore(dragging, afterElement);
//   }
// });

// list.addEventListener("drop", () => {
//   draggedItem.classList.remove("dragging");
//   draggedItem = null;
// });

// list.addEventListener("dragend", (e) => {
//   if (e.target.tagName === "LI") {
//     const orderedList = Array.from(list.querySelectorAll("li")).map((li, index) => ({
//       id: li.dataset.id,
//       order:Number(index),
//     }));
//     console.log(orderedList)
//     orderList(orderedList);
//   }
// });

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

//update ordered dragged list

async function orderList(orderedList){
try{
  console.log('Sending order:', orderedList)
  const res = await fetch('/api/saveOrder',{
  method:'PUT',
  headers:{"Content-Type":"application/json"},
  body: JSON.stringify({orderedList}),
})
if(!res.ok) throw new Error('Update failed')
 console.log("Order saved!")
 //location.reload()
}catch(err){
  console.error('Error:',err)
}
}

//================= FILTER BY STORES =================================//  
const selectStore = document.getElementById('store-select');

selectStore.addEventListener('change', (e) => {
  const selectedStore = e.target.value.toLowerCase();
  const items = document.querySelectorAll('.list-item');

  items.forEach(item => {
    const itemStore = item.dataset.store.toLowerCase();

    if (selectedStore === 'all' || itemStore === selectedStore) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
});





