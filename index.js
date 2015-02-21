var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var Package = require('./package.json');
var RGX_COLOR = /(#)?([\w\d]){6}/;

var processImageData = require('color-to-alpha/process-image-data');
var stringToRGB = require('color-to-alpha/string-to-rgb');

var Canvas = require('canvas');
var Image = Canvas.Image;

module.exports = function (color) {

  if (typeof color !== 'string' && (typeof color !== 'object' && typeof color.length !== 'number')) {
    throw new gutil.PluginError(Package.name, 'E_COLOR: Provide a color as string or RGB array')
  }

  if (typeof color === 'string') color = stringToRGB(color);

  return through.obj(function (file, enc, callback) {
    var self = this;

    if (file.isNull()) {
      callback(null);
      return;
    }

    if (file.isStream()) {
      return callback(new gutil.PluginError(Package.name, 'E_STREAM: Streaming not supported'));
    }

    var img = new Image();

    img.onload = function () {
      var filename = file.history[file.history.length-1];
      self.push(new gutil.File({
        path : path.basename(filename, path.extname(filename)) + '.png',
        contents : _toAlpha(img)
      }));

      callback(null);
    };

    img.onerror = function (e) { callback(e); };
    img.src = file.contents;

    function _toAlpha (img) {
      var canvas = new Canvas(img.width, img.height);
      var context = canvas.getContext('2d');
      context.drawImage(img, 0, 0, img.width, img.height);
      var data = context.getImageData(0, 0, img.width, img.height);
      processImageData(data, data, color);
      context.putImageData(data, 0, 0);
      return canvas.toBuffer('png');
    }
  });
};