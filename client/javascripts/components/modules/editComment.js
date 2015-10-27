// *************************************
//
//   Edit Comment
//   -> Ajax editing of comment
//
// *************************************
//
// @param $element    { jQuery object }
// @param $comment    { jQuery object }
// @param $form       { jQuery object }
// @param $cancelBtn  { jQuery object }
// @param $deleteBtn  { jQuery object }
// @param $editBtn    { jQuery object }
// @param $saveBtn    { jQuery object }
// @param $textarea   { jQuery object }
// @param hiddenClass { string }
// @param storySlug   { string }
// @param token       { string }
//
// *************************************

JS.Modules.EditComment = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings = {};

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function( options ) {
    _settings = $.extend({
      $element    : $('.js-editComment'),
      $comment    : $('.js-editComment-comment'),
      $form       : $('.js-editComment-form'),
      $cancelBtn  : $('.js-editComment-cancelBtn'),
      $deleteBtn  : $('.js-editComment-deleteBtn'),
      $editBtn    : $('.js-editComment-editBtn'),
      $saveBtn    : $('.js-editComment-saveBtn'),
      $number     : $('.js-editComment-number'),
      $textarea   : $('.js-editComment-textarea'),
      hiddenClass : 'is-hidden',
      storySlug   : window.location.pathname.split('/')[2],
      token       : $('input[name="_csrf"]').val()
    }, options);

    _setEventHandlers();
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {

    // ----- Form ----- //

    _settings.$form.on('submit', function(event) {
      event.preventDefault();
    });

    // ----- Cancel Button ----- //

    _settings.$cancelBtn.on('click', function(event) {
      _restoreComment($(this).closest(_settings.$element));
      _toggleForm($(this).closest(_settings.$element));
    });

    // ----- Delete Button ----- //

    _settings.$deleteBtn.on('click', function(event) {
      _deleteComment($(this).closest(_settings.$element));
      _updateCommentNumber();
    });

    // ----- Edit Button ----- //

    _settings.$editBtn.on('click', function(event) {
      _toggleForm($(this).closest(_settings.$element));
    });

    // ----- Save Button ----- //

    _settings.$saveBtn.on('click', function(event) {
      _saveComment($(this).closest(_settings.$element));
      _toggleForm($(this).closest(_settings.$element));
    });

  };

  // -------------------------------------
  //   Delete Comment
  // -------------------------------------

  var _deleteComment = function($element) {
    var id = $element.data('id');
    $.ajax({
      beforeSend : function(xhr) { xhr.setRequestHeader('csrf-token', _settings.token); },
      url        : '/news/' + _settings.storySlug + '/comment/' + id,
      type       : 'delete',
      complete   : function() { $element.remove(); }
    });
  };

  // -------------------------------------
  //   Restore Comment
  // -------------------------------------

  var _restoreComment = function($element) {
    var $comment  = $element.find(_settings.$comment),
        $textarea = $element.find(_settings.$textarea);

    $textarea.val($comment.text());
  };

  // -------------------------------------
  //   Save Comment
  // -------------------------------------

  var _saveComment = function($element) {
    var $comment  = $element.find(_settings.$comment),
        $textarea = $element.find(_settings.$textarea),
        body      = $textarea.val(),
        id        = $element.data('id');

    $comment.text(body);

    $.ajax({
      beforeSend : function(xhr) { xhr.setRequestHeader('csrf-token', _settings.token); },
      url        : '/news/' + _settings.storySlug + '/comment/' + id,
      type       : 'put',
      data       : { body: body }
    });
  }

  // -------------------------------------
  //   Toggle Form
  // -------------------------------------

  var _toggleForm = function($element) {
    var $comment = $element.find(_settings.$comment),
        $editBtn = $element.find(_settings.$editBtn),
        $form    = $element.find(_settings.$form);

    $comment.toggleClass(_settings.hiddenClass);
    $editBtn.toggleClass(_settings.hiddenClass);
    $form.toggleClass(_settings.hiddenClass);
  };

  // -------------------------------------
  //   Update Comment Number
  // -------------------------------------

  var _updateCommentNumber = function() {
    var number = parseInt(_settings.$number.first().text(), 10);

    number--;

    if (number === 1) {
      _settings.$number.text(number + ' Comment');
    } else {
      _settings.$number.text(number + ' Comments');
    }
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
// Spellbook.Modules.EditComment.init()
//
