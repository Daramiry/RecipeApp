// add.js — handles recipe creation, validation, and saving

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("recipeForm");
    const backBtn = document.getElementById("backBtn");

    // --- Navigation ---
    backBtn.addEventListener("click", () => {
        window.location.href = "toc.html";
    });

    // --- Form Submission ---
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("recipeName").value.trim();
        const ingredients = document.getElementById("ingredients").value.trim().split("\n").filter(i => i.trim() !== "");
        const instructions = document.getElementById("instructions").value.trim().split("\n").filter(i => i.trim() !== "");
        const hashtags = document.getElementById("hashtags").value.trim();

        // --- Validation ---
        if (!name) {
            alert("Please enter a recipe name.");
            return;
        }

        if (ingredients.length < 2) {
            alert("Please add at least two ingredients.");
            return;
        }

        if (instructions.length === 0 || !instructions[0].match(/^\d+\./)) {
            alert("Please number your instruction steps for clarity (e.g., '1. Preheat oven').");
            return;
        }

        if (!hashtags) {
            alert("Please add hashtags to help filter recipes.");
            return;
        }

        // --- Create Recipe Object ---
        const recipe = {
            id: Date.now(),
            name,
            ingredients,
            instructions,
            hashtags: hashtags.split(" ").filter(tag => tag.startsWith("#")),
            favorite: false
        };

        // --- Save to localStorage ---
        let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
        recipes.push(recipe);
        localStorage.setItem("recipes", JSON.stringify(recipes));

        // --- Generate Dedicated Recipe Page ---
        generateRecipePage(recipe);

        alert("Recipe saved successfully!");
        window.location.href = "toc.html";
    });
});

// --- Generate Individual Recipe Page ---
function generateRecipePage(recipe) {
    const pageContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${recipe.name}</title>
    <link rel="stylesheet" href="css/view.css">
    <script src="js/view.js" defer></script>
</head>
<body>
    <header>
        <h1 class="title">${recipe.name}</h1>
        <nav>
            <button class="nav-btn" onclick="window.location.href='toc.html'">← Back to Cookbook</button>
        </nav>
    </header>

    <main class="recipe-view">
        <h2>Ingredients</h2>
        <ul>
            ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
        </ul>

        <h2>Instructions</h2>
        <ol>
            ${recipe.instructions.map(step => `<li>${step}</li>`).join("")}
        </ol>

        <p class="hashtags">${recipe.hashtags.join(" ")}</p>
    </main>
</body>
</html>
`;

    // --- Save HTML file dynamically ---
    const blob = new Blob([pageContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    localStorage.setItem(`recipePage_${recipe.id}`, url);
}
