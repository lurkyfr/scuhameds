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
        difficulty: 3,
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
    }

    init() {
        console.log('Initializing ProjectsManager...');
        this.setupEventListeners();
        this.loadInitialGames();
        this.updateLoadMoreButton();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterGames();
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    this.searchTerm = '';
                    this.filterGames();
                }
            });
        } else {
            console.warn('Search input element not found');
        }

        const filterButtons = document.querySelectorAll('.filter-btn');
        if (filterButtons.length > 0) {
            filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentFilter = e.target.getAttribute('data-filter');
                    this.filterGames();
                });
            });
        } else {
            console.warn('No filter buttons found');
        }

        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreGames();
            });
        } else {
            console.warn('Load more button not found');
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'F3' || (e.ctrlKey && e.key === 'f')) {
                e.preventDefault();
                searchInput?.focus();
            }
        });
    }

    filterGames() {
        try {
            console.log(`Filtering games with filter: ${this.currentFilter}, search: ${this.searchTerm}`);
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

            console.log(`Filtered games count: ${this.filteredGames.length}`);
            this.displayedGames = 0;
            this.clearGamesGrid();
            this.loadInitialGames();
            this.updateLoadMoreButton();

            if (this.filteredGames.length === 0) {
                this.showEmptyState();
            }
        } catch (error) {
            console.error('Error filtering games:', error);
        }
    }

    loadInitialGames() {
        try {
            console.log('Loading initial games...');
            this.loadMoreGames();
        } catch (error) {
            console.error('Error loading initial games:', error);
        }
    }

    loadMoreGames() {
        try {
            console.log(`Loading more games. Displayed: ${this.displayedGames}, Total: ${this.filteredGames.length}`);
            const gamesToLoad = this.filteredGames.slice(
                this.displayedGames, 
                this.displayedGames + this.gamesPerLoad
            );

            console.log(`Games to load: ${gamesToLoad.length}`);
            gamesToLoad.forEach((game, index) => {
                setTimeout(() => {
                    this.createGameCard(game);
                }, index * 100);
            });

            this.displayedGames += gamesToLoad.length;
            this.updateLoadMoreButton();
        } catch (error) {
            console.error('Error loading more games:', error);
        }
    }

    createGameCard(game) {
        try {
            const grid = document.getElementById('projectsGrid');
            if (!grid) {
                console.error('Projects grid element not found');
                return;
            }

            console.log(`Creating card for game: ${game.title}`);
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-game-id', game.id);
            
            const categoryIcon = this.getCategoryIcon(game.category);
            const difficultyDots = this.generateDifficultyDots(game.difficulty);
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

            card.addEventListener('click', (e) => {
                if (!e.target.closest('.favorite-btn')) {
                    console.log(`Playing game: ${game.title}`);
                    this.playGame(game);
                }
            });

            const favoriteBtn = card.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log(`Toggling favorite for game: ${game.id}`);
                this.toggleFavorite(game.id, favoriteBtn);
            });

            card.addEventListener('mouseenter', () => {
                console.log(`Preloading game: ${game.title}`);
                this.preloadGame(game);
            });

            grid.appendChild(card);
            console.log(`Appended card for ${game.title} to grid`);

            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, 50);
        } catch (error) {
            console.error(`Error creating game card for ${game.title}:`, error);
        }
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
        try {
            const index = this.favorites.indexOf(gameId);
            if (index > -1) {
                this.favorites.splice(index, 1);
                button.classList.remove('favorited');
            } else {
                this.favorites.push(gameId);
                button.classList.add('favorited');
            }
            this.saveFavorites();
            
            button.style.transform = 'scale(1.3)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    }

    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('scuha_favorites') || '[]');
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('scuha_favorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    preloadGame(game) {
        try {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = game.src;
            document.head.appendChild(link);
        } catch (error) {
            console.error('Error preloading game:', error);
        }
    }

    playGame(game) {
        try {
            const card = document.querySelector(`[data-game-id="${game.id}"]`);
            if (card) {
                card.style.transform = 'scale(0.95)';
                card.style.opacity = '0.8';
                
                this.addToRecentlyPlayed(game.id);
                
                setTimeout(() => {
                    GameUtils.playGame(game);
                }, 150);
            } else {
                console.warn(`Card not found for game: ${game.id}`);
            }
        } catch (error) {
            console.error('Error playing game:', error);
        }
    }

    addToRecentlyPlayed(gameId) {
        try {
            let recentGames = JSON.parse(localStorage.getItem('scuha_recent_games') || '[]');
            recentGames = recentGames.filter(id => id !== gameId);
            recentGames.unshift(gameId);
            recentGames = recentGames.slice(0, 10);
            localStorage.setItem('scuha_recent_games', JSON.stringify(recentGames));
        } catch (error) {
            console.error('Error adding to recently played:', error);
        }
    }

    clearGamesGrid() {
        try {
            const grid = document.getElementById('projectsGrid');
            if (grid) {
                grid.innerHTML = '';
                console.log('Cleared projects grid');
            } else {
                console.warn('Projects grid not found for clearing');
            }
        } catch (error) {
            console.error('Error clearing games grid:', error);
        }
    }

    updateLoadMoreButton() {
        try {
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
            } else {
                console.warn('Load more button not found');
            }
        } catch (error) {
            console.error('Error updating load more button:', error);
        }
    }

    showEmptyState() {
        try {
            const grid = document.getElementById('projectsGrid');
            if (grid) {
                grid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <i class="fas fa-search"></i>
                        <h3>No Games Found</h3>
                        <p>Try adjusting your search terms or filters</p>
                    </div>
                `;
                console.log('Displayed empty state');
            } else {
                console.warn('Projects grid not found for empty state');
            }
        } catch (error) {
            console.error('Error showing empty state:', error);
        }
    }

    getGameById(id) {
        return this.allGames.find(game => game.id === id);
    }

    getFavoriteGames() {
        return this.allGames.filter(game => this.favorites.includes(game.id));
    }

    getRecentlyPlayed() {
        try {
            const recentIds = JSON.parse(localStorage.getItem('scuha_recent_games') || '[]');
            return recentIds.map(id => this.getGameById(id)).filter(Boolean);
        } catch (error) {
            console.error('Error getting recently played games:', error);
            return [];
        }
    }

    searchGames(query) {
        try {
            this.searchTerm = query.toLowerCase();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = query;
            }
            this.filterGames();
        } catch (error) {
            console.error('Error searching games:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('DOM content loaded, initializing ProjectsManager');
        window.projectsManager = new ProjectsManager();
        window.projectsManager.init(); // Initialize ProjectsManager
    } catch (error) {
        console.error('Error initializing ProjectsManager:', error);
    }
});

window.ProjectsManager = ProjectsManager;