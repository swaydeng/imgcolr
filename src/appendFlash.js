define(['jQuery'], function ($) {

  var appendFlash = (function () {
    var version, versionNumbers, flashAvailable;
    // Prototype style
    // https://github.com/sstephenson/prototype/blob/1fb9728/src/prototype.js#L81
    var isIE = !!window.attachEvent && Object.prototype.toString.call(window.opera) !== '[object Opera]';

    var Plugin = navigator.plugins['Shockwave Flash'] || window.ActiveXObject;

    try {
      if (Plugin.description) {
        version = Plugin.description;
      } else {
        version = (new Plugin('ShockwaveFlash.ShockwaveFlash')).GetVariable('$version');
      }
    } catch (e) {
      version = 'Unavailable';
    }
    versionNumbers = version.match(/\d+/g);
    flashAvailable = !!versionNumbers && versionNumbers[0] > 0;

    function buildQueryString (obj) {
      if (!$.isPlainObject(obj)) {
        return obj;
      }

      var k, v;
      var arr = [];
      var str = '';

      for (k in obj) {
        v = obj[k];
        if ($.isPlainObject(v)) {
          str = buildQueryString(v);
        } else {
          str = [k, encodeURI(v)].join('=');
        }
        arr.push(str);
      }

      return arr.join('&');
    }

    // build attributes based on an object
    function buildAttr (obj) {
      var k, v;
      var arr = [];

      for (k in obj) {
        v = obj[k];
        if (v) {
          arr.push([k, '="', v, '"'].join(''));
        }
      }

      return arr.join(' ');
    }

    function buildParamTag (obj) {
      var arr = [];

      for (var k in obj) {
        arr.push(['<param name="', k, '" value="', buildQueryString(obj[k]), '" />'].join(''));
      }

      return arr.join('');
    }

    // return the real method to append a flash object
    return function (elem, options) {
      var attrs;

      if (!options.swf || !flashAvailable) {
        return false;
      }

      attrs = {
        id: 'swf-' + ($.guid++),
        width: options.width || 1,
        height: options.height || 1,
        style: options.style || ''
      };

      if (isIE) {
        attrs.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
        options.movie = options.swf;
      } else {
        attrs.data = options.swf;
        attrs.type = 'application/x-shockwave-flash';
      }

      options.wmode = options.wmode || 'opaque';

      var html = ['<object ', buildAttr(attrs), '>', buildParamTag(options), '</object>'].join('');
      if (isIE) {
        var flashContainer = document.createElement('div');
        elem.html(flashContainer);
        flashContainer.outerHTML = html;
      } else {
        elem.html(html);
      }

      return elem.children().get(0);
    };
  })();

});