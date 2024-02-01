const path = require("path");

module.exports = {
  mode: "development",
  entry: [
    "./src/modules/DOM.js",
    "./src/modules/battleship.js",
    "./src/modules/gameloop.js",
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
