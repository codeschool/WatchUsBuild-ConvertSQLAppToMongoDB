// *************************************
//
//   Home
//   -> Dispatch events
//
// *************************************

JS.Pages.Home = function() {

  // -------------------------------------
  //   Modules
  // -------------------------------------

  JS.Modules.Console.init();
  JS.Modules.Video.init({ vendor: true, ytVideo: true });

  // -------------------------------------
  //   Services
  // -------------------------------------

  JS.Services.expel({
    $toggle     : $('.js-alert-close'),
    elementNode : '.js-alert'
  });

  // -------------------------------------
  //   Local
  // -------------------------------------

  $('.js-inlineConsole-btn').on('click', function(event) {
    var name = $('.js-inlineConsole-input').val().replace(/['";]/g, '');

    document.cookie = JS.Globals.userNameCookie + '=' + name;
  });

};
