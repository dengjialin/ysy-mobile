// import Path from 'path';
import PxToRem from 'postcss-pxtorem';
const path = require('path')
const svgSpriteDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),
  path.resolve(__dirname, 'src/svg/')
]

export default {
  hash: true,
  entry: 'src/index.js',
  disableCSSModules: false,
  publicPath : `/public/`,
  outputPath : `./dist`,
  autoprefixer: {
    browsers: [
      'iOS >= 8',
      'Android >= 4'
    ]
  },
  svgSpriteLoaderDirs:svgSpriteDirs,
  extraPostCSSPlugins: [
    PxToRem({
      rootValue: 100,
      propWhiteList: [],
    }),
  ],
  extraBabelPlugins: [
    'transform-runtime',
    ['import', {
      libraryName: 'antd-mobile',
      style: true
    }]
  ],
  env: {
    production: {
      multipage: true,
    },
    development: {
      multipage: false,
      extraBabelPlugins: [
        'dva-hmr'
      ]
    }
  }
};
