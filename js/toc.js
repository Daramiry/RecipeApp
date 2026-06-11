// toc.js — handles navigation, recipe loading, and search filtering

document.addEventListener("DOMContentLoaded", () => {
    function safeParse(key, def = []) {
        try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (e) { console.error('Corrupt localStorage for', key, e); localStorage.removeItem(key); return def; }
    }

    const addRecipeBtn = document.getElementById("addRecipeBtn");
    const favoritesBtn = document.getElementById("favoritesBtn");
    const homeBtn = document.getElementById("homeBtn");
    const searchInput = document.getElementById("searchInput");
    const hashtagFilterInput = document.getElementById("hashtagFilterInput");
    const recipeContainer = document.getElementById("recipeGrid");

    // --- Navigation ---
    if (addRecipeBtn) addRecipeBtn.addEventListener("click", () => { window.location.href = "add.html"; });
    if (favoritesBtn) favoritesBtn.addEventListener("click", () => { window.location.href = "favorites.html"; });
    if (homeBtn) if (homeBtn) homeBtn.addEventListener("click", () => { window.location.href = "home.html"; });

    // --- Load Recipes ---
    let recipes = safeParse("recipes", []);

    function getFavoriteIds() {
        return JSON.parse(localStorage.getItem("favoriteIds")) || [];
    }

    function saveFavoriteIds(ids) {
        localStorage.setItem("favoriteIds", JSON.stringify(ids));
    }

    function isFavorite(id) {
        return getFavoriteIds().some(fav => String(fav) === String(id));
    }

    function toggleFavorite(id) {
        const favorites = getFavoriteIds();
        const exists = favorites.some(fav => String(fav) === String(id));

        if (exists) {
            const updated = favorites.filter(fav => String(fav) !== String(id));
            saveFavoriteIds(updated);
            return false;
        }

        favorites.push(id);
        saveFavoriteIds(favorites);
        return true;
    }

    function saveRecipes(list) {
        localStorage.setItem("recipes", JSON.stringify(list));
        recipes = list;
    }

    function displayRecipes(list) {
        if (!recipeContainer) return;
        recipeContainer.innerHTML = "";

        if (!list || list.length === 0) {
            recipeContainer.innerHTML = "<p>No recipes found.</p>";
            return;
        }

        list.forEach(recipe => {
            const card = document.createElement("div");
            card.className = "recipe-card";
            const favoriteClass = isFavorite(recipe.id) ? "favorited" : "";
            const favoriteText = isFavorite(recipe.id) ? "★" : "☆";
            card.innerHTML = `
                <h3>${recipe.name}</h3>
                <p>${recipe.ingredients && recipe.ingredients.length > 0 ? recipe.ingredients[0] : "No ingredients"}...</p>
                <div class="card-actions">
                    <button class="view-btn action-btn" data-id="${recipe.id}">View</button>
                    <button class="edit-btn action-btn" data-id="${recipe.id}">Edit</button>
                    <button class="favorite-btn action-btn ${favoriteClass}" data-id="${recipe.id}" aria-label="Toggle favorite">${favoriteText}</button>
                    <button class="delete-btn action-btn" data-id="${recipe.id}">Delete</button>
                </div>
            `;
            recipeContainer.appendChild(card);
        });
    }

    displayRecipes(recipes);

    function filterRecipes() {
        const query = (searchInput && searchInput.value) ? searchInput.value.trim().toLowerCase() : "";
        const hashtagFilter = (hashtagFilterInput && hashtagFilterInput.value) ? hashtagFilterInput.value.trim().toLowerCase().replace(/^#/, "") : "";

        const filtered = recipes.filter(r => {
            const nameMatch = r.name && r.name.toLowerCase().includes(query);
            const ingredientMatch = r.ingredients && r.ingredients.some(item => item.toLowerCase().includes(query));
            const hashtagMatch = r.hashtags && r.hashtags.some(tag => tag.toLowerCase().includes(query));

            const generalMatch = !query || nameMatch || ingredientMatch || hashtagMatch;
            const hashtagFilterMatch = !hashtagFilter || (r.hashtags && r.hashtags.some(tag => tag.toLowerCase().replace(/^#/, "").includes(hashtagFilter)));

            return generalMatch && hashtagFilterMatch;
        });

        displayRecipes(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", filterRecipes);
    if (hashtagFilterInput) hashtagFilterInput.addEventListener("input", filterRecipes);

    // --- Card Actions ---
    document.addEventListener("click", e => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains("view-btn")) {
            localStorage.setItem("selectedRecipe", id);
            window.location.href = "view.html";
            return;
        }

        if (e.target.classList.contains("edit-btn")) {
            localStorage.setItem("editRecipeId", id);
            window.location.href = "edit.html";
            return;
        }

        if (e.target.classList.contains("favorite-btn")) {
            toggleFavorite(id);
            filterRecipes();
            return;
        }

        if (e.target.classList.contains("delete-btn")) {
            if (!confirm("Delete this recipe?")) {
                return;
            }
            const updatedRecipes = recipes.filter(r => String(r.id) !== String(id));
            saveRecipes(updatedRecipes);
            const favoriteIds = getFavoriteIds().filter(favId => updatedRecipes.some(r => String(r.id) === String(favId)));
            saveFavoriteIds(favoriteIds);
            filterRecipes();
            return;
        }
    });
});
