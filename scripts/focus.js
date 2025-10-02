// Focus Page JavaScript for Game Display

class FocusManager {
    constructor() {
        this.gameData = null;
        this.isFullscreen = false;
        this.isLoading = true;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadGameFromURL();
        this.setupKeyboardShortcuts();
    }

    setupEventListeners() {
        // Home button
        const homeBtn = document.getElementById('homeBtn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                this.returnHome();
            });
        }

        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Game frame load events
        const gameFrame = document.getElementById('gameFrame');
        if (gameFrame) {
            gameFrame.addEventListener('load', () => {
                this.onGameLoaded();
            });

            gameFrame.addEventListener('error', () => {
                this.onGameError();
            });
        }

        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveGameProgress();
        });

        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => {
            this.handleFullscreenChange();
        });

        document.addEventListener('webkitfullscreenchange', () => {
            this.handleFullscreenChange();
        });

        document.addEventListener('mozfullscreenchange', () => {
            this.handleFullscreenChange();
        });

        document.addEventListener('MSFullscreenChange', () => {
            this.handleFullscreenChange();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Escape':
                    if (this.isFullscreen) {
                        this.exitFullscreen();
                    } else {
                        this.returnHome();
                    }
                    break;
                case 'F11':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'F5':
                    e.preventDefault();
                    this.reloadGame();
                    break;
                case 'Home':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.returnHome();
                    }
                    break;
            }
        });
    }

    loadGameFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        this.gameData = {
            name: urlParams.get('game'),
            src: urlParams.get('src'),
            title: urlParams.get('title')
        };

        if (!this.gameData.src || !this.gameData.title) {
            this.onGameError();
            return;
        }

        // Update page title
        document.title = `${this.gameData.title} - SCUHA`;
        
        // Update game title in overlay
        const gameTitle = document.getElementById('gameTitle');
        if (gameTitle) {
            gameTitle.textContent = this.gameData.title;
        }

        // Load the game
        this.loadGame();
    }

    loadGame() {
        const gameFrame = document.getElementById('gameFrame');
        const loadingScreen = document.getElementById('loadingScreen');
        
        if (!gameFrame) {
            this.onGameError();
            return;
        }

        // Show loading screen
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }

        // Set a timeout for loading
        const loadTimeout = setTimeout(() => {
            if (this.isLoading) {
                this.onGameError();
            }
        }, 30000); // 30 second timeout

        // Store timeout reference
        this.loadTimeout = loadTimeout;

        // Load the game source
        gameFrame.src = this.gameData.src;

        // Start loading animation
        this.startLoadingAnimation();
    }

    startLoadingAnimation() {
        const loadingContent = document.querySelector('.loading-content h2');
        if (!loadingContent) return;

        const messages = [
            'Loading Game...',
            'Preparing Assets...',
            'Initializing...',
            'Almost Ready...'
        ];

        let messageIndex = 0;
        this.loadingInterval = setInterval(() => {
            if (this.isLoading) {
                loadingContent.textContent = messages[messageIndex];
                messageIndex = (messageIndex + 1) % messages.length;
            }
        }, 2000);
    }

    onGameLoaded() {
        this.isLoading = false;
        
        // Clear timeout and interval
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
        }
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
        }

        // Hide loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }

        // Update recently played
        this.updateRecentlyPlayed();

        // Focus on the game frame
        const gameFrame = document.getElementById('gameFrame');
        if (gameFrame) {
            gameFrame.focus();
        }
    }

    onGameError() {
        this.isLoading = false;
        
        // Clear timeout and interval
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
        }
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
        }

        // Hide loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }

        // Show error screen
        const errorScreen = document.getElementById('errorScreen');
        if (errorScreen) {
            errorScreen.style.display = 'flex';
        }

        console.error('Failed to load game:', this.gameData);
    }

    toggleFullscreen() {
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    enterFullscreen() {
        const gameContainer = document.querySelector('.game-container');
        if (!gameContainer) return;

        const requestFullscreen = gameContainer.requestFullscreen ||
                                gameContainer.webkitRequestFullscreen ||
                                gameContainer.mozRequestFullScreen ||
                                gameContainer.msRequestFullscreen;

        if (requestFullscreen) {
            requestFullscreen.call(gameContainer);
        } else {
            // Fallback for browsers that don't support fullscreen API
            this.simulateFullscreen();
        }
    }

    exitFullscreen() {
        const exitFullscreen = document.exitFullscreen ||
                             document.webkitExitFullscreen ||
                             document.mozCancelFullScreen ||
                             document.msExitFullscreen;

        if (exitFullscreen) {
            exitFullscreen.call(document);
        } else {
            // Fallback
            this.exitSimulatedFullscreen();
        }
    }

    simulateFullscreen() {
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.classList.add('fullscreen');
            this.isFullscreen = true;
            this.updateFullscreenButton();
        }
    }

    exitSimulatedFullscreen() {
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.classList.remove('fullscreen');
            this.isFullscreen = false;
            this.updateFullscreenButton();
        }
    }

    handleFullscreenChange() {
        const isCurrentlyFullscreen = document.fullscreenElement ||
                                    document.webkitFullscreenElement ||
                                    document.mozFullScreenElement ||
                                    document.msFullscreenElement;

        this.isFullscreen = !!isCurrentlyFullscreen;
        this.updateFullscreenButton();
        
        if (this.isFullscreen) {
            document.body.classList.add('game-focused');
        } else {
            document.body.classList.remove('game-focused');
        }
    }

    updateFullscreenButton() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            const icon = fullscreenBtn.querySelector('i');
            if (icon) {
                if (this.isFullscreen) {
                    icon.className = 'fas fa-compress';
                    fullscreenBtn.title = 'Exit Fullscreen';
                } else {
                    icon.className = 'fas fa-expand';
                    fullscreenBtn.title = 'Fullscreen';
                }
            }
        }
    }

    returnHome() {
        // Add exit animation
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.style.opacity = '0';
            gameContainer.style.transform = 'scale(0.95)';
        }

        // Save game progress before leaving
        this.saveGameProgress();

        setTimeout(() => {
            window.location.href = '../projects';
        }, 300);
    }

    reloadGame() {
        const gameFrame = document.getElementById('gameFrame');
        if (gameFrame) {
            this.isLoading = true;
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'flex';
            }
            
            // Reload the iframe
            gameFrame.src = gameFrame.src;
            this.startLoadingAnimation();
        }
    }

    updateRecentlyPlayed() {
        if (!this.gameData.name) return;

        let recentGames = JSON.parse(localStorage.getItem('scuha_recent_games') || '[]');
        
        // Remove if already exists
        recentGames = recentGames.filter(game => game.id !== this.gameData.name);
        
        // Add to beginning with timestamp
        recentGames.unshift({
            id: this.gameData.name,
            title: this.gameData.title,
            playedAt: new Date().toISOString(),
            src: this.gameData.src
        });
        
        // Keep only last 10
        recentGames = recentGames.slice(0, 10);
        
        localStorage.setItem('scuha_recent_games', JSON.stringify(recentGames));
    }

    saveGameProgress() {
        // This would typically communicate with the game iframe to get save data
        // For now, we'll just save the session info
        if (this.gameData.name) {
            const sessionData = {
                gameId: this.gameData.name,
                lastPlayed: new Date().toISOString(),
                sessionDuration: Date.now() - this.sessionStartTime
            };
            
            localStorage.setItem(`scuha_session_${this.gameData.name}`, JSON.stringify(sessionData));
        }
    }

    // Communication with game iframe
    setupGameCommunication() {
        window.addEventListener('message', (event) => {
            // Handle messages from the game iframe
            const gameFrame = document.getElementById('gameFrame');
            if (event.source !== gameFrame.contentWindow) return;

            switch (event.data.type) {
                case 'GAME_READY':
                    this.onGameReady();
                    break;
                case 'GAME_SCORE':
                    this.onScoreUpdate(event.data.score);
                    break;
                case 'GAME_COMPLETE':
                    this.onGameComplete(event.data);
                    break;
                case 'REQUEST_FULLSCREEN':
                    this.enterFullscreen();
                    break;
                case 'EXIT_GAME':
                    this.returnHome();
                    break;
            }
        });
    }

    onGameReady() {
        console.log('Game is ready');
        // Send initialization data to game if needed
        this.sendMessageToGame({
            type: 'INIT',
            settings: this.getGameSettings()
        });
    }

    onScoreUpdate(score) {
        // Handle score updates
        console.log('Score updated:', score);
        // You could display this in the overlay
    }

    onGameComplete(data) {
        // Handle game completion
        console.log('Game completed:', data);
        // Save high scores, achievements, etc.
        this.saveGameCompletion(data);
    }

    sendMessageToGame(message) {
        const gameFrame = document.getElementById('gameFrame');
        if (gameFrame && gameFrame.contentWindow) {
            gameFrame.contentWindow.postMessage(message, '*');
        }
    }

    getGameSettings() {
        // Return user settings for the game
        return JSON.parse(localStorage.getItem('scuha_game_settings') || '{}');
    }

    saveGameCompletion(data) {
        const completions = JSON.parse(localStorage.getItem('scuha_completions') || '{}');
        if (!completions[this.gameData.name]) {
            completions[this.gameData.name] = [];
        }
        
        completions[this.gameData.name].push({
            ...data,
            completedAt: new Date().toISOString()
        });
        
        localStorage.setItem('scuha_completions', JSON.stringify(completions));
    }
}

// Initialize focus manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.focusManager = new FocusManager();
    window.focusManager.sessionStartTime = Date.now();
    window.focusManager.setupGameCommunication();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        // Pause game or save state when tab becomes inactive
        window.focusManager?.sendMessageToGame({ type: 'PAGE_HIDDEN' });
    } else {
        // Resume game when tab becomes active
        window.focusManager?.sendMessageToGame({ type: 'PAGE_VISIBLE' });
    }
});

// Export for use in other scripts
window.FocusManager = FocusManager-