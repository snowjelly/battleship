/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/DOM.js":
/*!****************************!*\
  !*** ./src/modules/DOM.js ***!
  \****************************/
/***/ (() => {

eval("// after getting the users name we should\n// ask them if they want to fight an AI opponent\n// or real life opponent\n\nfunction addOpponentSelectEventListeners() {\n  const aiBtn = document.querySelector(\"#ai\");\n  const humanBtn = document.querySelector(\"#human\");\n\n  aiBtn.addEventListener(\"click\", (e) => {\n    console.log(e);\n  });\n\n  humanBtn.addEventListener(\"click\", (e) => {\n    console.log(e);\n  });\n}\n\naddOpponentSelectEventListeners();\n\n\n//# sourceURL=webpack://battleship/./src/modules/DOM.js?");

/***/ }),

/***/ "./src/modules/battleship.js":
/*!***********************************!*\
  !*** ./src/modules/battleship.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Gameboard: () => (/* binding */ Gameboard),\n/* harmony export */   Player: () => (/* binding */ Player),\n/* harmony export */   Ship: () => (/* binding */ Ship)\n/* harmony export */ });\nconst Ship = (length) => {\n  const numTimesHit = 0;\n\n  function hit() {\n    this.numTimesHit += 1;\n    return this.numTimesHit;\n  }\n\n  function isSunk() {\n    if (this.numTimesHit === length) return true;\n    return false;\n  }\n\n  return { length, isSunk, numTimesHit, hit };\n};\n\nconst Gameboard = () => {\n  function generate() {\n    const game = [];\n    for (let i = 0; i < 10; i += 1) {\n      for (let k = 0; k < 10; k += 1) {\n        game.push({ pos: [i, k] });\n      }\n    }\n    return game;\n  }\n\n  const board = generate();\n\n  function getRandomCoordinate() {\n    const randomIndex = Math.floor(Math.random() * board.length);\n    const startingValue = board[randomIndex];\n    return startingValue;\n  }\n\n  function getBoardCoords(pos) {\n    for (let i = 0; i < board.length; i += 1) {\n      if (board[i].pos[0] === pos[0] && board[i].pos[1] === pos[1]) {\n        return board[i];\n      }\n    }\n    return null;\n  }\n\n  function placeShip(ship, coords) {\n    coords.reduce((prev, curr) => {\n      if (\n        prev[0] - curr[0] > 1 ||\n        prev[1] - curr[1] > 1 ||\n        curr[1] - prev[1] > 1 ||\n        curr[0] - prev[0] > 1\n      )\n        throw new Error(\"Invalid placement\");\n      else return curr;\n    });\n    const boardCoords = getBoardCoords(coords);\n    boardCoords.ship = ship;\n    return { coords, ship };\n  }\n\n  function receiveAttack(coords) {\n    const boardPos = getBoardCoords(coords);\n    if (boardPos.hit) return \"Cannot shoot the same coordinate twice\";\n    if (boardPos.ship) {\n      boardPos.ship.hit();\n      boardPos.hit = true;\n      return boardPos.ship;\n    }\n    boardPos.miss = true;\n    return false;\n  }\n\n  function missedAttacks() {\n    const arr = [];\n    for (let i = 0; i < board.length; i += 1) {\n      if (board[i].miss) {\n        arr.push(board[i]);\n      }\n    }\n    return arr;\n  }\n\n  function shipsSunk() {\n    const arrSunk = [];\n    const arrAlive = [];\n    for (let i = 0; i < board.length; i += 1) {\n      if (board[i].ship) {\n        if (board[i].ship.isSunk()) {\n          arrSunk.push(board[i]);\n        } else if (!board[i].ship.isSunk()) {\n          arrAlive.push(board[i]);\n        }\n      }\n    }\n    if (arrAlive.length === 0) return { sunk: true, arrSunk };\n    return { sunk: false, arrAlive };\n  }\n\n  function generateRandomShipPlacementCoords(cb, ship, set) {\n    const randomAxis = Math.floor(Math.random() * 2);\n    const horizontalPlacementCoords = [];\n    const verticalPlacementCoords = [];\n\n    let startingValue = getRandomCoordinate();\n\n    while (\n      (!(startingValue.pos[0] + ship.length <= 9) &&\n        !(startingValue.pos[1] + ship.length <= 9)) ||\n      set.has(JSON.stringify(startingValue))\n    ) {\n      startingValue = getRandomCoordinate();\n    }\n\n    if (startingValue.pos[0] + ship.length <= 9) {\n      for (let i = 0; i < ship.length; i += 1) {\n        if (\n          set.has(\n            JSON.stringify([startingValue.pos[0] + i, startingValue.pos[1]])\n          )\n        ) {\n          return generateRandomShipPlacementCoords(cb, ship, set);\n        }\n        horizontalPlacementCoords.push([\n          startingValue.pos[0] + i,\n          startingValue.pos[1],\n        ]);\n      }\n    }\n    if (startingValue.pos[1] + ship.length <= 9) {\n      for (let i = 0; i < ship.length; i += 1) {\n        if (\n          set.has(\n            JSON.stringify([startingValue.pos[0], startingValue.pos[1] + i])\n          )\n        ) {\n          return generateRandomShipPlacementCoords(cb, ship, set);\n        }\n        verticalPlacementCoords.push([\n          startingValue.pos[0],\n          startingValue.pos[1] + i,\n        ]);\n      }\n    }\n\n    const coords = [horizontalPlacementCoords, verticalPlacementCoords];\n    if (coords[0].length === 0) return coords[1];\n    if (coords[1].length === 0) return coords[0];\n\n    coords[randomAxis].forEach((coord) => {\n      cb(coord);\n    });\n\n    return coords[randomAxis];\n  }\n\n  function placeShipsRandomly() {\n    function slicer(arr, type) {\n      const newArr = [];\n      let start;\n      let end;\n      let newArrLength;\n      let startIncrement;\n      let endIncrement;\n      if (type === 2 || type === \"double\") {\n        start = 0;\n        end = 2;\n        newArrLength = 3;\n        startIncrement = 2;\n        endIncrement = 2;\n      }\n      if (type === 3 || type === \"triple\") {\n        start = 0;\n        end = 3;\n        newArrLength = 2;\n        startIncrement = 3;\n        endIncrement = 3;\n      }\n      for (let i = 0; i < newArrLength; i += 1) {\n        newArr.push(arr.slice(start, end));\n        start += startIncrement;\n        end += endIncrement;\n      }\n      return newArr;\n    }\n\n    const shipCoords = new Set();\n    let numberOfCoordinatePairs = 0;\n\n    function randomlyPlaceShips(shipLength, n) {\n      const arr = [];\n      numberOfCoordinatePairs += n * shipLength;\n      while (shipCoords.size < numberOfCoordinatePairs) {\n        generateRandomShipPlacementCoords(\n          (coords) => {\n            const coordsStr = JSON.stringify(coords);\n            if (!shipCoords.has(coordsStr)) {\n              shipCoords.add(JSON.stringify(coords));\n              arr.push(coords);\n            }\n          },\n          Ship(shipLength),\n          shipCoords\n        );\n      }\n      return arr;\n    }\n\n    const singles = randomlyPlaceShips(1, 4);\n    const doubles = randomlyPlaceShips(2, 3);\n    const triples = randomlyPlaceShips(3, 2);\n    const quads = randomlyPlaceShips(4, 1);\n\n    const returnValue = {\n      singles,\n      doubles: slicer(doubles, 2),\n      triples: slicer(triples, 3),\n      quads,\n    };\n\n    returnValue.singles.forEach((coord) => {\n      placeShip(Ship(1), coord);\n    });\n\n    returnValue.doubles.forEach((doubleCoord) => {\n      const ship = Ship(2);\n      doubleCoord.forEach((singleCoord) => {\n        placeShip(ship, singleCoord);\n      });\n    });\n\n    returnValue.triples.forEach((tripleCoord) => {\n      const ship = Ship(3);\n      tripleCoord.forEach((singleCoord) => {\n        placeShip(ship, singleCoord);\n      });\n    });\n\n    returnValue.quads.forEach((coord) => {\n      const ship = Ship(4);\n      placeShip(ship, coord);\n    });\n\n    return returnValue;\n  }\n\n  return {\n    placeShip,\n    receiveAttack,\n    missedAttacks,\n    shipsSunk,\n    placeShipsRandomly,\n    getRandomCoordinate,\n  };\n};\n\nconst Player = (name) => {\n  const board = Gameboard();\n\n  function attack(player, coords) {\n    const result = player.board.receiveAttack(coords);\n    if (result === false) {\n      return `${name} has missed!`;\n    }\n    return `${name} has hit ${player.name}'s ship on ${coords}!`;\n  }\n\n  return { name, board, attack };\n};\n\n\n\n\n//# sourceURL=webpack://battleship/./src/modules/battleship.js?");

/***/ }),

/***/ "./src/modules/gameloop.js":
/*!*********************************!*\
  !*** ./src/modules/gameloop.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _battleship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./battleship */ \"./src/modules/battleship.js\");\n\n\nconst Game = (player1Name, player2Name = null) => {\n  if (player2Name === null) {\n    const player1 = (0,_battleship__WEBPACK_IMPORTED_MODULE_0__.Player)(player1Name);\n    player1.board.placeShipsRandomly();\n    const ai = (0,_battleship__WEBPACK_IMPORTED_MODULE_0__.Player)(\"AI\");\n    ai.board.placeShipsRandomly();\n\n    return ai.attack(player1, player1.board.getRandomCoordinate().pos);\n  }\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);\n\n\n//# sourceURL=webpack://battleship/./src/modules/gameloop.js?");

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
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	__webpack_require__("./src/modules/DOM.js");
/******/ 	__webpack_require__("./src/modules/battleship.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/modules/gameloop.js");
/******/ 	
/******/ })()
;