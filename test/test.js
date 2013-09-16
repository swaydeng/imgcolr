(function ($) {
  Imgcolr.setSwf('http://view.1688.com/book/swfapp/imgcolr/imgcolr.swf');
  $(function () {
    $('#btn').click(function () {

      $('div.normal img').imgcolr();

      $('div.multiple img').imgcolr('.inner-box');

      $('div.isolate img').imgcolr(function (elem, color) {
        console.log(this, elem, color);
        console.log(this === elem);
      }).imgcolr(function () {
        return $(this).prev('.text');
      });

      $('div.ignore img').imgcolr({ ignore: 'lrb' });

      // data-imgcolr-ignore

    });
  });

})(jQuery);