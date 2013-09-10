(function ($) {

  $(function () {
    $('#btn').click(function () {
      $('img').each(function () {
        var elem = this;
        Imgcolr.color({
          url: elem.src,
          success: function (data) {
            $(elem).parent().css('backgroundColor', data.color);
          },
          error: function () {
            console.log('error: ' + elem.src);
          }
        });
      });
    });
  });

// TODO demo
//$('div.n img').imgcolr();
//$('div.n img').imgcolr('.box');
  /*
   $('div.c img').imgcolr(function () {
   return $(this).prev('.text');
   });
   */
//$('div.n img').imgcolr({ ignore: 'tr' });
// data-imgcolr-ignore

})(jQuery);