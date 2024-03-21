function renderPlayer1Name() {
  let turn = "";
  if (localStorage.getItem("turn") === "p1") turn = "turn";
  const html = `
      <div class="player-names">
        <div class="player1-name name silly-font pink-bubble ${turn}">
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
    player1Name = `Player 1`;
    player2Name = `Player 2`;
  }
  const html = `
    <div class="name-selection fade-in">
      <form class="form-name pink-bubble">
        <div class="name-prompt">
          <h1>Enter Name</h1>        
        </div>
        <div class="form-name-el">
          <label for="player1" class="player-name-label"> ${player1Name} </label>
          <input type="text" name="player1" id="player1" required/>
        </div>
        <div class="form-name-el">
          <label for="player2" class="player-name-label"> ${player2Name} </label>
          <input type="text" name="player2" id="player2" required/>
        </div>
        <div class="submit-container">
          <button class="silly-font" type="button" id="submit-btn">LET'S ROCK!</button>
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

function addRotateEventListener() {
  const inv = document.querySelector(".ship-inventory");
  inv.addEventListener("click", () => {
    Storage().changeRotation();
  });
}

export {
  renderPlayer1Name,
  renderPlayer2Name,
  renderWelcomeScreen,
  renderNameSelection,
  renderShipInventory,
  renderGameEnd,
};
