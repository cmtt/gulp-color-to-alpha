global.assert = require('assert');
global.basePath = _basePath;
global.specPath = _basePath.bind(null, 'spec');

var path = require('path');

/**
 * @function
 * @returns {string}
 */

function _basePath () {
  var args = [].slice.apply(arguments);
  args.unshift(__dirname, '..');
  return path.join.apply(path, args);
}