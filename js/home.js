// home.js - handles homepage navigation

document.addEventListener("DOMContentLoaded", () =>  {
    const enterBtn = document.querySelector(".enter-btn");
    const favBtn = document.querySelector(".fav-btn");

    // Navigate to Table of Contents
    enterBtn.addEventListener("click", () => {
        window.location.href = "toc.html";
    });

    // Navigate to Favorites Page
    favBtn.addEventListener("click", () => {
        window.location.href = "favorites.html"
    });
})