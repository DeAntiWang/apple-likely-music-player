module.exports = {
  mode: "development",
  watch: true,
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  devtool: "source-map",
  module: {
    rules: [
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.jsx?$/, exclude: /node_modules/, use: "babel-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
    ],
  },
};
