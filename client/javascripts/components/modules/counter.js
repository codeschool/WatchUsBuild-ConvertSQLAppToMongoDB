// *************************************
//
//   Counter
//   -> Form input character counter
//
// *************************************

JS.Modules.Counter = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings = {};
  var _count    = 0;

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function(options) {
    _settings = $.extend({
      $element        : $('.js-counter'),
      $label          : $('.js-counter-label'),
      $number         : $('.js-counter-number'),
      errorClass      : 'is-error',
      successClass    : 'is-success',
      minChars        : 100,
      maxChars        : 300,
      onMinPreceeded  : null,
      onMaxExceeded   : null,
      onConditionsMet : null
    }, options);

    _setEventHandlers();
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {

    _settings.$element.on('keyup', function(event) {
      event.preventDefault();

      var $element = $(this);
      var _count   = $element.val().length;

      _settings.$number.text(_count);

      if (_count > _settings.maxChars) {
        _toggleState($element, 'error');
        if (_settings.onMaxExceeded != null) {
          _settings.onMaxExceeded(_settings);
        }
      } else if (_count < _settings.minChars) {
        _toggleState($element, 'error');
        if (_settings.onMinPreceeded != null) {
          _settings.onMinPreceeded(_settings);
        }
      } else {
        _toggleState($element, 'success');
        if (_settings.onConditionsMet != null) {
          _settings.onConditionsMet(_settings);
        }
      }
    });

  };

  // -------------------------------------
  //   Public Methods
  // -------------------------------------
  //
  // @param element { jQuery object }
  // @param state   { string }
  //
  // -------------------------------------

  var _toggleState = function(element, state) {
    switch (state) {
      case 'error':
        element.removeClass(_settings.successClass);
        _settings.$label.removeClass(_settings.successClass);
        element.addClass(_settings.errorClass);
        _settings.$label.addClass(_settings.errorClass);
        break;
      case 'success':
        element.removeClass(_settings.errorClass);
        _settings.$label.removeClass(_settings.errorClass);
        element.addClass(_settings.successClass);
        _settings.$label.addClass(_settings.successClass);
        break;
    }
  };

  // -------------------------------------
  //   Public Methods
  // -------------------------------------

  return {
    init: init
  };

})();

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.Modules.Counter.init()
//
