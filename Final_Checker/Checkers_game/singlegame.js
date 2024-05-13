let checkerBoard; //creating variables here
let player1; // Black player
let player2; // Red player
let element; // the piece we selected to move
let highlightEvent = [];
let activePiece;
let isComputerTurn = false;

//Function to switch turns, when it's true it will be player 1's turn, if false then player 2 turn. In single player it should allow computer's turn instead.
  function switchTurns() {
    player1.isTurn = !player1.isTurn;
    player2.isTurn = !player2.isTurn;
    // If it's now player2's turn and it's a single-player game, call the computerMove function
    if (player2.isTurn) {
      computerMove();
    }
  }
  //Computer's logic
  function computerMove() {
    //Grabs all the red pieces for the computer to use (Computer will always be player 2)
    const pieces = document.querySelectorAll('.piece.red'); 
    // Filter out pieces that can make a capture move
    const capturingPieces = Array.from(pieces).filter(piece => {
      const row = parseInt(piece.getAttribute('data-row'));
      const col = parseInt(piece.getAttribute('data-col'));
      //Checks if the adjacent spots are valid or not.
      return ((row + 1 < checkerBoard.size && col + 1 < checkerBoard.size && !checkerBoard.hasPieceAt(row + 1, col + 1)) || (row + 1 < checkerBoard.size && col - 1 >= 0 && !checkerBoard.hasPieceAt(row + 1, col - 1)));
    });
    // Chooses a random piece to move from the ones that avoided getting filtered. A turnary operation is being used to deterine if a piece can be taken or not and what 
    //to do. If a piece can be taken it shall use "capturingPieces" but if not then it will move randomly.
    const randomPiece = capturingPieces.length > 0 ? getRandomElement(capturingPieces) : getRandomElement(pieces);
  
    // Get the possible moves for the chosen piece
    const row = parseInt(randomPiece.getAttribute('data-row'));
    const col = parseInt(randomPiece.getAttribute('data-col'));
    const possibleMoves = [];
    possibleMoves.push({ newRow: row + 1, newCol: col + 1 });
    possibleMoves.push({ newRow: row + 1, newCol: col - 1 });
  
    // Filter out invalid moves or gets valid moves
    const validMoves = possibleMoves.filter(move => {
      return (
        move.newRow >= 0 &&
        move.newCol >= 0 &&
        move.newCol < checkerBoard.size &&
        move.newRow < checkerBoard.size &&
        !checkerBoard.hasPieceAt(move.newRow, move.newCol)
      );
    });
  
    // Choose a random valid move
    const randomMove = getRandomElement(validMoves);
  
    // Perform the move
    highlightMove(randomPiece, randomMove.newCol, randomMove.newRow);
  }
  //Function to select random move from array
  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  //creates checkerboard and players.
  //Function to set up the game and creates the checkerBoard of the size of what was selected in the HTML

function createCheckerBoard(size) {
  player1 = new Player("black");
  player2 = new Player("red");

  player1.startTurn(); // Set the initial turn to the black player
  checkerBoard = new CheckerBoard(size); //Creates the board
}
  // Function for beginning the move process for the pieces. (Set as an onclick element in the class).
