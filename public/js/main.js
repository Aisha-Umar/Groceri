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

let allPantryItems = [];

//======== Get pantry items ==================
//get pantry items
async function getAllPantryItems() {
  try {
    let res = await fetch("/api/getPantryItems", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Could not get pantry items");
    const data = await res.json();
    allPantryItems = data.pantryItems;
  } catch (err) {
    console.error(err);
  }
}

getAllPantryItems();

const inputSearch = document.getElementById("inputSearch");

const handleSearch = (e) => {
  const searchItem = e.target.value.trim().toLowerCase();
  if (!allPantryItems.length) return;
  if (!searchItem) return;
  const found = allPantryItems.some((item) => item.item.toLowerCase() === searchItem);
  if (found) alert("item available");
};

inputSearch.addEventListener("input", debounce(handleSearch, 300));

function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
 



 


//=====================MOVE TO PANTRY ======================//
const moveToPantryBtn = document.querySelector('.move-to-pantry')
if(moveToPantryBtn) {
  moveToPantryBtn.addEventListener('click', async(e) =>{
    //select the checkboxes and the move to pantry button
  const selectedCb = Array.from(document.querySelectorAll('.item-checkbox:checked'))


  //go over the array of checkboxes, get item name and map into the array
  const selectedItemIds = selectedCb.map(e =>{
    return e.dataset.id
  })

  if (selectedItemIds.length === 0) {
      alert('No items selected.')
      return
    }

    try{
      const res = await fetch('/api/moveToPantry', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:'same-origin',
        body: JSON.stringify({selectedItemIds})
      })
    window.location.reload()
  }catch(err){
    console.error(err)
    alert('Failed to add item to pantry.')
  }
  })
}


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


//======================= GET AI RECIPE SUGGESTIONS ==================//

document.addEventListener("DOMContentLoaded", () => {
  const aiLink = document.getElementById("aiRecipesLink");
  if (!aiLink) return; // important if main.js is shared across pages

  aiLink.addEventListener("click", async (e) => {
    e.preventDefault();

    const recipesModal = document.getElementById('recipesModal');
    const recipesContainer = document.getElementById('recipesContainer');
    
    // Show loading state
    recipesContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Loading recipes from AI... This may take 30 seconds.</p>';
    recipesModal.classList.add('active');

    try {
      const res = await fetch("/api/getAiRecipes", {
        method: "GET",
        credentials: 'same-origin',
      });

      if (!res.ok) {
        console.error(`Recipes fetch failed: ${res.status} ${res.statusText}`);
        recipesContainer.innerHTML = '<p style="color: red;">Failed to fetch recipes. Please try again.</p>';
        return;
      }

      // Parse JSON
      const data = await res.json();
      console.log('Response data:', data);
      console.log('Recipes:', data.recipes);

      // Display recipes in modal
      displayRecipes(data.recipes.recipes);

    } catch (err) {
      console.error('Request to /api/getAiRecipes failed', err);
      recipesContainer.innerHTML = '<p style="color: red;">Recipes fetch failed: check console for details.</p>';
    }
  });

  // Close recipes modal
  const closeRecipesBtn = document.getElementById('closeRecipesModalBtn');
  const recipesModal = document.getElementById('recipesModal');
  if (closeRecipesBtn && recipesModal) {
    closeRecipesBtn.addEventListener('click', () => {
      recipesModal.classList.remove('active');
    });
  }
});

// Function to display recipes in the modal
function displayRecipes(recipes) {
  const recipesContainer = document.getElementById('recipesContainer');
  
  if (!recipes || recipes.length === 0) {
    recipesContainer.innerHTML = '<p>No recipes found. Make sure your pantry has items and Ollama is running.</p>';
  } else {
    let recipesHTML = '';
    recipes.forEach((recipe, index) => {
      recipesHTML += `
        <div class="recipe-card" style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #333;">${recipe.name || 'Recipe ' + (index + 1)}</h3>
          <div style="margin: 10px 0;">
            <strong>Ingredients:</strong>
            <ul style="margin: 5px 0;">
              ${(recipe.ingredients || []).map(ing => `<li>${ing}</li>`).join('')}
            </ul>
          </div>
          <div style="margin: 10px 0;">
            <strong>Steps:</strong>
            <ol style="margin: 5px 0;">
              ${(recipe.steps || []).map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        </div>
      `;
    });
    recipesContainer.innerHTML = recipesHTML;
  }
}

//=======================NOTIFY ITEM RUNNING LOW=======================//
//add input field in add item modal for number of weeks item lasts
//add weeksItemLasts to the pantry model
//select notifications link
const notifications = document.querySelector('.notify')
//create async function to fetch notifications for items running low
//getItemsRunningLow
if(notifications) {
  notifications.addEventListener('click', async(e) =>{
    try{
    const res = await fetch('/api/getItemsRunningLow',{
      method:'GET',
      headers: { "Content-Type": "application/json" }
    })
      if(!res.ok) throw new Error('Did not get low running items.')
       const data = await res.json()
      console.log(data.itemsRunningLow)
  }catch(err){
    console.error('Request to /api/getItemsRunningLow failed.', err)
  }
})
}
//add router function
//add controller

//=====================MOVE TO FINISHED ======================//
const moveToFinishedBtn = document.querySelector('.move-to-finished')
if(moveToFinishedBtn) {
  moveToFinishedBtn.addEventListener('click', async(e) =>{
    const selectedCb = Array.from(document.querySelectorAll('.item-checkbox:checked'))
    
    const selectedItemIds = selectedCb.map(e => {
      return e.dataset.id
    })

    if (selectedItemIds.length === 0) {
      alert('No items selected.')
      return
    }

    try{
      const res = await fetch('/api/moveToFinished', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:'same-origin',
        body: JSON.stringify({selectedItemIds})
      })
      if (!res.ok) throw new Error('Move to finished failed.')
      
      selectedCb.forEach(cb => {
        cb.closest('li').remove()
      })
      window.location.reload()
    }catch(err){
      console.error(err)
      alert('Failed to move items to finished.')
    }
  })
}

//=====================MOVE TO GROCERY LIST ======================//
const moveToGroceryBtn = document.querySelector('.move-to-grocery')
if(moveToGroceryBtn) {
  moveToGroceryBtn.addEventListener('click', async(e) =>{
    const selectedCb = Array.from(document.querySelectorAll('.item-checkbox:checked'))
    
    const selectedItemIds = selectedCb.map(e => {
      return e.dataset.id
    })

    if (selectedItemIds.length === 0) {
      alert('No items selected.')
      return
    }

    try{
      const res = await fetch('/api/moveToGrocery', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:'same-origin',
        body: JSON.stringify({selectedItemIds})
      })
      if (!res.ok) throw new Error('Move to grocery list failed.')
      
      selectedCb.forEach(cb => {
        cb.closest('li').remove()
      })
      window.location.reload()
    }catch(err){
      console.error(err)
      alert('Failed to move items to grocery list.')
    }
  })
}
 
