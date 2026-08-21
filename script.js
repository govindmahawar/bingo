// ================================================================
// BLOCK 1: FIREBASE CONFIG
// ================================================================

const firebaseConfig = {
    apiKey: "AIzaSyC-jAk48X5IQnbbLXKq8TcZiV3AJX8h74E",
    authDomain: "bingoo-ae551.firebaseapp.com",
    databaseURL: "https://bingoo-ae551-default-rtdb.firebaseio.com",
    projectId: "bingoo-ae551",
    storageBucket: "bingoo-ae551.firebasestorage.app",
    messagingSenderId: "945276194044",
    appId: "1:945276194044:web:62a53e824a14f0f02b1b79",
    measurementId: "G-RXGMWLBG50"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
const firestore = firebase.firestore();

// ================================================================
// BLOCK 2: TOAST SYSTEM
// ================================================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3500);
}

// ================================================================
// BLOCK 3: AUTHENTICATION
// ================================================================

const AuthManager = {
    currentUser: null,

    init() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.currentUser = user;
                UIManager.showScreen('screen-main');
                UIManager.updateHeader(user);
                ProfileManager.loadProfile(user);
                showToast(`Welcome back, ${user.displayName || 'Player'}!`, 'success');
            } else {
                this.currentUser = null;
                UIManager.showScreen('screen-login');
            }
        });

        document.getElementById('btn-login').addEventListener('click', () => {
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();
            if (!email || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            auth.signInWithEmailAndPassword(email, password)
                .then(() => showToast('Signed in successfully!', 'success'))
                .catch(err => showToast(err.message, 'error'));
        });

        document.getElementById('btn-signup').addEventListener('click', () => {
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value.trim();
            if (!name || !email || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            if (password.length < 6) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }
            auth.createUserWithEmailAndPassword(email, password)
                .then(userCred => {
                    return userCred.user.updateProfile({ displayName: name });
                })
                .then(() => {
                    showToast('Account created successfully! Welcome!', 'success');
                })
                .catch(err => showToast(err.message, 'error'));
        });

        document.getElementById('btn-logout-mobile').addEventListener('click', () => {
            auth.signOut();
            RoomManager.leaveRoom();
            showToast('Signed out', 'info');
        });

        document.getElementById('goto-signup').addEventListener('click', () => {
            UIManager.showScreen('screen-signup');
        });
        document.getElementById('goto-login').addEventListener('click', () => {
            UIManager.showScreen('screen-login');
        });

        document.getElementById('header-profile').addEventListener('click', () => {
            UIManager.showPage('profile');
            UIManager.setActiveNav('profile');
        });
    },

    getCurrentUser() {
        return this.currentUser;
    }
};

// ================================================================
// BLOCK 4: UI RENDERER
// ================================================================

