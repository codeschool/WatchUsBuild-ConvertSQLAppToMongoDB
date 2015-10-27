// *************************************
//
//   Inject SVG
//   -> Asynchronously append an SVG
//
// *************************************
//
// @param assetPath { string }
//
// *************************************

JS.injectSvg = function (options) {
  var settings = $.extend({
    assetPath : null
  }, options);

  $.get(settings.assetPath, function (data) {
    var $element = $(new XMLSerializer().serializeToString(data.documentElement));

    $element.css({ display : 'none' }).appendTo('body');
  });
}

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.injectSvg({ assetPath : '/path/to/file.svg' });
//
