document.addEventListener("DOMContentLoaded", () => {
  function safeParse(key, def = []) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (e) { console.error('Corrupt localStorage for', key, e); localStorage.removeItem(key); return def; } }

  const id = localStorage.getItem("editRecipeId");
  const recipes = safeParse("recipes", []);
  const recipe = recipes.find(r => String(r.id) === String(id));

  const nameInput = document.getElementById("editName");
  const ingredientsInput = document.getElementById("editIngredients");
  const instructionsInput = document.getElementById("editInstructions");
  const hashtagsInput = document.getElementById("editHashtags");
  const form = document.getElementById("editForm");
  const deleteBtn = document.getElementById("deleteBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  // If recipe not found, redirect
  if (!recipe) {
    alert('Recipe not found.');
    return window.location.href = 'toc.html';
  }

  // Pre-fill form (guard inputs)
  if (nameInput) nameInput.value = recipe.name || '';
  if (ingredientsInput) ingredientsInput.value = Array.isArray(recipe.ingredients) ? recipe.ingredients.join("\n") : '';
  if (instructionsInput) instructionsInput.value = Array.isArray(recipe.instructions) ? recipe.instructions.join("\n") : '';
  if (hashtagsInput) hashtagsInput.value = Array.isArray(recipe.hashtags) ? recipe.hashtags.join(" ") : '';

  // Save changes
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      recipe.name = nameInput ? nameInput.value.trim() : recipe.name;
      recipe.ingredients = ingredientsInput ? ingredientsInput.value.trim().split("\n").filter(Boolean) : recipe.ingredients;
      recipe.instructions = instructionsInput ? instructionsInput.value.trim().split("\n").filter(Boolean) : recipe.instructions;
      recipe.hashtags = hashtagsInput ? hashtagsInput.value.trim().split(" ").filter(Boolean) : recipe.hashtags;

      localStorage.setItem("recipes", JSON.stringify(recipes));
      alert("Recipe updated!");
      window.location.href = "view.html";
    });
  }

  // Delete recipe
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

  // Cancel edit
  if (cancelBtn) cancelBtn.addEventListener("click", () => { window.location.href = "view.html"; });
});