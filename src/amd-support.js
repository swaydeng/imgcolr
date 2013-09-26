define(['jQuery', 'Imgcolr'], function ($, Imgcolr) {

  // AMD module support
  Imgcolr.imgcolr = function (elem, selector, options) {
    $(elem).imgcolr(selector, options);
  };

  if (typeof define === 'function' && define.amd) {
    define('imgcolr', [], function () { return Imgcolr; });
  }

});