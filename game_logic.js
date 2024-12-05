let playerText = document.getElementById('playerText')
 let restartBtn = document.getElementById('restartBtn')
 let boxes = Array.from(document.getElementsByClassName('box'))
 let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks')
 let rollBtn = document.getElementById('rollBtn'); 
 let dice = document.getElementById('dice'); 
 let turnIndicator = document.getElementById('turnIndicator'); 
 rollBtn.addEventListener('click', rollDice);
let boxesClickable = false; // Flag to control box clicks

 const O_TEXT = "O"
 const X_TEXT = "X"
 let currentPlayer = X_TEXT
 let spaces = Array(9).fill(null)
 let gameEnded = false; 
 let rollCount = 0; // Add roll counter
 const startGame = () => {
 }
 function boxClicked(e) {
     if (gameEnded) {
         return; 
     }
     const id = e.target.id
     if (!spaces[id]) { 
         spaces[id] = currentPlayer;
         e.target.classList.add(currentPlayer.toLowerCase()); 
         let winning_blocks = playerHasWon(); 
         if (winning_blocks !== false) {
             playerText.innerHTML = `${currentPlayer} has won!`
             winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator)
             gameEnded = true; 
             return
         }
         currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT;
         rollBtn.disabled = false; 
         
         boxes.forEach(box => box.removeEventListener('click', boxClicked));
     }
 }
 function rollDice() {
    rollCount++; // Increment roll count
    dice.innerHTML = `<img src="loadDice.png" alt="Dice">`; // Display loading dice
    setTimeout(() => { // Simulate dice roll delay
        let randomChoice = Math.random() < 0.5 ? X_TEXT : O_TEXT;
        dice.innerHTML = `<img src="${randomChoice === X_TEXT ? 'Xdice.png' : 'Odice.png'}" alt="Dice">`;
        currentPlayer = randomChoice;

        if (rollCount >= 2) {
            turnIndicator.textContent = `It's ${currentPlayer}'s turn!`; // Update turn indicator
            rollCount = 0; // Reset roll count
            rollBtn.disabled = true; // Disable roll button
            // Add event listeners here
            boxes.forEach(box => box.addEventListener('click', boxClicked)); // Enable board clicks
        } else {
            turnIndicator.textContent = `You need to roll ${2 - rollCount} more times to get your turn.`; // Update turn indicator
        }
    }, 1000); // Adjust delay as needed
}


const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]


restartBtn.addEventListener('click', restart)

function restart() {
    spaces.fill(null);
    rollCount = 0; // Reset roll count

    boxes.forEach(box => {
        box.innerText = '';
        box.style.backgroundColor = '';
        // Remove the winning and sad face classes
        box.classList.remove('x'); 
        box.classList.remove('o'); 
        box.classList.remove('happyx');
        box.classList.remove('happyo');
        box.classList.remove('sadx');
        box.classList.remove('sado');
        // **Remove click event listener**
        box.removeEventListener('click', boxClicked); 
    });

    playerText.innerHTML = 'Tic Dice and Roll';
    
    currentPlayer = X_TEXT;
    gameEnded = false;
    dice.innerHTML = `<img src="dice.png" alt="Dice">`;
    turnIndicator.textContent = ''; // Clear turn indicator
    rollBtn.disabled = false; // Re-enable roll button
}



function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition

        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            updateScoreboard(currentPlayer);

            // Add the winning face class to the winner's boxes
            boxes.forEach(box => {
                if (box.classList.contains(currentPlayer.toLowerCase())) {
                    box.classList.add(`happy${currentPlayer.toLowerCase()}`);
                }
            });

            // Add the sad face class to the loser's boxes
            const loser = currentPlayer === X_TEXT ? O_TEXT : X_TEXT;
            boxes.forEach(box => {
                if (box.classList.contains(loser.toLowerCase())) {
                    box.classList.add(`sad${loser.toLowerCase()}`);
                }
            });

            // Reset the game state for the next round
            gameEnded = true;
            rollBtn.disabled = true;
            boxes.forEach(box => box.removeEventListener('click', boxClicked));

            return [a, b, c];
        }
    }

    // No winner, check for a draw
    if (spaces.every(space => space !== null)) {
        playerText.innerHTML = "It's a draw!";
        gameEnded = true;
        rollBtn.disabled = true;
        boxes.forEach(box => box.removeEventListener('click', boxClicked));
        return false;
    }

    return false; 
}


function updateScoreboard(player) {
    if (player === X_TEXT) {
        let player1Score = parseInt(document.getElementById('player1sc').textContent);
        player1Score++;
        document.getElementById('player1sc').textContent = player1Score;
    } else {
        let player2Score = parseInt(document.getElementById('player2sc').textContent);
        player2Score++;
        document.getElementById('player2sc').textContent = player2Score;
    }
}

startGame()
