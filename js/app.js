// Factory function for creating player objects
const createPlayer = (name, symbol) => {
    // Getter function for the player's symbol
    const getSymbol = () => symbol;
    // Getter function for the player's name
    const getName = () => name;
    // Return an object with the player's name, symbol, and getter functions
    return { name, symbol, getSymbol, getName };
  };
  
  // Immediately Invoked Function Expression (IIFE) for creating the game board
  const gameBoard = (() => {
    // Factory function for creating cell objects
    const createCell = () => {
      let value = "";
      // Function for adding a symbol to the cell
      const addSymbol = (symbol) => {
        value = symbol;
      };
      // Getter function for the cell's value
      const getValue = () => value;
      // Function for checking if the cell is empty
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
  
    // Getter function for the game board
    const getBoard = () => board;
  
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
        getValueOrOffboard(row - 1, column - 1),
        getValueOrOffboard(row + 1, column + 1),
      ];
      const rightDiagonal = [
        getValueOrOffboard(row + 1, column - 1),
        getValueOrOffboard(row - 1, column + 1),
      ];
      const horizontal = [
        getValueOrOffboard(row, column - 1),
        getValueOrOffboard(row, column + 1),
      ];
      const vertical = [
        getValueOrOffboard(row - 1, column),
        getValueOrOffboard(row + 1, column),
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
      board.forEach((row) => row.forEach((cell) => cell.addSymbol("")));
    };
  
    // Return an object with the game board and functions for getting the board, printing the board, getting the values of the cells in the lines relative to a given cell, checking if the game is a tie, and resetting the game board
    return {
      board,
      getBoard,
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
      // Check if any of the lines relative to the given cell contain two cells with the same symbol as the active player
      for (let [lineName, lineArray] of Object.entries(cellLines)) {
        if (
          lineArray.filter((value) => value === getActivePlayer().getSymbol())
            .length === 2
        ) {
          return true;
        }
      }
      return false;
    };
  
    // Function for playing a round of the game
    const playRound = (row, column) => {
      const cell = board.board[row - 1][column - 1];
      // Check if the selected cell is empty
      if (cell.isEmpty()) {
        // Add the active player's symbol to the selected cell
        cell.addSymbol(getActivePlayer().getSymbol());
        // Check if the play is a winning play
        if (isWinningPlay(row - 1, column - 1)) {
          console.log(`${getActivePlayer().getName()} won the game !!!`);
        } else if (board.isTie()) {
          console.log("The game is a tie.");
        } else {
          // Switch the active player
          switchPlayer();
        }
      } else {
        console.log("Invalid play. The selected cell should be empty.");
      }
      // Print the game board to the console
      board.printBoard();
    };
  
    // Print the initial game board to the console
    board.printBoard();
  
    // Return an object with the function for playing a round of the game
    return { playRound };
  })();
  
  // Create a reference to the gameFlowController object
  const game = gameFlowController;