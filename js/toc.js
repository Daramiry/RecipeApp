// toc.js — handles navigation, recipe loading, and search filtering

document.addEventListener("DOMContentLoaded", () => {
    const addRecipeBtn = document.getElementById("addRecipeBtn");
    const favoritesBtn = document.getElementById("favoritesBtn");
    const homeBtn = document.getElementById("homeBtn");
    const searchInput = document.getElementById("searchInput");
    const recipeGrid = document.getElementById("recipeGrid");

    // --- Navigation ---
    addRecipeBtn.addEventListener("click", () => {
        window.location.href = "add.html";
    });

    favoritesBtn.addEventListener("click", () => {
        window.location.href = "favorites.html";
    });

    homeBtn.addEventListener("click", () => {
        window.location.href = "home.html";
    });

    // --- Load Recipes ---
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

    function displayRecipes(list) {
        recipeGrid.innerHTML = "";

        if (list.length === 0) {
            recipeGrid.innerHTML = "<p>No recipes found.</p>";
            return;
        }

        list.forEach(recipe => {
            const card = document.createElement("div");
            card.className = "recipe-card";
            card.innerHTML = `
                <h3>${recipe.name}</h3>
                <p>${recipe.ingredients.split("\n")[0]}...</p>
                <button class="view-btn" onclick="viewRecipe(${recipe.id})">View</button>
            `;
            recipeGrid.appendChild(card);
        });
    }

    displayRecipes(recipes);

    // --- Search Filter ---
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = recipes.filter(r => r.name.toLowerCase().includes(query));
        displayRecipes(filtered);
    });
});

// --- View Recipe Function ---
function viewRecipe(id) {
    localStorage.setItem("currentRecipe", id);
    window.location.href = "view.html";
}
