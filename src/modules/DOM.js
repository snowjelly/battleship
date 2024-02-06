import { Gameboard, Storage } from "./battleship";
import { renderBoard1, renderBoard2 } from "./gameBoards";
import Game from "./gameloop";

function removeWelcomeScreen() {
  document.querySelector(".welcome").remove();
}

function waitForAnimationEnd(animationClassName, querySelector, cb) {
  const element = document.querySelector(querySelector);
  element.classList.add(animationClassName);
  element.addEventListener("animationend", () => {
    cb();
  });
}

function renderGameBoards() {
  const players = Game(
    localStorage.getItem("player1Name"),
    localStorage.getItem("player2Name")
  );

  function storageSetTurn(p) {
    localStorage.setItem("turn", p);
  }

  storageSetTurn("p1");

  document.querySelector("main").innerHTML = `
      <div class="container fade-in"></div>`;
  let cpuText = "";
  if (localStorage.getItem("opponent") === "ai") cpuText = "(CPU)";

  function renderPlayer1Name() {
    const html = `
      <div class="player-names">
        <div class="player1-name name silly-font">
          ${localStorage.getItem("player1Name")}
        </div>
        `;
    return html;
  }

  function renderPlayer2Name() {
    const html = `
        <div class="player2-name name silly-font">
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

  function styleAttackResults(result, e) {
    if (result.illegal) return;
    if (result.miss) e.target.classList.add("miss");
    if (result.hit) e.target.classList.add("hit");
  }

  function addCellEventListeners(cell) {
    cell.addEventListener("click", (e) => {
      if (
        localStorage.getItem("turn") === "p1" &&
        e.target.classList.contains("p2") &&
        !e.target.classList.contains("miss") &&
        !e.target.classList.contains("hit")
      ) {
        const coords = [Number(e.target.dataset.x), Number(e.target.dataset.y)];
        styleAttackResults(players.player1.attack(players.player2, coords), e);
        if (players.player2.board.shipsSunk().sunk) {
          console.log(`${players.player1.name} wins!`);
        }
        Storage().changeTurn();
      }
      if (
        localStorage.getItem("turn") === "p2" &&
        !e.target.classList.contains("p2") &&
        !e.target.classList.contains("miss") &&
        !e.target.classList.contains("hit")
      ) {
        const coords = [Number(e.target.dataset.x), Number(e.target.dataset.y)];
        styleAttackResults(players.player2.attack(players.player1, coords), e);
        if (players.player1.board.shipsSunk().sunk) {
          console.log(`${players.player2.name} wins!`);
        }
        Storage().changeTurn();
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

  tagCells(p1Table);
  tagCells(p2Table);

  const player1Board = players.player1.board.getBoard();
  const player2Board = players.player2.board.getBoard();

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

  renderShips(player1Board);
  renderShips(player1Board);
  renderShips(player1Board);
  renderShips(player1Board);

  renderShips(player2Board, true);
  renderShips(player2Board, true);
  renderShips(player2Board, true);
  renderShips(player2Board, true);
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
    waitForAnimationEnd("fade-out", ".name-selection", renderGameBoards);
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

  aiBtn.addEventListener("click", (e) => {
    localStorage.setItem("opponent", "ai");
    waitForAnimationEnd("fade-out", ".welcome", removeWelcomeScreen);
    waitForAnimationEnd("fade-out", ".welcome", () => {
      renderNameSelection(true);
    });
  });

  humanBtn.addEventListener("click", (e) => {
    localStorage.setItem("opponent", "human");
    waitForAnimationEnd("fade-out", ".welcome", removeWelcomeScreen);
    waitForAnimationEnd("fade-out", ".welcome", renderNameSelection);
  });
}

addOpponentSelectEventListeners();

removeWelcomeScreen();
renderGameBoards();
