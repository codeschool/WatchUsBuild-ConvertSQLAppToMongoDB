// *************************************
//
//   News New
//   -> Dispatch events
//
// *************************************

JS.Pages.News.New = function() {

  // -------------------------------------
  //   Modules
  // -------------------------------------

  JS.Modules.Counter.init({
    onMaxExceeded: function(settings) {
      $('.js-counter-message-max').removeClass('is-hidden');
      $('.js-counter-message-min').addClass('is-hidden');
    },
    onConditionsMet: function(settings){
      $('.js-counter-message-min').addClass('is-hidden');
      $('.js-counter-message-max').addClass('is-hidden');
    }
  });

};
