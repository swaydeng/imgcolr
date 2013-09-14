define(['jQuery', 'appendFlash', 'Imgcolr'], function ($, appendFlash, Imgcolr) {

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
  var compute = function (url, ignore) {
    var style = 'position:absolute; left:0; top:0; width:1px; height:1px;';
    var swfNode = $('<div style="' + style + '">').appendTo('body');

    swfObj = appendFlash(swfNode, {
      width: 1,
      height: 1,
      wmode: 'transparent',
      swf: swfUrl,
      allowScriptAccess: 'always',
      flashvars: {
        allowedDomain: window.location.hostname
      }
    });

    compute = function (url, ignore) {
      getDfd(DFD_SWF).done(function (obj) {
        obj.getColor(url, ignore);
      });
    };

    compute(url, ignore);
  };

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

});