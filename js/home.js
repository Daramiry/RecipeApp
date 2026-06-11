// home.js - handles homepage navigation

document.addEventListener("DOMContentLoaded", () =>  {
    const enterBtn = document.getElementById("enterBtn");
    const favBtn = document.getElementById("favBtn");
    const themeToggle = document.getElementById("themeToggle");

    // Navigate to Table of Contents
    if (enterBtn) enterBtn.addEventListener("click", () => {
        window.location.href = "toc.html";
    });

    // Navigate to Favorites Page
    if (favBtn) favBtn.addEventListener("click", () => {
        window.location.href = "favorites.html"
    });

    // Theme handling
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            if (themeToggle) themeToggle.textContent = '☀️';
        } else {
            document.documentElement.classList.remove('dark');
            if (themeToggle) themeToggle.textContent = '🌙';
        }
    }

    function loadTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) {
            applyTheme(saved);
        } else {
            // default to light
            applyTheme('light');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            const next = isDark ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem('theme', next);
        });
    }

    loadTheme();
})