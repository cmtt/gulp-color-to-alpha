describe('color-to-alpha', function () {
  var fs = require('fs');
  var Canvas = require('canvas');
  var gutil = require('gulp-util');

  var Image = Canvas.Image;
  var colorToAlpha = require(basePath('index.js'));

  it ('removes a color form an image', function (done) {
    var stream = colorToAlpha('#0000');

    var l = 0;
    var buffer = null;

    stream.on('end', function () {
      assert.ok(buffer, 'File was returned');

      var img = new Image();
      var transparentPixels = 0;

      img.onload = function () {
        var canvas = new Canvas(img.width, img.height);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0,0, img.width, img.height);
        var l = data.data.length;
        while (l-= 4) transparentPixels+= data.data[l] === 0 ? 1 : 0;
        transparentPixels = 100 * (transparentPixels / (img.width * img.height));
        assert.equal(Math.round(transparentPixels), 25);
        done();
      };

      img.onerror = function (e) { throw e; };
      img.src = buffer;

    });

    stream.on('data', function (file) {
      assert.ok(!buffer,'Only one file is returned');

      var buf = file.contents;
      assert.equal(buf.slice(1,4).toString(),'PNG');
      buffer = buf;
    });

    stream.write(new gutil.File({
      path : 'black-quadrant.png',
      contents : fs.readFileSync(specPath('fixtures', 'black-quadrant.png'))
    }));

    stream.end();

  });
});