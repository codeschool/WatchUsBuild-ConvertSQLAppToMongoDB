// *************************************
//
//   Toggle
//   -> Toggle state on given elements
//
// *************************************
//
// @param $element     { jQuery object }
// @param proximity    { string }
// @param event        { string }
// @param toggleClass  { string }
// @param activeClass  { string }
// @param initialState { function }
// @param onClick      { function }
// @param onMouseover  { function }
// @param onMouseout   { function }
//
// *************************************

JS.Modules.Toggle = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings = {};

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function(options) {
    _settings = $.extend({
      $element     : $('.js-toggle'),
      proximity    : 'next',
      event        : 'click',
      toggleClass  : 'is-hidden',
      activeClass  : 'is-active',
      initialState : null,
      onClick      : null,
      onMouseover  : null,
      onMouseout   : null
    }, options);

    _setEventHandlers();
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {
    switch (_settings.event) {
      case 'click':
        _handleClickEvent();
        return;
      case 'hover':
        _handleHoverEvent();
    }
  };

  // -------------------------------------
  //   Handle Click Event
  // -------------------------------------

  var _handleClickEvent = function() {
    _settings.$element.on('click', function(event) {
      event.preventDefault();
      var $element = $(this);

      if (_settings.onClick != null) {
        _settings.onClick(_settings);
      }

      _settings.$element.toggleClass(_settings.activeClass);

      switch (_settings.proximity) {
        case 'next':
          return $element.next().toggleClass(_settings.toggleClass);
        case 'prev':
          return $element.prev().toggleClass(_settings.toggleClass);
        case 'nextParent':
          return $element.parent().next().toggleClass(_settings.toggleClass);
        case 'prevParent':
          return $element.parent().prev().toggleClass(_settings.toggleClass);
        default:
          if (typeof _settings.proximity === 'object') {
            return _settings.proximity.toggleClass(_settings.toggleClass);
          } else {
            return $element.find(_settings.proximity).toggleClass(_settings.toggleClass);
          }
      }
    });
  };

  // -------------------------------------
  //   Handle Hover Event
  // -------------------------------------

  var _handleHoverEvent = function() {
    if (_settings.initialState) {
      _settings.initialState(_settings);
    }

    _settings.$element.on({
      mouseenter: function() {
        _handleHoverStateEvent($(this), 'on');
      },
      mouseleave: function() {
        _handleHoverStateEvent($(this), 'off');
      }
    });
  };

  // -------------------------------------
  //   Handle Hover State Event
  // -------------------------------------
  //
  // @param $element { object }
  // @param state    { string }
  //
  // -------------------------------------

  var _handleHoverStateEvent = function($element, state) {
    switch (state) {
      case 'on':
        if (_settings.onMouseover != null) {
          _settings.onMouseover(_settings);
        }
        $element.addClass(_settings.activeClass);
        break;
      case 'off':
        if (_settings.onMouseout != null) {
          _settings.onMouseout(_settings);
        }
        $element.removeClass(_settings.activeClass);
    }

    switch (_settings.proximity) {
      case 'next':
        _toggleClass($element.next());
      case 'prev':
        _toggleClass($element.prev());
      case 'nextParent':
        _toggleClass($element.parent().next());
      case 'prevParent':
        _toggleClass($element.parent().prev());
      default:
        if (typeof _settings.proximity === 'object') {
          _toggleClass(_settings.proximity);
        } else {
          _toggleClass($element.find(_settings.proximity));
        }
    }
  };

  // -------------------------------------
  //   Toggle Cass
  // -------------------------------------
  //
  // @param $element      { object }
  // @param classToToggle { string }
  //
  // -------------------------------------

  var _toggleClass = function($element, classToToggle) {
    if (classToToggle == null) {
      classToToggle = _settings.toggleClass;
    }

    if ($element.hasClass(classToToggle)) {
      $element.removeClass(classToToggle);
    } else {
      $element.addClass(classToToggle);
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
// JS.Modules.Toggle.init();
//
