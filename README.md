imgcolr
=======

imgcolr is a jQuery plugin for grabbing the dominant color of a given image's borders. You can programmably adapt the elements' color on the webpage for the image after getting the color. Based on the idea, we can make the web more beautiful and interesting. Note that imgcolr can not handle images with colorful borders properly.

:point_right: [Check out the demo page](http://swaydeng.github.io/imgcolr/).

## How-To

imgcolr accesses image binary data by using flash, so make sure Adobe Flash Player is installed properly. (You can also use the [HTML5 version](#vhtml5))

#### Upload SWF file

First you should upload `media/imgcolr.swf` and hosts it on a server, suppose that your swf file url is `http://static.bar.com/dir/imgcolr.swf`, and all your images are hosted on the server with domain `http://img.foo.com`. 

#### crossdomain.xml

If your swf file and images are hosted on the same domain, skip this step, if not, keep following.
Make sure a `crossdomain.xml` file is in the root directory of the image server, like this: `http://img.foo.com/crossdomain.xml`, A crossdomain.xml file is an XML document that grants Adobe Flash Player(swf) permission to handle data across multiple domains  ([learn more](http://www.adobe.com/cn/devnet/articles/crossdomain_policy_file_spec.html)). In this scenario, we should grants the swf on `static.bar.com` permission to access image data, so your crossdomain.xml may be like this:

```xml
<?xml version="1.0"?>
<cross-domain-policy>
  <allow-access-from domain="static.bar.com" />
</cross-domain-policy>
```

#### JavaScript

imgcolr is a jQuery plugin, so make sure jQuery is included in your web page before including imgcolr code:

```html
<script src="jsdir/jquery.min.js"></script>
<script src="jsdir/imgcolr.min.js"></script>
```

imgcolr handles `<img>` tag, or `HTMLImageElement`, consider a page with a simple list on it:

```html
<ul>
  <li class="item">
    <div class="box">
      <img src="http://img.foo.com/xdir/foo.jpg" />
    </div>
    <div class="label">Hello, World!</div>
  </li>
  <li class="item">
    <div class="box">
      <img src="http://img.foo.com/xdir/bar.jpg" />
    </div>
    <div class="label">Hello, Human!</div>
  </li>
</ul>
```

Now i will explain the method in action:

After including **imgcolr.min.js**, a global object `Imgcolr` will be created. Before 
you use the plugin, you need specify the swf file's url:

```javascript
Imgcolr.setSwf('http://static.bar.com/dir/imgcolr.swf');
```

then feel free to use:

```javascript
var imgs = $('img');

// get the image borders' color 
// and the style property background-color of each parent will be set to this color,
// The result of this call is a background-color change for all div element with class "box". 
imgs.imgcolr();

// get the image borders' color 
// and the style property background-color of the ancestors with class "item" will 
// be set to this color.
imgs.imgcolr('.item');

// get the image borders' color 
// you can specify which elements' background-color to set by returning them
imgs.imgcolr(function () {
  // `this` refers to the current img element
  return $(this).parent().next('.label');
});

// if you don't want any element's background-color change,
// or maybe you just want to know the image borders' color,
// return nothing is fine.
imgs.imgcolr(function (img, color) {
  // `img` refers to the current img element
  console.log(img);
  // `color` is the grabbed color, a string like "#ededed"
  console.log(color);
});

// Suppose that you just adapt background color only for a given image's left and 
// right borders, you can ignore the others, here is the rule:
// "t" represents top border 
// "r" represents right border
// "b" represents bottom border
// "l" represents left border
imgs.imgcolr({
  ignore: 'tb'  // ignores top border and bottom border
});

// Of course you can use the filter and ignore option at the same time
imgs.imgcolr('.item', {
  ignore: 'tb'
});
```

#### AMD module support

imgcolr supports AMD, the arguments are identical except that the first one is the element(s) to handle:

```javascript
define(['jquery', 'imgcolr'], function ( $, Imgcolr ) {

    Imgcolr.setSwf('http://static.bar.com/dir/imgcolr.swf');

    var imgs = $('img');

    // identical to `imgs.imgcolr();`
    Imgcolr.imgcolr(imgs);

    // identical to `imgs.imgcolr('.item');`
    Imgcolr.imgcolr(imgs, '.item');

   //  identical to `imgs.imgcolr('.item', { ignore: 'tb' });`
   Imgcolr.imgcolr(imgs, '.item', { ignore: 'tb' });

});
```

## Build your own imgcolr

Make sure `node` and node package `grunt-cli` are installed globally on your computer, and cd into the project directory, install necessary packages by running `npm install`.

You should not modify **imgcolr.js** in root directory, for modular reason, please modify files in `src/`, and then run `grunt build` , the latest **imgcolr.js** and **imgcolr.min.js** will be created in `dist/`.

## <a name='vhtml5'>HTML5 version</a>

I am a big fan of HTML5, however HTML5 image [CORS](https://developer.mozilla.org/en/docs/HTTP/Access_control_CORS) specification is supported terribly by browser vendors. So imgcolr based on HTML5 just supports latest modern browsers like Google Chrome and Firefox , and it is experimental. Anyway, it's really faster than the Flash version.
First of all , make sure jQuery and `imgcolr.html5.min.js` are included in your web page:

```html
<script src="jsdir/jquery.min.js"></script>
<script src="jsdir/imgcolr.html5.min.js"></script>
```

If your web page and images on the page are hosted on the same domain, skip this step, if not, you should enable image  CORS by adding the appropriate Access-Control-Allow-Origin header info ([more details](https://developer.mozilla.org/en-US/docs/HTML/CORS_Enabled_Image) you must read).

There is no different on calling method, and `Imgcolr.setSwf` is unnecessary:

```javascript

var imgs = $('img');

imgs.imgcolr();

```

:point_right: [Check out the demo page](http://swaydeng.github.io/imgcolr/h5.html).