const UIManager = {
    currentPage: 'home',

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(screenId);
        if (screen) screen.classList.add('active');
    },

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const page = document.getElementById('page-' + pageId);
        if (page) page.classList.add('active');
        this.currentPage = pageId;
    },

    setActiveNav(pageId) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelector(`.nav-item[data-page="${pageId}"]`)?.classList.add('active');
    },

    updateHeader(user) {
        if (user) {
            const name = user.displayName || user.email || 'Player';
            document.getElementById('header-name').textContent = name;
            document.getElementById('header-avatar').textContent = name[0].toUpperCase();
            document.getElementById('welcome-name').textContent = name;

            const hour = new Date().getHours();
            let greeting = 'Good evening';
            if (hour < 12) greeting = 'Good morning';
            else if (hour < 17) greeting = 'Good afternoon';
            const greetingEl = document.querySelector('.welcome-greeting');
            if (greetingEl) greetingEl.textContent = greeting;
        }
    },

    renderBoard(boardData, playerId, isCurrentPlayer) {
        const container = document.getElementById('game-boards-container');
        if (!container) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'board-wrapper';

        const nameEl = document.createElement('div');
        nameEl.className = 'player-name';
        nameEl.textContent = '🟢 Your Board';
        wrapper.appendChild(nameEl);

        const boardDiv = document.createElement('div');
        boardDiv.className = 'board-grid';

        boardData.forEach((num, index) => {
            const cell = document.createElement('div');
            cell.className = 'board-cell';
            cell.dataset.index = index;

            if (num === 0) {
                cell.textContent = '✓';
                cell.classList.add('crossed');
            } else {
                cell.textContent = num;
            }

            // Click sirf tab jab:
            // 1. Apna board hai
            // 2. Apni turn hai
            // 3. Number cross nahi hai
            if (isCurrentPlayer && num !== 0) {
                cell.style.cursor = 'pointer';
                cell.addEventListener('click', function() {
                    const idx = parseInt(this.dataset.index);
                    console.log('🔵 Cell clicked:', idx, num);
                    GameLogic.handleCellClick(playerId, idx);
                });
            } else {
                cell.classList.add('disabled');
            }

            boardDiv.appendChild(cell);
        });

        wrapper.appendChild(boardDiv);
        container.appendChild(wrapper);
    },

    clearBoards() {
        const container = document.getElementById('game-boards-container');
        if (container) container.innerHTML = '';
    },

    updateGameStatus(roomId, players, currentTurn) {
        document.getElementById('game-room-id').textContent = roomId || '---';
        document.getElementById('game-players').textContent = players ? players.length : 0;

        const user = AuthManager.getCurrentUser();
        const turnEl = document.getElementById('game-turn');
        if (currentTurn === user?.uid) {
            turnEl.textContent = '🎯 Your Turn';
            turnEl.style.color = '#2ecc71';
        } else {
            turnEl.textContent = '⏳ Waiting for opponent...';
            turnEl.style.color = '#f5c842';
        }
    },

    showWinner(winnerId) {
        const turnEl = document.getElementById('game-turn');
        turnEl.textContent = `🏆 ${winnerId.substring(0, 6)} WINS! 🎉`;
        turnEl.style.color = '#f5c842';
        turnEl.style.fontSize = '1.5rem';
        showToast(`🎉 ${winnerId.substring(0, 6)} wins the game!`, 'success');
    },

    showRoomCode(code) {
        const display = document.getElementById('room-code-display');
        if (display) {
            display.style.display = 'block';
            document.getElementById('room-code').textContent = code;
            showToast(`Room created! Code: ${code}`, 'success');
            setTimeout(() => {
                display.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    },

    hideRoomCode() {
        const display = document.getElementById('room-code-display');
        if (display) display.style.display = 'none';
    }
};

// ================================================================
// BLOCK 5: BOARD GENERATOR
// ================================================================

const BoardGenerator = {
    generateBoard() {
        const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        return numbers;
    }
};

// ================================================================
// BLOCK 6: ROOM MANAGER
// ================================================================

const RoomManager = {
    currentRoomId: null,
    isHost: false,

    init() {
        document.getElementById('btn-create-room').addEventListener('click', () => {
            UIManager.showPage('create-room');
        });

        document.getElementById('btn-create-room-final').addEventListener('click', () => {
            this.createRoom();
        });

        document.getElementById('btn-join-room').addEventListener('click', () => {
            UIManager.showPage('join-room');
        });

        document.getElementById('btn-join-room-final').addEventListener('click', () => {
            this.joinRoom();
        });

        document.getElementById('btn-back-home').addEventListener('click', () => {
            UIManager.showPage('home');
        });
        document.getElementById('btn-back-home-2').addEventListener('click', () => {
            UIManager.showPage('home');
        });

        document.getElementById('btn-leave-room').addEventListener('click', () => {
            this.leaveRoom();
        });

        document.getElementById('btn-copy-code').addEventListener('click', () => {
            const code = document.getElementById('room-code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                showToast('Room code copied!', 'success');
            });
        });
    },

    createRoom() {
        const user = AuthManager.getCurrentUser();
        if (!user) {
            showToast('Please sign in first', 'error');
            return;
        }

        const playerCount = parseInt(document.getElementById('room-player-count').value);
        const roomId = this.generateRoomCode();

        const roomData = {
            host: user.uid,
            players: [user.uid],
            playerNames: { [user.uid]: user.displayName || user.email || 'Player' },
            playerBoards: { [user.uid]: BoardGenerator.generateBoard() },
            maxPlayers: playerCount,
            currentTurn: user.uid,
            gameStarted: false,
            winner: null,
            crossedNumbers: [],
            createdAt: Date.now()
        };

        db.ref('rooms/' + roomId).set(roomData)
            .then(() => {
                this.currentRoomId = roomId;
                this.isHost = true;
                UIManager.showRoomCode(roomId);
                UIManager.showPage('game');
                UIManager.clearBoards();
                this.listenRoom(roomId);
                GameLogic.setRoomId(roomId);
            })
            .catch(err => showToast('Error: ' + err.message, 'error'));
    },

    joinRoom() {
        const user = AuthManager.getCurrentUser();
        if (!user) {
            showToast('Please sign in first', 'error');
            return;
        }

        const roomId = document.getElementById('join-room-code').value.trim().toUpperCase();
        if (!roomId) {
            showToast('Please enter room code', 'error');
            return;
        }

        const playerName = document.getElementById('join-player-name').value.trim() || user.displayName || 'Player';

        db.ref('rooms/' + roomId).once('value')
            .then(snapshot => {
                const room = snapshot.val();
                if (!room) {
                    showToast('Room not found', 'error');
                    return;
                }
                if (room.players.length >= room.maxPlayers) {
                    showToast('Room is full', 'error');
                    return;
                }
                if (room.gameStarted) {
                    showToast('Game already started', 'error');
                    return;
                }

                const updates = {};
                updates['players'] = [...room.players, user.uid];
                updates['playerNames/' + user.uid] = playerName;
                updates['playerBoards/' + user.uid] = BoardGenerator.generateBoard();

                return db.ref('rooms/' + roomId).update(updates);
            })
            .then(() => {
                this.currentRoomId = roomId;
                this.isHost = false;
                UIManager.showPage('game');
                UIManager.clearBoards();
                this.listenRoom(roomId);
                GameLogic.setRoomId(roomId);
                showToast('Joined room successfully!', 'success');
            })
            .catch(err => showToast('Error: ' + err.message, 'error'));
    },

    leaveRoom() {
        if (this.currentRoomId) {
            const user = AuthManager.getCurrentUser();
            if (user && this.isHost) {
                db.ref('rooms/' + this.currentRoomId).remove();
            } else if (user) {
                db.ref('rooms/' + this.currentRoomId + '/players').once('value')
                    .then(snapshot => {
                        const players = snapshot.val() || [];
                        const filtered = players.filter(uid => uid !== user.uid);
                        return db.ref('rooms/' + this.currentRoomId + '/players').set(filtered);
                    });
            }
        }
        this.currentRoomId = null;
        this.isHost = false;
        UIManager.showPage('home');
        UIManager.clearBoards();
        GameLogic.setRoomId(null);
        showToast('Left room', 'info');
    },

    generateRoomCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    },

    listenRoom(roomId) {
        const user = AuthManager.getCurrentUser();
        if (!user) return;

        db.ref('rooms/' + roomId).on('value', snapshot => {
            const room = snapshot.val();
            if (!room) {
                showToast('Room closed by host', 'error');
                this.leaveRoom();
                return;
            }

            const players = room.players || [];
            UIManager.updateGameStatus(roomId, players, room.currentTurn);

            UIManager.clearBoards();
            const boards = room.playerBoards || {};
            const currentTurn = room.currentTurn;
            const winner = room.winner;

            // 🔥 SIRF APNA BOARD
            const myBoard = boards[user.uid];
            if (myBoard) {
                const isMyTurn = (currentTurn === user.uid && !winner);
                UIManager.renderBoard(myBoard, user.uid, isMyTurn);
            }

            if (winner) {
                UIManager.showWinner(winner);
            }

            if (room.winningCells) {
                document.querySelectorAll('.board-cell').forEach(cell => {
                    const index = parseInt(cell.dataset.index);
                    if (room.winningCells.includes(index)) {
                        cell.classList.add('winning-cell');
                    }
                });
            }
        });
    }
};

