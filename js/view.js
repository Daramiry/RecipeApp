// view.js

document.addEventListener('DOMContentLoaded', () => {
    function safeParse(key, def = []) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (e) { console.error('Corrupt localStorage for', key, e); localStorage.removeItem(key); return def; } }

    // Get elements
    const titleEl= document.getElementById("recipeTitle");
    const ingredientsEl = document.getElementById("ingredientsList");
    const instructionsEl = document.getElementById("instructionsList");
    const hashtagsEl = document.getElementById("hashtagsList");
    const backBtn = document.getElementById("backBtn");

    // Load selected recipe
    const recipes = safeParse("recipes", []);
    const selectedId = localStorage.getItem("selectedRecipe");

    // Find recipe by ID
    const recipe = recipes.find(r => String(r.id) === String(selectedId));

    if (recipe) {
        if (titleEl) titleEl.textContent = recipe.name || "Recipe Title";

        if (ingredientsEl) {
            ingredientsEl.innerHTML = "";
            if (Array.isArray(recipe.ingredients)) {
                recipe.ingredients.forEach(item => {
                    const li = document.createElement("li");
                    li.textContent = item;
                    ingredientsEl.appendChild(li);
                });
            }
        }

        if (instructionsEl) {
            instructionsEl.innerHTML = "";
            if (Array.isArray(recipe.instructions)) {
                recipe.instructions.forEach(step => {
                    const li = document.createElement("li");
                    li.textContent = step;
                    instructionsEl.appendChild(li);
                });
            }
        }

        if (hashtagsEl) hashtagsEl.textContent = Array.isArray(recipe.hashtags) ? recipe.hashtags.join(" ") : "";
    } else {
        if (titleEl) titleEl.textContent = "Recipe not found.";
    }

    // Back button
    if (backBtn) backBtn.addEventListener("click", () => { window.location.href = "toc.html"; });

    const editBtn = document.getElementById("editBtn");
    if (editBtn) {
        editBtn.addEventListener("click", () => {
            localStorage.setItem("editRecipeId", selectedId);
            window.location.href = "edit.html";
        });
    }
});