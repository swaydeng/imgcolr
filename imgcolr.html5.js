(function (root, $) {

  var previousImgcolr = root.Imgcolr;

  var Imgcolr = {};
  // all deferred objects cache
  var dfdCache = {};
  var canvas = document.createElement('canvas');
  // TODO find a better way to determine image cors support precisely.
  //var imgCors = !!(canvas.getContext && canvas.getContext('2d')) && $.support.cors && ('crossOrigin' in new Image());

  var SIDE_TOP    = 't';
  var SIDE_RIGHT  = 'r';
  var SIDE_BOTTOM = 'b';
  var SIDE_LEFT   = 'l';

  // get or cache Deferred objects
  var getDfd = function (key) {
    var dfd = dfdCache[key];
    if (!dfd) {
      dfd = $.Deferred();
      dfdCache[key] = dfd;
    }
    return dfd;
  };

  var decToHex = function (num) {
    var hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  var rgbToHex = function (r, g, b) {
    return ['#', decToHex(r), decToHex(g), decToHex(b)].join('');
  };

  var count = function (idx, imageData, colorsInfo) {
    var name;
    var alpha = imageData[idx + 3];

    // if true, means alpha value is less than 127, ignore this point
    if (alpha < 127) {
      return;
    }

    name = rgbToHex(imageData[idx], imageData[idx + 1], imageData[idx + 2]);
    if (colorsInfo[name]) {
      colorsInfo[name] ++;
    } else {
      colorsInfo[name] = 1;
    }
  };

  var traverse = function (side, colorsInfo, width, height, imageData) {
    var x, y;
    if (side === SIDE_TOP || side === SIDE_BOTTOM) {
      y = (side === SIDE_TOP) ? 0 : (height - 1);
      for (x = 0; x < width; x ++) {
        count((y * width + x) * 4, imageData, colorsInfo);
      }
    } else { // side is right or left
      height = height - 1;
      x = (side === SIDE_RIGHT) ? (width - 1) : 0;
      for (y = 1; y < height; y ++) {
        count((y * width + x) * 4, imageData, colorsInfo);
      }
    }
  };

  var computeByImage = function (img, ignore) {
    var data, k, v;
    var color = '#ffffff';
    var colorAmount = 0;
    var colorsInfo = {};
    var width = img.width;
    var height = img.height;
    var ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0);
    data = ctx.getImageData(0, 0, width, height).data;

    if (ignore.indexOf(SIDE_TOP) < 0) { // don't ignore top border
      traverse(SIDE_TOP, colorsInfo, width, height, data);
    }
    if (ignore.indexOf(SIDE_RIGHT) < 0) { // don't ignore right border
      traverse(SIDE_RIGHT, colorsInfo, width, height, data);
    }
    if (ignore.indexOf(SIDE_BOTTOM) < 0) { // don't ignore bottom border
      traverse(SIDE_BOTTOM, colorsInfo, width, height, data);
    }
    if (ignore.indexOf(SIDE_LEFT) < 0) { // don't ignore left border
      traverse(SIDE_LEFT, colorsInfo, width, height, data);
    }

    for (k in colorsInfo) {
      v = colorsInfo[k];
      if (v > colorAmount) {
        color = k;
        colorAmount = v;
      }
    }

    return color;
  };

  var compute = function (url, ignore) {
    var img = new Image();
    var data = { url: url, ignore: ignore };

    img.onload = function () {
      try {
        data.color = computeByImage(this, ignore);
        getDfd(url).resolve(data);
      } catch (e) { // Error - the canvas has been tainted by cross-origin data.
        getDfd(url).reject(data);
      }
      img = null;
    };
    img.onerror = function () { // Error - Cross-origin image load denied
      img.onerror = null;
      img = null;
      getDfd(url).reject(data);
    };

    img.crossOrigin = ''; // '' is same as 'anonymous'
    img.src = url;
  };

  // Imgcolr.color
  // ---------------- core method ---------------
  // @param {string}   options.url - The url of the image
  // @param {string}   options.ignore - Which border should be ignored,
  //    there are 4 kinds of values: 't', 'r', 'b', 'l', you can ignore multiple borders like this: 'tb', it's optional
  // @param {function} options.success - The callback for success
  // @param {function} options.error - The callback for error, it's optional
  Imgcolr.color = function (options) {
    var dfd = getDfd(options.url);

    if (typeof options.success === 'function') {
      dfd.done(options.success);
    }

    if (typeof options.error === 'function') {
      dfd.fail(options.error);
    }

    if ('pending' === dfd.state()) {
      compute(options.url, typeof options.ignore === 'string' ? options.ignore : '');
    }
  };

  Imgcolr.noConflict = function () {
    root.Imgcolr = previousImgcolr;
    return Imgcolr;
  };

  root.Imgcolr = Imgcolr;

  // jQuery Plugin extend - for example: $(elem).imgcolr()
  var pluginName = 'imgcolr';

  function Plugin (element, selector, options) {
    var elem = $(element);
    var ignore = elem.data('imgcolrIgnore');
    var defOpt = {
      url: element.src
    };

    if (typeof selector === 'object') {
      options = selector;
      selector = undefined;
    }

    options = $.extend(defOpt, options);
    // if data-imgcolr-ignore is specified on the img node, then rewrite the options
    if (typeof ignore === 'string') {
      options.ignore = ignore;
    }

    options.success = function (data) {
      var matches = typeof selector === 'function' ? selector.call(element, element, data.color) :
          typeof selector === 'string' ? elem.parents(selector) : elem.parent();
      // for `selector.call(element, element, data.color)` may not return a jQuery object
      if (matches && matches.jquery) {
        matches.css('backgroundColor', data.color);
      }
    };

    Imgcolr.color(options);
  }

  // @param selector {Selector | Function}[optional]
  // @param {string}   options.ignore - Which border should be ignored,
  //    there are 4 kinds of values: 't', 'r', 'b', 'l', you can ignore multiple borders like this: 'tb', it's optional
  $.fn[pluginName] = function (selector, options) {
    return this.each(function () {
      new Plugin(this, selector, options);
    });
  };

})(this, jQuery);