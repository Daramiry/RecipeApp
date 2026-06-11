document.addEventListener("DOMContentLoaded", () => {
  function safeParse(key, def = []) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (e) { console.error('Corrupt localStorage for', key, e); localStorage.removeItem(key); return def; } }

  const backBtn = document.getElementById("backBtn");
  const favoritesList = document.getElementById("favoritesList");

  function getRecipes() {
    return JSON.parse(localStorage.getItem("recipes")) || [];
  }

  function getFavoriteIds() {
    return JSON.parse(localStorage.getItem("favoriteIds")) || [];
  }

  function saveFavoriteIds(ids) {
    localStorage.setItem("favoriteIds", JSON.stringify(ids));
  }

  function renderFavorites() {
    if (!favoritesList) return;
    const recipes = getRecipes();
    const favoriteIds = getFavoriteIds();
    const favoriteRecipes = recipes.filter(recipe => favoriteIds.includes(String(recipe.id)));

    if (!favoriteRecipes || favoriteRecipes.length === 0) {
      favoritesList.innerHTML = `
        <div class="empty-state">
          <p>You don't have any favorite recipes yet.</p>
          <p>Go back to the cookbook and tap the star to save your favorites.</p>
        </div>
      `;
      return;
    }

    favoritesList.innerHTML = favoriteRecipes.map(recipe => {
      const summary = recipe.ingredients && recipe.ingredients.length > 0 ? recipe.ingredients[0] : "No ingredients listed.";
      return `
        <article class="favorite-card" data-id="${recipe.id}">
          <h2>${recipe.name}</h2>
          <p>${summary}...</p>
          <div class="favorite-actions">
            <button class="view-btn" data-id="${recipe.id}">View</button>
            <button class="remove-btn" data-id="${recipe.id}">Remove</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function removeFavorite(recipeId) {
    const updatedFavorites = getFavoriteIds().filter(id => String(id) !== String(recipeId));
    saveFavoriteIds(updatedFavorites);
    renderFavorites();
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "toc.html";
    });
  }

  favoritesList.addEventListener("click", event => {
    const target = event.target;
    const recipeId = target.dataset.id;
    if (!recipeId) return;

    if (target.classList.contains("view-btn")) {
      localStorage.setItem("selectedRecipe", recipeId);
      window.location.href = "view.html";
      return;
    }

    if (target.classList.contains("remove-btn")) {
      removeFavorite(recipeId);
      return;
    }
  });

  renderFavorites();
});
