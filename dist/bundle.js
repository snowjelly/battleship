/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/DOM.js":
/*!****************************!*\
  !*** ./src/modules/DOM.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   styleAttacks: () => (/* binding */ styleAttacks),
/* harmony export */   unRenderShips: () => (/* binding */ unRenderShips)
/* harmony export */ });
/* harmony import */ var _gameBoards__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameBoards */ "./src/modules/gameBoards.js");
/* harmony import */ var _UI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UI */ "./src/modules/UI.js");
/* harmony import */ var _gameloop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameloop */ "./src/modules/gameloop.js");
/* harmony import */ var _battleship__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./battleship */ "./src/modules/battleship.js");





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
  const currShip = (0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().getCurrentShip();
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
  const className = getClassNameOfTheCurrentShip();
  const curShipLength = (0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().getCurrentShip();
  let cellX;
  let cellY;
  while (cellsArr.length) {
    const cell = cellsArr.shift();
    if (!cell.classList.contains("placed")) {
      cell.classList.remove(className);
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
    if (adjacentCell === null) return;
    cellsArr.push(adjacentCell);
    adjacentCell.classList.add(className);
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
  (0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().storeShip(shipArr, p2);
}

function addCellEventListeners(cell, cellsArr) {
  cell.addEventListener("mouseover", (e) => {
    const rotate = (0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().getRotation();
    if (rotate) {
      hoverHighlightPlacement(e, cellsArr, rotate);
    } else {
      hoverHighlightPlacement(e, cellsArr);
    }
  });
  cell.addEventListener("click", (e) => {
    if (e.target.classList.contains("placed")) return;
    const curShipLength = (0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().getCurrentShip();
    const shipType = getClassNameOfTheCurrentShip();

    const shipGhost = Array.from(
      document.querySelectorAll(`.${shipType}`)
    ).filter((el) => !el.classList.contains("placed"));
    if (shipGhost.length !== curShipLength) return;
    getShipPlacementCoords(shipGhost);

    (0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().getNextShip();
    if ((0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().getShipInventory().length === 0) {
      if ((0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().getTurn() === "p2") {
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

function addRotateEventListener() {
  const inv = document.querySelector(".ship-inventory");
  inv.addEventListener("click", () => {
    (0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().changeRotation();
  });
}

function renderGameBoard1(rotate = false) {
  (0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().resetShips();
  /* const game = Game(
    localStorage.getItem("player1Name"),
    localStorage.getItem("player2Name")
  );
  */

  const main = document.querySelector("main");
  main.innerHTML = `
      <div class="container fade-in"></div>`;
  const container = document.querySelector(".container");

  container.insertAdjacentHTML("beforeend", (0,_UI__WEBPACK_IMPORTED_MODULE_1__.renderPlayer1Name)());
  container.insertAdjacentHTML("beforeend", (0,_gameBoards__WEBPACK_IMPORTED_MODULE_0__.renderBoard1)());
  renderShipInventory();

  const p1Table = document.querySelector(".player1-board-container")
    .children[0];

  const cells = [];

  tagCells(p1Table, cells);
}

function renderGameBoard2(rotate = false) {
  (0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().resetShips();
  /* const game = Game(
    localStorage.getItem("player1Name"),
    localStorage.getItem("player2Name")
  );
  */
  (0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().changeTurn();
  const main = document.querySelector("main");
  main.innerHTML = `
      <div class="container fade-in"></div>`;
  const container = document.querySelector(".container");

  container.insertAdjacentHTML("beforeend", (0,_UI__WEBPACK_IMPORTED_MODULE_1__.renderPlayer2Name)());
  container.insertAdjacentHTML("beforeend", (0,_gameBoards__WEBPACK_IMPORTED_MODULE_0__.renderBoard2)());
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

function styleAttacks() {
  const attacks = (0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().getAttacks();
  const turn = (0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().getTurn();

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

  container.insertAdjacentHTML("beforeend", (0,_UI__WEBPACK_IMPORTED_MODULE_1__.renderPlayer1Name)());
  container.insertAdjacentHTML("beforeend", (0,_gameBoards__WEBPACK_IMPORTED_MODULE_0__.renderBoard1)());
  container.insertAdjacentHTML("beforeend", (0,_UI__WEBPACK_IMPORTED_MODULE_1__.renderPlayer2Name)());
  container.insertAdjacentHTML("beforeend", (0,_gameBoards__WEBPACK_IMPORTED_MODULE_0__.renderBoard2)());

  const p1Table = document.querySelector(".player1-board-container")
    .children[0];
  const p2Table = document.querySelector(".player2-board-container")
    .children[0];
  const players = (0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().getPlayers();
  const p1 = players.p1;
  const p2 = players.p2;
  const game = (0,_gameloop__WEBPACK_IMPORTED_MODULE_2__["default"])(p1, p2);
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
    e.target.form[0].value = 'Player 1';
    e.target.form[1].value = 'Player 2';
    storageSetPlayerNames('Player 1', 'Player 2');
    waitForAnimationEnd("fade-out", ".name-selection", removeNameSelectScreen);
    waitForAnimationEnd("fade-out", ".name-selection", renderGameBoard1);
  });
}

function addOpponentSelectEventListeners() {
  const aiBtn = document.querySelector("#ai");
  const humanBtn = document.querySelector("#human");

  aiBtn.addEventListener("click", () => {
    localStorage.setItem("opponent", "ai");
    waitForAnimationEnd("fade-out", ".welcome", removeWelcomeScreen);
    waitForAnimationEnd("fade-out", ".welcome", () => {
      (0,_UI__WEBPACK_IMPORTED_MODULE_1__.renderNameSelection)(true);
      addNameSubmitBtnEventListeners();
    });
  });

  humanBtn.addEventListener("click", () => {
    localStorage.setItem("opponent", "human");
    waitForAnimationEnd("fade-out", ".welcome", removeWelcomeScreen);
    waitForAnimationEnd("fade-out", ".welcome", _UI__WEBPACK_IMPORTED_MODULE_1__.renderNameSelection);
    addNameSubmitBtnEventListeners();
  });
}

function addGameOverEventListeners() {
  const retryBtn = document.querySelector(".retry-btn");
  const newPlayers = document.querySelector(".new-players-btn");

  retryBtn.addEventListener("click", (e) => {
    renderGameBoard1();
  });

  newPlayers.addEventListener("click", (e) => {
    (0,_UI__WEBPACK_IMPORTED_MODULE_1__.renderWelcomeScreen)();
    addOpponentSelectEventListeners();
  });
}

addOpponentSelectEventListeners();

(0,_battleship__WEBPACK_IMPORTED_MODULE_3__.Storage)().initShipCoords();

/* removeWelcomeScreen();
renderGameBoards();
renderGameEnd();
 */



/***/ }),

/***/ "./src/modules/UI.js":
/*!***************************!*\
  !*** ./src/modules/UI.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderGameEnd: () => (/* binding */ renderGameEnd),
/* harmony export */   renderNameSelection: () => (/* binding */ renderNameSelection),
/* harmony export */   renderPlayer1Name: () => (/* binding */ renderPlayer1Name),
/* harmony export */   renderPlayer2Name: () => (/* binding */ renderPlayer2Name),
/* harmony export */   renderShipInventory: () => (/* binding */ renderShipInventory),
/* harmony export */   renderWelcomeScreen: () => (/* binding */ renderWelcomeScreen)
/* harmony export */ });
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

function renderShipInventory() {
  const html = `
    <div class="ship-inventory">
      <svg xmlns="http://www.w3.org/2000/svg" height="50" viewBox="0 -960 960 960" width="50"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>
    </div>
  `;

  document.querySelector(".player-names").insertAdjacentHTML("afterend", html);
  addRotateEventListener();
}




/***/ }),

/***/ "./src/modules/battleship.js":
/*!***********************************!*\
  !*** ./src/modules/battleship.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gameboard: () => (/* binding */ Gameboard),
/* harmony export */   Player: () => (/* binding */ Player),
/* harmony export */   Ship: () => (/* binding */ Ship),
/* harmony export */   Storage: () => (/* binding */ Storage)
/* harmony export */ });
const Ship = (length) => {
  const numTimesHit = 0;

  function hit() {
    this.numTimesHit += 1;
    return this.numTimesHit;
  }

  function isSunk() {
    if (this.numTimesHit === length) return true;
    return false;
  }

  return { length, isSunk, numTimesHit, hit };
};

const Gameboard = () => {
  function generate() {
    const game = [];
    for (let i = 0; i < 10; i += 1) {
      for (let k = 0; k < 10; k += 1) {
        game.push({ pos: [i, k] });
      }
    }
    return game;
  }

  const board = generate();

  function getBoard() {
    return board;
  }

  function getRandomCoordinate() {
    const randomIndex = Math.floor(Math.random() * board.length);
    const startingValue = board[randomIndex];
    return startingValue;
  }

  function getBoardCoords(pos) {
    const b = getBoard();
    for (let i = 0; i < b.length; i += 1) {
      if (b[i].pos[0] === pos[0] && b[i].pos[1] === pos[1]) {
        return b[i];
      }
    }
    return null;
  }

  function placeShip(ship, coords) {
    coords.reduce((prev, curr) => {
      if (
        prev[0] - curr[0] > 1 ||
        prev[1] - curr[1] > 1 ||
        curr[1] - prev[1] > 1 ||
        curr[0] - prev[0] > 1
      )
        throw new Error("Invalid placement");
      else return curr;
    });
    const boardCoords = getBoardCoords(coords);
    boardCoords.ship = ship;
    return { coords, ship };
  }

  function receiveAttack(coords) {
    const boardPos = getBoardCoords(coords);
    if (boardPos.hit || boardPos.miss) return null;
    if (boardPos.ship) {
      boardPos.ship.hit();
      boardPos.hit = true;
      return true;
    }
    boardPos.miss = true;
    return false;
  }

  function missedAttacks() {
    const arr = [];
    for (let i = 0; i < board.length; i += 1) {
      if (board[i].miss) {
        arr.push(board[i]);
      }
    }
    return arr;
  }

  function shipsSunk() {
    const arrSunk = [];
    const arrAlive = [];
    for (let i = 0; i < board.length; i += 1) {
      if (board[i].ship) {
        if (board[i].ship.isSunk()) {
          arrSunk.push(board[i]);
        } else if (!board[i].ship.isSunk()) {
          arrAlive.push(board[i]);
        }
      }
    }
    if (arrAlive.length === 0) return { sunk: true, arrSunk };
    return { sunk: false, arrAlive };
  }

  function generateRandomShipPlacementCoords(cb, ship, set) {
    const randomAxis = Math.floor(Math.random() * 2);
    const horizontalPlacementCoords = [];
    const verticalPlacementCoords = [];

    let startingValue = getRandomCoordinate();

    while (
      (!(startingValue.pos[0] + ship.length <= 9) &&
        !(startingValue.pos[1] + ship.length <= 9)) ||
      set.has(JSON.stringify(startingValue))
    ) {
      startingValue = getRandomCoordinate();
    }

    if (startingValue.pos[0] + ship.length <= 9) {
      for (let i = 0; i < ship.length; i += 1) {
        if (
          set.has(
            JSON.stringify([startingValue.pos[0] + i, startingValue.pos[1]])
          )
        ) {
          return generateRandomShipPlacementCoords(cb, ship, set);
        }
        horizontalPlacementCoords.push([
          startingValue.pos[0] + i,
          startingValue.pos[1],
        ]);
      }
    }
    if (startingValue.pos[1] + ship.length <= 9) {
      for (let i = 0; i < ship.length; i += 1) {
        if (
          set.has(
            JSON.stringify([startingValue.pos[0], startingValue.pos[1] + i])
          )
        ) {
          return generateRandomShipPlacementCoords(cb, ship, set);
        }
        verticalPlacementCoords.push([
          startingValue.pos[0],
          startingValue.pos[1] + i,
        ]);
      }
    }

    const coords = [horizontalPlacementCoords, verticalPlacementCoords];
    if (coords[0].length === 0) return coords[1];
    if (coords[1].length === 0) return coords[0];

    coords[randomAxis].forEach((coord) => {
      cb(coord);
    });

    return coords[randomAxis];
  }

  function slicer(arr, type) {
    const newArr = [];
    let start;
    let end;
    let newArrLength;
    let startIncrement;
    let endIncrement;
    if (type === 2 || type === "double") {
      start = 0;
      end = 2;
      newArrLength = 3;
      startIncrement = 2;
      endIncrement = 2;
    }
    if (type === 3 || type === "triple") {
      start = 0;
      end = 3;
      newArrLength = 2;
      startIncrement = 3;
      endIncrement = 3;
    }
    for (let i = 0; i < newArrLength; i += 1) {
      newArr.push(arr.slice(start, end));
      start += startIncrement;
      end += endIncrement;
    }
    return newArr;
  }

  function placeShipsRandomly() {
    const shipCoords = new Set();
    let numberOfCoordinatePairs = 0;

    function randomlyPlaceShips(shipLength, n) {
      const arr = [];
      numberOfCoordinatePairs += n * shipLength;
      while (shipCoords.size < numberOfCoordinatePairs) {
        generateRandomShipPlacementCoords(
          (coords) => {
            const coordsStr = JSON.stringify(coords);
            if (!shipCoords.has(coordsStr)) {
              shipCoords.add(JSON.stringify(coords));
              arr.push(coords);
            }
          },
          Ship(shipLength),
          shipCoords
        );
      }
      return arr;
    }

    const singles = randomlyPlaceShips(1, 4);
    const doubles = randomlyPlaceShips(2, 3);
    const triples = randomlyPlaceShips(3, 2);
    const quads = randomlyPlaceShips(4, 1);

    const returnValue = {
      singles,
      doubles: slicer(doubles, 2),
      triples: slicer(triples, 3),
      quads,
    };

    returnValue.singles.forEach((coord) => {
      placeShip(Ship(1), coord);
    });

    return returnValue;
  }

  function getShipInventory() {
    return [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  }

  function placeShips(p2 = false) {
    let p2Text = "";
    if (p2) {
      p2Text = "P2";
    }
    const singles = JSON.parse(localStorage.getItem(`singles${p2Text}`));
    singles.flat(1).forEach((coord) => {
      placeShip(Ship(1), [Number(coord[0]), Number(coord[1])]);
    });
    const couples = JSON.parse(localStorage.getItem(`couples${p2Text}`));
    couples.forEach((couple) => {
      const ship2 = Ship(2);
      couple.forEach((coord) => {
        placeShip(ship2, [Number(coord[0]), Number(coord[1])]);
      });
    });
    const triplets = JSON.parse(localStorage.getItem(`triplets${p2Text}`));
    triplets.forEach((triplet) => {
      const ship3 = Ship(3);
      triplet.forEach((coord) => {
        placeShip(ship3, [Number(coord[0]), Number(coord[1])]);
      });
    });
    const quads = JSON.parse(localStorage.getItem(`quads${p2Text}`));
    quads.forEach((quad) => {
      const ship4 = Ship(4);
      quad.forEach((coord) => {
        placeShip(ship4, [Number(coord[0]), Number(coord[1])]);
      });
    });
  }

  return {
    placeShip,
    receiveAttack,
    missedAttacks,
    shipsSunk,
    placeShipsRandomly,
    getRandomCoordinate,
    getBoard,
    getShipInventory,
    placeShips,
  };
};

const Player = (name) => {
  const board = Gameboard();

  function attack(opponent, coords) {
    const result = opponent.board.receiveAttack(coords);
    if (result === null) {
      return { illegal: true, coords };
    }
    if (result === false) {
      return { miss: true, coords };
    }
    return { hit: true, coords };
  }

  return { name, board, attack };
};

const Storage = () => {
  function changeTurn() {
    const turn = localStorage.getItem("turn");
    if (turn === "p1") {
      localStorage.setItem("turn", "p2");
    }
    if (turn === "p2") {
      localStorage.setItem("turn", "p1");
    }
  }

  function getTurn() {
    return localStorage.getItem("turn");
  }

  function initAttacks() {
    localStorage.setItem("attacks", JSON.stringify({ p1: [], p2: [] }));
  }

  function getAttacks() {
    let attacks = JSON.parse(localStorage.getItem("attacks"));
    if (attacks === null) {
      initAttacks();
      attacks = JSON.parse(localStorage.getItem("attacks"));
    }
    return attacks;
  }

  function setAttacks(value) {
    localStorage.setItem("attacks", JSON.stringify(value));
  }

  function storeAttack(attackResult) {
    const turn = getTurn();
    const attacks = getAttacks();
    if (turn === "p1") {
      attacks.p1.push(attackResult);
    }
    if (turn === "p2") {
      attacks.p2.push(attackResult);
    }
    setAttacks(attacks);
  }

  function initRotation() {
    localStorage.setItem("rotate", false);
  }

  if (localStorage.getItem("rotate") === null) {
    initRotation();
  }

  function initShipInventory() {
    localStorage.setItem(
      "shipInventory",
      JSON.stringify(Gameboard().getShipInventory())
    );
  }

  if (localStorage.getItem("shipInventory") === null) {
    initShipInventory();
  }

  function initShipCoords() {
    localStorage.setItem("quads", JSON.stringify([]));
    localStorage.setItem("quadsP2", JSON.stringify([]));
    localStorage.setItem("triplets", JSON.stringify([]));
    localStorage.setItem("tripletsP2", JSON.stringify([]));
    localStorage.setItem("couples", JSON.stringify([]));
    localStorage.setItem("couplesP2", JSON.stringify([]));
    localStorage.setItem("singles", JSON.stringify([]));
    localStorage.setItem("singlesP2", JSON.stringify([]));
  }

  if (localStorage.getItem("quads") === null) {
    initShipCoords();
  }

  function getShipCoords(type) {
    return JSON.parse(localStorage.getItem(type));
  }

  function changeRotation() {
    if (localStorage.getItem("rotate") === "false") {
      localStorage.setItem("rotate", true);
    } else if (localStorage.getItem("rotate") === "true") {
      localStorage.setItem("rotate", false);
    }
  }

  function getPlayers() {
    const p1 = Player(localStorage.getItem("player1Name"));
    const p2 = Player(localStorage.getItem("player2Name"));
    return { p1, p2 };
  }

  function storeShip(arrCoords, p2 = false) {
    function getShipType() {
      let P2Str = "";
      if (p2) {
        P2Str = "P2";
      }
      if (arrCoords.length === 4) {
        return `quads${P2Str}`;
      }
      if (arrCoords.length === 3) {
        return `triplets${P2Str}`;
      }
      if (arrCoords.length === 2) {
        return `couples${P2Str}`;
      }
      if (arrCoords.length === 1) {
        return `singles${P2Str}`;
      }
      return null;
    }

    const store = (() => {
      const shipType = getShipType();
      const shipArrCoordinates = getShipCoords(shipType);
      shipArrCoordinates.push(arrCoords);
      localStorage.setItem(shipType, JSON.stringify(shipArrCoordinates));
    })();
  }

  function getNextShip() {
    const inv = JSON.parse(localStorage.getItem("shipInventory"));
    const next = inv.shift();
    localStorage.setItem("shipInventory", JSON.stringify(inv));
    return next;
  }

  function getCurrentShip() {
    return JSON.parse(localStorage.getItem("shipInventory"))[0];
  }

  function getShipInventory() {
    return JSON.parse(localStorage.getItem("shipInventory"));
  }

  function resetShips() {
    localStorage.setItem(
      "shipInventory",
      JSON.stringify(Gameboard().getShipInventory())
    );
  }

  function getRotation() {
    return JSON.parse(localStorage.getItem("rotate"));
  }

  return {
    changeTurn,
    changeRotation,
    initRotation,
    storeShip,
    getNextShip,
    getCurrentShip,
    resetShips,
    getRotation,
    getShipInventory,
    getTurn,
    initShipCoords,
    getPlayers,
    storeAttack,
    initAttacks,
    getAttacks,
  };
};




/***/ }),

/***/ "./src/modules/gameBoards.js":
/*!***********************************!*\
  !*** ./src/modules/gameBoards.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderBoard1: () => (/* binding */ renderBoard1),
/* harmony export */   renderBoard2: () => (/* binding */ renderBoard2)
/* harmony export */ });
function renderBoard1() {
  const html = `
        <div class="player1-board-container">
          <table>
            <thead>
              <tr>
                <th scope"col"></th>
                <th scope"col">A</th>
                <th scope"col">B</th>
                <th scope"col">C</th>
                <th scope"col">D</th>
                <th scope"col">E</th>
                <th scope"col">F</th>
                <th scope"col">G</th>
                <th scope"col">H</th>
                <th scope"col">I</th>
                <th scope"col">J</th>
              </tr>
            </thead>
            <tbody>
              <tr class="board-row">
                <td class="number-cell">1</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">2</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">3</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">4</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">5</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">6</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">7</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">8</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">9</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">10</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
          </table>
      </div>
    `;
  return html;
}

function renderBoard2() {
  const html = `
        <div class="player2-board-container">
          <table>
            <thead>
              <tr>
                <th scope"col"></th>
                <th scope"col">A</th>
                <th scope"col">B</th>
                <th scope"col">C</th>
                <th scope"col">D</th>
                <th scope"col">E</th>
                <th scope"col">F</th>
                <th scope"col">G</th>
                <th scope"col">H</th>
                <th scope"col">I</th>
                <th scope"col">J</th>
              </tr>
            </thead>
            <tbody>
              <tr class="board-row">
                <td class="number-cell">1</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">2</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">3</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">4</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">5</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">6</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">7</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">8</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">9</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
              <tr class="board-row">
                <td class="number-cell">10</td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
                <td class="cell"></td>
              </tr>
          </table>
        </div>`;
  return html;
}




/***/ }),

/***/ "./src/modules/gameloop.js":
/*!*********************************!*\
  !*** ./src/modules/gameloop.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOM */ "./src/modules/DOM.js");
/* harmony import */ var _battleship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./battleship */ "./src/modules/battleship.js");



const Game = (p1, p2) => {
  function next(e, styleResults) {
    if (
      localStorage.getItem("turn") === "p1" &&
      e.target.classList.contains("p2") &&
      !e.target.classList.contains("miss") &&
      !e.target.classList.contains("hit")
    ) {
      console.log(p2.board.shipsSunk());
      const coords = [Number(e.target.dataset.x), Number(e.target.dataset.y)];
      (0,_battleship__WEBPACK_IMPORTED_MODULE_1__.Storage)().storeAttack(styleResults(p1.attack(p2, coords), e));
      if (p2.board.shipsSunk().sunk) {
        localStorage.setItem("winner", p1.name);
        return "gameover";
      }
      // unRenderShips();
      (0,_DOM__WEBPACK_IMPORTED_MODULE_0__.styleAttacks)();
      (0,_battleship__WEBPACK_IMPORTED_MODULE_1__.Storage)().changeTurn();
    }
    if (
      localStorage.getItem("turn") === "p2" &&
      !e.target.classList.contains("p2") &&
      !e.target.classList.contains("miss") &&
      !e.target.classList.contains("hit")
    ) {
      console.log(p1.board.shipsSunk());
      const coords = [Number(e.target.dataset.x), Number(e.target.dataset.y)];
      (0,_battleship__WEBPACK_IMPORTED_MODULE_1__.Storage)().storeAttack(styleResults(p2.attack(p1, coords), e));
      if (p1.board.shipsSunk().sunk) {
        localStorage.setItem("winner", p2.name);
        return "gameover";
      }
      // unRenderShips();
      (0,_DOM__WEBPACK_IMPORTED_MODULE_0__.styleAttacks)();
      (0,_battleship__WEBPACK_IMPORTED_MODULE_1__.Storage)().changeTurn();
    }
    return null;
  }

  return { next };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/modules/DOM.js");
/******/ 	__webpack_require__("./src/modules/battleship.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/modules/gameloop.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRTRDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbmQ1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2VGM7QUFDTDs7QUFFL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLG9EQUFPO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sa0RBQVk7QUFDbEIsTUFBTSxvREFBTztBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sb0RBQU87QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxrREFBWTtBQUNsQixNQUFNLG9EQUFPO0FBQ2I7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDs7QUFFQSxpRUFBZSxJQUFJLEVBQUM7Ozs7Ozs7VUM3Q3BCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9ET00uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL1VJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9iYXR0bGVzaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lQm9hcmRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlbmRlckJvYXJkMSwgcmVuZGVyQm9hcmQyIH0gZnJvbSBcIi4vZ2FtZUJvYXJkc1wiO1xuaW1wb3J0IHtcbiAgcmVuZGVyUGxheWVyMU5hbWUsXG4gIHJlbmRlclBsYXllcjJOYW1lLFxuICByZW5kZXJXZWxjb21lU2NyZWVuLFxuICByZW5kZXJOYW1lU2VsZWN0aW9uLFxufSBmcm9tIFwiLi9VSVwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4vZ2FtZWxvb3BcIjtcbmltcG9ydCB7IFN0b3JhZ2UsIEdhbWVib2FyZCB9IGZyb20gXCIuL2JhdHRsZXNoaXBcIjtcblxuZnVuY3Rpb24gcmVtb3ZlV2VsY29tZVNjcmVlbigpIHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWxjb21lXCIpLnJlbW92ZSgpO1xuICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcIndpbm5lclwiKTtcbn1cblxuZnVuY3Rpb24gd2FpdEZvckFuaW1hdGlvbkVuZChhbmltYXRpb25DbGFzc05hbWUsIHF1ZXJ5U2VsZWN0b3IsIGNiKSB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHF1ZXJ5U2VsZWN0b3IpO1xuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoYW5pbWF0aW9uQ2xhc3NOYW1lKTtcbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHtcbiAgICBjYigpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlTmFtZUNvbG9yT25UdXJuKCkge1xuICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0dXJuXCIpID09PSBcInAxXCIpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllcjItbmFtZVwiKS5jbGFzc0xpc3QuYWRkKFwidHVyblwiKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllcjEtbmFtZVwiKS5jbGFzc0xpc3QucmVtb3ZlKFwidHVyblwiKTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllcjEtbmFtZVwiKS5jbGFzc0xpc3QuYWRkKFwidHVyblwiKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllcjItbmFtZVwiKS5jbGFzc0xpc3QucmVtb3ZlKFwidHVyblwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzdHlsZUF0dGFja1Jlc3VsdHMocmVzdWx0KSB7XG4gIGlmIChyZXN1bHQuaWxsZWdhbCkgcmV0dXJuO1xuICBjaGFuZ2VOYW1lQ29sb3JPblR1cm4oKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lT2ZUaGVDdXJyZW50U2hpcCgpIHtcbiAgY29uc3QgY3VyclNoaXAgPSBTdG9yYWdlKCkuZ2V0Q3VycmVudFNoaXAoKTtcbiAgaWYgKGN1cnJTaGlwID09PSA0KSB7XG4gICAgcmV0dXJuIFwicXVhZHJ1cGxlXCI7XG4gIH1cbiAgaWYgKGN1cnJTaGlwID09PSAzKSB7XG4gICAgcmV0dXJuIFwidHJpcGxlXCI7XG4gIH1cbiAgaWYgKGN1cnJTaGlwID09PSAyKSB7XG4gICAgcmV0dXJuIFwiZG91YmxlXCI7XG4gIH1cbiAgaWYgKGN1cnJTaGlwID09PSAxKSB7XG4gICAgcmV0dXJuIFwic2luZ2xlXCI7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGhvdmVySGlnaGxpZ2h0UGxhY2VtZW50KGUsIGNlbGxzQXJyLCByb3RhdGUgPSBmYWxzZSkge1xuICBpZiAoY2VsbHNBcnIgPT09IG51bGwpIHJldHVybjtcbiAgY29uc3QgY2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lT2ZUaGVDdXJyZW50U2hpcCgpO1xuICBjb25zdCBjdXJTaGlwTGVuZ3RoID0gU3RvcmFnZSgpLmdldEN1cnJlbnRTaGlwKCk7XG4gIGxldCBjZWxsWDtcbiAgbGV0IGNlbGxZO1xuICB3aGlsZSAoY2VsbHNBcnIubGVuZ3RoKSB7XG4gICAgY29uc3QgY2VsbCA9IGNlbGxzQXJyLnNoaWZ0KCk7XG4gICAgaWYgKCFjZWxsLmNsYXNzTGlzdC5jb250YWlucyhcInBsYWNlZFwiKSkge1xuICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfVxuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY3VyU2hpcExlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKHJvdGF0ZSkge1xuICAgICAgY2VsbFggPSBlLnRhcmdldC5kYXRhc2V0Lng7XG4gICAgICBjZWxsWSA9IE51bWJlcihlLnRhcmdldC5kYXRhc2V0LnkpICsgaTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VsbFggPSBOdW1iZXIoZS50YXJnZXQuZGF0YXNldC54KSArIGk7XG4gICAgICBjZWxsWSA9IGUudGFyZ2V0LmRhdGFzZXQueTtcbiAgICB9XG4gICAgY29uc3QgYWRqYWNlbnRDZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIGAuY2VsbFtkYXRhLXg9XCIke2NlbGxYfVwiXVtkYXRhLXk9XCIke2NlbGxZfVwiXWBcbiAgICApO1xuICAgIGlmIChhZGphY2VudENlbGwgPT09IG51bGwpIHJldHVybjtcbiAgICBjZWxsc0Fyci5wdXNoKGFkamFjZW50Q2VsbCk7XG4gICAgYWRqYWNlbnRDZWxsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRTaGlwUGxhY2VtZW50Q29vcmRzKHNoaXBHaG9zdCkge1xuICBjb25zdCBzaGlwQXJyID0gW107XG4gIGxldCBwMiA9IGZhbHNlO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBHaG9zdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChzaGlwR2hvc3RbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKFwicDJcIikpIHtcbiAgICAgIHAyID0gdHJ1ZTtcbiAgICB9XG4gICAgc2hpcEFyci5wdXNoKFtzaGlwR2hvc3RbaV0uZGF0YXNldC54LCBzaGlwR2hvc3RbaV0uZGF0YXNldC55XSk7XG4gICAgc2hpcEdob3N0W2ldLmNsYXNzTGlzdC5hZGQoXCJwbGFjZWRcIik7XG4gIH1cbiAgU3RvcmFnZSgpLnN0b3JlU2hpcChzaGlwQXJyLCBwMik7XG59XG5cbmZ1bmN0aW9uIGFkZENlbGxFdmVudExpc3RlbmVycyhjZWxsLCBjZWxsc0Fycikge1xuICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKGUpID0+IHtcbiAgICBjb25zdCByb3RhdGUgPSBTdG9yYWdlKCkuZ2V0Um90YXRpb24oKTtcbiAgICBpZiAocm90YXRlKSB7XG4gICAgICBob3ZlckhpZ2hsaWdodFBsYWNlbWVudChlLCBjZWxsc0Fyciwgcm90YXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaG92ZXJIaWdobGlnaHRQbGFjZW1lbnQoZSwgY2VsbHNBcnIpO1xuICAgIH1cbiAgfSk7XG4gIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcInBsYWNlZFwiKSkgcmV0dXJuO1xuICAgIGNvbnN0IGN1clNoaXBMZW5ndGggPSBTdG9yYWdlKCkuZ2V0Q3VycmVudFNoaXAoKTtcbiAgICBjb25zdCBzaGlwVHlwZSA9IGdldENsYXNzTmFtZU9mVGhlQ3VycmVudFNoaXAoKTtcblxuICAgIGNvbnN0IHNoaXBHaG9zdCA9IEFycmF5LmZyb20oXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtzaGlwVHlwZX1gKVxuICAgICkuZmlsdGVyKChlbCkgPT4gIWVsLmNsYXNzTGlzdC5jb250YWlucyhcInBsYWNlZFwiKSk7XG4gICAgaWYgKHNoaXBHaG9zdC5sZW5ndGggIT09IGN1clNoaXBMZW5ndGgpIHJldHVybjtcbiAgICBnZXRTaGlwUGxhY2VtZW50Q29vcmRzKHNoaXBHaG9zdCk7XG5cbiAgICBTdG9yYWdlKCkuZ2V0TmV4dFNoaXAoKTtcbiAgICBpZiAoU3RvcmFnZSgpLmdldFNoaXBJbnZlbnRvcnkoKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmIChTdG9yYWdlKCkuZ2V0VHVybigpID09PSBcInAyXCIpIHtcbiAgICAgICAgcmVuZGVyR2FtZUJvYXJkcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVuZGVyR2FtZUJvYXJkMigpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHRhZ0NlbGxzKHRhYmxlLCBjZWxsc0Fycikge1xuICBmb3IgKGxldCBpID0gMTsgaSA8IHRhYmxlLnJvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBmb3IgKGxldCBrID0gMTsgayA8IHRhYmxlLnJvd3NbaV0uY2VsbHMubGVuZ3RoOyBrICs9IDEpIHtcbiAgICAgIGNvbnN0IGNlbGwgPSB0YWJsZS5yb3dzW2ldLmNlbGxzW2tdO1xuICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXlcIiwgaSAtIDEpO1xuICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXhcIiwgayAtIDEpO1xuICAgICAgaWYgKHRhYmxlLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwicGxheWVyMi1ib2FyZC1jb250YWluZXJcIikpIHtcbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwicDJcIik7XG4gICAgICB9XG4gICAgICBhZGRDZWxsRXZlbnRMaXN0ZW5lcnMoY2VsbCwgY2VsbHNBcnIpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRSb3RhdGVFdmVudExpc3RlbmVyKCkge1xuICBjb25zdCBpbnYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoaXAtaW52ZW50b3J5XCIpO1xuICBpbnYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBTdG9yYWdlKCkuY2hhbmdlUm90YXRpb24oKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlckdhbWVCb2FyZDEocm90YXRlID0gZmFsc2UpIHtcbiAgU3RvcmFnZSgpLnJlc2V0U2hpcHMoKTtcbiAgLyogY29uc3QgZ2FtZSA9IEdhbWUoXG4gICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwbGF5ZXIxTmFtZVwiKSxcbiAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBsYXllcjJOYW1lXCIpXG4gICk7XG4gICovXG5cbiAgY29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpO1xuICBtYWluLmlubmVySFRNTCA9IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgZmFkZS1pblwiPjwvZGl2PmA7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGFpbmVyXCIpO1xuXG4gIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgcmVuZGVyUGxheWVyMU5hbWUoKSk7XG4gIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgcmVuZGVyQm9hcmQxKCkpO1xuICByZW5kZXJTaGlwSW52ZW50b3J5KCk7XG5cbiAgY29uc3QgcDFUYWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyMS1ib2FyZC1jb250YWluZXJcIilcbiAgICAuY2hpbGRyZW5bMF07XG5cbiAgY29uc3QgY2VsbHMgPSBbXTtcblxuICB0YWdDZWxscyhwMVRhYmxlLCBjZWxscyk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlckdhbWVCb2FyZDIocm90YXRlID0gZmFsc2UpIHtcbiAgU3RvcmFnZSgpLnJlc2V0U2hpcHMoKTtcbiAgLyogY29uc3QgZ2FtZSA9IEdhbWUoXG4gICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwbGF5ZXIxTmFtZVwiKSxcbiAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBsYXllcjJOYW1lXCIpXG4gICk7XG4gICovXG4gIFN0b3JhZ2UoKS5jaGFuZ2VUdXJuKCk7XG4gIGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcbiAgbWFpbi5pbm5lckhUTUwgPSBgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGZhZGUtaW5cIj48L2Rpdj5gO1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lclwiKTtcblxuICBjb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIHJlbmRlclBsYXllcjJOYW1lKCkpO1xuICBjb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIHJlbmRlckJvYXJkMigpKTtcbiAgcmVuZGVyU2hpcEludmVudG9yeSgpO1xuXG4gIGNvbnN0IHAyVGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllcjItYm9hcmQtY29udGFpbmVyXCIpXG4gICAgLmNoaWxkcmVuWzBdO1xuXG4gIGNvbnN0IGNlbGxzID0gW107XG5cbiAgaWYgKHJvdGF0ZSkge1xuICAgIHRhZ0NlbGxzKHAyVGFibGUsIGNlbGxzLCByb3RhdGUpO1xuICB9IGVsc2Uge1xuICAgIHRhZ0NlbGxzKHAyVGFibGUsIGNlbGxzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzdHlsZUF0dGFja3MoKSB7XG4gIGNvbnN0IGF0dGFja3MgPSBTdG9yYWdlKCkuZ2V0QXR0YWNrcygpO1xuICBjb25zdCB0dXJuID0gU3RvcmFnZSgpLmdldFR1cm4oKTtcblxuICBpZiAodHVybiA9PT0gXCJwMVwiKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRhY2tzLnAxLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBjZWxsRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAucDJbZGF0YS15PVwiJHthdHRhY2tzLnAxW2ldLmNvb3Jkc1sxXX1cIl1bZGF0YS14PVwiJHthdHRhY2tzLnAxW2ldLmNvb3Jkc1swXX1gXG4gICAgICApO1xuICAgICAgaWYgKGF0dGFja3MucDFbaV0ubWlzcykge1xuICAgICAgICBjZWxsRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChhdHRhY2tzLnAxW2ldLmhpdCkge1xuICAgICAgICBjZWxsRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAodHVybiA9PT0gXCJwMlwiKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRhY2tzLnAyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBjZWxsRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS15PVwiJHthdHRhY2tzLnAyW2ldLmNvb3Jkc1sxXX1cIl1bZGF0YS14PVwiJHthdHRhY2tzLnAyW2ldLmNvb3Jkc1swXX1gXG4gICAgICApO1xuICAgICAgaWYgKGF0dGFja3MucDJbaV0ubWlzcykge1xuICAgICAgICBjZWxsRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChhdHRhY2tzLnAyW2ldLmhpdCkge1xuICAgICAgICBjZWxsRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB1blJlbmRlclNoaXBzKCkge1xuICByZW5kZXJHYW1lQm9hcmRzKGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyR2FtZUJvYXJkcyhmaXJzdFJ1biA9IHRydWUpIHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIikuaW5uZXJIVE1MID0gYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBmYWRlLWluXCI+PC9kaXY+YDtcbiAgbGV0IGNwdVRleHQgPSBcIlwiO1xuICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJvcHBvbmVudFwiKSA9PT0gXCJhaVwiKSBjcHVUZXh0ID0gXCIoQ1BVKVwiO1xuXG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGFpbmVyXCIpO1xuXG4gIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgcmVuZGVyUGxheWVyMU5hbWUoKSk7XG4gIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgcmVuZGVyQm9hcmQxKCkpO1xuICBjb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIHJlbmRlclBsYXllcjJOYW1lKCkpO1xuICBjb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIHJlbmRlckJvYXJkMigpKTtcblxuICBjb25zdCBwMVRhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXIxLWJvYXJkLWNvbnRhaW5lclwiKVxuICAgIC5jaGlsZHJlblswXTtcbiAgY29uc3QgcDJUYWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyMi1ib2FyZC1jb250YWluZXJcIilcbiAgICAuY2hpbGRyZW5bMF07XG4gIGNvbnN0IHBsYXllcnMgPSBTdG9yYWdlKCkuZ2V0UGxheWVycygpO1xuICBjb25zdCBwMSA9IHBsYXllcnMucDE7XG4gIGNvbnN0IHAyID0gcGxheWVycy5wMjtcbiAgY29uc3QgZ2FtZSA9IEdhbWUocDEsIHAyKTtcbiAgZnVuY3Rpb24gYWRkQ2VsbEV2ZW50TGlzdGVuZXJzKGNlbGwpIHtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBnYW1lLm5leHQoZSwgc3R5bGVBdHRhY2tSZXN1bHRzKSA9PT0gXCJnYW1lb3ZlclwiIHx8XG4gICAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwid2lubmVyXCIpICE9PSBudWxsXG4gICAgICApIHtcbiAgICAgICAgcmVuZGVyR2FtZUVuZCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdGFnQ2VsbHModGFibGUpIHtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRhYmxlLnJvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGsgPSAxOyBrIDwgdGFibGUucm93c1tpXS5jZWxscy5sZW5ndGg7IGsgKz0gMSkge1xuICAgICAgICBjb25zdCBjZWxsID0gdGFibGUucm93c1tpXS5jZWxsc1trXTtcbiAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXlcIiwgaSAtIDEpO1xuICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZShcImRhdGEteFwiLCBrIC0gMSk7XG4gICAgICAgIGlmICh0YWJsZS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcInBsYXllcjItYm9hcmQtY29udGFpbmVyXCIpKSB7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwicDJcIik7XG4gICAgICAgIH1cbiAgICAgICAgYWRkQ2VsbEV2ZW50TGlzdGVuZXJzKGNlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlclNoaXBzKGJvYXJkLCBwMikge1xuICAgIGxldCBwbGF5ZXIyQ2xhc3MgPSBcIlwiO1xuICAgIGlmIChwMikge1xuICAgICAgcGxheWVyMkNsYXNzID0gXCIucDJcIjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBsZXQgdHlwZTtcbiAgICAgIGlmIChib2FyZFtpXS5zaGlwKSB7XG4gICAgICAgIGlmIChib2FyZFtpXS5zaGlwLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHR5cGUgPSBcInNpbmdsZVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChib2FyZFtpXS5zaGlwLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgIHR5cGUgPSBcImRvdWJsZVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChib2FyZFtpXS5zaGlwLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgIHR5cGUgPSBcInRyaXBsZVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChib2FyZFtpXS5zaGlwLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAgIHR5cGUgPSBcInF1YWRydXBsZVwiO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNlbGxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgJHtwbGF5ZXIyQ2xhc3N9W2RhdGEteT1cIiR7Ym9hcmRbaV0ucG9zWzFdfVwiXVtkYXRhLXg9XCIke2JvYXJkW2ldLnBvc1swXX1cIl1gXG4gICAgICAgICk7XG5cbiAgICAgICAgY2VsbEVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0eXBlLCBcInNoaXBcIik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU5hbWVTZWxlY3RTY3JlZW4oKSB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmFtZS1zZWxlY3Rpb25cIikucmVtb3ZlKCk7XG59XG5cbmZ1bmN0aW9uIHN0b3JhZ2VTZXRQbGF5ZXJOYW1lcyhwbGF5ZXIxTmFtZSwgcGxheWVyMk5hbWUpIHtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwbGF5ZXIxTmFtZVwiLCBwbGF5ZXIxTmFtZSk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicGxheWVyMk5hbWVcIiwgcGxheWVyMk5hbWUpO1xufVxuXG5mdW5jdGlvbiBhZGROYW1lU3VibWl0QnRuRXZlbnRMaXN0ZW5lcnMoKSB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgZS50YXJnZXQuZm9ybVswXS52YWx1ZSA9ICdQbGF5ZXIgMSc7XG4gICAgZS50YXJnZXQuZm9ybVsxXS52YWx1ZSA9ICdQbGF5ZXIgMic7XG4gICAgc3RvcmFnZVNldFBsYXllck5hbWVzKCdQbGF5ZXIgMScsICdQbGF5ZXIgMicpO1xuICAgIHdhaXRGb3JBbmltYXRpb25FbmQoXCJmYWRlLW91dFwiLCBcIi5uYW1lLXNlbGVjdGlvblwiLCByZW1vdmVOYW1lU2VsZWN0U2NyZWVuKTtcbiAgICB3YWl0Rm9yQW5pbWF0aW9uRW5kKFwiZmFkZS1vdXRcIiwgXCIubmFtZS1zZWxlY3Rpb25cIiwgcmVuZGVyR2FtZUJvYXJkMSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRPcHBvbmVudFNlbGVjdEV2ZW50TGlzdGVuZXJzKCkge1xuICBjb25zdCBhaUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWlcIik7XG4gIGNvbnN0IGh1bWFuQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNodW1hblwiKTtcblxuICBhaUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwib3Bwb25lbnRcIiwgXCJhaVwiKTtcbiAgICB3YWl0Rm9yQW5pbWF0aW9uRW5kKFwiZmFkZS1vdXRcIiwgXCIud2VsY29tZVwiLCByZW1vdmVXZWxjb21lU2NyZWVuKTtcbiAgICB3YWl0Rm9yQW5pbWF0aW9uRW5kKFwiZmFkZS1vdXRcIiwgXCIud2VsY29tZVwiLCAoKSA9PiB7XG4gICAgICByZW5kZXJOYW1lU2VsZWN0aW9uKHRydWUpO1xuICAgICAgYWRkTmFtZVN1Ym1pdEJ0bkV2ZW50TGlzdGVuZXJzKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGh1bWFuQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJvcHBvbmVudFwiLCBcImh1bWFuXCIpO1xuICAgIHdhaXRGb3JBbmltYXRpb25FbmQoXCJmYWRlLW91dFwiLCBcIi53ZWxjb21lXCIsIHJlbW92ZVdlbGNvbWVTY3JlZW4pO1xuICAgIHdhaXRGb3JBbmltYXRpb25FbmQoXCJmYWRlLW91dFwiLCBcIi53ZWxjb21lXCIsIHJlbmRlck5hbWVTZWxlY3Rpb24pO1xuICAgIGFkZE5hbWVTdWJtaXRCdG5FdmVudExpc3RlbmVycygpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkR2FtZU92ZXJFdmVudExpc3RlbmVycygpIHtcbiAgY29uc3QgcmV0cnlCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJldHJ5LWJ0blwiKTtcbiAgY29uc3QgbmV3UGxheWVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmV3LXBsYXllcnMtYnRuXCIpO1xuXG4gIHJldHJ5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgIHJlbmRlckdhbWVCb2FyZDEoKTtcbiAgfSk7XG5cbiAgbmV3UGxheWVycy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICByZW5kZXJXZWxjb21lU2NyZWVuKCk7XG4gICAgYWRkT3Bwb25lbnRTZWxlY3RFdmVudExpc3RlbmVycygpO1xuICB9KTtcbn1cblxuYWRkT3Bwb25lbnRTZWxlY3RFdmVudExpc3RlbmVycygpO1xuXG5TdG9yYWdlKCkuaW5pdFNoaXBDb29yZHMoKTtcblxuLyogcmVtb3ZlV2VsY29tZVNjcmVlbigpO1xucmVuZGVyR2FtZUJvYXJkcygpO1xucmVuZGVyR2FtZUVuZCgpO1xuICovXG5leHBvcnQgeyB1blJlbmRlclNoaXBzLCBzdHlsZUF0dGFja3MgfTtcbiIsImZ1bmN0aW9uIHJlbmRlclBsYXllcjFOYW1lKCkge1xuICBsZXQgdHVybiA9IFwiXCI7XG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInR1cm5cIikgPT09IFwicDFcIikgdHVybiA9IFwidHVyblwiO1xuICBjb25zdCBodG1sID0gYFxuICAgICAgPGRpdiBjbGFzcz1cInBsYXllci1uYW1lc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicGxheWVyMS1uYW1lIG5hbWUgc2lsbHktZm9udCAke3R1cm59XCI+XG4gICAgICAgICAgJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBsYXllcjFOYW1lXCIpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgcmV0dXJuIGh0bWw7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclBsYXllcjJOYW1lKCkge1xuICBsZXQgdHVybiA9IFwiXCI7XG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInR1cm5cIikgPT09IFwicDJcIikgdHVybiA9IFwidHVyblwiO1xuICBjb25zdCBodG1sID0gYFxuICAgICAgPGRpdiBjbGFzcz1cInBsYXllci1uYW1lc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicGxheWVyMi1uYW1lIG5hbWUgc2lsbHktZm9udCAke3R1cm59XCI+XG4gICAgICAgICAgJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBsYXllcjJOYW1lXCIpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgcmV0dXJuIGh0bWw7XG59XG5cbmZ1bmN0aW9uIHJlbmRlcldlbGNvbWVTY3JlZW4oKSB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpLmlubmVySFRNTCA9IGBcbiAgPGRpdiBjbGFzcz1cIndlbGNvbWUgZmFkZS1pblwiPlxuICAgICAgICA8aDE+V2VsY29tZSB0byBCYXR0bGVzaGlwPC9oMT5cbiAgICAgICAgPGgyIGNsYXNzPVwicXVlc3Rpb25cIj5GYWNlIGFuIEEuSSBvciBodW1hbiBvcHBvbmVudD88L2gyPlxuICAgICAgICA8ZGl2IGNsYXNzPVwic2VsZWN0LW9wcG9uZW50LWJ0bnNcIj5cbiAgICAgICAgICA8aW1nIHNyYz1cIi4vYXNzZXRzL2FpLmpwZ1wiIGFsdD1cImFpXCIgY2xhc3M9XCJvcHBvbmVudC1idG5cIiBpZD1cImFpXCIgLz5cbiAgICAgICAgICA8aW1nXG4gICAgICAgICAgICBzcmM9XCIuL2Fzc2V0cy9odW1hbi5qcGdcIlxuICAgICAgICAgICAgYWx0PVwiaHVtYW5cIlxuICAgICAgICAgICAgY2xhc3M9XCJvcHBvbmVudC1idG5cIlxuICAgICAgICAgICAgaWQ9XCJodW1hblwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgYDtcbn1cblxuZnVuY3Rpb24gcmVuZGVyTmFtZVNlbGVjdGlvbihhaSkge1xuICBsZXQgcGxheWVyMU5hbWU7XG4gIGxldCBwbGF5ZXIyTmFtZTtcbiAgaWYgKGFpKSB7XG4gICAgcGxheWVyMU5hbWUgPSBgRW50ZXIgeW91ciBuYW1lOmA7XG4gICAgcGxheWVyMk5hbWUgPSBgRW50ZXIgdGhlIG5hbWUgZm9yIHlvdXIgQS5JIGNoYWxsZW5nZXI6YDtcbiAgfSBlbHNlIHtcbiAgICBwbGF5ZXIxTmFtZSA9IGBQbGF5ZXIgMTogRW50ZXIgeW91ciBuYW1lOmA7XG4gICAgcGxheWVyMk5hbWUgPSBgUGxheWVyIDI6IEVudGVyIHlvdXIgbmFtZTpgO1xuICB9XG4gIGNvbnN0IGh0bWwgPSBgXG4gICAgPGRpdiBjbGFzcz1cIm5hbWUtc2VsZWN0aW9uIGZhZGUtaW5cIj5cbiAgICAgIDxmb3JtIGNsYXNzPVwiZm9ybS1uYW1lXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLW5hbWUtZWxcIj5cbiAgICAgICAgICA8bGFiZWwgZm9yPVwicGxheWVyMVwiPiAke3BsYXllcjFOYW1lfSA8L2xhYmVsPlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJwbGF5ZXIxXCIgaWQ9XCJwbGF5ZXIxXCIgcmVxdWlyZWQvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tbmFtZS1lbFwiPlxuICAgICAgICAgIDxsYWJlbCBmb3I9XCJwbGF5ZXIyXCI+ICR7cGxheWVyMk5hbWV9IDwvbGFiZWw+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInBsYXllcjJcIiBpZD1cInBsYXllcjJcIiByZXF1aXJlZC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3VibWl0LWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzaWxseS1mb250XCIgdHlwZT1cImJ1dHRvblwiPkxFVCdTIFJPQ0shPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9mb3JtPlxuICAgIDwvZGl2PlxuICBgO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKS5pbm5lckhUTUwgPSBodG1sO1xufVxuXG5mdW5jdGlvbiByZW5kZXJHYW1lRW5kKCkge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKS5pbm5lckhUTUwgPSBcIlwiO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKS5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgXCJiZWZvcmVlbmRcIixcbiAgICBgXG4gICAgPGRpdiBjbGFzcz1cImdhbWUtb3Zlci1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJnYW1lLW92ZXItY29udGVudFwiPlxuICAgICAgICA8aDE+R2FtZSBPdmVyPC9oMT5cbiAgICAgICAgPGgyPiR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ3aW5uZXJcIil9IHdpbnMhPC9oMT5cbiAgICAgICAgPGgyPiBQbGF5IGFnYWluPyA8L2gyPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1vdmVyLXByb21wdFwiPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicmV0cnktYnRuXCI+UmV0cnk8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5ldy1wbGF5ZXJzLWJ0blwiPk5ldyBQbGF5ZXJzPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGBcbiAgKTtcbiAgYWRkR2FtZU92ZXJFdmVudExpc3RlbmVycygpO1xufVxuXG5mdW5jdGlvbiByZW5kZXJTaGlwSW52ZW50b3J5KCkge1xuICBjb25zdCBodG1sID0gYFxuICAgIDxkaXYgY2xhc3M9XCJzaGlwLWludmVudG9yeVwiPlxuICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaGVpZ2h0PVwiNTBcIiB2aWV3Qm94PVwiMCAtOTYwIDk2MCA5NjBcIiB3aWR0aD1cIjUwXCI+PHBhdGggZD1cIk00ODAtMTYwcS0xMzQgMC0yMjctOTN0LTkzLTIyN3EwLTEzNCA5My0yMjd0MjI3LTkzcTY5IDAgMTMyIDI4LjVUNzIwLTY5MHYtMTEwaDgwdjI4MEg1MjB2LTgwaDE2OHEtMzItNTYtODcuNS04OFQ0ODAtNzIwcS0xMDAgMC0xNzAgNzB0LTcwIDE3MHEwIDEwMCA3MCAxNzB0MTcwIDcwcTc3IDAgMTM5LTQ0dDg3LTExNmg4NHEtMjggMTA2LTExNCAxNzN0LTE5NiA2N1pcIi8+PC9zdmc+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXItbmFtZXNcIikuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYWZ0ZXJlbmRcIiwgaHRtbCk7XG4gIGFkZFJvdGF0ZUV2ZW50TGlzdGVuZXIoKTtcbn1cblxuZXhwb3J0IHtcbiAgcmVuZGVyUGxheWVyMU5hbWUsXG4gIHJlbmRlclBsYXllcjJOYW1lLFxuICByZW5kZXJXZWxjb21lU2NyZWVuLFxuICByZW5kZXJOYW1lU2VsZWN0aW9uLFxuICByZW5kZXJTaGlwSW52ZW50b3J5LFxuICByZW5kZXJHYW1lRW5kLFxufTtcbiIsImNvbnN0IFNoaXAgPSAobGVuZ3RoKSA9PiB7XG4gIGNvbnN0IG51bVRpbWVzSGl0ID0gMDtcblxuICBmdW5jdGlvbiBoaXQoKSB7XG4gICAgdGhpcy5udW1UaW1lc0hpdCArPSAxO1xuICAgIHJldHVybiB0aGlzLm51bVRpbWVzSGl0O1xuICB9XG5cbiAgZnVuY3Rpb24gaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLm51bVRpbWVzSGl0ID09PSBsZW5ndGgpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB7IGxlbmd0aCwgaXNTdW5rLCBudW1UaW1lc0hpdCwgaGl0IH07XG59O1xuXG5jb25zdCBHYW1lYm9hcmQgPSAoKSA9PiB7XG4gIGZ1bmN0aW9uIGdlbmVyYXRlKCkge1xuICAgIGNvbnN0IGdhbWUgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgMTA7IGsgKz0gMSkge1xuICAgICAgICBnYW1lLnB1c2goeyBwb3M6IFtpLCBrXSB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdhbWU7XG4gIH1cblxuICBjb25zdCBib2FyZCA9IGdlbmVyYXRlKCk7XG5cbiAgZnVuY3Rpb24gZ2V0Qm9hcmQoKSB7XG4gICAgcmV0dXJuIGJvYXJkO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmFuZG9tQ29vcmRpbmF0ZSgpIHtcbiAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGJvYXJkLmxlbmd0aCk7XG4gICAgY29uc3Qgc3RhcnRpbmdWYWx1ZSA9IGJvYXJkW3JhbmRvbUluZGV4XTtcbiAgICByZXR1cm4gc3RhcnRpbmdWYWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEJvYXJkQ29vcmRzKHBvcykge1xuICAgIGNvbnN0IGIgPSBnZXRCb2FyZCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKGJbaV0ucG9zWzBdID09PSBwb3NbMF0gJiYgYltpXS5wb3NbMV0gPT09IHBvc1sxXSkge1xuICAgICAgICByZXR1cm4gYltpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXAoc2hpcCwgY29vcmRzKSB7XG4gICAgY29vcmRzLnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBwcmV2WzBdIC0gY3VyclswXSA+IDEgfHxcbiAgICAgICAgcHJldlsxXSAtIGN1cnJbMV0gPiAxIHx8XG4gICAgICAgIGN1cnJbMV0gLSBwcmV2WzFdID4gMSB8fFxuICAgICAgICBjdXJyWzBdIC0gcHJldlswXSA+IDFcbiAgICAgIClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwbGFjZW1lbnRcIik7XG4gICAgICBlbHNlIHJldHVybiBjdXJyO1xuICAgIH0pO1xuICAgIGNvbnN0IGJvYXJkQ29vcmRzID0gZ2V0Qm9hcmRDb29yZHMoY29vcmRzKTtcbiAgICBib2FyZENvb3Jkcy5zaGlwID0gc2hpcDtcbiAgICByZXR1cm4geyBjb29yZHMsIHNoaXAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soY29vcmRzKSB7XG4gICAgY29uc3QgYm9hcmRQb3MgPSBnZXRCb2FyZENvb3Jkcyhjb29yZHMpO1xuICAgIGlmIChib2FyZFBvcy5oaXQgfHwgYm9hcmRQb3MubWlzcykgcmV0dXJuIG51bGw7XG4gICAgaWYgKGJvYXJkUG9zLnNoaXApIHtcbiAgICAgIGJvYXJkUG9zLnNoaXAuaGl0KCk7XG4gICAgICBib2FyZFBvcy5oaXQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGJvYXJkUG9zLm1pc3MgPSB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1pc3NlZEF0dGFja3MoKSB7XG4gICAgY29uc3QgYXJyID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKGJvYXJkW2ldLm1pc3MpIHtcbiAgICAgICAgYXJyLnB1c2goYm9hcmRbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hpcHNTdW5rKCkge1xuICAgIGNvbnN0IGFyclN1bmsgPSBbXTtcbiAgICBjb25zdCBhcnJBbGl2ZSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChib2FyZFtpXS5zaGlwKSB7XG4gICAgICAgIGlmIChib2FyZFtpXS5zaGlwLmlzU3VuaygpKSB7XG4gICAgICAgICAgYXJyU3Vuay5wdXNoKGJvYXJkW2ldKTtcbiAgICAgICAgfSBlbHNlIGlmICghYm9hcmRbaV0uc2hpcC5pc1N1bmsoKSkge1xuICAgICAgICAgIGFyckFsaXZlLnB1c2goYm9hcmRbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhcnJBbGl2ZS5sZW5ndGggPT09IDApIHJldHVybiB7IHN1bms6IHRydWUsIGFyclN1bmsgfTtcbiAgICByZXR1cm4geyBzdW5rOiBmYWxzZSwgYXJyQWxpdmUgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tU2hpcFBsYWNlbWVudENvb3JkcyhjYiwgc2hpcCwgc2V0KSB7XG4gICAgY29uc3QgcmFuZG9tQXhpcyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICAgIGNvbnN0IGhvcml6b250YWxQbGFjZW1lbnRDb29yZHMgPSBbXTtcbiAgICBjb25zdCB2ZXJ0aWNhbFBsYWNlbWVudENvb3JkcyA9IFtdO1xuXG4gICAgbGV0IHN0YXJ0aW5nVmFsdWUgPSBnZXRSYW5kb21Db29yZGluYXRlKCk7XG5cbiAgICB3aGlsZSAoXG4gICAgICAoIShzdGFydGluZ1ZhbHVlLnBvc1swXSArIHNoaXAubGVuZ3RoIDw9IDkpICYmXG4gICAgICAgICEoc3RhcnRpbmdWYWx1ZS5wb3NbMV0gKyBzaGlwLmxlbmd0aCA8PSA5KSkgfHxcbiAgICAgIHNldC5oYXMoSlNPTi5zdHJpbmdpZnkoc3RhcnRpbmdWYWx1ZSkpXG4gICAgKSB7XG4gICAgICBzdGFydGluZ1ZhbHVlID0gZ2V0UmFuZG9tQ29vcmRpbmF0ZSgpO1xuICAgIH1cblxuICAgIGlmIChzdGFydGluZ1ZhbHVlLnBvc1swXSArIHNoaXAubGVuZ3RoIDw9IDkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgc2V0LmhhcyhcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KFtzdGFydGluZ1ZhbHVlLnBvc1swXSArIGksIHN0YXJ0aW5nVmFsdWUucG9zWzFdXSlcbiAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiBnZW5lcmF0ZVJhbmRvbVNoaXBQbGFjZW1lbnRDb29yZHMoY2IsIHNoaXAsIHNldCk7XG4gICAgICAgIH1cbiAgICAgICAgaG9yaXpvbnRhbFBsYWNlbWVudENvb3Jkcy5wdXNoKFtcbiAgICAgICAgICBzdGFydGluZ1ZhbHVlLnBvc1swXSArIGksXG4gICAgICAgICAgc3RhcnRpbmdWYWx1ZS5wb3NbMV0sXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3RhcnRpbmdWYWx1ZS5wb3NbMV0gKyBzaGlwLmxlbmd0aCA8PSA5KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHNldC5oYXMoXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShbc3RhcnRpbmdWYWx1ZS5wb3NbMF0sIHN0YXJ0aW5nVmFsdWUucG9zWzFdICsgaV0pXG4gICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVSYW5kb21TaGlwUGxhY2VtZW50Q29vcmRzKGNiLCBzaGlwLCBzZXQpO1xuICAgICAgICB9XG4gICAgICAgIHZlcnRpY2FsUGxhY2VtZW50Q29vcmRzLnB1c2goW1xuICAgICAgICAgIHN0YXJ0aW5nVmFsdWUucG9zWzBdLFxuICAgICAgICAgIHN0YXJ0aW5nVmFsdWUucG9zWzFdICsgaSxcbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY29vcmRzID0gW2hvcml6b250YWxQbGFjZW1lbnRDb29yZHMsIHZlcnRpY2FsUGxhY2VtZW50Q29vcmRzXTtcbiAgICBpZiAoY29vcmRzWzBdLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGNvb3Jkc1sxXTtcbiAgICBpZiAoY29vcmRzWzFdLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGNvb3Jkc1swXTtcblxuICAgIGNvb3Jkc1tyYW5kb21BeGlzXS5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgY2IoY29vcmQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvb3Jkc1tyYW5kb21BeGlzXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNsaWNlcihhcnIsIHR5cGUpIHtcbiAgICBjb25zdCBuZXdBcnIgPSBbXTtcbiAgICBsZXQgc3RhcnQ7XG4gICAgbGV0IGVuZDtcbiAgICBsZXQgbmV3QXJyTGVuZ3RoO1xuICAgIGxldCBzdGFydEluY3JlbWVudDtcbiAgICBsZXQgZW5kSW5jcmVtZW50O1xuICAgIGlmICh0eXBlID09PSAyIHx8IHR5cGUgPT09IFwiZG91YmxlXCIpIHtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICAgIGVuZCA9IDI7XG4gICAgICBuZXdBcnJMZW5ndGggPSAzO1xuICAgICAgc3RhcnRJbmNyZW1lbnQgPSAyO1xuICAgICAgZW5kSW5jcmVtZW50ID0gMjtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09IDMgfHwgdHlwZSA9PT0gXCJ0cmlwbGVcIikge1xuICAgICAgc3RhcnQgPSAwO1xuICAgICAgZW5kID0gMztcbiAgICAgIG5ld0Fyckxlbmd0aCA9IDI7XG4gICAgICBzdGFydEluY3JlbWVudCA9IDM7XG4gICAgICBlbmRJbmNyZW1lbnQgPSAzO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld0Fyckxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBuZXdBcnIucHVzaChhcnIuc2xpY2Uoc3RhcnQsIGVuZCkpO1xuICAgICAgc3RhcnQgKz0gc3RhcnRJbmNyZW1lbnQ7XG4gICAgICBlbmQgKz0gZW5kSW5jcmVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gbmV3QXJyO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwc1JhbmRvbWx5KCkge1xuICAgIGNvbnN0IHNoaXBDb29yZHMgPSBuZXcgU2V0KCk7XG4gICAgbGV0IG51bWJlck9mQ29vcmRpbmF0ZVBhaXJzID0gMDtcblxuICAgIGZ1bmN0aW9uIHJhbmRvbWx5UGxhY2VTaGlwcyhzaGlwTGVuZ3RoLCBuKSB7XG4gICAgICBjb25zdCBhcnIgPSBbXTtcbiAgICAgIG51bWJlck9mQ29vcmRpbmF0ZVBhaXJzICs9IG4gKiBzaGlwTGVuZ3RoO1xuICAgICAgd2hpbGUgKHNoaXBDb29yZHMuc2l6ZSA8IG51bWJlck9mQ29vcmRpbmF0ZVBhaXJzKSB7XG4gICAgICAgIGdlbmVyYXRlUmFuZG9tU2hpcFBsYWNlbWVudENvb3JkcyhcbiAgICAgICAgICAoY29vcmRzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb29yZHNTdHIgPSBKU09OLnN0cmluZ2lmeShjb29yZHMpO1xuICAgICAgICAgICAgaWYgKCFzaGlwQ29vcmRzLmhhcyhjb29yZHNTdHIpKSB7XG4gICAgICAgICAgICAgIHNoaXBDb29yZHMuYWRkKEpTT04uc3RyaW5naWZ5KGNvb3JkcykpO1xuICAgICAgICAgICAgICBhcnIucHVzaChjb29yZHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgU2hpcChzaGlwTGVuZ3RoKSxcbiAgICAgICAgICBzaGlwQ29vcmRzXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH1cblxuICAgIGNvbnN0IHNpbmdsZXMgPSByYW5kb21seVBsYWNlU2hpcHMoMSwgNCk7XG4gICAgY29uc3QgZG91YmxlcyA9IHJhbmRvbWx5UGxhY2VTaGlwcygyLCAzKTtcbiAgICBjb25zdCB0cmlwbGVzID0gcmFuZG9tbHlQbGFjZVNoaXBzKDMsIDIpO1xuICAgIGNvbnN0IHF1YWRzID0gcmFuZG9tbHlQbGFjZVNoaXBzKDQsIDEpO1xuXG4gICAgY29uc3QgcmV0dXJuVmFsdWUgPSB7XG4gICAgICBzaW5nbGVzLFxuICAgICAgZG91Ymxlczogc2xpY2VyKGRvdWJsZXMsIDIpLFxuICAgICAgdHJpcGxlczogc2xpY2VyKHRyaXBsZXMsIDMpLFxuICAgICAgcXVhZHMsXG4gICAgfTtcblxuICAgIHJldHVyblZhbHVlLnNpbmdsZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgIHBsYWNlU2hpcChTaGlwKDEpLCBjb29yZCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTaGlwSW52ZW50b3J5KCkge1xuICAgIHJldHVybiBbNCwgMywgMywgMiwgMiwgMiwgMSwgMSwgMSwgMV07XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXBzKHAyID0gZmFsc2UpIHtcbiAgICBsZXQgcDJUZXh0ID0gXCJcIjtcbiAgICBpZiAocDIpIHtcbiAgICAgIHAyVGV4dCA9IFwiUDJcIjtcbiAgICB9XG4gICAgY29uc3Qgc2luZ2xlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYHNpbmdsZXMke3AyVGV4dH1gKSk7XG4gICAgc2luZ2xlcy5mbGF0KDEpLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICBwbGFjZVNoaXAoU2hpcCgxKSwgW051bWJlcihjb29yZFswXSksIE51bWJlcihjb29yZFsxXSldKTtcbiAgICB9KTtcbiAgICBjb25zdCBjb3VwbGVzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgY291cGxlcyR7cDJUZXh0fWApKTtcbiAgICBjb3VwbGVzLmZvckVhY2goKGNvdXBsZSkgPT4ge1xuICAgICAgY29uc3Qgc2hpcDIgPSBTaGlwKDIpO1xuICAgICAgY291cGxlLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICAgIHBsYWNlU2hpcChzaGlwMiwgW051bWJlcihjb29yZFswXSksIE51bWJlcihjb29yZFsxXSldKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGNvbnN0IHRyaXBsZXRzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgdHJpcGxldHMke3AyVGV4dH1gKSk7XG4gICAgdHJpcGxldHMuZm9yRWFjaCgodHJpcGxldCkgPT4ge1xuICAgICAgY29uc3Qgc2hpcDMgPSBTaGlwKDMpO1xuICAgICAgdHJpcGxldC5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICBwbGFjZVNoaXAoc2hpcDMsIFtOdW1iZXIoY29vcmRbMF0pLCBOdW1iZXIoY29vcmRbMV0pXSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb25zdCBxdWFkcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYHF1YWRzJHtwMlRleHR9YCkpO1xuICAgIHF1YWRzLmZvckVhY2goKHF1YWQpID0+IHtcbiAgICAgIGNvbnN0IHNoaXA0ID0gU2hpcCg0KTtcbiAgICAgIHF1YWQuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgICAgcGxhY2VTaGlwKHNoaXA0LCBbTnVtYmVyKGNvb3JkWzBdKSwgTnVtYmVyKGNvb3JkWzFdKV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBsYWNlU2hpcCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIG1pc3NlZEF0dGFja3MsXG4gICAgc2hpcHNTdW5rLFxuICAgIHBsYWNlU2hpcHNSYW5kb21seSxcbiAgICBnZXRSYW5kb21Db29yZGluYXRlLFxuICAgIGdldEJvYXJkLFxuICAgIGdldFNoaXBJbnZlbnRvcnksXG4gICAgcGxhY2VTaGlwcyxcbiAgfTtcbn07XG5cbmNvbnN0IFBsYXllciA9IChuYW1lKSA9PiB7XG4gIGNvbnN0IGJvYXJkID0gR2FtZWJvYXJkKCk7XG5cbiAgZnVuY3Rpb24gYXR0YWNrKG9wcG9uZW50LCBjb29yZHMpIHtcbiAgICBjb25zdCByZXN1bHQgPSBvcHBvbmVudC5ib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3Jkcyk7XG4gICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHsgaWxsZWdhbDogdHJ1ZSwgY29vcmRzIH07XG4gICAgfVxuICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4geyBtaXNzOiB0cnVlLCBjb29yZHMgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgaGl0OiB0cnVlLCBjb29yZHMgfTtcbiAgfVxuXG4gIHJldHVybiB7IG5hbWUsIGJvYXJkLCBhdHRhY2sgfTtcbn07XG5cbmNvbnN0IFN0b3JhZ2UgPSAoKSA9PiB7XG4gIGZ1bmN0aW9uIGNoYW5nZVR1cm4oKSB7XG4gICAgY29uc3QgdHVybiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidHVyblwiKTtcbiAgICBpZiAodHVybiA9PT0gXCJwMVwiKSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInR1cm5cIiwgXCJwMlwiKTtcbiAgICB9XG4gICAgaWYgKHR1cm4gPT09IFwicDJcIikge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0dXJuXCIsIFwicDFcIik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHVybigpIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0dXJuXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdEF0dGFja3MoKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhdHRhY2tzXCIsIEpTT04uc3RyaW5naWZ5KHsgcDE6IFtdLCBwMjogW10gfSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QXR0YWNrcygpIHtcbiAgICBsZXQgYXR0YWNrcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhdHRhY2tzXCIpKTtcbiAgICBpZiAoYXR0YWNrcyA9PT0gbnVsbCkge1xuICAgICAgaW5pdEF0dGFja3MoKTtcbiAgICAgIGF0dGFja3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYXR0YWNrc1wiKSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRhY2tzO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0QXR0YWNrcyh2YWx1ZSkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYXR0YWNrc1wiLCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RvcmVBdHRhY2soYXR0YWNrUmVzdWx0KSB7XG4gICAgY29uc3QgdHVybiA9IGdldFR1cm4oKTtcbiAgICBjb25zdCBhdHRhY2tzID0gZ2V0QXR0YWNrcygpO1xuICAgIGlmICh0dXJuID09PSBcInAxXCIpIHtcbiAgICAgIGF0dGFja3MucDEucHVzaChhdHRhY2tSZXN1bHQpO1xuICAgIH1cbiAgICBpZiAodHVybiA9PT0gXCJwMlwiKSB7XG4gICAgICBhdHRhY2tzLnAyLnB1c2goYXR0YWNrUmVzdWx0KTtcbiAgICB9XG4gICAgc2V0QXR0YWNrcyhhdHRhY2tzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRSb3RhdGlvbigpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJvdGF0ZVwiLCBmYWxzZSk7XG4gIH1cblxuICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyb3RhdGVcIikgPT09IG51bGwpIHtcbiAgICBpbml0Um90YXRpb24oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRTaGlwSW52ZW50b3J5KCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgXCJzaGlwSW52ZW50b3J5XCIsXG4gICAgICBKU09OLnN0cmluZ2lmeShHYW1lYm9hcmQoKS5nZXRTaGlwSW52ZW50b3J5KCkpXG4gICAgKTtcbiAgfVxuXG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNoaXBJbnZlbnRvcnlcIikgPT09IG51bGwpIHtcbiAgICBpbml0U2hpcEludmVudG9yeSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFNoaXBDb29yZHMoKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJxdWFkc1wiLCBKU09OLnN0cmluZ2lmeShbXSkpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicXVhZHNQMlwiLCBKU09OLnN0cmluZ2lmeShbXSkpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidHJpcGxldHNcIiwgSlNPTi5zdHJpbmdpZnkoW10pKTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRyaXBsZXRzUDJcIiwgSlNPTi5zdHJpbmdpZnkoW10pKTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImNvdXBsZXNcIiwgSlNPTi5zdHJpbmdpZnkoW10pKTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImNvdXBsZXNQMlwiLCBKU09OLnN0cmluZ2lmeShbXSkpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2luZ2xlc1wiLCBKU09OLnN0cmluZ2lmeShbXSkpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2luZ2xlc1AyXCIsIEpTT04uc3RyaW5naWZ5KFtdKSk7XG4gIH1cblxuICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJxdWFkc1wiKSA9PT0gbnVsbCkge1xuICAgIGluaXRTaGlwQ29vcmRzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTaGlwQ29vcmRzKHR5cGUpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0eXBlKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjaGFuZ2VSb3RhdGlvbigpIHtcbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyb3RhdGVcIikgPT09IFwiZmFsc2VcIikge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyb3RhdGVcIiwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJvdGF0ZVwiKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicm90YXRlXCIsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQbGF5ZXJzKCkge1xuICAgIGNvbnN0IHAxID0gUGxheWVyKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGxheWVyMU5hbWVcIikpO1xuICAgIGNvbnN0IHAyID0gUGxheWVyKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGxheWVyMk5hbWVcIikpO1xuICAgIHJldHVybiB7IHAxLCBwMiB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc3RvcmVTaGlwKGFyckNvb3JkcywgcDIgPSBmYWxzZSkge1xuICAgIGZ1bmN0aW9uIGdldFNoaXBUeXBlKCkge1xuICAgICAgbGV0IFAyU3RyID0gXCJcIjtcbiAgICAgIGlmIChwMikge1xuICAgICAgICBQMlN0ciA9IFwiUDJcIjtcbiAgICAgIH1cbiAgICAgIGlmIChhcnJDb29yZHMubGVuZ3RoID09PSA0KSB7XG4gICAgICAgIHJldHVybiBgcXVhZHMke1AyU3RyfWA7XG4gICAgICB9XG4gICAgICBpZiAoYXJyQ29vcmRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICByZXR1cm4gYHRyaXBsZXRzJHtQMlN0cn1gO1xuICAgICAgfVxuICAgICAgaWYgKGFyckNvb3Jkcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIGBjb3VwbGVzJHtQMlN0cn1gO1xuICAgICAgfVxuICAgICAgaWYgKGFyckNvb3Jkcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIGBzaW5nbGVzJHtQMlN0cn1gO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RvcmUgPSAoKCkgPT4ge1xuICAgICAgY29uc3Qgc2hpcFR5cGUgPSBnZXRTaGlwVHlwZSgpO1xuICAgICAgY29uc3Qgc2hpcEFyckNvb3JkaW5hdGVzID0gZ2V0U2hpcENvb3JkcyhzaGlwVHlwZSk7XG4gICAgICBzaGlwQXJyQ29vcmRpbmF0ZXMucHVzaChhcnJDb29yZHMpO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2hpcFR5cGUsIEpTT04uc3RyaW5naWZ5KHNoaXBBcnJDb29yZGluYXRlcykpO1xuICAgIH0pKCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXROZXh0U2hpcCgpIHtcbiAgICBjb25zdCBpbnYgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2hpcEludmVudG9yeVwiKSk7XG4gICAgY29uc3QgbmV4dCA9IGludi5zaGlmdCgpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2hpcEludmVudG9yeVwiLCBKU09OLnN0cmluZ2lmeShpbnYpKTtcbiAgICByZXR1cm4gbmV4dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEN1cnJlbnRTaGlwKCkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2hpcEludmVudG9yeVwiKSlbMF07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTaGlwSW52ZW50b3J5KCkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2hpcEludmVudG9yeVwiKSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFNoaXBzKCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgXCJzaGlwSW52ZW50b3J5XCIsXG4gICAgICBKU09OLnN0cmluZ2lmeShHYW1lYm9hcmQoKS5nZXRTaGlwSW52ZW50b3J5KCkpXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJvdGF0aW9uKCkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicm90YXRlXCIpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2hhbmdlVHVybixcbiAgICBjaGFuZ2VSb3RhdGlvbixcbiAgICBpbml0Um90YXRpb24sXG4gICAgc3RvcmVTaGlwLFxuICAgIGdldE5leHRTaGlwLFxuICAgIGdldEN1cnJlbnRTaGlwLFxuICAgIHJlc2V0U2hpcHMsXG4gICAgZ2V0Um90YXRpb24sXG4gICAgZ2V0U2hpcEludmVudG9yeSxcbiAgICBnZXRUdXJuLFxuICAgIGluaXRTaGlwQ29vcmRzLFxuICAgIGdldFBsYXllcnMsXG4gICAgc3RvcmVBdHRhY2ssXG4gICAgaW5pdEF0dGFja3MsXG4gICAgZ2V0QXR0YWNrcyxcbiAgfTtcbn07XG5cbmV4cG9ydCB7IFNoaXAsIEdhbWVib2FyZCwgUGxheWVyLCBTdG9yYWdlIH07XG4iLCJmdW5jdGlvbiByZW5kZXJCb2FyZDEoKSB7XG4gIGNvbnN0IGh0bWwgPSBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwbGF5ZXIxLWJvYXJkLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDx0YWJsZT5cbiAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0aCBzY29wZVwiY29sXCI+PC90aD5cbiAgICAgICAgICAgICAgICA8dGggc2NvcGVcImNvbFwiPkE8L3RoPlxuICAgICAgICAgICAgICAgIDx0aCBzY29wZVwiY29sXCI+QjwvdGg+XG4gICAgICAgICAgICAgICAgPHRoIHNjb3BlXCJjb2xcIj5DPC90aD5cbiAgICAgICAgICAgICAgICA8dGggc2NvcGVcImNvbFwiPkQ8L3RoPlxuICAgICAgICAgICAgICAgIDx0aCBzY29wZVwiY29sXCI+RTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoIHNjb3BlXCJjb2xcIj5GPC90aD5cbiAgICAgICAgICAgICAgICA8dGggc2NvcGVcImNvbFwiPkc8L3RoPlxuICAgICAgICAgICAgICAgIDx0aCBzY29wZVwiY29sXCI+SDwvdGg+XG4gICAgICAgICAgICAgICAgPHRoIHNjb3BlXCJjb2xcIj5JPC90aD5cbiAgICAgICAgICAgICAgICA8dGggc2NvcGVcImNvbFwiPko8L3RoPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj4xPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj4yPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj4zPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj40PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj41PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj42PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj43PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj44PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj45PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj4xMDwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgPC90YWJsZT5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG4gIHJldHVybiBodG1sO1xufVxuXG5mdW5jdGlvbiByZW5kZXJCb2FyZDIoKSB7XG4gIGNvbnN0IGh0bWwgPSBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwbGF5ZXIyLWJvYXJkLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDx0YWJsZT5cbiAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0aCBzY29wZVwiY29sXCI+PC90aD5cbiAgICAgICAgICAgICAgICA8dGggc2NvcGVcImNvbFwiPkE8L3RoPlxuICAgICAgICAgICAgICAgIDx0aCBzY29wZVwiY29sXCI+QjwvdGg+XG4gICAgICAgICAgICAgICAgPHRoIHNjb3BlXCJjb2xcIj5DPC90aD5cbiAgICAgICAgICAgICAgICA8dGggc2NvcGVcImNvbFwiPkQ8L3RoPlxuICAgICAgICAgICAgICAgIDx0aCBzY29wZVwiY29sXCI+RTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoIHNjb3BlXCJjb2xcIj5GPC90aD5cbiAgICAgICAgICAgICAgICA8dGggc2NvcGVcImNvbFwiPkc8L3RoPlxuICAgICAgICAgICAgICAgIDx0aCBzY29wZVwiY29sXCI+SDwvdGg+XG4gICAgICAgICAgICAgICAgPHRoIHNjb3BlXCJjb2xcIj5JPC90aD5cbiAgICAgICAgICAgICAgICA8dGggc2NvcGVcImNvbFwiPko8L3RoPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj4xPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj4yPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj4zPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj40PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj41PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj42PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj43PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj44PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj45PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZWxsXCI+PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYm9hcmQtcm93XCI+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibnVtYmVyLWNlbGxcIj4xMDwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2VsbFwiPjwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgPC9kaXY+YDtcbiAgcmV0dXJuIGh0bWw7XG59XG5cbmV4cG9ydCB7IHJlbmRlckJvYXJkMSwgcmVuZGVyQm9hcmQyIH07XG4iLCJpbXBvcnQgeyB1blJlbmRlclNoaXBzLCBzdHlsZUF0dGFja3MgfSBmcm9tIFwiLi9ET01cIjtcbmltcG9ydCB7IFBsYXllciwgU3RvcmFnZSB9IGZyb20gXCIuL2JhdHRsZXNoaXBcIjtcblxuY29uc3QgR2FtZSA9IChwMSwgcDIpID0+IHtcbiAgZnVuY3Rpb24gbmV4dChlLCBzdHlsZVJlc3VsdHMpIHtcbiAgICBpZiAoXG4gICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInR1cm5cIikgPT09IFwicDFcIiAmJlxuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwicDJcIikgJiZcbiAgICAgICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJtaXNzXCIpICYmXG4gICAgICAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpXG4gICAgKSB7XG4gICAgICBjb25zb2xlLmxvZyhwMi5ib2FyZC5zaGlwc1N1bmsoKSk7XG4gICAgICBjb25zdCBjb29yZHMgPSBbTnVtYmVyKGUudGFyZ2V0LmRhdGFzZXQueCksIE51bWJlcihlLnRhcmdldC5kYXRhc2V0LnkpXTtcbiAgICAgIFN0b3JhZ2UoKS5zdG9yZUF0dGFjayhzdHlsZVJlc3VsdHMocDEuYXR0YWNrKHAyLCBjb29yZHMpLCBlKSk7XG4gICAgICBpZiAocDIuYm9hcmQuc2hpcHNTdW5rKCkuc3Vuaykge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIndpbm5lclwiLCBwMS5uYW1lKTtcbiAgICAgICAgcmV0dXJuIFwiZ2FtZW92ZXJcIjtcbiAgICAgIH1cbiAgICAgIC8vIHVuUmVuZGVyU2hpcHMoKTtcbiAgICAgIHN0eWxlQXR0YWNrcygpO1xuICAgICAgU3RvcmFnZSgpLmNoYW5nZVR1cm4oKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0dXJuXCIpID09PSBcInAyXCIgJiZcbiAgICAgICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJwMlwiKSAmJlxuICAgICAgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcIm1pc3NcIikgJiZcbiAgICAgICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIilcbiAgICApIHtcbiAgICAgIGNvbnNvbGUubG9nKHAxLmJvYXJkLnNoaXBzU3VuaygpKTtcbiAgICAgIGNvbnN0IGNvb3JkcyA9IFtOdW1iZXIoZS50YXJnZXQuZGF0YXNldC54KSwgTnVtYmVyKGUudGFyZ2V0LmRhdGFzZXQueSldO1xuICAgICAgU3RvcmFnZSgpLnN0b3JlQXR0YWNrKHN0eWxlUmVzdWx0cyhwMi5hdHRhY2socDEsIGNvb3JkcyksIGUpKTtcbiAgICAgIGlmIChwMS5ib2FyZC5zaGlwc1N1bmsoKS5zdW5rKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwid2lubmVyXCIsIHAyLm5hbWUpO1xuICAgICAgICByZXR1cm4gXCJnYW1lb3ZlclwiO1xuICAgICAgfVxuICAgICAgLy8gdW5SZW5kZXJTaGlwcygpO1xuICAgICAgc3R5bGVBdHRhY2tzKCk7XG4gICAgICBTdG9yYWdlKCkuY2hhbmdlVHVybigpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB7IG5leHQgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tb2R1bGVzL0RPTS5qc1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tb2R1bGVzL2JhdHRsZXNoaXAuanNcIik7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tb2R1bGVzL2dhbWVsb29wLmpzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9