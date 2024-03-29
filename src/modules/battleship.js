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

    // returnValue.doubles.forEach((doubleCoord) => {
    //   const ship = Ship(2);
    //   doubleCoord.forEach((singleCoord) => {
    //     placeShip(ship, singleCoord);
    //   });
    // });

    // returnValue.triples.forEach((tripleCoord) => {
    //   const ship = Ship(3);
    //   tripleCoord.forEach((singleCoord) => {
    //     placeShip(ship, singleCoord);
    //   });
    // });

    // const ship = Ship(4);
    // returnValue.quads.forEach((coord) => {
    //   placeShip(ship, coord);
    // });

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
    if (p2) {
      if (arrCoords.length === 4) {
        const quadsP2 = getShipCoords("quadsP2");
        quadsP2.push(arrCoords);
        localStorage.setItem("quadsP2", JSON.stringify(quadsP2));
      } else if (arrCoords.length === 3) {
        const tripletsP2 = getShipCoords("tripletsP2");
        tripletsP2.push(arrCoords);
        localStorage.setItem("tripletsP2", JSON.stringify(tripletsP2));
      } else if (arrCoords.length === 2) {
        const couplesP2 = getShipCoords("couplesP2");
        couplesP2.push(arrCoords);
        localStorage.setItem("couplesP2", JSON.stringify(couplesP2));
      } else if (arrCoords.length === 1) {
        const singlesP2 = getShipCoords("singlesP2");
        singlesP2.push(arrCoords);
        localStorage.setItem("singlesP2", JSON.stringify(singlesP2));
      }
    } else if (arrCoords.length === 4) {
      const quads = getShipCoords("quads");
      quads.push(arrCoords);
      localStorage.setItem("quads", JSON.stringify(quads));
    } else if (arrCoords.length === 3) {
      const triplets = getShipCoords("triplets");
      triplets.push(arrCoords);
      localStorage.setItem("triplets", JSON.stringify(triplets));
    } else if (arrCoords.length === 2) {
      const couples = getShipCoords("couples");
      couples.push(arrCoords);
      localStorage.setItem("couples", JSON.stringify(couples));
    } else if (arrCoords.length === 1) {
      const singles = getShipCoords("singles");
      singles.push(arrCoords);
      localStorage.setItem("singles", JSON.stringify(singles));
    }
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
  };
};

export { Ship, Gameboard, Player, Storage };
