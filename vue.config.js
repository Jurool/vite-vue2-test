/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { pages } = require(`./config`);
console.log('pages: ', pages);

const { resolve } = path;
const { assign: extend } = Object;

const {
  env: { npm_package_scripts_vite = `` },
} = process;

const isVite = npm_package_scripts_vite.includes(`USE_VITE`);
console.log('isVite: ', isVite);

const env = process.env.NODE_ENV;
const FILE_LIMIT_SIZE = 8292;

const isProduction = env === `production`;

/**
 * @type {Omit<import('@vue/cli-service').ProjectOptions, 'pages'>}
 */
const restConfig = {
  publicPath: `/`,
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('~entrance', resolve('src/entrance.ts'));

    // 去除css、js文件hash
    if (isProduction) {
      config.plugin('extract-css').tap(() => [
        {
          filename: `css/[name].css`,
          chunkFilename: `css/[name].css`,
        },
      ]);

      config.plugin(`optimize-css`).tap((args) => {
        // 禁用颜色压缩
        args[0].cssnanoOptions.preset[1].colormin = false;
        return args;
      });
    }

    config.output.filename('js/[name].js').end();
    config.output.chunkFilename('js/[name].js').end();
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => Object.assign(options, { limit: FILE_LIMIT_SIZE }));

    const svgModule = config.module.rule('svg');
    svgModule.uses.clear();
    svgModule
      .use('url-loader')
      .loader('url-loader')
      .tap(() => ({ limit: FILE_LIMIT_SIZE }));

    config.optimization.minimizer('terser').tap((args) => {
      extend(args[0].terserOptions, {
        output: {
          comments: false, // 去掉注释
        },
        warnings: false,
        compress: {
          drop_console: true,
          drop_debugger: false,
          pure_funcs: ['console.log'],
        },
      });

      return args;
    });
  },
  configureWebpack: {
    optimization: {
      minimize: isProduction,
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'all',
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader-srcset',
              options: {
                minimize: false,
                interpolate: true,
                attrs: [':src', ':srcset', ':data-src', ':data-srcset'],
              },
            },
          ],
        },
      ],
    },
    css: {
      loaderOptions: {
        sass: {
          // https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
          prependData:
            '@import "~@/css/_variables.scss"; @import "~@/css/_mixin.scss";',
        },
      },
    },
  },
  devServer: {
    open: `./`,
    disableHostCheck: true,
  },
};

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
const config = {
  pages,
  // pluginOptions: {
  //   vite: {
  //     optimizeDeps: {
  //       // entries: ['**/index.html'],
  //       // include: [`vue`, `vue-router`],
  //     },
  //     vitePluginVue2Options: {
  //       jsx: true,
  //       jsxOptions: {
  //         compositionAPI: true,
  //       },
  //     },
  //   },
  // },

  ...(isVite ? {} : restConfig),
};

module.exports = config;
