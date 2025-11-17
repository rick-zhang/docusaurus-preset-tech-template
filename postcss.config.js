module.exports = {
  plugins: [
    require('postcss-nested'),
    require('postcss-nested-vars'),
    require('postcss-custom-properties')({
      preserve: true,
    }),
  ],
};

