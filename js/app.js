// Factory function for creating player objects
const createPlayer = (name, symbol) => {
    const getSymbol = () => symbol;
    const getName = () => name;
    return { name, symbol, getSymbol, getName };
  };
  
  // Immediately Invoked Function Expression (IIFE) for creating the game board
  const gameBoard = (() => {
    // Factory function for creating cell objects
    const createCell = () => {
      let value = "";
      const addSymbol = (symbol) => value = symbol;
      const getValue = () => value;
      const isEmpty = () => value === "";
      // Return an object with the cell's value and functions for adding a symbol and checking if it's empty
      return { addSymbol, getValue, isEmpty };
    };
  
    const rows = 3;
    const columns = 3;
  
    // Create a 2D array to represent the game board, with each cell created by the createCell function
    const board = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => createCell())
    );
  
    // Function for printing the game board to the console
    const printBoard = () => {
      const boardWithCellValues = board.map((row) =>
        row.map((cell) => cell.getValue())
      );
      console.log(boardWithCellValues);
    };
  
    // Function for getting the values of the cells in the left diagonal, right diagonal, horizontal, and vertical lines relative to a given cell
    const getAssociatedBoardLines = (row, column) => {
      // Helper function for getting the value of a cell, or "offboard" if the cell is outside the bounds of the board
      const getValueOrOffboard = (row, column) => {
        if (row >= 0 && row < rows && column >= 0 && column < columns) {
          return board[row][column].getValue();
        } else {
          return "offboard";
        }
      };
  
      // Get the values of the cells in the left diagonal, right diagonal, horizontal, and vertical lines relative to the given cell
      const leftDiagonal = [
        getValueOrOffboard(row - 2, column - 2),
        getValueOrOffboard(row - 1, column - 1),
        getValueOrOffboard(row + 1, column + 1),
        getValueOrOffboard(row + 2, column + 2),
      ];
      const rightDiagonal = [
        getValueOrOffboard(row + 2, column - 2),
        getValueOrOffboard(row + 1, column - 1),
        getValueOrOffboard(row - 1, column + 1),
        getValueOrOffboard(row - 2, column + 2),
      ];
      const horizontal = [
        getValueOrOffboard(row, column - 2),
        getValueOrOffboard(row, column - 1),
        getValueOrOffboard(row, column + 1),
        getValueOrOffboard(row, column + 2),
      ];
      const vertical = [
        getValueOrOffboard(row - 2, column),
        getValueOrOffboard(row - 1, column),
        getValueOrOffboard(row + 1, column),
        getValueOrOffboard(row + 2, column),
      ];
  
      // Return an object with the values of the cells in the left diagonal, right diagonal, horizontal, and vertical lines relative to the given cell
      return { leftDiagonal, rightDiagonal, horizontal, vertical };
    };
  
    // Function for checking if the game is a tie
    const isTie = () => {
      return board.every((row) => row.every((cell) => !cell.isEmpty()));
    };
  
    // Function for resetting the game board
    const resetBoard = () => {
      console.log("\nStarting new game...\n");
      board.forEach((row) => row.forEach((cell) => cell.addSymbol("")));
    };
  
    // Return an object with the game board and functions for printing the board, getting the values of the cells in the lines relative to a given cell, checking if the game is a tie, and resetting the game board
    return {
      board,
      printBoard,
      getAssociatedBoardLines,
      isTie,
      resetBoard,
    };
  })();
  
  // Immediately Invoked Function Expression (IIFE) for controlling the flow of the game
  const gameFlowController = (() => {
    const board = gameBoard;
    // Create an array of player objects
    const players = [
      createPlayer("Player A", "X"),
      createPlayer("Player B", "O"),
    ];
    let activePlayer = players[0];
  
    // Getter function for the active player
    const getActivePlayer = () => activePlayer;
    // Function for switching the active player
    const switchPlayer = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
  
    // Function for checking if a given play is a winning play
    const isWinningPlay = (row, column) => {
      const cellLines = board.getAssociatedBoardLines(row, column);
      const activeSymbol = getActivePlayer().getSymbol();
      // Create current cell as object counting from row and column 1
      const cellIndexFromOne = { row: row + 1, column: column + 1 };
      // Logs out the cell that is currently being played for easier debugging
      console.log(`\nAssociated lines of selected cell ${JSON.stringify(cellIndexFromOne)}:`);
      for (let [lineName, lineArray] of Object.entries(cellLines)) {
        // Creates a filtered array that disregards the parts that aren't in the grid
        const filteredLineArray = lineArray.filter((value) => value !== "offboard");
        // Logs into the console each associated line (diagonals, horizontal and vertical), and chacks if matches the winning criterion. If so return true and stop checking other lines
        console.log({ lineName, numberOfCells: filteredLineArray.length, filteredLineArray });
        if (
          filteredLineArray.length === 2 &&
          filteredLineArray.filter((value) => value === activeSymbol).length === 2
        ) {
          return true;
        }
      }
      // If no winning combination was found, boolean is set to false
      return false;
    };
  
    // Function for playing a round of the game
    // Function for playing a round of the game
    const playRound = (row, column) => {
        const cell = board.board[row - 1][column - 1];
        if (cell.isEmpty()) {
        cell.addSymbol(getActivePlayer().getSymbol());
        updateScreen(); // update the screen before checking for a win or tie
        if (isWinningPlay(row - 1, column - 1)) {
            // display the winning message in an alert box, update the screen after resetting the board, wait for 1 second before displaying the alert box
            setTimeout(() => {
                alert(`${getActivePlayer().getName()} won the game !!!`); 
                board.resetBoard();
                updateScreen(); 
            }, 350);
        } else if (board.isTie()) {
            // display the tie message in an alert box, update the screen after resetting the board, wait for 1 second before displaying the alert box
            setTimeout(() => {
                alert(`The game is a tie.`); 
                board.resetBoard();
                updateScreen(); 
            }, 350); 
        } else {
            switchPlayer();
        }
        } else {
        updateScreen("Invalid play. The selected cell should be empty. Try again..."); // update the screen with the invalid play message
        }
    };
  
    // Return an object with the function for playing a round of the game
    return {
        playRound,
        getActivePlayer,
        getBoard: () => board.board,
    };
})();

// Function for updating the screen
const updateScreen = (message) => {
    const boardDiv = document.querySelector(".board");
    const playerTurnDiv = document.querySelector(".turn");
    boardDiv.textContent = "";
    const board = gameFlowController.getBoard();
    const activePlayer = gameFlowController.getActivePlayer();
    playerTurnDiv.textContent = `${activePlayer.name}'s turn.`;
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
    if (message) {
      alert(message); // display the message using an alert box
    }
  };
  

function ScreenController() {
    const game = gameFlowController;
    const boardDiv = document.querySelector(".board");
  
  
    function clickHandlerBoard(e) {
      const selectedRow = parseInt(e.target.dataset.row);
      const selectedColumn = parseInt(e.target.dataset.column);
      if (!isNaN(selectedRow) && !isNaN(selectedColumn)) {
        game.playRound(selectedRow + 1, selectedColumn + 1);
        updateScreen();
      }
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
  
    updateScreen();
  }
  
  ScreenController();
