import { renderBoard1, renderBoard2 } from "./gameBoards";
import Game from "./gameloop";
import { Storage, Gameboard } from "./battleship";

function removeWelcomeScreen() {
  document.querySelector(".welcome").remove();
  localStorage.removeItem("winner");
}

function waitForAnimationEnd(animationClassName, querySelector, cb) {
  const element = document.querySelector(querySelector);
  element.classList.add(animationClassName);
  element.addEventListener("animationend", () => {
    cb();
  });
}

function changeNameColorOnTurn() {
  if (localStorage.getItem("turn") === "p1") {
    document.querySelector(".player2-name").classList.add("turn");
    document.querySelector(".player1-name").classList.remove("turn");
  } else {
    document.querySelector(".player1-name").classList.add("turn");
    document.querySelector(".player2-name").classList.remove("turn");
  }
}

function styleAttackResults(result, e) {
  if (result.illegal) return;
  if (result.miss) e.target.classList.add("miss");
  if (result.hit) e.target.classList.add("hit");
  changeNameColorOnTurn();
}

function renderPlayer1Name() {
  let turn = "";
  if (localStorage.getItem("turn") === "p1") turn = "turn";
  const html = `
      <div class="player-names">
        <div class="player1-name name silly-font ${turn}">
          ${localStorage.getItem("player1Name")}
        </div>
        `;
  return html;
}

function renderPlayer2Name() {
  let turn = "";
  if (localStorage.getItem("turn") === "p2") turn = "turn";
  const html = `
      <div class="player-names">
        <div class="player2-name name silly-font ${turn}">
          ${localStorage.getItem("player2Name")}
        </div>
        `;
  return html;
}

function getClassName() {
  const currShip = Storage().getCurrentShip();
  if (currShip === 4) {
    return "quadruple";
  }
  if (currShip === 3) {
    return "triple";
  }
  if (currShip === 2) {
    return "double";
  }
  if (currShip === 1) {
    return "single";
  }
  return null;
}

function hoverHighlightPlacement(e, cellsArr, rotate = false) {
  if (cellsArr === null) return;
  const className = getClassName();
  const curShipLength = Storage().getCurrentShip();
  if (rotate) {
    while (cellsArr.length) {
      const cell = cellsArr.shift();
      if (!cell.classList.contains("placed")) {
        cell.classList.remove(className);
      }
    }
    for (let i = 0; i < curShipLength; i += 1) {
      const adjacentCell = document.querySelector(
        `.cell[data-x="${e.target.dataset.x}"][data-y="${
          Number(e.target.dataset.y) + i
        }"]`
      );
      if (adjacentCell === null) return;
      cellsArr.push(adjacentCell);
      adjacentCell.classList.add(className);
    }
  } else {
    while (cellsArr.length) {
      const cell = cellsArr.shift();
      if (!cell.classList.contains("placed")) {
        cell.classList.remove(className);
      }
    }
    for (let i = 0; i < curShipLength; i += 1) {
      const adjacentCell = document.querySelector(
        `.cell[data-x="${Number(e.target.dataset.x) + i}"][data-y="${
          e.target.dataset.y
        }"]`
      );
      if (adjacentCell === null) return;
      cellsArr.push(adjacentCell);
      adjacentCell.classList.add(className);
    }
  }
}

function getShipPlacementCoords(shipGhost) {
  const shipArr = [];
  let p2 = false;
  for (let i = 0; i < shipGhost.length; i += 1) {
    if (shipGhost[i].classList.contains("p2")) {
      p2 = true;
    }
    shipArr.push([shipGhost[i].dataset.x, shipGhost[i].dataset.y]);
    shipGhost[i].classList.add("placed");
  }
  Storage().storeShip(shipArr, p2);
}

