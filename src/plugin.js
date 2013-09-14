define(['jQuery', 'Imgcolr'], function ($, Imgcolr) {

  // jQuery Plugin - for example: $(elem).imgcolr()
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

});