const path = require("path");
const Webpack = require("webpack");
const { readdirSync } = require("fs");

const functionsPath = path.join(__dirname, "functions");
const fns = readdirSync(functionsPath);

module.exports = fns.map(f => ({
  mode: "production",
  entry: ["babel-polyfill", path.join(functionsPath, f, "./index.js")],
  target: "node",
  output: {
    path: path.join(functionsPath, f, "lib"),
    filename: "index.js",
    libraryTarget: "commonjs2"
  },
  externals: ["aws-sdk"],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    new Webpack.NoEmitOnErrorsPlugin(),
    new Webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ]
}));
