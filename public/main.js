console.log("JS file loaded")
const input = document.querySelector(".inputItem");
const form = document.querySelector("form");
const list = document.querySelector(".groceryList");
let itemBeingEdited = null;

// Edit an item
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    itemBeingEdited = e.target.parentElement.querySelector("span").textContent;
    input.value = itemBeingEdited;
    input.focus();
  }
});

// Form submit (add or edit)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newItem = input.value.trim();
  if (!newItem) return alert("Please enter an item name");

  const url = itemBeingEdited ? "/api/editItem" : "/api/addItem";
  const method = itemBeingEdited ? "PUT" : "POST";
  const body = itemBeingEdited
    ? JSON.stringify({ itemBeingEdited, newItem })
    : JSON.stringify({ newItem });
    console.log(itemBeingEdited,newItem)

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (!res.ok) throw new Error("Request failed");
   location.reload(); // EJS refresh handles new list
  } catch (err) {
    console.error("Error:", err);
  }
  input.value=''
});

// Delete item
list.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    const item = e.target.parentElement.querySelector("span").textContent;
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch("/api/deleteItem", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      });
      if (!res.ok) throw new Error("Delete failed");
    location.reload();
    } catch (err) {
      console.error("Error:", err);
    }
  }
});

//make elements draggable
let draggedItem = null;

list.addEventListener("dragstart", (e) => {
  draggedItem = e.target;
  e.target.classList.add("dragging");
});

list.addEventListener("dragover", (e) => {
  e.preventDefault(); // allows dropping
  const afterElement = getDragAfterElement(list, e.clientY);
  const dragging = document.querySelector(".dragging");
  if (afterElement == null) {
    list.appendChild(dragging);
  } else {
    list.insertBefore(dragging, afterElement);
  }
});

list.addEventListener("drop", () => {
  draggedItem.classList.remove("dragging");
  draggedItem = null;
});

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
let orderedList = Array.from(document.querySelectorAll('ul li'))
orderList(orderedList)
async function orderList(orderedList){
try{
  const res = await fetch('/api/saveOrder',{
  method:'POST',
  header:{"Content-Type":"application/json"},
  body: JSON.stringify({orderedList}),
})
if(!res.ok) throw new Error('Update failed')
  location.reload
}catch(err){
  console.error('Error:',err)
}
}

