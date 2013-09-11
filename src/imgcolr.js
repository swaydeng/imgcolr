/*!
 * @Author      Sway Deng
 * @Description Retrieve the dominant border color of an image.
 */
(function ($, undefined) {

/****** some constants  ******/
  // event name
  var EVT_SWFREADY = 'swfReady';
  var EVT_SUCCESS  = 'success';
  var EVT_ERROR    = 'error';
  // swf dfd keyname
  var DFD_SWF      = 'dfd-swf';

  // swf object
  var swfObj;
  // modify this according to your scenario
  var swfUrl = 'http://view.1688.com/book/swfapp/imgcolr/imgcolr.swf';
  // shortcut for Imgcolr
  var Imgcolr = {};
  // all deferred objects cache
  var dfdCache = {};
  // get or cache Deferred objects
  var getDfd = function (key) {
    var dfd = dfdCache[key];
    if (!dfd) {
      dfd = $.Deferred();
      dfdCache[key] = dfd;
    }
    return dfd;
  };

  // swf method
  function compute (url, ignore) {
    getDfd(DFD_SWF).done(function (swfObj) {
      swfObj.getColor(url, ignore);
    });

    // load swf file when needed, only execute once
    if (swfObj) {
      return;
    }

    var swfNode = $('<div id="imgcolr-swf-container">').appendTo('body').css({
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '1px',
      height: '1px'
    });
    swfObj = Imgcolr.appendFlash(swfNode, {
      width: 1,
      height: 1,
      wmode: 'transparent',
      swf: swfUrl,
      allowScriptAccess: 'always',
      flashvars: {
        allowedDomain: location.hostname
      }
    });
  }

  // @private - very important, this method is called from swf internally
  Imgcolr.trigger = function (evtObj) {
    switch (evtObj.type) {
      case EVT_SWFREADY:
        getDfd(DFD_SWF).resolve(swfObj);
        break;
      case EVT_SUCCESS:
        getDfd(evtObj.data.url).resolve(evtObj.data);
        break;
      case EVT_ERROR:
        getDfd(evtObj.data.url).reject(evtObj.data);
        break;
    }
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

  Imgcolr.appendFlash = (function () {
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

    // append a flash object
    function appendFlash (elem, options) {
      var attrs;

      if (!options.swf || !flashAvailable) {
        return false;
      }

      elem = $(elem);
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
    }

    return appendFlash;
  })();

  // The top-level namespace
  window.Imgcolr = Imgcolr;

})(jQuery);

// jQuery Plugin - for example: $(elem).imgcolr()
(function ($, undefined) {

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
      var matches = typeof selector === 'function' ? selector.call(element, element) :
            typeof selector === 'string' ? elem.parents(selector) : elem.parent();

      matches.css('backgroundColor', data.color);
    };

    Imgcolr.color(options);
  }

  // @param selector {Selector | Function}[optional]
  // @param {string}   options.ignore - Which border should be ignored,
  //    there are 4 kinds of values: 't', 'r', 'b', 'l', you can ignore multiple borders like this: 'tb', it's optional
  $.fn[pluginName] = function (selector, options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, selector, options));
      }
    });
  };

})(jQuery);