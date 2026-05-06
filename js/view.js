// view.js

// Get elements
const titleEl= document.getElementById("recipeTitle");
const ingredientsEl = document.getElementById("ingredientsList");
const instructionsEl = document.getElementById("instructionsList");
const hashtagsEl = document.getElementById("hashtagsList");
const backBtn = document.getElementById("backBtn");

// Load selected recipe
const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
const selectedId = localStorage.getItem("selectedRecipe");

// Find recipe by ID
const recipe = recipes.find(r => r.id === selectedId);

if (recipe) {
    // Title
    titleEl.textContent = recipe.title;

    // Ingredients
    ingredientsEl.innerHTML = "";
    recipe.ingredients.forEach(item => {
        const li = documents.createElements("li");
        li.textContent = item;
        ingredientsEl.appendChild(li);
    });
    
    // Hashtags
    hashtagsEl.textContent = recipe.hashtags.join(" ");
} else {
    titleEl.textContent = "Recipe not found.";
}

// Back button
backBtn.addEventListener("click", () => {
    window.location.href = "toc.html";
});

const editBtn = document.getElementById("editBtn");
editBtn.addEventListener("click", () => {
    localStorage.setItem("editRecipeId", selectedId);
    window.location.href = "edit.html";
});