// after getting the users name we should
// ask them if they want to fight an AI opponent
// or real life opponent

function addOpponentSelectEventListeners() {
  const aiBtn = document.querySelector("#ai");
  const humanBtn = document.querySelector("#human");

  aiBtn.addEventListener("click", (e) => {
    console.log(e);
  });

  humanBtn.addEventListener("click", (e) => {
    console.log(e);
  });
}

addOpponentSelectEventListeners();
