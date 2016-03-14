#jquery.navbar.js

## What is it
I think this project is a so pretty jQuery navigation bar plugin, and it supports bootstrap. Lightweight, only 12k compressed. You can refer the demo to use it.  
  
Requires [Easing Plugin](http://gsgd.co.uk/sandbox/jquery/easing/) for Menu Animations.  
  
![screenshot](https://github.com/zhaodabao/jquery.navbar.js/raw/master/demo/images/screenshot.png "jquery.navbar.js")

## Usage
register navigation bar from javascript:  

HTML:
```html  
<div id="nav"></div>
```
JavaScript:
```javascript  
$("#nav").css("position", "static").navbar({
    skin: "bootstrap",
    // define the elements of the navbar
    menu: [{
        id: "1",
        text: "Foo",
        icon: "images/foo.png",
        action: clickMenu
    }, {
        id: "2",
        text: "Bar",
        icon: "images/bar.png",
        children: [{
            id: "2.1",
            text: "Child",
            icon: "images/child.png",
            action: clickMenu
    }]
    // there's more, have a look at the demos and options
});
```  
have a look at demos:  
[Bootstrap Style Demo](http://htmlpreview.github.io/?https://github.com/zhaodabao/jquery.navbar.js/master/demo/demo.html)  
[Lightblue Style Demo](http://htmlpreview.github.io/?https://github.com/zhaodabao/jquery.navbar.js/master/demo/demo2.html)

## Compatibility
IE 9+, Chrome

## License
jquery.navbar.js is published under the MIT license.
