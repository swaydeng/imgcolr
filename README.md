imgcolr
=======

imgcolr is a jQuery plugin for grabbing the dominant color of a given image's borders. You can programmably adapt the elements' color on the webpages for the image after getting the color. Based on the idea, we can make the web more beautiful and interesting. Note that imgcolr can not handle images with colorful borders properly.

:point_right: [Check out the demo page](http://swaydeng.github.io/imgcolr/).

## How-To

imgcolr accesses image binary data by using flash, so make sure Adobe Flash Player is installed properly. (Damn flash, why not use HTML5? Because HML5 image CORS is supported terribly by browser vendors.)

#### Upload SWF file

First you should upload `media/imgcolr.swf` and hosts it on a server, suppose that your swf file url is `http://static.bar.com/dir/imgcolr.swf`, and all your images are hosted on the server with domain `http://img.foo.com`. 

#### crossdomain.xml

If your swf file and images are hosted on the same domain, skip this step, if not, keep following.
Make sure a `crossdomain.xml` file is in the root directory of the images server, like this: `http://img.foo.com/crossdomain.xml`, A crossdomain.xml file is an XML document that grants Adobe Flash Player(swf) permission to handle data across multiple domains  ([learn more](http://www.adobe.com/cn/devnet/articles/crossdomain_policy_file_spec.html)). In this scenario, we should grants the swf on `static.bar` permission to access image data, so your crossdomain.xml may be like this:

```xml
<?xml version="1.0"?>
<cross-domain-policy>
  <allow-access-from domain="static.bar.com" />
</cross-domain-policy>
```

#### JavaScript

imgcolr is a jQuery plugin, so make sure jQuery is supported on your web page before adding imgcolr code:

```html
<script src="jsdir/jquery.min.js"></script>
<script src="jsdir/imgcolr.min.js"></script>
```

imgcolr handle `<img>` tag, or `HTMLImageElement`, consider a page with a simple list on it:

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

```javascript
var imgs = $('img');

// get the image borders' color 
// and the style property background-color of each parent will be set to this color,
// The result of this call is a red background for all div element with class "box". 
imgs.imgcolr();

// get the image borders' color 
// and the style property background-color of the ancestors with class "item" will be set to this color.
imgs.imgcolr('.item');

// get the image borders' color 
// you can specify which elements' background-color to set by returning them
imgs.imgcolr(function () {
  // `this` refers to the current img element
  return $(this).parent().next('.label');
});

// if you don't want any element's background-color change.
// or maybe you just want to know the image borders' color.
// return nothing is just fine.
imgs.imgcolr(function (img, color) {
  // `img` refers to the current img element
  console.log(img);
  // `color` is the grabbed color, a string like "#ededed"
  console.log(color);
});

// todo filter
```