// ================================================================
// BLOCK 7: GAME LOGIC (SIMPLE & WORKING)
// ================================================================

const GameLogic = {
    roomId: null,

    setRoomId(id) {
        this.roomId = id;
    },

    handleCellClick(playerId, cellIndex) {
        const user = AuthManager.getCurrentUser();
        if (!user || !this.roomId) {
            showToast('Please login first!', 'error');
            return;
        }

        console.log('🔵 Click:', playerId, cellIndex);

        const roomRef = db.ref('rooms/' + this.roomId);
        roomRef.once('value')
            .then(snapshot => {
                const room = snapshot.val();
                if (!room) {
                    showToast('Room not found!', 'error');
                    return;
                }

                // Game already finished?
                if (room.winner) {
                    showToast('Game already finished!', 'error');
                    return;
                }

                // Correct turn?
                if (room.currentTurn !== user.uid) {
                    showToast('Not your turn!', 'error');
                    return;
                }

                // Get player's board
                const board = room.playerBoards[playerId];
                if (!board) {
                    showToast('Board not found!', 'error');
                    return;
                }

                // Already crossed?
                if (board[cellIndex] === 0) {
                    showToast('Already crossed!', 'error');
                    return;
                }

                const number = board[cellIndex];
                console.log('🎯 Number:', number);

                // Prepare updates
                const updates = {};

                // 1. Cross on current player's board
                board[cellIndex] = 0;
                updates['playerBoards/' + playerId] = board;

                // 2. Cross on all other players' boards
                const allPlayers = room.players || [];
                allPlayers.forEach(pid => {
                    if (pid === playerId) return;
                    const oppBoard = room.playerBoards[pid];
                    if (!oppBoard) return;
                    const idx = oppBoard.indexOf(number);
                    if (idx !== -1) {
                        oppBoard[idx] = 0;
                        updates['playerBoards/' + pid] = oppBoard;
                        console.log('✅ Crossed on:', pid);
                    }
                });

                // 3. Check winner
                const result = GameLogic.checkWinner(board);

                if (result.won) {
                    updates['winner'] = playerId;
                    updates['winningCells'] = result.winningCells;
                    showToast('🎉 You won! Congratulations!', 'success');
                    ProfileManager.addWin(user.uid);
                } else {
                    // 4. Next turn
                    const currentIndex = allPlayers.indexOf(playerId);
                    const nextIndex = (currentIndex + 1) % allPlayers.length;
       
