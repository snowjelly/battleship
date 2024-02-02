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

  function tagCells(table) {
    for (let i = 1; i < table.rows.length; i += 1) {
      for (let k = 1; k < table.rows[i].cells.length; k += 1) {
        const cell = table.rows[i].cells[k];
        cell.setAttribute("data-y", i - 1);
        cell.setAttribute("data-x", k - 1);
        if (table.parentElement.classList.contains("player2-board-container")) {
          cell.classList.add("p2");
        }
      }
    }
  }

  tagCells(p1Table);
  tagCells(p2Table);

  Game(
    localStorage.getItem("player1Name"),
    localStorage.getItem("player2Name")
  );

  const player1Board = JSON.parse(localStorage.getItem("player1Board"));
  const player2Board = JSON.parse(localStorage.getItem("player2Board"));

  function renderShips(board, type, p2) {
    let player2Class = "";
    if (p2) {
      player2Class = ".p2";
    }
    if (type === "singles" || type === "quads") {
      board[type].forEach((coord) => {
        document.querySelector(
          `${player2Class}[data-y="${coord[0]}"][data-x="${coord[1]}"]`
        ).classList = `cell ${type}`;
      });
    } else {
      board[type].flat(1).forEach((coord) => {
        document.querySelector(
          `${player2Class}[data-y="${coord[0]}"][data-x="${coord[1]}"]`
        ).classList = `cell ${type}`;
      });
    }
  }

  renderShips(player1Board, "singles");
  renderShips(player1Board, "doubles");
  renderShips(player1Board, "triples");
  renderShips(player1Board, "quads");

  renderShips(player2Board, "singles", true);
  renderShips(player2Board, "doubles", true);
  renderShips(player2Board, "triples", true);
  renderShips(player2Board, "quads", true);
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
