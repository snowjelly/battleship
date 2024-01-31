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
      <form>
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

function addOpponentSelectEventListeners() {
  const aiBtn = document.querySelector("#ai");
  const humanBtn = document.querySelector("#human");

  aiBtn.addEventListener("click", (e) => {
    waitForAnimationEnd("fade-out", ".welcome", removeWelcomeScreen);
    waitForAnimationEnd("fade-out", ".welcome", () => {
      renderNameSelection(true);
    });
  });

  humanBtn.addEventListener("click", (e) => {
    waitForAnimationEnd("fade-out", ".welcome", removeWelcomeScreen);
    waitForAnimationEnd("fade-out", ".welcome", renderNameSelection);
  });
}

addOpponentSelectEventListeners();
