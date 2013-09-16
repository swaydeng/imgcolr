/*
module('default group', {
  setup:function () {},
  teardown:function () {}
});
 */

var $ = jQuery;
var root = $('#imgset-test');

Imgcolr.setSwf('http://view.1688.com/book/swfapp/imgcolr/imgcolr.swf');

test('globals set up', function() {
  ok(window.Imgcolr, 'global object Imgcolr is created');
});

test('jQuery plugin method set up', function() {
  ok(jQuery.fn.imgcolr, '$.fn.imgcolr is created');
});

// the img site does not allow to access

// retrived right color
asyncTest('retrive color', 1, function () {

  $('div.normal img', root).imgcolr().imgcolr(function () {
    var bgColor = this.parentNode.style.backgroundColor;
    strictEqual(bgColor, 'rgb(191, 191, 191)', 'parentNode\'s backgroundColor and img border color are the same');
    start();
  });

});