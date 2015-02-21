gulp-color-to-alpha
===================

This is a plugin for the Gulp building system which removes a given color from the given set of images (see [color-to-alpha](http://cmtt.github.io/color-to-alpha)).

## Usage

In order to remove a color #ffffff from all images in images, use the following calls:

```js
  var alpha = require('gulp-color-to-alpha');
  
  gulp.src([
    'images/**/*'
  ])
  .pipe(alpha('#ffffff'))
  .pipe(gulp.dest('output'));

```

Color must be a hexdecimal string or an RGB array ([0,0,0]).

## Running the unit tests

You will need to have the [Mocha](http://mochajs.org/) test framework installed.

```js
mocha spec
```

# Licence

MIT

