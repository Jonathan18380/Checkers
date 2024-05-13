let checkerBoard; //creating variables here
let player1; // Black player
let player2; // Red player
let element; // the piece we selected to move
let highlightEvent = [];
let activePiece;

function createCheckerBoard(size) {
  //Function to set up the game and creates the checkerBoard of the size of what was selected in the HTML
  player1 = new Player("black");
  player2 = new Player("red");

  player1.startTurn(); // Set the initial turn to the black player
  checkerBoard = new CheckerBoard(size); //Creates the board
}

function initiateMove(piece, checkerBoard) {
  // Function for beginning the move process for the pieces. (Set as an onclick element in the class).
  if (
    (player1.isTurn && piece.classList.contains("black"))
    ||(player2.isTurn && piece.classList.contains("red"))
    ||(player1.isTurn && piece.classList.contains("blackKing"))
    ||(player2.isTurn && piece.classList.contains("redKing"))
  ) {
    let row = parseInt(piece.getAttribute("data-row"));
    let col = parseInt(piece.getAttribute("data-col"));
    if(player1.isTurn && piece.classList.contains("black") && (row === 0)){
      piece.setAttribute("class", "blackKing");
      piece.setAttribute("src", "CheckerBlackKing.png")
    } else if(player2.isTurn && piece.classList.contains("red") && (row === checkerBoard.size)){
      piece.setAttribute("class", "redKing");
      piece.setAttribute("src", "CheckerRedKing.png")
    }
    highlight(piece, row, col);
  }
  return false;
}

function highlight(piece, row, col) {
  removeHighlights();
  // Function to Highlight valid moves
  if (piece.classList[0] === "black") {
    // console.log(row-1,col+1)
    addHighlightListener(piece, row - 1, col + 1);
    addHighlightListener(piece, row - 1, col - 1);
    addCaptureHighlightListener(piece, row - 2, col + 2, row - 1, col + 1);
    addCaptureHighlightListener(piece, row - 2, col - 2, row - 1, col - 1);
  } else if(piece.classList[0] === "red"){
    addHighlightListener(piece, row + 1, col + 1);
    addHighlightListener(piece, row + 1, col - 1);
    addCaptureHighlightListener(piece, row + 2, col + 2, row + 1, col + 1);
    addCaptureHighlightListener(piece, row + 2, col - 2, row + 1, col - 1);
  } 
   else {
    addHighlightListener(piece, row + 1, col + 1);
    addHighlightListener(piece, row + 1, col - 1);
    addHighlightListener(piece, row - 1, col + 1);
    addHighlightListener(piece, row - 1, col - 1);
    addCaptureHighlightListener(piece, row + 2, col + 2, row + 1, col + 1);
    addCaptureHighlightListener(piece, row + 2, col - 2, row + 1, col - 1);
    addCaptureHighlightListener(piece, row - 2, col + 2, row - 1, col + 1);
    addCaptureHighlightListener(piece, row - 2, col - 2, row - 1, col - 1);
  }
}

function addHighlightListener(piece, row, col) {
  if (row >= 0 && col >= 0 && col < checkerBoard.size && row < checkerBoard.size && !checkerBoard.hasPieceAt(row, col)) {
    const cell = checkerBoard.table.rows[row].cells[col];
    cell.classList.add("highlight");

    const highlightMoveHandler = () => highlightMove(piece, col, row);

    cell.addEventListener("click", highlightMoveHandler);
    // Store the reference to the handler function in a property of the cell for removal later
    cell.highlightMoveHandler = highlightMoveHandler;
  }
}

function addCaptureHighlightListener(piece, newRow, newCol, capturedRow, capturedCol) {     //will highlight the tiles that are an additional adjacent tile if they can be
  //captured
  if (
     //gonna check the new row and new col for both top left and top right past the piece
    newRow >= 0 && 
    newCol >= 0 &&
    newCol < checkerBoard.size &&
    newRow < checkerBoard.size &&
    //gonna check if no pieces are occupying that space
    !checkerBoard.hasPieceAt(newRow, newCol) &&  
    //Checks if the adjacent rows are empty from the potential captured piece, if so then they can be captured.     
    checkerBoard.hasPieceAt(capturedRow, capturedCol)
  ) {
    const cell = checkerBoard.table.rows[newRow].cells[newCol];
    cell.classList.add("highlight");      //adds highlights class to the cell

    const highlightMoveHandler = () => highlightMove(piece, newCol, newRow);

    cell.addEventListener("click", highlightMoveHandler);
    // going to store the handler as a reference (can maybe be used later lol havent seen this before lmao)
    cell.highlightMoveHandler = highlightMoveHandler;
  }
}

