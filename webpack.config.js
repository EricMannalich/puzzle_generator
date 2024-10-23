const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const packageJson = require("./package.json");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const outputPath = isProduction ? "./dist" : "./dev";
  const projectName = packageJson.name || "main";
  return {
    entry: "./index.jsx",
    output: {
      path: path.resolve(__dirname, outputPath),
      filename: `${projectName}.js`,
    },
    resolve: {
      extensions: ["", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: ["@babel/plugin-transform-class-properties"],
            },
          },
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            compress: {
              drop_console: isProduction,
            },
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
    devServer: {
      historyApiFallback: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.TRAINING": JSON.stringify(!isProduction),
        "process.env.PROJECT_NAME": JSON.stringify(projectName),
      }),
    ],
  };
};
