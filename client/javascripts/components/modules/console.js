// *************************************
//
//   Console
//   -> Homepage faux challenge
//
// *************************************

JS.Modules.Console = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings = {};

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function(options) {
    _settings = $.extend({
      $element       : $('.js-inlineConsole'),
      $input         : $('.js-inlineConsole-input'),
      correctClass   : 'is-correct',
      incorrectClass : 'is-incorrect'
    }, options);

    _settings.$input.focus();

    _setEventHandlers();
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {

    _settings.$element.on('submit', function(event) {
      event.preventDefault();

      var $element = $(this);
      var value = _settings.$input.val();

      if (value.match(JS.Globals.homepageChallengeAnswer)) {
        $element.removeClass(_settings.incorrectClass);
        $element.addClass(_settings.correctClass);
      } else {
        $element.removeClass(_settings.correctClass);
        $element.addClass(_settings.incorrectClass);
        setTimeout(function() {
          $element.removeClass(_settings.incorrectClass);
        }, 500);
      }
    });

  };

  // -------------------------------------
  //   Public Methods
  // -------------------------------------

  return {
    init : init
  };

})();

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.Modules.Console.init()
//
