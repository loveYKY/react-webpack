const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const isDev = process.env.NODE_ENV === "development"; // 是否是开发模式
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  //配置入口文件
  entry: path.join(__dirname, "../src/index.tsx"),

  //配置输出文件
  output: {
    filename: "[name].[chunkhash:8].js", //打包后模块的名称
    path: path.join(__dirname, "../dist"), //打包后模块输出的位置
    clean: true,
    publicPath: "/", // 打包后文件的公共前缀路径
  },

  //配置loader
  module: {
    rules: [
      //配置babel使浏览器可以处理tsx和ts语法
      {
        test: /.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      //处理scss、less以及css文件
      // Less 配置
      {
        test: /.less$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["autoprefixer"],
              },
            },
          },
          "less-loader",
        ],
      },
      // Sass 配置
      {
        test: /.scss$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["autoprefixer"],
              },
            },
          },
          "sass-loader",
        ],
      },
      //处理图片文件
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/images/[name].[contenthash:8][ext]", // 文件输出目录和命名
        },
      },
      //处理字体和图标文件
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/fonts/[name].[contenthash:8][ext]", // 文件输出目录和命名
        },
      },
      //处理媒体文件
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/media/[name].[contenthash:8][ext]", // 文件输出目录和命名
        },
      },
    ],
  },

  //配置插件
  plugins: [
    //HtmlWebpackPlugin可以帮助打包后的静态资源自动注入到html里
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"), //选择模板，以public的index.html作为模板注入
      inject: true, // 自动注入静态资源
    }),
    //为业务代码注入环境变量
    new webpack.DefinePlugin({
      "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV),
    }),
  ],

  cache: {
    type: "filesystem", // 使用文件缓存
  },

  resolve: {
    //自动匹配文件后缀名
    extensions: [".js", ".tsx", ".ts"],
    alias: {
      "@": path.join(__dirname, "../src"),
    },
    modules: [path.resolve(__dirname, "../node_modules")], // 查找第三方模块只在本项目的node_modules中查找
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
};
