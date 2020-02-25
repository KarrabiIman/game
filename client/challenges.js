
var scores, roundScore, activePlayer, gamePlaying;

init();

var lastDice;

function rollDice() {
    if (gamePlaying) {
        var dice1 = Math.floor(Math.random() * 6) + 1;
        var dice2 = Math.floor(Math.random() * 6) + 1;

        document.getElementById('dice-1').style.display = 'block';
        document.getElementById('dice-2').style.display = 'block';
        document.getElementById('dice-1').src = 'dice-' + dice1 + '.png';
        document.getElementById('dice-2').src = 'dice-' + dice2 + '.png';

        if (dice1 !== 1 && dice2 !== 1) {
            roundScore += dice1 + dice2;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        }
        else {
            nextPlayer();
        }
    }
}

document.querySelector('.btn-hold').addEventListener('click', function () {
    if (gamePlaying) {
        var input = document.querySelector('.final-score').value;
        if (input) {
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "http://localhost:3001/api/win-score", true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify({ "winScore": input }));
        }



        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3001/api/score", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({ "newScore": { "name": `player${activePlayer}`, "point": roundScore } }));
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(this.responseText);
                if (result.winner == null) {
                    document.querySelector(`#score-${activePlayer}`).textContent = result.score;
                    nextPlayer();
                }
                else {
                    winnerIntro(result, activePlayer)
                }
            }
        };
    }
});


function nextPlayer() {
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
}

document.querySelector('.btn-new').addEventListener('click', init);

function winnerIntro(result, activePlayer) {
    if (result.winner !== `player${activePlayer}`) {
        return;
    }
    document.querySelector(`#score-${activePlayer}`).textContent = result.score;
    document.querySelector(`#name-${activePlayer}`).textContent = 'Winner!';
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
    document.querySelector(`.player-${activePlayer}-panel`).classList.add('winner');
    document.querySelector(`.player-${activePlayer}-panel`).classList.remove('active');
    gamePlaying = false;
}

function init() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3001/api/new-game", true);
    xhttp.send();


    activePlayer = 0;
    roundScore = 0;
    gamePlaying = true;

    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
}