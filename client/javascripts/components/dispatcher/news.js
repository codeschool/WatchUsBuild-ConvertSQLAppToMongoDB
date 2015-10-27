// *************************************
//
//   News
//   -> Dispatch events
//
// *************************************

JS.Pages.News = function() {

  // -------------------------------------
  //   Classes
  // -------------------------------------

  new JS.Classes.FormValidator();

  // -------------------------------------
  //   Modules
  // -------------------------------------

  JS.Modules.LoadStories.init();
  JS.Modules.SaveProgress.init();

  // -------------------------------------
  //   Services
  // -------------------------------------

  JS.Services.expel({
    $toggle     : $('.js-alert-close'),
    elementNode : '.js-alert'
  });

  // -------------------------------------
  //   Vendor
  // -------------------------------------

  autosize($(JS.Globals.Vendor.autosizeQuery));

};
