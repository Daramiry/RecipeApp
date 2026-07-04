document.addEventListener("DOMContentLoaded", () => {
  function safeParse(key, def = []) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : def;
    } catch (e) {
      console.error("Corrupt localStorage for", key, e);
      localStorage.removeItem(key);
      return def;
    }
  }

  const id = localStorage.getItem("editRecipeId");
  const recipes = safeParse("recipes", []);
  const recipe = recipes.find(r => String(r.id) === String(id));

  const recipeTitleDisplay = document.getElementById("recipeTitleDisplay");
  const ingredientsList = document.getElementById("ingredientsList");
  const instructionsList = document.getElementById("instructionsList");
  const hashtagsList = document.getElementById("hashtagsList");
  const deleteBtn = document.getElementById("deleteBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const backBtn = document.getElementById("backBtn");

  if (!recipe) {
    alert("Recipe not found.");
    return window.location.href = "toc.html";
  }

  if (recipeTitleDisplay) {
    recipeTitleDisplay.textContent = recipe.name || "Untitled Recipe";
  }

  if (ingredientsList) {
    ingredientsList.innerHTML = "";
    (Array.isArray(recipe.ingredients) ? recipe.ingredients : []).forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      ingredientsList.appendChild(li);
    });
  }

  if (instructionsList) {
    instructionsList.innerHTML = "";
    (Array.isArray(recipe.instructions) ? recipe.instructions : []).forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      instructionsList.appendChild(li);
    });
  }

  if (hashtagsList) {
    const hashtags = Array.isArray(recipe.hashtags) ? recipe.hashtags : [];
    hashtagsList.textContent = hashtags.length ? hashtags.join(" ") : "No hashtags";
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      if (confirm("Delete this recipe?")) {
        const updated = recipes.filter(r => String(r.id) !== String(id));
        localStorage.setItem("recipes", JSON.stringify(updated));
        alert("Recipe deleted!");
        window.location.href = "toc.html";
      }
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "toc.html";
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "view.html";
    });
  }
});