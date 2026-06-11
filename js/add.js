// add.js

document.addEventListener("DOMContentLoaded", () => {
    function safeParse(key, def = []) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (e) { console.error('Corrupt localStorage for', key, e); localStorage.removeItem(key); return def; } }

    const form = document.getElementById("recipeForm");
    const backBtn = document.getElementById("backBtn");
    const recentList = document.getElementById("recentList");

    function updateRecentList() {
        const recipes = safeParse("recipes", []);

        if (recipes.length === 0) {
            recentList.innerHTML = "<p>No recipes added yet.</p>";
            return;
        }

        const recent = recipes.slice(-5).reverse();
        recentList.innerHTML = "";
        recent.forEach(r => {
            const p = document.createElement('p');
            p.className = 'recent-item';
            p.dataset.id = r.id;
            p.textContent = r.name;
            p.style.cursor = 'pointer';
            p.tabIndex = 0;
            p.addEventListener('click', () => {
                localStorage.setItem('selectedRecipe', String(r.id));
                window.location.href = 'view.html';
            });
            p.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    p.click();
                }
            });
            recentList.appendChild(p);
        });
    }

    function saveRecipe(recipe) {
        const recipes = safeParse("recipes", []);
        recipes.push(recipe);
        localStorage.setItem("recipes", JSON.stringify(recipes));
    }

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "toc.html";
        });
    }

    if (form) {
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

        if (!name || !ingredientsRaw || !instructionsRaw) {
            alert("Please fill in recipe name, ingredients, and instructions.");
            return;
        }

        const ingredients = ingredientsRaw
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const instructions = instructionsRaw
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const hashtags = hashtagsRaw
            ? hashtagsRaw.split(" ").map(tag => tag.trim()).filter(tag => tag.length > 0)
            : [];

        const newRecipe = {
            id: Date.now(),
            name,
            ingredients,
            instructions,
            hashtags
        };

            saveRecipe(newRecipe);
            form.reset();
            updateRecentList();
            alert("Recipe saved!");
    });
    } else {
        console.warn('Add form not found on this page.');
    }

    updateRecentList();
});
