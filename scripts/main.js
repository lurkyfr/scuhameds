// Main JavaScript for SCUHA Gaming Hub

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
        }
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const elementsToObserve = document.querySelectorAll('.feature-card, .stat-item, .project-card');
    elementsToObserve.forEach(el => observer.observe(el));
});

// Loading screen utility
function showLoading(element) {
    if (element) {
        element.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 200px; flex-direction: column; gap: 20px;">
                <div style="width: 40px; height: 40px; border: 3px solid rgba(108, 92, 231, 0.1); border-top: 3px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="color: var(--text-secondary);">Loading...</p>
            </div>
        `;
    }
}

// Error message utility
function showError(element, message) {
    if (element) {
        element.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 15px; color: #e74c3c;"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

// Local Storage utilities
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn('Unable to save to localStorage:', e);
    }
}

function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.warn('Unable to read from localStorage:', e);
        return defaultValue;
    }
}

// Theme utilities
function toggleTheme() {
    const currentTheme = getFromStorage('theme', 'dark');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    saveToStorage('theme', newTheme);
    applyTheme(newTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = getFromStorage('theme', 'dark');
    applyTheme(savedTheme);
});

// Utility functions for game management
const GameUtils = {
    // Get game data from URL parameters
    getGameFromURL: function() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            name: urlParams.get('game'),
            src: urlParams.get('src'),
            title: urlParams.get('title')
        };
    },

    // Navigate to game focus page
    playGame: function(gameData) {
        const params = new URLSearchParams({
            game: gameData.id || gameData.name,
            src: gameData.src,
            title: gameData.title
        });
        window.location.href = `../focus?${params.toString()}`;
    },

    // Format player count
    formatPlayerCount: function(count) {
        if (count < 1000) return count.toString();
        if (count < 1000000) return Math.floor(count / 100) / 10 + 'K';
        return Math.floor(count / 100000) / 10 + 'M';
    },

    // Generate rating stars
    generateStars: function(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
};

// Export utilities for use in other scripts
window.GameUtils = GameUtils;
window.showLoading = showLoading;
window.showError = showError;
window.saveToStorage = saveToStorage;
window.getFromStorage = getFromStorage;