// Add this function to your existing code
function capturePiece(row, col) {
  const cell = checkerBoard.table.rows[row].cells[col];
  const capturedPiece = cell.firstChild; // Get the captured piece(s) 
  cell.removeChild(capturedPiece); // Removes the captured piece from the cell 
}

// Highlights the valid moves from the arguments that are passed by [row][col]
function highlightMove(piece, col, row) {
  const newCell = checkerBoard.table.rows[row].cells[col];
  const currentRow = parseInt(piece.getAttribute("data-row"));
  const currentCol = parseInt(piece.getAttribute("data-col"));
  const originalCell = checkerBoard.table.rows[currentRow].cells[currentCol];

  // Check if the move is a capture (piece moved 2+ spots)
  const isCapture = Math.abs(row - currentRow) > 1 || Math.abs(col - currentCol) > 1;

  // If it's a capture, remove the captured piece
  if (isCapture) {
    const capturedRow = (row + currentRow) / 2; // Calculate the row of the captured piece
    const capturedCol = (col + currentCol) / 2; // Calculate the col of the captured piece
    capturePiece(capturedRow, capturedCol);
  }

  originalCell.removeChild(piece);

  piece.setAttribute("data-row", row);
  piece.setAttribute("data-col", col);

  newCell.appendChild(piece);
  removeHighlights();
  checkerBoard.updatePieceCounts();
  switchTurns();
}


function removeHighlights() {
  let cells = document.querySelectorAll(".highlight");
  cells.forEach((cell) => {
    cell.removeEventListener("click", cell.highlightMoveHandler);
    cell.classList.remove("highlight");
  });
}

//Function to switch turns, when it's true it will be player 1's turn, if false then player 2 turn.
function switchTurns() {
  player1.isTurn = !player1.isTurn;
  player2.isTurn = !player2.isTurn;
}
//Player class that holds the player's turn, color of their pieces, and starts/ends their turns.
class Player {
  constructor(color) {
    this.color = color;
    this.isTurn = false;
  }
  startTurn() {
    this.isTurn = true;
  }
  endTurn() {
    this.isTurn = false;
  }
}
//Class for the checkerPieces that holds the color and img and position.
class CheckerPiece {
  constructor(color, src, row, col) {
    this.color = color;
    this.src = src;
    this.position = { row, col };
  }

  createImageElement() {
    const piece = document.createElement("img");
    piece.setAttribute("src", this.src);
    piece.setAttribute("class", `${this.color.toLowerCase()} piece`);
    // console.log(piece.classList)

    piece.setAttribute("onclick", "initiateMove(this, checkerBoard)");
    piece.setAttribute("data-row", this.position.row);
    piece.setAttribute("data-col", this.position.col);
    return piece;
  }
}
//Class for the Coordinate for the highlight and attack function(not entirely sure if we need this anymore as the logic changed)
class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class CheckerBoard {
  constructor(size) {
    this.size = size;
    this.table = document.createElement("table");
    this.table.setAttribute("class", "board");
    this.space();
    this.generateBoard();
    this.elapsedSeconds = 0;
    checkerBoard = this;
    document.body.innerHTML = "";
    document.body.append(this.table);
    this.createTimer(); // Div holding the timer.
    this.changePlayer1Color(); // Call the function to create player 1 color dropdown menu so it appends to the board with the function on the bottom.
    this.changePlayer2Color(); // Call the function to create player 2 color dropdown menu so it appends to the board with the function on the bottom.
    this.createRestart(); // Restart button
    this.createBoardColor();
    this.createInfo(); // Updates the amount of pieces each player has (Black and Red)
    this.updatePieceCounts();
  }