function addCellEventListeners(cell, cellsArr) {
  cell.addEventListener("mouseover", (e) => {
    const rotate = Storage().getRotation();
    if (rotate) {
      hoverHighlightPlacement(e, cellsArr, rotate);
    } else {
      hoverHighlightPlacement(e, cellsArr);
    }
  });
  cell.addEventListener("click", (e) => {
    if (e.target.classList.contains("placed")) return;
    const curShipLength = Storage().getCurrentShip();
    if (curShipLength === 4) {
      const shipGhost = Array.from(
        document.querySelectorAll(".quadruple")
      ).filter((el) => !el.classList.contains("placed"));
      if (shipGhost.length !== 4) return;
      getShipPlacementCoords(shipGhost);
    }
    if (curShipLength === 3) {
      const shipGhost = Array.from(document.querySelectorAll(".triple")).filter(
        (el) => !el.classList.contains("placed")
      );
      if (shipGhost.length !== 3) return;
      getShipPlacementCoords(shipGhost);
    }
    if (curShipLength === 2) {
      const shipGhost = Array.from(document.querySelectorAll(".double")).filter(
        (el) => !el.classList.contains("placed")
      );
      if (shipGhost.length !== 2) return;
      getShipPlacementCoords(shipGhost);
    }
    if (curShipLength === 1) {
      const shipGhost = Array.from(document.querySelectorAll(".single")).filter(
        (el) => !el.classList.contains("placed")
      );
      if (shipGhost.length !== 1) return;
      getShipPlacementCoords(shipGhost);
    }
    Storage().getNextShip();
    if (Storage().getShipInventory().length === 0) {
      if (Storage().getTurn() === "p2") {
        renderGameBoards();
      } else {
        renderGameBoard2();
      }
    }
  });
}

function tagCells(table, cellsArr, rotate = false) {
  for (let i = 1; i < table.rows.length; i += 1) {
    for (let k = 1; k < table.rows[i].cells.length; k += 1) {
      const cell = table.rows[i].cells[k];
      cell.setAttribute("data-y", i - 1);
      cell.setAttribute("data-x", k - 1);
      if (table.parentElement.classList.contains("player2-board-container")) {
        cell.classList.add("p2");
      }
      if (rotate) {
        addCellEventListeners(cell, cellsArr, rotate);
      } else {
        addCellEventListeners(cell, cellsArr);
      }
    }
  }
}
function addRotateEventListener() {
  const inv = document.querySelector(".ship-inventory");
  inv.addEventListener("click", () => {
    Storage().changeRotation();
  });
}

function renderShipInventory() {
  const html = `
    <div class="ship-inventory">
      <svg xmlns="http://www.w3.org/2000/svg" height="50" viewBox="0 -960 960 960" width="50"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>
    </div>
  `;

  document.querySelector(".player-names").insertAdjacentHTML("afterend", html);
  addRotateEventListener();
}

function renderGameBoard1(rotate = false) {
  Storage().resetShips();
  const game = Game(
    localStorage.getItem("player1Name"),
    localStorage.getItem("player2Name")
  );
  const main = document.querySelector("main");
  main.innerHTML = `
      <div class="container fade-in"></div>`;
  const container = document.querySelector(".container");

  container.insertAdjacentHTML("beforeend", renderPlayer1Name());
  container.insertAdjacentHTML("beforeend", renderBoard1());
  renderShipInventory();

  const p1Table = document.querySelector(".player1-board-container")
    .children[0];

  const cells = [];

  if (rotate) {
    tagCells(p1Table, cells, rotate);
  } else {
    tagCells(p1Table, cells);
  }
}

function renderGameBoard2(rotate = false) {
  Storage().resetShips();
  const game = Game(
    localStorage.getItem("player1Name"),
    localStorage.getItem("player2Name")
  );
  Storage().changeTurn();
  const main = document.querySelector("main");
  main.innerHTML = `
      <div class="container fade-in"></div>`;
  const container = document.querySelector(".container");

  container.insertAdjacentHTML("beforeend", renderPlayer2Name());
  container.insertAdjacentHTML("beforeend", renderBoard2());
  renderShipInventory();

  const p2Table = document.querySelector(".player2-board-container")
    .children[0];

  const cells = [];

  if (rotate) {
    tagCells(p2Table, cells, rotate);
  } else {
    tagCells(p2Table, cells);
  }
}

