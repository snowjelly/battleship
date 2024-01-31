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

function addOpponentSelectEventListeners() {
  const aiBtn = document.querySelector("#ai");
  const humanBtn = document.querySelector("#human");

  aiBtn.addEventListener("click", (e) => {
    fadeOutWelcome();
  });

  humanBtn.addEventListener("click", (e) => {
    fadeOutWelcome();
  });
}

addOpponentSelectEventListeners();
