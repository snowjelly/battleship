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
  function renderPlayerNames() {
    let cpuText = "";
    if (localStorage.getItem("opponent") === "ai") cpuText = "(CPU)";
    const html = `
      <div class="player-names">
        <div class="player1-name name silly-font">
          ${localStorage.getItem("player1Name")}
        </div>
        <div class="player2-name name silly-font">
          ${localStorage.getItem("player2Name")} ${cpuText}
        </div>
      </div>
    `;
    return html;
  }

  function renderBoards() {
    const html = `
      <div class="boards">
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
                <td class="cell"></td>
              </tr>
          </table>
        </div>
        <div class="player2-board-container">
        </div>
      </div>
    `;
    return html;
  }

  document.querySelector(".container").innerHTML =
    renderPlayerNames() + renderBoards();
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
