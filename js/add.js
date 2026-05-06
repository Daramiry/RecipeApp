// ../js/add.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recipeForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("recipeName");
    const ingredientsInput = document.getElementById("ingredients");
    const instructionsInput = document.getElementById("instruction");
    const hashtagsInput = document.getElementById("hashtags");

    const name = nameInput.value.trim();
    const ingredientsRaw = ingredientsInput.value.trim();
    const instructionsRaw = instructionsInput.value.trim();
    const hashtagsRaw = hashtagsInput.value.trim();

    // Basic validation
    if (!name || !ingredientsRaw || !instructionsRaw) {
      alert("Please fill in recipe name, ingredients, and instructions.");
      return;
    }

    // Turn textareas into arrays (one per line)
    const ingredients = ingredientsRaw
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const instructions = instructionsRaw
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Optional: split hashtags by space
    const hashtags = hashtagsRaw
      ? hashtagsRaw.split(" ").map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    // Recipe object
    const newRecipe = {
      id: Date.now(),          // simple unique id
      name,
      ingredients,
      instructions,
      hashtags
    };

    // Load existing recipes
    const existing = localStorage.getItem("recipes");
    const recipes = existing ? JSON.parse(existing) : [];

    // Add new one
    recipes.push(newRecipe);

    // Save back
    localStorage.setItem("recipes", JSON.stringify(recipes));

    console.log("Saved recipe:", newRecipe);
    console.log("All recipes:", recipes);

    // For now, just clear the form so we can see it works
    form.reset();
    alert("Recipe saved!");
  });
});


// Function to update the "Recently Added" box
function updateRecentList() {
    const recentList = document.getElementById("recentList");
    const existing = localStorage.getItem("recipes");
    const recipes = existing ? JSON.parse(existing) : [];

    if (recipes.length === 0) {
        recentList.innerHTML = "<p> No recipes added yet.</p>";
        return;
    }

    // Get last 5 recipes (Most Recent First)
    const recent = recipes.slice(-5).reverse();

    // Build HTML list
    recentList.innerHTML = recent
    .map(r =>  `<p>${r.name}</p>`)
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("recipeForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        // ... your save logic ...
        updateRecentList(); // keep this inside submit
    });

    // Call once when page loades, inside DOMContentloaded
    updateRecentList();
})