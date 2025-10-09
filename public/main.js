const input = document.querySelector(".inputItem");
const form = document.querySelector("form");
const list = document.querySelector(".groceryList");
let itemBeingEdited = null;

// Edit an item
list.addEventListener("click", (e)=>{
  e.preventDefault();
  if (e.target.classList.contains("edit")) {
    itemBeingEdited = e.target.parentElement.querySelector("span").textContent;
    input.value = itemBeingEdited;
    console.log(input.value)
    input.focus();
  }
})

//=========INPUT FORM =====================//
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const newItem = input.value.trim();
  console.log("Submitting:", { itemBeingEdited, newItem });
  if (itemBeingEdited) {
    fetch("http://localhost:3000/api/editItem", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({itemBeingEdited,newItem}),
    })
      .then((res) => res.json())
      .then((data) => {
        renderStoredItems(data.storedItems);
        itemBeingEdited = null;
        input.value = "";
      })
      .catch((err) => console.error("Error:", err));
  } else {
    fetch("http://localhost:3000/api/addItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({newItem}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("item added:", data);
        renderStoredItems(data.storedItems);
        input.value = "";
      })
      .catch((err) => console.error("Error:", err));
  }
});

function renderStoredItems(items) {
  list.innerHTML = "";
  items.forEach((element) => {
    let listItem = document.createElement("li");
    let span = document.createElement("span");
    span.textContent = element.item;
    listItem.appendChild(span);
    let delbtn = document.createElement("button");
    delbtn.textContent = "delete";
    delbtn.classList.add("delete");
    listItem.appendChild(delbtn);
    let editbtn = document.createElement("button");
    editbtn.textContent = "edit";
    editbtn.classList.add("edit");
    listItem.appendChild(editbtn);
    list.appendChild(listItem);
  });
}

//get item list on load
fetch("/api/getList")
  .then((res) => res.json())
  .then((data) => {
    console.log("items from backend:", data);
    renderStoredItems(data);
  })
  .catch((err) => console.error("Error:", err));

//delete button
list.addEventListener("click", deleteItem);
function deleteItem(e) {
  e.preventDefault();
  if (e.target.classList.contains("delete")) {
    let item = e.target.parentElement.querySelector("span").textContent;
    fetch("http://localhost:3000/api/deleteItem", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item }),
    })
      .then((res) => res.json())
      .then((data) => {
        renderStoredItems(data.storedItems);
        input.value = "";
      })
      .catch((err) => console.error("Error:", err));
  }
}