function initiateMove(piece, checkerBoard) {
  //Checks who's turn it is, then restricts the person to their piece for pawns and kings.
  if (
    (player1.isTurn && piece.classList.contains("black"))
    ||(player2.isTurn && piece.classList.contains("red"))
    ||(player1.isTurn && piece.classList.contains("blackKing"))
    ||(player2.isTurn && piece.classList.contains("redKing"))
  ) {
    let row = parseInt(piece.getAttribute("data-row"));
    let col = parseInt(piece.getAttribute("data-col"));
    //Creates the king
    if(player1.isTurn && piece.classList.contains("black") && (row === 0)){
      piece.setAttribute("class", "blackKing");
      piece.setAttribute("src", "CheckerBlackKing.png")
      //highlights the squares.
    } else
    highlight(piece, row, col);
  }
  return false;
}
//Function to highlight any valid move
function highlight(piece, row, col) {
  removeHighlights();
      //Highlights valid move at the proper adjacent squares, for blacks it will be row -1 (going upwards) and col-1 or col+1 for left and right. Unless an attack
      //can be made. in which the addCaptureHighlightListener function procs where it allows an attack.
  if (piece.classList[0] === "black") {
    addHighlightListener(piece, row - 1, col + 1);
    addHighlightListener(piece, row - 1, col - 1);
    addCaptureHighlightListener(piece, row - 2, col + 2, row - 1, col + 1);
    addCaptureHighlightListener(piece, row - 2, col - 2, row - 1, col - 1);
    //Same function except for red player
  } else if(piece.classList[0] === "red"){
    addHighlightListener(piece, row + 1, col + 1);
    addHighlightListener(piece, row + 1, col - 1);
    addCaptureHighlightListener(piece, row + 2, col + 2, row + 1, col + 1);
    addCaptureHighlightListener(piece, row + 2, col - 2, row + 1, col - 1);
  } 
  //Same function except for king pieces (red and black)
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
//adds highlight listener at the cell. This will be the start of the attack.
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

function addCaptureHighlightListener(piece, newRow, newCol, capturedRow, capturedCol) {     //will highlight the tiles that
  if (
    newRow >= 0 &&  //gonna check the new row and new col for both top left and top right past the piece
    newCol >= 0 &&
    newCol < checkerBoard.size &&
    newRow < checkerBoard.size &&
    !checkerBoard.hasPieceAt(newRow, newCol) &&       //gonna check if no pieces are occupying that space
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


//Captures the piece that gets jumped.
function capturePiece(row, col) {
  const cell = checkerBoard.table.rows[row].cells[col];
  const capturedPiece = cell.firstChild; // Get the captured piece
  cell.removeChild(capturedPiece); // Remove the captured piece from the cell
}

//HighlightMove will highlight the coordinates that can be moved to
function highlightMove(piece, col, row) {
  const newCell = checkerBoard.table.rows[row].cells[col];
  const currentRow = parseInt(piece.getAttribute("data-row"));
  const currentCol = parseInt(piece.getAttribute("data-col"));
  const originalCell = checkerBoard.table.rows[currentRow].cells[currentCol];

  // Checks if the move is a possible capture target (piece moved 2+ spots)
  const isCapture = Math.abs(row - currentRow) > 1 || Math.abs(col - currentCol) > 1;

  // If it's a capture, remove the captured piece by calling capture piece by passing the capturable piece's location through capturePiece.
  if (isCapture) {
    const capturedRow = (row + currentRow) / 2; // Calculate the row of the captured piece
    const capturedCol = (col + currentCol) / 2; // Calculate the col of the captured piece
    capturePiece(capturedRow, capturedCol);
  }
  //removes piece from the old cell so it looks like it's moving.
  originalCell.removeChild(piece);
  //Piece's new location
  piece.setAttribute("data-row", row);
  piece.setAttribute("data-col", col);
  //New cell will append the piece
  newCell.appendChild(piece);
  //removes highlight
  removeHighlights();
  //Update the pieces so that it will keep track when a win condition is met.
  checkerBoard.updatePieceCounts();
  //switches turn (Black -> red, red -> black)
  switchTurns();
}

//removes highlight when a piece moves
function removeHighlights() {
  let cells = document.querySelectorAll(".highlight");
  cells.forEach((cell) => {
    cell.removeEventListener("click", cell.highlightMoveHandler);
    cell.classList.remove("highlight");
  });
  //player class to store the color and turn of the player
}
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
//Piece class to hold color, img, and position.
class CheckerPiece {
  constructor(color, src, row, col) {
    this.color = color;
    this.src = src;
    this.position = { row, col };
  }
  //puts the image of our choice onto the board.
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
//coordinate class for the attack function (not sure if still need)
class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
//CheckerBoard class that will create the board, decide how it looks, will change the color, sets each cell's attributes, etc.
class CheckerBoard {
  constructor(size) {
    //Size of board from html selection
    this.size = size;
    //Creates table in DOM
    this.table = document.createElement("table");
    //Gives the table a class so we can design in CSS
    this.table.setAttribute("class", "board");
    this.space();
    this.generateBoard();
    this.elapsedSeconds = 0;
    checkerBoard = this;
    document.body.innerHTML = "";
    document.body.append(this.table);
    this.createTimer(); // Div holding the timer.
    this.changePlayer1Color(); // Call the method to create player 1 color dropdown
    this.changePlayer2Color(); // Call the method to create player 2 color dropdown
    this.createRestart(); // Restart button
    this.createBoardColor();
    this.createInfo(); // Updates the amount of pieces each player has (Black and Red)
    this.updatePieceCounts();
  }
  //creates the space which will be used to create a gap from the top of the screen to the center. (We will adjust this in CSS to take up invisible space.)
  space() {
    var space = document.createElement("div");
    space.setAttribute("id", "space");
    document.body.append(space);
  }
  //Info will hold the information such as scoreboard.
  createInfo() {
    let info = document.createElement("div");
    info.setAttribute("class", "info");
    document.body.append(info);
  }
  //Function to generate the board depending on the HTML selection. (8x8 or 10x10)
  generateBoard() {
    for (let i = 0; i < this.size; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < this.size; j++) {
        let col = document.createElement("td");
        //White cells
        if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
          col.setAttribute("class", "white");
          col.style.backgroundImage = "url(white.jpg)";
          //Black cells (players play on this one)
        } else if ((i % 2 == 0 && j % 2 == 1) || (i % 2 == 1 && j % 2 == 0)) {
          col.setAttribute("class", "black");
          col.style.backgroundImage = "url(black.jpg)";
        }
        //Sets red pieces on black class cells up until the 3rd row (row 0, row 1, row 2)
        if (i < 3 && col.classList.contains("black")) {
          const redPiece = new CheckerPiece("red", "CheckerRedPawn.png", i, j);
          //creates image of the red piece and appends to board.
          col.appendChild(redPiece.createImageElement());
          //same for black pieces
        } else if (i > this.size - 4 && col.classList.contains("black")) {
          const blackPiece = new CheckerPiece("black", "CheckerBlackPawn.png", i, j);
          col.appendChild(blackPiece.createImageElement());
        }
        row.appendChild(col);
      }
      this.table.appendChild(row);
    }
  }
  //determines if a piece is at a certain cell [col][row]
  hasPieceAt(row, col) {
    const cell = this.table.rows[row].cells[col];
    if (col > checkerBoard.size || col < 0) {
      return;
    }
    //disables going out of bound
    if (row > checkerBoard.size || row < 0) {
      return;
    }
    //to deallocate the set attributes I added from the eventlisteners (prevents 2 pieces from moving at the same time)
    const piece = cell.querySelector(".piece");
    return piece !== null;
  }

  countBlackPieces() {
    //counts black peices (pawns and kings) then posts
    const blackPieces = document.getElementsByClassName("piece black");
    const blackKings = document.getElementsByClassName("blackKing")
    const add = blackPieces.length + blackKings.length
    return add;
  }
  //same for red pieces
  countRedPieces() {
    const redPieces = document.getElementsByClassName("piece red");
    const redKings = document.getElementsByClassName("redKing");
    const add = redPieces.length + redKings.length
    return add;
  }
  //Win condition for the game
  checkForWinner() {
    const blackPieceCount = this.countBlackPieces();
    const redPieceCount = this.countRedPieces();

    if (blackPieceCount === 0) {
      // Display an alert or update the UI to indicate the winner
      alert("Computer wins!"); 
      // Restart the game after displaying the winner
      this.restart();
      //same for red pieces
    } else if (redPieceCount === 0) {
      alert("Player wins!"); 
      this.restart(); 
    }
  }
  //updates the piece count with the count function then dictates winner with the checkForWinner function.
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
  //restarts board with button (will actually send back to the home page)
  createRestart() {
    let restart = document.createElement("button");
    restart.innerHTML = "Restart";
    restart.setAttribute("onclick", "restart()");
    restart.setAttribute("class", "restart");
    document.body.append(restart);
  }
  //Creates time to keep track of time in the game
  createTimer() {
    this.timer = document.createElement("div");
    // Initial timer value
    this.timer.innerHTML = "Time: 00:00"; 
    this.timer.setAttribute("class", "timer");
    document.body.append(this.timer);
  }
  //Was supposed to set the board's color to a color of the user's picking (not working)
  createBoardColor() {
    this.bColorContainer = document.createElement("div");
    this.bColorContainer.innerHTML = "Board Color";
    this.bColorContainer.setAttribute('class', 'boardColor');
    
    // Create an input element of type color (not working)
    this.bColor = document.createElement("input");
    this.bColor.setAttribute("type", 'color');
    this.bColor.setAttribute("value", '#ff0000');
    this.bColor.setAttribute("class", 'boardColor-input'); 
  
    // Add an event listener to handle color changes (not working)
    this.bColor.addEventListener('input', this.changeBoardColor.bind(this));
  
    // Append the color input to the container (not working)
    this.bColorContainer.appendChild(this.bColor);
    
    // Append the container to the body (not working)
    document.body.append(this.bColorContainer);
  }
  
  changeBoardColor() {
    // Remove white class images (not working)
    //Trying to grab all the white cell images and delete them with removeChild (not working)
    const whitePieces = document.querySelectorAll(".white .piece img");
    whitePieces.forEach((img) => {
      img.parentNode.removeChild(img);
    });
  
    // Get the selected color from the input element
    const newColor = this.bColor.value;
  
    // Set the background color of the table to the selected color
    this.table.style.backgroundColor = newColor;
  
    // Set the background image of the table to none
    this.table.style.backgroundImage = 'none';
  }
  


//Changes the piece color 
changePlayer1Color() {
  //creates a div with the select tag and provides options for player 1 to change their piece's color
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
  //option choices values
  this.playerOption0.value = "-";
  this.playerOption.value = "Red";
  this.playerOption2.value = "Green";
  this.playerOption3.value = "Blue";
  this.playerOption4.value = "Black";
  this.playerOption5.value = "White";
  //What will be displayed when you open the select button
  this.playerOption0.textContent = "-";
  this.playerOption.textContent = "Red";
  this.playerOption2.textContent = "Green";
  this.playerOption3.textContent = "Blue";
  this.playerOption4.textContent = "Black";
  this.playerOption5.textContent = "White";
  //appends the color
  this.playerColor.setAttribute("class", "colorSelect");
  this.playerSelect.appendChild(this.playerOption0);
  this.playerSelect.appendChild(this.playerOption);
  this.playerSelect.appendChild(this.playerOption2);
  this.playerSelect.appendChild(this.playerOption3);
  this.playerSelect.appendChild(this.playerOption4);
  this.playerSelect.appendChild(this.playerOption5);

  // Corrected this line to remove the parentheses from handleChanges (wasn't reading properly due to parentheses.)
  this.playerSelect.onchange = this.handleChanges;

  //this.playerSelect.onchange = this.handleChanges;
  this.playerColor.appendChild(this.playerSelect);
  document.body.append(this.playerColor);
}
//Handles the changes to the colors
handleChanges() {
  const selectedOption = document.getElementById("colorSelect").value;
  console.log(selectedOption)
  const playerPiece = document.querySelectorAll(".piece.black"); // Adjust this selector based on your HTML structure
  const playerPieceKing = document.querySelector(".blackKing"); // Assuming there is only one black king
  // Changes the src attribute based on the selected option from changePlayer1 function
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

//Same thing except player2 can change their selected colors.
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
  //handles the parentheses
  this.playerSelect.onchange = this.handleChanges2;

  //this.playerSelect.onchange = this.handleChanges;
  this.playerColor.appendChild(this.playerSelect);
  document.body.append(this.playerColor);
}

//Same thing as handleChanges except for player2 only. have to have 2 separate ones or else both would change
handleChanges2() {
  const selectedOption = document.getElementById("colorSelect2").value;
  console.log(selectedOption)
  const playerPiece = document.querySelectorAll(".piece.red"); // Adjust this selector based on your HTML structure
  const playerPieceKing = document.querySelector(".redKing"); // Assuming there is only one red king

  // Update the src attribute based on the selected option
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
   //Targets the elapsedSeconds declared in checkerBoard
  checkerBoard.elapsedSeconds++;
  // Calculate minutes and sec
  const minutes = Math.floor(checkerBoard.elapsedSeconds / 60);
  const seconds = checkerBoard.elapsedSeconds % 60;
  // Update the timer display
  checkerBoard.timer.innerHTML = `Time: ${String(minutes).padStart(
    2,"0")}:${String(seconds).padStart(2, "0")}`; 
}

//Updates timer every 1 second
setInterval(updateTimer, 1000); 
