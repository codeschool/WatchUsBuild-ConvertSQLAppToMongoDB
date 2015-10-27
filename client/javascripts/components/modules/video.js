// *************************************
//
//   Video
//   -> Homepage video modal
//
// *************************************
//
// @param $element    { jQuery object }
// @param $trigger    { jQuery object }
// @param $video      { jQuery object }
// @param $close      { jQuery object }
// @param $overlay    { jQuery object }
// @param overlayNode { string (selector) }
// @param closeNode   { string (selector) }
// @param activeClass { string }
//
// *************************************

JS.Modules.Video = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings  = {};
  var _isPlaying = false;
  var _video     = null;
  var _videoSrc  = null;

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function(options) {
    _settings = $.extend({
      $element    : $('body'),
      $container  : $('.js-video'),
      $trigger    : $('.js-video-trigger'),
      $video      : $('.js-video-element'),
      $close      : $('<a href="#" class="video-close js-video-close" aria-label="close">&times;</a>'),
      $overlay    : $('<div class="video-overlay js-video-overlay"></div>'),
      overlayNode : '.js-video-overlay',
      closeNode   : '.js-video-close',
      activeClass : 'is-video-playing',
      playDelay   : 1000,
      vendor      : null,
      ytVideo     : null
    }, options);

    _video = _settings.$video[0];

    _getYouTubeSrc();
    _setEventHandlers();
  };

  // -------------------------------------
  //   Get YouTube Source
  // -------------------------------------

  var _getYouTubeSrc = function() {
    _videoSrc = $( _video ).attr( 'src' );
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {

    // ----- Click: Hover ----- //

    _settings.$trigger.on('mouseover', function(event) {
      _settings.$video.attr('preload', 'true');
    });

    // ----- Click: Trigger ----- //

    _settings.$trigger.on('click', function(event) {
      event.preventDefault();

      _toggle('open');
    });

    // ----- Click: Close ----- //

    $(document).on('click', _settings.closeNode, function(event) {
      event.preventDefault();

      _toggle('close');
    });

    // ----- Click: Overlay ----- //

    $(document).on('click', _settings.overlayNode, function(event) {
      _toggle('close');
    });

    // ----- Keydown: Escape ----- //

    $(document).on('keydown', function(event) {
      switch (event.which) {
        case 27:
          _toggle('close');
          break;
      }
    });

  };

  // -------------------------------------
  //   Toggle
  // -------------------------------------

  var _toggle = function(state) {
    switch(state) {

      case 'open':
        _settings.$element.prepend(_settings.$overlay);
        _settings.$overlay.prepend(_settings.$close);

        setTimeout(function() {
          _settings.$element.addClass(_settings.activeClass);
        }, 200);

        if (_settings.vendor === null) {
          setTimeout(function() {
            _play();
          }, 1000);
        }

        if (_settings.ytVideo !== null) {
          $(_video).attr('src', _videoSrc + '?rel=0&showinfo=0&html5=1&autoplay=1');
        }

        break;

      case 'close':
        _settings.$element.removeClass(_settings.activeClass);

        if (_settings.vendor === null) {
          _pause();
        }

        if (_settings.ytVideo !== null) {
          $(_video).attr('src', _videoSrc);
        }

        break;
    }
  };

  // -------------------------------------
  //   Play
  // -------------------------------------

  var _play = function() {
    _video.play();
  };

  // -------------------------------------
  //   Pause
  // -------------------------------------

  var _pause = function() {
    _video.pause();
  };

  // -------------------------------------
  //   Stop
  // -------------------------------------

  var _stop = function() {
    _video.stop();
  };

  // -------------------------------------
  //   Public Methods
  // -------------------------------------

  return {
    init : init
  };

})();
