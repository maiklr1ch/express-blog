
const prettyPath = require('pretty-path-express');
prettyPath.setDirname(__dirname, '../views');

module.exports = prettyPath.getPath;