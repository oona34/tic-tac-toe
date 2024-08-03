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
  
    // Function for printing the game board and the active player's turn
    const printNewRound = () => {
      board.printBoard();
      console.log(`\n${getActivePlayer().name}'s turn.`);
    };
  
    // Function for playing a round of the game
    const playRound = (row, column) => {
      const cell = board.board[row - 1][column - 1];
      if (cell.isEmpty()) {
        cell.addSymbol(getActivePlayer().getSymbol());
        if (isWinningPlay(row - 1, column - 1)) {
          console.log(`\n${getActivePlayer().getName()} won the game !!!`);
          board.printBoard();
          board.resetBoard();
        } else if (board.isTie()) {
          console.log("\nThe game is a tie.");
          board.printBoard();
          board.resetBoard();
        } else {
          switchPlayer();
        }
      } else {
        console.log("\nInvalid play. The selected cell should be empty. Try again...");
      }
      printNewRound();
    };
  
    printNewRound();

    playRound(1,1);
    playRound(1,2);
    playRound(2,2);
    playRound(2,3);
    playRound(3,3);
  
    // Return an object with the function for playing a round of the game
    return { playRound };
  })();
  
  const game = gameFlowController;
  