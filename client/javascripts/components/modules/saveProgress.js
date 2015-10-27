// *************************************
//
//   Save Progress
//   -> Save input text in Local Storage
//
// *************************************
//
// @param $element      { jQuery object }
// @param $container    { jQuery object }
// @param dataAttribute { string }
//
// *************************************

JS.Modules.SaveProgress = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings = {};

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function(options) {
    _settings = $.extend({
      $element      : $('.js-saveProgress'),
      $container    : $('.js-saveProgress-container'),
      dataAttribute : 'saveprogress'
    }, options);

    _restoreProgress();
    _setEventHandlers();
  };

  // -------------------------------------
  //   Erase Progress
  // -------------------------------------

  var _eraseProgress = function(container) {
    container.find(_settings.$element).each(function() {
      var key = $(this).data(_settings.dataAttribute);

      localStorage.removeItem(key);
    });
  };

  // -------------------------------------
  //   Restore Progress
  // -------------------------------------

  var _restoreProgress = function() {
    _settings.$element.each(function() {
      var $element = $(this),
          key      = $element.data(_settings.dataAttribute),
          value    = localStorage.getItem(key);

      if (value !== null) {
        $element.val(value);
      }
    });
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {
    _settings.$element.on('input', function() {
      var $element, key, value;
      var $element = $(this),
          key      = $element.data(_settings.dataAttribute),
          value    = $element.val();

      _storeProgress(key, value);
    });

    _settings.$container.on('submit', function(event) {
      _eraseProgress($(this));
    });
  };

  // -------------------------------------
  //   Store Progress
  // -------------------------------------

  var _storeProgress = function(key, value) {
    localStorage.setItem(key, value);
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
// JS.Modules.SaveProgress.init()
//