  space() {
    var space = document.createElement("div");
    space.setAttribute("id", "space");
    document.body.append(space);
  }

  createInfo() {
    let info = document.createElement("div");
    info.setAttribute("class", "info");
    document.body.append(info);
  }
  generateBoard() {
    for (let i = 0; i < this.size; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < this.size; j++) {
        let col = document.createElement("td");

        if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
          col.setAttribute("class", "white");
          col.style.backgroundImage = "url(white.jpg)";
        } else if ((i % 2 == 0 && j % 2 == 1) || (i % 2 == 1 && j % 2 == 0)) {
          col.setAttribute("class", "black");
          col.style.backgroundImage = "url(black.jpg)";
        }

        if (i < 3 && col.classList.contains("black")) {
          const redPiece = new CheckerPiece("red", "CheckerRedPawn.png", i, j);
          col.appendChild(redPiece.createImageElement());
        } else if (i > this.size - 4 && col.classList.contains("black")) {
          const blackPiece = new CheckerPiece("black", "CheckerBlackPawn.png", i, j);
          col.appendChild(blackPiece.createImageElement());
        }
        row.appendChild(col);
      }
      this.table.appendChild(row);
    }
  }
  hasPieceAt(row, col) {
    //Determines if a piece is at a certain cell[col][row]
    const cell = this.table.rows[row].cells[col];
    if (col > checkerBoard.size || col < 0) {
      return;
    }
    if (row > checkerBoard.size || row < 0) {
      return;
    }
    const piece = cell.querySelector(".piece");
    return piece !== null;
  }

  countBlackPieces() {
    const blackPieces = document.getElementsByClassName("piece black");
    const blackKings = document.getElementsByClassName("blackKing")
    const add = blackPieces.length + blackKings.length
    return add;
  }

  countRedPieces() {
    const redPieces = document.getElementsByClassName("piece red");
    const redKings = document.getElementsByClassName("redKing");
    const add = redPieces.length + redKings.length
    return add;
  }

  checkForWinner() {
    const blackPieceCount = this.countBlackPieces();
    const redPieceCount = this.countRedPieces();

    if (blackPieceCount === 0) {
      alert("Red player wins!"); // Display an alert or update the UI to indicate the winner
      this.restart(); // Restart the game after displaying the winner
    } else if (redPieceCount === 0) {
      alert("Black player wins!"); // Display an alert or update the UI to indicate the winner
      this.restart(); // Restart the game after displaying the winner
    }
  }

  updatePieceCounts() {
    const blackPieceCount = this.countBlackPieces();
    const redPieceCount = this.countRedPieces();
    const info = document.querySelector(".info");

    if (info) {
      info.innerHTML = `Number of black pieces: ${blackPieceCount}<br>Number of red pieces: ${redPieceCount}`;
    }

    // Check for a winner after updating piece counts
    this.checkForWinner();
  }
  //Restart function created.
  createRestart() {
    let restart = document.createElement("button");
    restart.innerHTML = "Restart";
    restart.setAttribute("onclick", "restart()");
    restart.setAttribute("class", "restart");
    document.body.append(restart);
  }
  //Timer created
  createTimer() {
    this.timer = document.createElement("div");
    this.timer.innerHTML = "Time: 00:00"; // Initial timer value
    this.timer.setAttribute("class", "timer");
    document.body.append(this.timer);
  }
  //Function to change the board's color (not working)
  createBoardColor() {
    this.bColorContainer = document.createElement("div");
    this.bColorContainer.innerHTML = "Board Color";
    this.bColorContainer.setAttribute('class', 'boardColor');
    
    // Create an input element of type color
    this.bColor = document.createElement("input");
    this.bColor.setAttribute("type", 'color');
    //Set to default color so the board won't change colors right away
    this.bColor.setAttribute("value", '#ff0000'); 
    //Class to adjust in CSS
    this.bColor.setAttribute("class", 'boardColor-input'); 
  
    // Add an event listener to handle color changes(not working)
    this.bColor.addEventListener('input', this.changeBoardColor.bind(this));
  
    // Append the color input to the container (not working)
    this.bColorContainer.appendChild(this.bColor);
    
    // Append the container to the body(not working)
    document.body.append(this.bColorContainer);
  }
  
  changeBoardColor() {
    // Remove white class images by grabbing all the white cells then removing them all with removeChild. (not working)
    const whitePieces = document.querySelectorAll(".white .piece img");
    whitePieces.forEach((img) => {
      img.parentNode.removeChild(img);
    });
  
    // Get the selected color from the input element (not working)
    const newColor = this.bColor.value;
  
    // Set the background color of the table to the selected color(not working)
    this.table.style.backgroundColor = newColor;
  
    // Set the background image of the table to none(not working)
    this.table.style.backgroundImage = 'none';
  }
  



