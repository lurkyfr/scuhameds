// Projects Page JavaScript

const gameData = [
    {
        id: '2048',
        title: '2048',
        description: 'Merge blocks to accumulate the highest number block',
        image: '../files/2048/thumb.png',
        tags: ['action', 'adventure'],
        rating: 4.5,
        players: 2340,
        src: '../files/2048/index.html',
        difficulty: 3,
        category: 'action'
    },
    {
        id: '1v1.space',
        title: '1v1.Space',
        description: '1v1SPACE, similar to 1v1.LOL, an entertaining battle royale browser game.',
        image: '../files/1v1space/splash.png',
        tags: ['puzzle', 'brain'],
        rating: 4.8,
        players: 1850,
        src: '../files/1v1space/index.html',
        difficulty: 4,
        category: 'puzzle'
    },
    {
        id: 'slope',
        title: 'Slope',
        description: 'Slopein Around Slope Yah Woo!',
        image: '../files/slope/slope4.jpeg',
        tags: ['racing', 'arcade'],
        rating: 4.3,
        players: 3420,
        src: '../files/slope/',
        difficulty: 999,
        category: 'arcade'
    }
];

class ProjectsManager {
    constructor() {
        this.allGames = gameData;
        this.filteredGames = [...gameData];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.displayedGames = 0;
        this.gamesPerLoad = 6;
        this.favorites = this.loadFavorites();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialGames();
        this.updateLoadMoreButton();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterGames();
            });

            // Clear search on escape
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    this.searchTerm = '';
                    this.filterGames();
                }
            });
        }

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                this.currentFilter = e.target.getAttribute('data-filter');
                this.filterGames();
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreGames();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F3' || (e.ctrlKey && e.key === 'f')) {
                e.preventDefault();
                searchInput?.focus();
            }
        });
    }

    filterGames() {
        this.filteredGames = this.allGames.filter(game => {
            const matchesFilter = this.currentFilter === 'all' || 
                                game.tags.includes(this.currentFilter) ||
                                game.category === this.currentFilter;
            const matchesSearch = this.searchTerm === '' || 
                                game.title.toLowerCase().includes(this.searchTerm) ||
                                game.description.toLowerCase().includes(this.searchTerm) ||
                                game.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
            
            return matchesFilter && matchesSearch;
        });

        this.displayedGames = 0;
        this.clearGamesGrid();
        this.loadInitialGames();
        this.updateLoadMoreButton();

        // Show empty state if no games found
        if (this.filteredGames.length === 0) {
            this.showEmptyState();
        }
    }

    loadInitialGames() {
        this.loadMoreGames();
    }

    loadMoreGames() {
        const gamesToLoad = this.filteredGames.slice(
            this.displayedGames, 
            this.displayedGames + this.gamesPerLoad
        );

        gamesToLoad.forEach((game, index) => {
            setTimeout(() => {
                this.createGameCard(game);
            }, index * 100); // Stagger the loading animation
        });

        this.displayedGames += gamesToLoad.length;
        this.updateLoadMoreButton();
    }

    createGameCard(game) {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-game-id', game.id);
        
        // Get category icon
        const categoryIcon = this.getCategoryIcon(game.category);
        
        // Generate difficulty dots
        const difficultyDots = this.generateDifficultyDots(game.difficulty);
        
        // Check if game is favorited
        const isFavorited = this.favorites.includes(game.id);
        
        card.innerHTML = `
            <div class="project-image">
                <img src="${game.image}" alt="${game.title}" onerror="this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400'">
                <div class="play-icon">
                    <i class="fas fa-play"></i>
                </div>
                <div class="category-icon">
                    <i class="fas ${categoryIcon}"></i>
                </div>
                <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-game-id="${game.id}">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="difficulty-indicator">
                    ${difficultyDots}
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${game.title}</h3>
                <p class="project-description">${game.description}</p>
                <div class="project-tags">
                    ${game.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-meta">
                    <div class="project-rating">
                        <span class="stars">${GameUtils.generateStars(game.rating)}</span>
                        <span>${game.rating}</span>
                    </div>
                    <div class="project-players">
                        <i class="fas fa-users"></i>
                        <span>${GameUtils.formatPlayerCount(game.players)}</span>
                    </div>
                </div>
            </div>
        `;

        // Add click event to play game (except on favorite button)
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                this.playGame(game);
            }
        });

        // Add favorite button functionality
        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(game.id, favoriteBtn);
        });

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            this.preloadGame(game);
        });

        grid.appendChild(card);

        // Add entrance animation
        setTimeout(() => {
            card.classList.add('fade-in-up');
        }, 50);
    }

    getCategoryIcon(category) {
        const icons = {
            'action': 'fa-sword',
            'puzzle': 'fa-puzzle-piece',
            'arcade': 'fa-gamepad',
            'strategy': 'fa-chess',
            'racing': 'fa-flag-checkered',
            'rpg': 'fa-dragon',
            'sports': 'fa-futbol',
            'adventure': 'fa-compass'
        };
        return icons[category] || 'fa-gamepad';
    }

    generateDifficultyDots(difficulty) {
        let dots = '';
        for (let i = 1; i <= 5; i++) {
            const activeClass = i <= difficulty ? 'active' : '';
            dots += `<div class="difficulty-dot ${activeClass}"></div>`;
        }
        return dots;
    }

    toggleFavorite(gameId, button) {
        const index = this.favorites.indexOf(gameId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            button.classList.remove('favorited');
        } else {
            this.favorites.push(gameId);
            button.classList.add('favorited');
        }
        this.saveFavorites();
        
        // Add animation
        button.style.transform = 'scale(1.3)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    }

    loadFavorites() {
        return JSON.parse(localStorage.getItem('scuha_favorites') || '[]');
    }

    saveFavorites() {
        localStorage.setItem('scuha_favorites', JSON.stringify(this.favorites));
    }

    preloadGame(game) {
        // Preload game assets for faster loading
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = game.src;
        document.head.appendChild(link);
    }

    playGame(game) {
        // Add click animation
        const card = document.querySelector(`[data-game-id="${game.id}"]`);
        if (card) {
            card.style.transform = 'scale(0.95)';
            card.style.opacity = '0.8';
            
            // Save recently played games
            this.addToRecentlyPlayed(game.id);
            
            setTimeout(() => {
                GameUtils.playGame(game);
            }, 150);
        }
    }

    addToRecentlyPlayed(gameId) {
        let recentGames = JSON.parse(localStorage.getItem('scuha_recent_games') || '[]');
        
        // Remove if already exists
        recentGames = recentGames.filter(id => id !== gameId);
        
        // Add to beginning
        recentGames.unshift(gameId);
        
        // Keep only last 10
        recentGames = recentGames.slice(0, 10);
        
        localStorage.setItem('scuha_recent_games', JSON.stringify(recentGames));
    }

    clearGamesGrid() {
        const grid = document.getElementById('projectsGrid');
        if (grid) {
            grid.innerHTML = '';
        }
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            const remainingGames = this.filteredGames.length - this.displayedGames;
            if (remainingGames <= 0) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-flex';
                loadMoreBtn.innerHTML = `
                    <i class="fas fa-plus"></i> 
                    Load ${Math.min(remainingGames, this.gamesPerLoad)} More Games
                `;
            }
        }
    }

    showEmptyState() {
        const grid = document.getElementById('projectsGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-search"></i>
                    <h3>No Games Found</h3>
                    <p>Try adjusting your search terms or filters</p>
                </div>
            `;
        }
    }

    // Public methods for external access
    getGameById(id) {
        return this.allGames.find(game => game.id === id);
    }

    getFavoriteGames() {
        return this.allGames.filter(game => this.favorites.includes(game.id));
    }

    getRecentlyPlayed() {
        const recentIds = JSON.parse(localStorage.getItem('scuha_recent_games') || '[]');
        return recentIds.map(id => this.getGameById(id)).filter(Boolean);
    }

    searchGames(query) {
        this.searchTerm = query.toLowerCase();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = query;
        }
        this.filterGames();
    }
}

// Initialize projects manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.projectsManager = new ProjectsManager();
});

// Export for use in other scripts
window.ProjectsManager = ProjectsManager;