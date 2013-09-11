(function ($) {

  $(function () {
    $('#btn').click(function () {

      $('div.normal img').imgcolr();

      $('div.multiple img').imgcolr('.inner-box');

      $('div.isolate img').imgcolr(function () {
        return $(this).prev('.text');
      });

      $('div.ignore img').imgcolr({ ignore: 'lrb' });

      // data-imgcolr-ignore

    });
  });

})(jQuery);