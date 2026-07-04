document.addEventListener("DOMContentLoaded", () => {
  function safeParse(key, def = []) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : def;
    } catch (e) {
      console.error("Corrupt localStorage for", key, e);
      localStorage.removeItem(key);
      return def;
    }
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  const id = localStorage.getItem("editRecipeId");
  const recipes = safeParse("recipes", []);
  const recipe = recipes.find(r => String(r.id) === String(id));

  const form = document.getElementById("editForm");
  const nameInput = document.getElementById("editName");
  const ingredientsInput = document.getElementById("editIngredients");
  const instructionsInput = document.getElementById("editInstructions");
  const cookTimeInput = document.getElementById("editCookTime");
  const servingsInput = document.getElementById("editServings");
  const hashtagsInput = document.getElementById("editHashtags");
  const imageInput = document.getElementById("recipeImage");
  const imagePreview = document.getElementById("imagePreview");
  const deleteBtn = document.getElementById("deleteBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  if (!recipe) {
    alert("Recipe not found.");
    return window.location.href = "toc.html";
  }

  if (nameInput) nameInput.value = recipe.name || "";
  if (ingredientsInput) ingredientsInput.value = Array.isArray(recipe.ingredients) ? recipe.ingredients.join("\n") : "";
  if (instructionsInput) instructionsInput.value = Array.isArray(recipe.instructions) ? recipe.instructions.join("\n") : "";
  if (cookTimeInput) cookTimeInput.value = recipe.cookTime || "";
  if (servingsInput) servingsInput.value = recipe.servings || "";
  if (hashtagsInput) hashtagsInput.value = Array.isArray(recipe.hashtags) ? recipe.hashtags.join(" ") : "";

  if (imagePreview && recipe.imageData) {
    imagePreview.src = recipe.imageData;
    imagePreview.style.display = "block";
  }

  if (imageInput && imagePreview) {
    imageInput.addEventListener("change", () => {
      const file = imageInput.files && imageInput.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          imagePreview.src = reader.result;
          imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.src = recipe.imageData || "";
        imagePreview.style.display = recipe.imageData ? "block" : "none";
      }
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const updatedRecipe = {
        ...recipe,
        name: nameInput ? nameInput.value.trim() : recipe.name,
        ingredients: ingredientsInput
          ? ingredientsInput.value
              .split("\n")
              .map(line => line.trim())
              .filter(Boolean)
          : recipe.ingredients,
        instructions: instructionsInput
          ? instructionsInput.value
              .split("\n")
              .map(line => line.trim())
              .filter(Boolean)
          : recipe.instructions,
        cookTime: cookTimeInput ? cookTimeInput.value.trim() : recipe.cookTime,
        servings: servingsInput ? servingsInput.value.trim() : recipe.servings,
        hashtags: hashtagsInput
          ? hashtagsInput.value
              .trim()
              .split(" ")
              .map(tag => tag.trim())
              .filter(Boolean)
          : recipe.hashtags
      };

      if (imageInput && imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        if (!file.type.startsWith("image/")) {
          alert("Please choose a valid image file.");
          return;
        }
        try {
          updatedRecipe.imageData = await readFileAsDataURL(file);
        } catch (err) {
          console.error(err);
          alert("Unable to read the selected image.");
          return;
        }
      } else if (!updatedRecipe.imageData && recipe.imageData) {
        updatedRecipe.imageData = recipe.imageData;
      }

      const index = recipes.findIndex(r => String(r.id) === String(id));
      if (index !== -1) {
        recipes[index] = updatedRecipe;
        localStorage.setItem("recipes", JSON.stringify(recipes));
        alert("Recipe updated!");
        window.location.href = "view.html";
      }
    });
  }

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

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "toc.html";
    });
  }
});