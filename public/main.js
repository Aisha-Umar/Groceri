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




