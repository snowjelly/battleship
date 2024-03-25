import { renderBoard1, renderBoard2 } from "./gameBoards";
import {
  renderPlayer1Name,
  renderPlayer2Name,
  renderWelcomeScreen,
  renderNameSelection,
  renderRotateBtn,
} from "./UI";
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

function styleAttackResults(result) {
  if (result.illegal) return;
  changeNameColorOnTurn();
  return result;
}

function getClassNameOfTheCurrentShip() {
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

function styleShipPlacement(cellsArr) {
  for (let i = 0; i < cellsArr.length; i += 1) {
    if (cellsArr[i] === null) return;
    if (i === 0) {
      cellsArr[i].classList.add("ship-4");
      return;
    }
  }
}

function hoverHighlightPlacement(e, cellsArr, rotate = false) {
  if (cellsArr === null) return;
  const curShipLength = Storage().getCurrentShip();
  let cellX;
  let cellY;

  while (cellsArr.length) {
    const cell = cellsArr.shift();
    if (cell !== null && !cell.classList.contains("placed")) {
      cell.classList = "cell";
    }
  }
  for (let i = 0; i < curShipLength; i += 1) {
    if (rotate) {
      cellX = e.target.dataset.x;
      cellY = Number(e.target.dataset.y) + i;
    } else {
      cellX = Number(e.target.dataset.x) + i;
      cellY = e.target.dataset.y;
    }
    const adjacentCell = document.querySelector(
      `.cell[data-x="${cellX}"][data-y="${cellY}"]`
    );
    cellsArr.push(adjacentCell);
  }
  styleShipPlacement(cellsArr, rotate);
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
    const shipType = getClassNameOfTheCurrentShip();

    const shipGhost = Array.from(
      document.querySelectorAll(`.${shipType}`)
    ).filter((el) => !el.classList.contains("placed"));
    if (shipGhost.length !== curShipLength) return;
    getShipPlacementCoords(shipGhost);

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

function tagCells(table, cellsArr) {
  for (let i = 1; i < table.rows.length; i += 1) {
    for (let k = 1; k < table.rows[i].cells.length; k += 1) {
      const cell = table.rows[i].cells[k];
      cell.setAttribute("data-y", i - 1);
      cell.setAttribute("data-x", k - 1);
      if (table.parentElement.classList.contains("player2-board-container")) {
        cell.classList.add("p2");
      }
      addCellEventListeners(cell, cellsArr);
    }
  }
}

function renderGameBoard1(rotate = false) {
  Storage().resetShips();

  const main = document.querySelector("main");
  main.innerHTML = `
      <div class="container fade-in"></div>`;
  const container = document.querySelector(".container");

  container.insertAdjacentHTML("beforeend", renderPlayer1Name());
  container.insertAdjacentHTML("beforeend", renderBoard1());
  renderRotateBtn();

  const p1Table = document.querySelector(".player1-board-content").children[0];

  const cells = [];

  tagCells(p1Table, cells);
}

function renderGameBoard2(rotate = false) {
  Storage().resetShips();
  Storage().changeTurn();
  const main = document.querySelector("main");
  main.innerHTML = `
      <div class="container fade-in"></div>`;
  const container = document.querySelector(".container");

  container.insertAdjacentHTML("beforeend", renderPlayer2Name());
  container.insertAdjacentHTML("beforeend", renderBoard2());
  renderRotateBtn();

  const p2Table = document.querySelector(".player2-board-content").children[0];

  const cells = [];

  if (rotate) {
    tagCells(p2Table, cells, rotate);
  } else {
    tagCells(p2Table, cells);
  }
}

function styleAttacks() {
  const attacks = Storage().getAttacks();
  const turn = Storage().getTurn();

  if (turn === "p1") {
    for (let i = 0; i < attacks.p1.length; i += 1) {
      const cellElement = document.querySelector(
        `.p2[data-y="${attacks.p1[i].coords[1]}"][data-x="${attacks.p1[i].coords[0]}`
      );
      if (attacks.p1[i].miss) {
        cellElement.classList.add("miss");
      }
      if (attacks.p1[i].hit) {
        cellElement.classList.add("hit");
      }
    }
  }
  if (turn === "p2") {
    for (let i = 0; i < attacks.p2.length; i += 1) {
      const cellElement = document.querySelector(
        `[data-y="${attacks.p2[i].coords[1]}"][data-x="${attacks.p2[i].coords[0]}`
      );
      if (attacks.p2[i].miss) {
        cellElement.classList.add("miss");
      }
      if (attacks.p2[i].hit) {
        cellElement.classList.add("hit");
      }
    }
  }
}

function unRenderShips() {
  renderGameBoards(false);
}

function renderGameBoards(firstRun = true) {
  document.querySelector("main").innerHTML = `
      <div class="container fade-in"></div>`;
  let cpuText = "";
  if (localStorage.getItem("opponent") === "ai") cpuText = "(CPU)";

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
    e.target.form[0].value = "Player 1";
    e.target.form[1].value = "Player 2";
    storageSetPlayerNames("Player 1", "Player 2");
    waitForAnimationEnd("fade-out", ".name-selection", removeNameSelectScreen);
    waitForAnimationEnd("fade-out", ".name-selection", renderGameBoard1);
  });
}

function addOpponentSelectEventListeners() {
  const aiBtn = document.querySelector(".robot-container");
  const humanBtn = document.querySelector(".human-container");

  aiBtn.addEventListener("click", () => {
    localStorage.setItem("opponent", "ai");
    waitForAnimationEnd("fade-out", ".welcome", removeWelcomeScreen);
    waitForAnimationEnd("fade-out", ".welcome", () => {
      renderNameSelection(true);
      addNameSubmitBtnEventListeners();
    });
  });

  humanBtn.addEventListener("click", () => {
    localStorage.setItem("opponent", "human");
    waitForAnimationEnd("fade-out", ".welcome", removeWelcomeScreen);
    waitForAnimationEnd("fade-out", ".welcome", () => {
      renderNameSelection();
      addNameSubmitBtnEventListeners();
    });
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

addOpponentSelectEventListeners();

Storage().initShipCoords();

renderNameSelection();
addNameSubmitBtnEventListeners();

export { unRenderShips, styleAttacks };
