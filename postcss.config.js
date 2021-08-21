const postcssPresetEnv = require('postcss-preset-env')

module.exports = {
  plugins: [
    require('postcss-nested')({
      preserveEmpty: true,
    }),
    postcssPresetEnv({ 
      browsers: 'last 3 versions' 
    }),
    require('cssnano')({
      preset: 'default'
    })
  ]
}