function removeWelcomeScreen() {
  document.querySelector(".welcome").remove();
}

function fadeOutWelcome() {
  const welcome = document.querySelector(".welcome");
  welcome.classList.add("fade-out");
  welcome.addEventListener("animationend", () => {
    removeWelcomeScreen();
  });
}

function waitForAnimationEnd(animationClassName, querySelector, cb) {
  const element = document.querySelector(querySelector);
  element.classList.add(animationClassName);
  element.addEventListener("animationend", () => {
    cb();
  });
}

function renderNameSelection() {
  const html = `
    <div class="name-selection fade-in">
      <form>
        <div class"form-name-el">
          <label for="player1"> Player 1: Enter your name: </label>
          <input type="text" name="player1" id="player1" required/>
        </div>
        <div class"form-name-el">
          <label for="player2"> Player 2: Enter your name: </label>
          <input type="text" name="player2" id="player2" required/>
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
    waitForAnimationEnd("fade-out", ".welcome", renderNameSelection);
  });

  humanBtn.addEventListener("click", (e) => {
    fadeOutWelcome();
    renderNameSelection();
  });
}

addOpponentSelectEventListeners();