changePlayer1Color() {
  this.playerColor = document.createElement("div");
  this.playerSelect = document.createElement("select");
  this.playerSelect.setAttribute("id", "colorSelect");
  this.playerColor.innerHTML = "Select Player 1 Color";
  this.playerOption0 = document.createElement("option");
  this.playerOption = document.createElement("option");
  this.playerOption2 = document.createElement("option");
  this.playerOption3 = document.createElement("option");
  this.playerOption4 = document.createElement("option");
  this.playerOption5 = document.createElement("option");

  this.playerOption0.value = "-";
  this.playerOption.value = "Red";
  this.playerOption2.value = "Green";
  this.playerOption3.value = "Blue";
  this.playerOption4.value = "Black";
  this.playerOption5.value = "White";

  this.playerOption0.textContent = "-";
  this.playerOption.textContent = "Red";
  this.playerOption2.textContent = "Green";
  this.playerOption3.textContent = "Blue";
  this.playerOption4.textContent = "Black";
  this.playerOption5.textContent = "White";

  this.playerColor.setAttribute("class", "colorSelect");
  this.playerSelect.appendChild(this.playerOption0);
  this.playerSelect.appendChild(this.playerOption);
  this.playerSelect.appendChild(this.playerOption2);
  this.playerSelect.appendChild(this.playerOption3);
  this.playerSelect.appendChild(this.playerOption4);
  this.playerSelect.appendChild(this.playerOption5);

  // Corrected this line to remove the parentheses from handleChanges
  this.playerSelect.onchange = this.handleChanges;

  //this.playerSelect.onchange = this.handleChanges;
  this.playerColor.appendChild(this.playerSelect);
  document.body.append(this.playerColor);
}

handleChanges() {
  const selectedOption = document.getElementById("colorSelect").value;
  console.log(selectedOption)
  const playerPiece = document.querySelectorAll(".piece.black"); // Adjust this selector based on your HTML structure
  const playerPieceKing = document.querySelector(".blackKing"); // Assuming there is only one black king

  // Update the src attribute based on the selected option
  switch (selectedOption) {
    case "Red":
      playerPiece.forEach(pawn => (pawn.src = "CheckerRedPawn.png"));
      if(playerPieceKing){
        playerPieceKing.src = "CheckerRedKing.png";
      }
      break;
    case "Green":
      playerPiece.forEach(pawn => (pawn.src = "CheckerGreenPawn.jpg"));  
      if(playerPieceKing){
        playerPieceKing.src = "CheckerGreenKing.jpg";
      }
      break;
    case "Blue":
      playerPiece.forEach(pawn => (pawn.src = "CheckerBluePawn.jpg"));  //WHY IS THE FILE NOT FOUND>!?!?!?!?!?!?!?!?!
      if(playerPieceKing){
        playerPieceKing.src = "CheckerBlueKing.jpg";
      }
      break;
    case "Black":
      playerPiece.forEach(pawn => (pawn.src = "CheckerBlackPawn.png"));
      if(playerPieceKing){
        playerPieceKing.src = "CheckerBlackKing.png";
      }
      break;
    case "White":
      playerPiece.forEach(pawn => (pawn.src = "CheckerWhitePawn.jpg"));
      if(playerPieceKing){
        playerPieceKing.src = "CheckerWhiteKing.jpg";
      }
      break;
    default:
      // Handle the default case or do nothing
      console.log("nothings happening in the case");
      break;
  }
}

