(function (root, $) {

  var previousImgcolr = root.Imgcolr;

  var Imgcolr = {};
  var canvas = document.createElement('canvas');
  // TODO find a better way to determine image cors support precisely.
  var imgCors = !!(canvas.getContext && canvas.getContext('2d')) && $.support.cors && ('crossOrigin' in new Image());

  var SIDE_TOP = 't';
  var SIDE_RIGHT = 'r';
  var SIDE_BOTTOM = 'b';
  var SIDE_LEFT = 'l';

  var decToHex = function (num) {
    var hex = num.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  };

  var rgbToHex = function (r, g, b) {
    return ['#', decToHex(r), decToHex(g), decToHex(b)].join('');
  };

  var countColor = function (x, y, width, imageData, colorsMap) {
    var name;
    var idx = (y * width + x) * 4;
    var alpha = imageData[idx + 3];

    // if true, means alpha value is less than 127, ignore this point
    if (alpha < 127) return;

    name = rgbToHex(imageData[idx], imageData[idx + 1], imageData[idx + 2]);
    if (colorsMap[name]) {
      colorsMap[name] ++;
    } else {
      colorsMap[name] = 1;
    }
  };

  var traverse = function (side, colorsMap, width, height, imageData) {
    var x, y;
    if (side === SIDE_TOP || side === SIDE_BOTTOM) {
      y = (side == SIDE_TOP) ? 0 : (height - 1);
      for (x = 0; x < width; x++) {
        countColor(x, y, width, imageData, colorsMap);
      }
    } else { // side is right or left
      x = (side == SIDE_RIGHT) ? (width - 1) : 0;
      for (y = 1; y < height-1; y++) {
        countColor(x, y, width, imageData, colorsMap);
      }
    }
  };

  var computeByImageData = function (img, ignore) {
    var data;
    var colors = {};
    var color = '#ffffff';
    var colorCount = 0;
    var width = img.width;
    var height = img.height;
    var ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0);
    data = ctx.getImageData(0, 0, width, height).data;

    if (ignore.indexOf(SIDE_TOP) < 0) { // don't ignore top border
      traverse(SIDE_TOP, colors, width, height, data);
    }
    if (ignore.indexOf(SIDE_RIGHT) < 0) { // don't ignore right border
      traverse(SIDE_RIGHT, colors, width, height, data);
    }
    if (ignore.indexOf(SIDE_BOTTOM) < 0) { // don't ignore bottom border
      traverse(SIDE_BOTTOM, colors, width, height, data);
    }
    if (ignore.indexOf(SIDE_LEFT) < 0) { // don't ignore left border
      traverse(SIDE_LEFT, colors, width, height, data);
    }

    $.each(colors, function (k, v) {
      if (v > colorCount) {
        color = k;
        colorCount = v;
      }
    });

    return color;
  };

  var compute = function (url, ignore) {
    var img = new Image();
    var data = { url: url, ignore: ignore };

    img = img; // prevent from memory auto-collection

    img.onload = function () {
      try {
        data.color = computeByImageData(this, ignore);
        // do your things
      } catch (e) { // Error - the canvas has been tainted by cross-origin data.
        // other backup way
      }
      img = null;
    };
    img.onerror = function () { // Error - Cross-origin image load denied
      // other backup way
      img.onerror = null;
      img = null;
    };

    img.crossOrigin = ''; // '' is same as 'anonymous'
    img.src = url;
  };

  Imgcolr.color = function () {

  };

  Imgcolr.dominantColor = function () {};

  Imgcolr.noConflict = function () {
    root.Imgcolr = previousImgcolr;
    return Imgcolr;
  };

  root.Imgcolor = Imgcolr;

})(this, jQuery);