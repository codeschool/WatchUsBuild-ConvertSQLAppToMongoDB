// *************************************
//
//   Application
//   -> Global scripts
//
// *************************************

// -------------------------------------
//   Namespace
// -------------------------------------

// ----- JavaScript.com ----- //

var JS = {};

JS.Globals  = {},
JS.Classes  = {},
JS.Helpers  = {},
JS.Modules  = {},
JS.Pages    = {},
JS.Services = {},
JS.Inbox    = {};

// -------------------------------------
//   Globals
// -------------------------------------

JS.Globals = {
  homepageChallengeAnswer : /^('|")[^'"]+\1;?$/,
  userNameCookie          : 'try_name',
  Vendor                  : {
    autosizeQuery         : '.js-autosize'
  }
};

// -------------------------------------
//   Document Ready
// -------------------------------------

jQuery(function($) {

  // ----- Dispatcher ----- //

  new JS.Classes.Dispatcher({
    events: [
      { page  : 'course',    run : function() { JS.Pages.Course(); } },
      { page  : 'feedback',  run : function() { JS.Pages.Feedback(); } },
      { page  : 'home',      run : function() { JS.Pages.Home(); } },
      { match : 'news',      run : function() { JS.Pages.News(); } },
      { page  : 'news:new',  run : function() { JS.Pages.News.New(); } },
      { page  : 'news:show', run : function() { JS.Pages.News.Show(); } }
    ]
  });

  // ----- Global ----- //

  JS.injectSvg({ assetPath : '/images/icons/icons.svg' });

});

// -------------------------------------
//   Inbox
// -------------------------------------

// ...