// Player 2's version of changePlayer2Color

changePlayer2Color() {
  this.playerColor = document.createElement("div");
  this.playerSelect = document.createElement("select");
  this.playerSelect.setAttribute("id", "colorSelect2"); 
  this.playerColor.innerHTML = "Select Player 2 Color";
  this.playerOption0 = document.createElement("option");
  this.playerOption = document.createElement("option");
  this.playerOption2 = document.createElement("option");
  this.playerOption3 = document.createElement("option");
  this.playerOption4 = document.createElement("option");
  this.playerOption5 = document.createElement("option");

  this.playerOption0.value = "-";
  this.playerOption.value = "Red";
  this.playerOption2.value = "Green";
  this.playerOption3.value = "Blue";
  this.playerOption4.value = "Black";
  this.playerOption5.value = "White";

  this.playerOption0.textContent = "-";
  this.playerOption.textContent = "Red";
  this.playerOption2.textContent = "Green";
  this.playerOption3.textContent = "Blue";
  this.playerOption4.textContent = "Black";
  this.playerOption5.textContent = "White";

  this.playerColor.setAttribute("class", "colorSelect");
  this.playerSelect.appendChild(this.playerOption0);
  this.playerSelect.appendChild(this.playerOption);
  this.playerSelect.appendChild(this.playerOption2);
  this.playerSelect.appendChild(this.playerOption3);
  this.playerSelect.appendChild(this.playerOption4);
  this.playerSelect.appendChild(this.playerOption5);

  // Corrected this line to remove the parentheses from handleChanges
  this.playerSelect.onchange = this.handleChanges2;

  //this.playerSelect.onchange = this.handleChanges;
  this.playerColor.appendChild(this.playerSelect);
  document.body.append(this.playerColor);
}


handleChanges2() {
  const selectedOption = document.getElementById("colorSelect2").value;
  console.log(selectedOption)
  const playerPiece = document.querySelectorAll(".piece.red"); // Adjust this selector based on your HTML 
  const playerPieceKing = document.querySelector(".redKing"); // Assuming there is a red king

  // Update the src attribute based on the selected option chosen by player 2, similar to player 1
  switch (selectedOption) {
    case "Red":
      playerPiece.forEach(pawn => (pawn.src = "CheckerRedPawn.png"));
      if(playerPieceKing){
        playerPieceKing.src = "CheckerRedKing.png";
      }
      break;
    case "Green":
      playerPiece.forEach(pawn => (pawn.src = "CheckerGreenPawn.jpg"));  //file not found?
      if(playerPieceKing){
        playerPieceKing.src = "CheckerGreenKing.jpg";
      }
      break;
    case "Blue":
      playerPiece.forEach(pawn => (pawn.src = "CheckerBluePawn.jpg"));  //file not found?
      if(playerPieceKing){
        playerPieceKing.src = "CheckerBlueKing.jpg";
      }
      break;
    case "Black":
      playerPiece.forEach(pawn => (pawn.src = "CheckerBlackPawn.png"));
      if(playerPieceKing){
        playerPieceKing.src = "CheckerBlackKing.png";
      }
      break;
    case "White":
      playerPiece.forEach(pawn => (pawn.src = "CheckerWhitePawn.jpg"));
      if(playerPieceKing){
        playerPieceKing.src = "CheckerWhiteKing.jpg";
      }
      break;
    default:
      // Handle the default case or do nothing
      console.log("nothings happening in the case");
      break;
  }
}
}

function restart() {
  //function to restart the game by redirection the player to the main game.html page.
  document.body.innerHTML = "";
  location.href = "game.html";
}

function updateTimer() {
  checkerBoard.elapsedSeconds++; //Targets the elapsedSeconds declared in checkerBoard

  const minutes = Math.floor(checkerBoard.elapsedSeconds / 60); // Calculate minutes
  const seconds = checkerBoard.elapsedSeconds % 60; // Calculate seconds

  checkerBoard.timer.innerHTML = `Time: ${String(minutes).padStart(
    2,"0")}:${String(seconds).padStart(2, "0")}`; // Update the timer display
}

setInterval(updateTimer, 1000); //Updates timer every 1 second
