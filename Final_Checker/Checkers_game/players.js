class Player {
    constructor(username, win, lose, draw, totalGames, totalTime) {
        this.username = username;
        this.win = win;
        this.lose = lose;
        this.draw = draw;
        this.totalGames = totalGames;
        this.totalTime = totalTime;
    }
}

const users = [
    new Player("Horne",  81, 77, 6, 252, 880),
    new Player("Jackson", 168, 71, 8, 377, 1015),
    new Player("Cohen",  86, 118, 8, 290, 478),
    new Player("Macdonald",  30, 35, 3, 366, 2554),
    new Player("Stanton",  300, 123, 2, 273, 1492),
    new Player("Bauer",  20, 193, 5, 223, 2526),
    new Player("Holder",  200, 54, 7, 272, 1433)
];
const items = users;

const itemJSON = JSON.stringify(items);

function generate() {
    const itemJSON = JSON.stringify(users);
    document.getElementById("jsonOutput").innerHTML = itemJSON;
}


let players = [
    { username: "Horne", win: 81, lose: 77, draw: 6, total_game:252, total_time:880},
    { username: "Jackson", win: 168, lose: 71, draw: 8, total_game: 377, total_time: 1015},
    { username: "Cohen", win: 86, lose: 118, draw: 8, total_game: 290, total_time: 478},
    { username: "Macdonanld", win: 30, lose: 35, draw: 3, total_game:366, total_time:2554},
    { username: "Stanton", win: 300, lose: 123, draw: 2, total_game:273, total_time:1492},
    { username: "Bauer", win: 20, lose: 193, draw: 5, total_game:223, total_time:2526},
    { username: "Holder", win: 200, lose: 54, draw: 7, total_game:272, total_time:1433},
]; 

let currentPlayerIndex = 0;

function loadDataFromJSON() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                players = JSON.parse(httpRequest.responseText).map(playerData => 
                    new Player(playerData.username, playerData.password, playerData.win, playerData.lose, playerData.draw, playerData.total_games, playerData.total_time)
                );
                displayPlayer(0); // Display the first player
            } else {
                console.error("Error fetching data from the server. Status: " + httpRequest.status);
            }
        }
    };
    httpRequest.open('GET', 'database.php', true); // Adjust URL for your player data
    httpRequest.send();
}


function displayPlayer(index) {
    if (index >= 0 && index < players.length) {
        let player = players[index];
        document.getElementById("playerInfo").innerHTML = `
            <h3>${player.username}</h3>
            <p>Wins: ${player.win}</p>
            <p>Losses: ${player.lose}</p>
            <p>Draws: ${player.draw}</p>
            <p>Total Games: ${player.totalGames}</p>
            <p>Total Time Played: ${player.totalTime}</p>
        `;
        currentPlayerIndex = index;
    }
}

function displayPlayer(index, select) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                let data;
                try {
                    data = JSON.parse(httpRequest.responseText);
                } catch (error) {
                    if (counter > 0) counter = 0;
                    else { counter = items.length - 1; }
                    displayDigimon(counter, select);
                }
                let section = document.getElementById('player');
                if (section.innerHTML == '') { // Assuming 'digimon' is the container for your Digimon details
                    displayDigimonDetails(data);
                }
                let newSection = document.getElementById('newSection'); // Change 'newSection' to match your HTML structure
                newSection.innerHTML = setHTMLforDigimon(data);
            }
        }
    }
    httpRequest.open('GET', 'fetchplayer.php?index=' + index, true); // Adjust the URL to match your PHP endpoint
    httpRequest.send();
}


function sortAlphabetically() {
    const sortedUsers = [...users].sort((a, b) =>
        a.username.localeCompare(b.username)
    );
    displaySortedElements(sortedUsers);
}

function displaySortedElements(sortedItems) {
    const displayArea = document.getElementById("sortedList");
    displayArea.innerHTML = "";
    sortedItems.forEach((player) => {
        const playerDiv = document.createElement("div");
        playerDiv.textContent = `${player.username} - Wins: ${player.win}, Losses: ${player.lose}, Draws: ${player.draw}, Total Games: ${player.totalGames}, Total Time: ${player.totalTime}`;
        displayArea.appendChild(playerDiv);
    });
}

window.onload = function () {
    startUp();
};

function startUp() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                console.log(httpRequest.responseText);
            } else {
                console.error("Error fetching data from the server. Status: " + httpRequest.status);
            }
        }
    };
    httpRequest.open('GET', 'database.php', true);
    httpRequest.send();

}

function sortByWins() {
    players.sort((a, b) => b.win - a.win); // For descending order
    displayPlayers();
}

function sortByTotalGames() {
    players.sort((a, b) => b.totalGames - a.totalGames);
    displayPlayers();
}

function sortByTotalTime() {
    players.sort((a, b) => b.total_time - a.total_time); // Sort by total time
    displayPlayers(); // Update the display
}


function displayPlayers() {
    const displayArea = document.getElementById("sortedList");
    if (!displayArea) {
        console.error("Element with ID 'sortedList' not found.");
        return;
    }

    displayArea.innerHTML = ""; // Clear previous content

    players.forEach((player) => {
        const playerDiv = document.createElement("div");
        playerDiv.textContent = `${player.username} - Wins: ${player.win}, Total Games: ${player.totalGames}, Total Time: ${player.totalTime}`;
        displayArea.appendChild(playerDiv);
    });
}