function renderGameBoards() {
  function storageSetTurn(p) {
    localStorage.setItem("turn", p);
  }

  storageSetTurn("p1");

  document.querySelector("main").innerHTML = `
      <div class="container fade-in"></div>`;
  let cpuText = "";
  if (localStorage.getItem("opponent") === "ai") cpuText = "(CPU)";

  function renderPlayer2Name() {
    let turn = "";
    if (localStorage.getItem("turn") === "p2") turn = "turn";
    const html = `
        <div class="player2-name name silly-font ${turn}">
          ${localStorage.getItem("player2Name")} ${cpuText}
        </div>
      </div>
    `;
    return html;
  }

  const container = document.querySelector(".container");

  container.insertAdjacentHTML("beforeend", renderPlayer1Name());
  container.insertAdjacentHTML("beforeend", renderBoard1());
  container.insertAdjacentHTML("beforeend", renderPlayer2Name());
  container.insertAdjacentHTML("beforeend", renderBoard2());

  const p1Table = document.querySelector(".player1-board-container")
    .children[0];
  const p2Table = document.querySelector(".player2-board-container")
    .children[0];
  const players = Storage().getPlayers();
  const p1 = players.p1;
  const p2 = players.p2;
  const game = Game(p1, p2);
  function addCellEventListeners(cell) {
    cell.addEventListener("click", (e) => {
      if (
        game.next(e, styleAttackResults) === "gameover" ||
        localStorage.getItem("winner") !== null
      ) {
        renderGameEnd();
      }
    });
  }

  function tagCells(table) {
    for (let i = 1; i < table.rows.length; i += 1) {
      for (let k = 1; k < table.rows[i].cells.length; k += 1) {
        const cell = table.rows[i].cells[k];
        cell.setAttribute("data-y", i - 1);
        cell.setAttribute("data-x", k - 1);
        if (table.parentElement.classList.contains("player2-board-container")) {
          cell.classList.add("p2");
        }
        addCellEventListeners(cell);
      }
    }
  }

  function renderShips(board, p2) {
    let player2Class = "";
    if (p2) {
      player2Class = ".p2";
    }

    for (let i = 0; i < board.length; i += 1) {
      let type;
      if (board[i].ship) {
        if (board[i].ship.length === 1) {
          type = "single";
        }
        if (board[i].ship.length === 2) {
          type = "double";
        }
        if (board[i].ship.length === 3) {
          type = "triple";
        }
        if (board[i].ship.length === 4) {
          type = "quadruple";
        }
        const cellElement = document.querySelector(
          `${player2Class}[data-y="${board[i].pos[1]}"][data-x="${board[i].pos[0]}"]`
        );

        cellElement.classList.add(type, "ship");
      }
    }
  }
  function init() {
    const player1Board = p1.board.getBoard();
    const player2Board = p2.board.getBoard();

    p1.board.placeShips();
    p2.board.placeShips(true);

    tagCells(p1Table);
    tagCells(p2Table);

    renderShips(player1Board);
    renderShips(player1Board);
    renderShips(player1Board);
    renderShips(player1Board);

    renderShips(player2Board, true);
    renderShips(player2Board, true);
    renderShips(player2Board, true);
    renderShips(player2Board, true);
  }
  init();
}

function renderWelcomeScreen() {
  document.querySelector("main").innerHTML = `
  <div class="welcome fade-in">
        <h1>Welcome to Battleship</h1>
        <h2 class="question">Face an A.I or human opponent?</h2>
        <div class="select-opponent-btns">
          <img src="./assets/ai.jpg" alt="ai" class="opponent-btn" id="ai" />
          <img
            src="./assets/human.jpg"
            alt="human"
            class="opponent-btn"
            id="human"
          />
        </div>
      </div>
  `;
}

