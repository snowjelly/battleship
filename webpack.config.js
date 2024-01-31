const path = require("path");

module.exports = {
  mode: "development",
  entry: [
    "./src/modules/DOM.js",
    "./src/modules/battleship.js",
    "./src/modules/gameloop.js",
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
