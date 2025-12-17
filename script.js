(() => {
  const macroBoardEl = document.getElementById("macroBoard");
  const statusTextEl = document.getElementById("statusText");
  const boardPromptEl = document.getElementById("boardPrompt");
  const messageEl = document.getElementById("messageArea");
  const resetBtn = document.getElementById("resetBtn");

  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  let state = createInitialState();
  const boardRefs = buildBoard(macroBoardEl);
  render();

  macroBoardEl.addEventListener("click", (event) => {
    const cell = event.target.closest("button.cell");
    if (!cell) return;

    const boardIndex = Number(cell.dataset.board);
    const cellIndex = Number(cell.dataset.cell);
    if (Number.isNaN(boardIndex) || Number.isNaN(cellIndex)) return;

    handleMove(boardIndex, cellIndex);
  });

  resetBtn.addEventListener("click", () => {
    state = createInitialState();
    messageEl.textContent = "";
    render();
  });

  function createInitialState() {
    return {
      boards: Array.from({ length: 9 }, () => Array(9).fill(null)),
      boardStatus: Array(9).fill("open"),
      currentPlayer: "X",
      targetBoard: null,
      winner: null,
      macroStatus: "open",
      lastMove: null
    };
  }

  function buildBoard(container) {
    const refs = [];
    container.innerHTML = "";

    for (let b = 0; b < 9; b++) {
      const boardEl = document.createElement("div");
      boardEl.className = "micro-board";
      boardEl.dataset.board = String(b);

      const overlay = document.createElement("div");
      overlay.className = "board-overlay";
      boardEl.appendChild(overlay);

      const cells = [];
      for (let c = 0; c < 9; c++) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "cell";
        button.dataset.board = String(b);
        button.dataset.cell = String(c);
        button.setAttribute("aria-label", `Board ${b + 1} cell ${c + 1}`);
        boardEl.appendChild(button);
        cells.push(button);
      }

      container.appendChild(boardEl);
      refs.push({ boardEl, overlay, cells });
    }

    return refs;
  }

  function handleMove(boardIndex, cellIndex) {
    if (!isMoveLegal(state, boardIndex, cellIndex)) {
      messageEl.textContent = "Move not allowed on that board.";
      return;
    }

    messageEl.textContent = "";
    state.boards[boardIndex][cellIndex] = state.currentPlayer;
    state.lastMove = { board: boardIndex, cell: cellIndex, player: state.currentPlayer };

    state.boardStatus[boardIndex] = evaluateMicroBoard(state.boards[boardIndex]);

    const macroResult = evaluateMacroBoard(state.boardStatus);
    if (macroResult === "X" || macroResult === "O") {
      state.winner = macroResult;
      state.macroStatus = macroResult;
    } else if (macroResult === "draw") {
      state.winner = null;
      state.macroStatus = "draw";
    } else {
      state.winner = null;
      state.macroStatus = "open";
    }

    if (!state.winner && state.macroStatus !== "draw" && state.boardStatus[cellIndex] === "open") {
      state.targetBoard = cellIndex;
    } else {
      state.targetBoard = null;
    }

    if (!state.winner && state.macroStatus !== "draw") {
      state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
    }

    render();
  }

  function allowedBoards(currentState) {
    if (currentState.winner || currentState.macroStatus === "draw") return [];

    if (
      currentState.targetBoard !== null &&
      currentState.boardStatus[currentState.targetBoard] === "open"
    ) {
      return [currentState.targetBoard];
    }

    return currentState.boardStatus
      .map((status, index) => (status === "open" ? index : null))
      .filter((index) => index !== null);
  }

  function isMoveLegal(currentState, boardIndex, cellIndex) {
    if (currentState.winner || currentState.macroStatus === "draw") return false;
    if (currentState.boardStatus[boardIndex] !== "open") return false;

    const allowed = allowedBoards(currentState);
    if (!allowed.includes(boardIndex)) return false;

    return currentState.boards[boardIndex][cellIndex] === null;
  }

  function evaluateMicroBoard(cells) {
    const winner = findWinner(cells);
    if (winner) return winner;
    if (cells.every((cell) => cell !== null)) return "draw";
    return "open";
  }

  function evaluateMacroBoard(statuses) {
    const winner = findWinner(statuses.map((status) => (status === "X" || status === "O" ? status : null)));
    if (winner) return winner;
    if (statuses.every((status) => status !== "open")) return "draw";
    return "open";
  }

  function findWinner(values) {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (values[a] && values[a] === values[b] && values[a] === values[c]) {
        return values[a];
      }
    }
    return null;
  }

  function render() {
    const allowed = allowedBoards(state);

    if (state.winner) {
      statusTextEl.textContent = `Player ${state.winner} wins the macro board!`;
      boardPromptEl.textContent = "Press restart to play again.";
    } else if (state.macroStatus === "draw") {
      statusTextEl.textContent = "Game ends in a draw.";
      boardPromptEl.textContent = "Press restart to play again.";
    } else {
      statusTextEl.textContent = `Player ${state.currentPlayer} to move`;
      boardPromptEl.textContent =
        state.targetBoard === null ? "Target board: any open board" : "\u00a0";
    }

    boardRefs.forEach((ref, boardIndex) => {
      const status = state.boardStatus[boardIndex];
      const isAllowed = allowed.includes(boardIndex);
      ref.boardEl.classList.toggle("active", isAllowed && !state.winner && state.macroStatus !== "draw");
      ref.boardEl.classList.toggle("closed", status !== "open");
      ref.boardEl.classList.toggle("won-x", status === "X");
      ref.boardEl.classList.toggle("won-o", status === "O");
      ref.boardEl.classList.toggle("drawn", status === "draw");

      ref.overlay.textContent = "";
      ref.overlay.className = "board-overlay";
      if (status === "X") {
        ref.overlay.textContent = "X";
        ref.overlay.classList.add("winner-x");
      } else if (status === "O") {
        ref.overlay.textContent = "O";
        ref.overlay.classList.add("winner-o");
      } else if (status === "draw") {
        ref.overlay.textContent = "DRAW";
        ref.overlay.classList.add("draw-state");
      }

      ref.cells.forEach((cellEl, cellIndex) => {
        const value = state.boards[boardIndex][cellIndex];
        cellEl.textContent = value ? value : "";
        cellEl.classList.toggle("mark-x", value === "X");
        cellEl.classList.toggle("mark-o", value === "O");
        const last = state.lastMove;
        cellEl.classList.toggle(
          "last-move",
          !!last && last.board === boardIndex && last.cell === cellIndex
        );

        const shouldEnable =
          !state.winner &&
          state.macroStatus !== "draw" &&
          value === null &&
          status === "open" &&
          allowed.includes(boardIndex);
        cellEl.disabled = !shouldEnable;
      });
    });
  }
})();
