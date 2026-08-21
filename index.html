<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>BINGO</title>
    <link rel="stylesheet" href="style.css" />

    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js">
    </script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js">
    </script>
</head>
<body>

    <!-- ============================================= -->
    <!-- TOAST CONTAINER -->
    <!-- ============================================= -->
    <div id="toast-container"></div>

    <!-- ============================================= -->
    <!-- MAIN APP (Direct, No Login) -->
    <!-- ============================================= -->
    <div id="screen-main" class="screen active">
        <div class="app-container">

            <!-- ===== HEADER ===== -->
            <header class="app-header">
                <div class="header-left">
                    <span class="app-title">🎯 BINGO</span>
                </div>
                <div class="header-right" id="header-profile">
                    <span class="header-name" id="header-name">Player</span>
                    <span class="header-avatar" id="header-avatar">👤</span>
                </div>
            </header>

            <!-- ===== PAGES ===== -->
            <div class="pages-container">

                <!-- HOME PAGE -->
                <div id="page-home" class="page active">
                    <div class="welcome-section">
                        <p class="welcome-greeting">Welcome to</p>
                        <h2 id="welcome-name">BINGO</h2>
                    </div>

                    <div class="game-modes">
                        <div class="mode-card" id="btn-create-room">
                            <div class="mode-icon">➕</div>
                            <h3>Create Room</h3>
                            <p>Host a new game</p>
                        </div>
                        <div class="mode-card" id="btn-join-room">
                            <div class="mode-icon">⌨️</div>
                            <h3>Join Room</h3>
                            <p>Enter room code</p>
                        </div>
                    </div>

                    <div class="incentives">
                        ⭐ Play & Win Coins
                    </div>
                </div>

                <!-- PROFILE PAGE -->
                <div id="page-profile" class="page">
                    <div class="profile-card">
                        <div class="profile-avatar" id="profile-avatar">👤</div>
                        <h3 id="profile-name">Player</h3>
                        <p id="profile-email">Guest Mode</p>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <span class="stat-number" id="stat-matches">0</span>
                                <span class="stat-label">Matches</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" id="stat-wins">0</span>
                                <span class="stat-label">Wins</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" id="stat-winrate">0%</span>
                                <span class="stat-label">Win Rate</span>
                            </div>
                        </div>
                        <button id="btn-edit-profile" class="btn-secondary">Edit Profile</button>
                    </div>
                </div>

                <!-- INSTRUCTIONS PAGE -->
                <div id="page-instructions" class="page">
                    <div class="instructions-content">
                        <h2>📖 How to Play</h2>
                        <div class="rule-card">
                            <div class="rule-icon">1</div>
                            <div>
                                <h4>5x5 Board</h4>
                                <p>Numbers 1-25 randomly placed</p>
                            </div>
                        </div>
                        <div class="rule-card">
                            <div class="rule-icon">2</div>
                            <div>
                                <h4>Multiplayer</h4>
                                <p>2 to 5 players, take turns</p>
                            </div>
                        </div>
                        <div class="rule-card">
                            <div class="rule-icon">3</div>
                            <div>
                                <h4>Mark Numbers</h4>
                                <p>Tap to cross your numbers</p>
                            </div>
                        </div>
                        <div class="rule-card">
                            <div class="rule-icon">4</div>
                            <div>
                                <h4>Win Condition</h4>
                                <p>First to complete 5 lines wins</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CREATE ROOM PAGE -->
                <div id="page-create-room" class="page">
                    <div class="room-form">
                        <h2>Create Room</h2>
                        <label>Number of players</label>
                        <select id="room-player-count">
                            <option value="2">2 Players</option>
                            <option value="3">3 Players</option>
                            <option value="4">4 Players</option>
                            <option value="5">5 Players</option>
                        </select>
                        <button id="btn-create-room-final" class="btn-primary">Create Room</button>
                        <div id="room-code-display" style="display:none;">
                            <div class="room-code-card">
                                <p class="room-code-label">Room Code</p>
                                <div class="room-code-large" id="room-code">XXXXXX</div>
                                <button id="btn-copy-code" class="btn-copy">Copy Code</button>
                            </div>
                        </div>
                        <button id="btn-back-home" class="btn-secondary">Back</button>
                    </div>
                </div>

                <!-- JOIN ROOM PAGE -->
                <div id="page-join-room" class="page">
                    <div class="room-form">
                        <h2>Join Room</h2>
                        <label>Room code</label>
                        <input type="text" id="join-room-code" placeholder="Enter code" maxlength="6" style="text-transform:uppercase;letter-spacing:4px;font-weight:700;" />
                        <label>Your name</label>
                        <input type="text" id="join-player-name" placeholder="Enter your name" value="Guest" />
                        <button id="btn-join-room-final" class="btn-primary">Join Room</button>
                        <button id="btn-back-home-2" class="btn-secondary">Back</button>
                    </div>
                </div>

                <!-- GAME PAGE -->
                <div id="page-game" class="page">
                    <div class="game-header">
                        <div class="game-room-info">
                            <span class="room-badge">Room <span id="game-room-id">---</span></span>
                            <span class="player-count">Players <span id="game-players">0</span></span>
                        </div>
                        <div class="game-turn-indicator" id="game-turn">
                            Waiting...
                        </div>
                    </div>
                    <div id="game-boards-container"></div>
                    <button id="btn-leave-room" class="btn-danger">Leave Room</button>
                </div>

            </div>

            <!-- ===== BOTTOM NAVIGATION ===== -->
            <nav class="bottom-nav">
                <div class="nav-item active" data-page="home">
                    <span class="nav-icon">🏠</span>
                    <span class="nav-label">Home</span>
                </div>
                <div class="nav-item" data-page="profile">
                    <span class="nav-icon">👤</span>
                    <span class="nav-label">Profile</span>
                </div>
                <div class="nav-item" data-page="instructions">
                    <span class="nav-icon">📖</span>
                    <span class="nav-label">Rules</span>
                </div>
            </nav>

        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
