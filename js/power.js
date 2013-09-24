(function ($) {

var root = $('div.carousel-box');
var boxes = $('div.box', root);
var total = boxes.length;
var curIdx = 0;
var html = [];
var cls = 'current';
var triggers;

boxes.each(function (i) {
  html.push('<li data-index="' + i + '" class="' + (i===0 ? cls : '') + '"></li>');
});

$('ul', root).append(html.join(''));
triggers = $('ul li', root);

function show (idx) {
  var targetBox = boxes.eq(idx);
  var borderColor = $('img', targetBox).data('borderColor');
  var targetTrigger = triggers.eq(idx);

  boxes.eq(curIdx).removeClass(cls);
  triggers.eq(curIdx).removeClass(cls);

  targetBox.addClass(cls);
  targetTrigger.addClass(cls);

  if (typeof borderColor === 'string') {
    $(document.documentElement).css('backgroundColor', borderColor);
  }

  curIdx = idx;
}

window.setInterval(function () {
  var idx = curIdx + 1;

  if (idx === total) {
    idx = 0;
  }

  show(idx);
}, 6000);

root.on('click', 'ul li', function () {
  var elem = $(this);
  var idx = elem.data('index');
  if (elem.hasClass(cls)) {
    return;
  }
  show(idx);
});

// imgcolr
$('div.intro button').one('click', function () {
  // specify the swffile url
  Imgcolr.setSwf('https://raw.github.com/swaydeng/imgcolr/master/media/imgcolr.swf');
  $('img', boxes).imgcolr(function (img, color) {
    $(img).data('borderColor', color);
  });
});

})(jQuery);