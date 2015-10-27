// *************************************
//
//   Expel
//   -> Pest control
//
// *************************************
//
// @param $toggle     { jQuery object }
// @param elementNode { string }
//
// *************************************

JS.Services.expel = function(options) {
  var settings = $.extend({
    $toggle     : $('.js-expel-toggle'),
    elementNode : '.js-expel',
    expelClass  : 'is-dismissed'
  }, options);

  settings.$toggle.on('click', function(event) {
    event.preventDefault();

    var element = $(this);

    element
      .closest(settings.elementNode)
      .addClass(settings.expelClass);

    setTimeout(function() {
      element
        .closest(settings.elementNode)
        .remove();
    }, 500);
  });
};

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.Services.expel();
//
