document.addEventListener("DOMContentLoaded", () => {
  const id = localStorage.getItem("editRecipeId");
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const recipe = recipes.find(r => r.id == id);

  const nameInput = document.getElementById("editName");
  const ingredientsInput = document.getElementById("editIngredients");
  const instructionsInput = document.getElementById("editInstructions");
  const hashtagsInput = document.getElementById("editHashtags");
  const form = document.getElementById("editForm");
  const deleteBtn = document.getElementById("deleteBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  // Pre-fill form
  if (recipe) {
    nameInput.value = recipe.name;
    ingredientsInput.value = recipe.ingredients.join("\n");
    instructionsInput.value = recipe.instructions.join("\n");
    hashtagsInput.value = recipe.hashtags.join(" ");
  }

  // Save changes
  form.addEventListener("submit", e => {
    e.preventDefault();
    recipe.name = nameInput.value.trim();
    recipe.ingredients = ingredientsInput.value.trim().split("\n").filter(Boolean);
    recipe.instructions = instructionsInput.value.trim().split("\n").filter(Boolean);
    recipe.hashtags = hashtagsInput.value.trim().split(" ").filter(Boolean);

    localStorage.setItem("recipes", JSON.stringify(recipes));
    alert("Recipe updated!");
    window.location.href = "view.html";
  });

  // Delete recipe
  deleteBtn.addEventListener("click", () => {
    if (confirm("Delete this recipe?")) {
      const updated = recipes.filter(r => r.id != id);
      localStorage.setItem("recipes", JSON.stringify(updated));
      alert("Recipe deleted!");
      window.location.href = "toc.html";
    }
  });

  // Cancel edit
  cancelBtn.addEventListener("click", () => {
    window.location.href = "view.html";
  });
});