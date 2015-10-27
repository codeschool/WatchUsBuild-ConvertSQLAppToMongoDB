// *************************************
//
//   Course
//   -> Dispatch events
//
// *************************************

JS.Pages.Course = function() {

  // -------------------------------------
  //   Modules
  // -------------------------------------

  JS.Modules.Toggle.init({
    $element    : $('.js-courseLayout-toggle'),
    proximity   : $('.js-courseLayout'),
    toggleClass : 'is-active'
  });

  // -------------------------------------
  //   Local
  // -------------------------------------

  // ----- Preloading ----- //

  $('.js-courseLayout').addClass('is-loaded');
  $('.js-preload').addClass('is-hidden');

};
