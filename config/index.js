/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const { resolve } = path;

const MAIN = `entrance`;

/**
 * 所有页面入口
 * @type {{ [key: string]: string }}
 */
const pages = {};

fs.readdirSync(resolve(__dirname, '../src/app')).forEach((page) => {
  pages[page] = {
    // page 的入口
    entry: `./src/app/${page}/index.ts`,
    // 模板来源
    template: `./src/app/${page}/index.html`,
    // 在 dist/index.html 的输出
    filename: `${page}.html`,
    // 当使用 title 选项时，
    // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: page,
    // 在这个页面中包含的块，默认情况下会包含
    // 提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', page],
  };
});

const entries = {
  [MAIN]: `./src/${MAIN}.ts`,
};

module.exports = { pages, entries };

exports.isVite = () => {
  const {
    env: { npm_package_scripts_vite = `` },
  } = process;
  return npm_package_scripts_vite.includes(`USE_VITE`);
};