function removeNameSelectScreen() {
  document.querySelector(".name-selection").remove();
}

function storageSetPlayerNames(player1Name, player2Name) {
  localStorage.setItem("player1Name", player1Name);
  localStorage.setItem("player2Name", player2Name);
}

function addNameSubmitBtnEventListeners() {
  document.querySelector("button").addEventListener("click", (e) => {
    let player1Name = e.target.form[0].value;
    let player2Name = e.target.form[1].value;
    if (player1Name === "") {
      player1Name = "Player 1";
    }
    if (player2Name === "") {
      player2Name = "Player 2";
    }
    storageSetPlayerNames(player1Name, player2Name);
    waitForAnimationEnd("fade-out", ".name-selection", removeNameSelectScreen);
    waitForAnimationEnd("fade-out", ".name-selection", renderGameBoard1);
  });
}

function renderNameSelection(ai) {
  let player1Name;
  let player2Name;
  if (ai) {
    player1Name = `Enter your name:`;
    player2Name = `Enter the name for your A.I challenger:`;
  } else {
    player1Name = `Player 1: Enter your name:`;
    player2Name = `Player 2: Enter your name:`;
  }
  const html = `
    <div class="name-selection fade-in">
      <form class="form-name">
        <div class="form-name-el">
          <label for="player1"> ${player1Name} </label>
          <input type="text" name="player1" id="player1" required/>
        </div>
        <div class="form-name-el">
          <label for="player2"> ${player2Name} </label>
          <input type="text" name="player2" id="player2" required/>
        </div>
        <div class="submit-container">
          <button class="silly-font" type="button">LET'S ROCK!</button>
        </div>
      </form>
    </div>
  `;
  document.querySelector("main").innerHTML = html;
  addNameSubmitBtnEventListeners();
}

function addOpponentSelectEventListeners() {
  const aiBtn = document.querySelector("#ai");
  const humanBtn = document.querySelector("#human");

  aiBtn.addEventListener("click", () => {
    localStorage.setItem("opponent", "ai");
    waitForAnimationEnd("fade-out", ".welcome", removeWelcomeScreen);
    waitForAnimationEnd("fade-out", ".welcome", () => {
      renderNameSelection(true);
    });
  });

  humanBtn.addEventListener("click", () => {
    localStorage.setItem("opponent", "human");
    waitForAnimationEnd("fade-out", ".welcome", removeWelcomeScreen);
    waitForAnimationEnd("fade-out", ".welcome", renderNameSelection);
  });
}

function addGameOverEventListeners() {
  const retryBtn = document.querySelector(".retry-btn");
  const newPlayers = document.querySelector(".new-players-btn");

  retryBtn.addEventListener("click", (e) => {
    renderGameBoard1();
  });

  newPlayers.addEventListener("click", (e) => {
    renderWelcomeScreen();
    addOpponentSelectEventListeners();
  });
}

function renderGameEnd() {
  document.querySelector("main").innerHTML = "";
  document.querySelector("main").insertAdjacentHTML(
    "beforeend",
    `
    <div class="game-over-container">
      <div class="game-over-content">
        <h1>Game Over</h1>
        <h2>${localStorage.getItem("winner")} wins!</h1>
        <h2> Play again? </h2>
        <div class="game-over-prompt">
          <button type="button" class="retry-btn">Retry</button>
          <button type="button" class="new-players-btn">New Players</button>
        </div>
      </div>
    </div>
  `
  );
  addGameOverEventListeners();
}

addOpponentSelectEventListeners();

Storage().initShipCoords();

/* removeWelcomeScreen();
renderGameBoards();
renderGameEnd();
 */
