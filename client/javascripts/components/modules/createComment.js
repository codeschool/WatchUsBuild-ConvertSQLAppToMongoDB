// *************************************
//
//   Create Comment
//   -> Ajax creation of comment
//
// *************************************
//
// @param $element        { jQuery object }
// @param $number         { jQuery object }
// @param $container      { jQuery object }
// @param $emptyContainer { jQuery object }
// @param listClass       { string }
//
// *************************************

JS.Modules.CreateComment = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings     = {};
  var _firstComment = false;

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function( options ) {
    _settings = $.extend({
      $element        : $('.js-createComment'),
      $number         : $('.js-createComment-number'),
      $container      : $('.js-createComment-container'),
      $emptyContainer : $('.js-createComment-empty'),
      listClass       : 'js-createComment-list'
    }, options );

    _settings.$list = $('.' + _settings.listClass);

    _setEventHandlers();
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {

    // ----- Submit ----- //

    _settings.$element.on('submit', function(event) {
      event.preventDefault();
      _postComment($(this));
    });

  };

  // -------------------------------------
  //   Append Comment
  // -------------------------------------

  var _appendComment = function(comment) {
    if (_firstComment) {
      _settings.$emptyContainer.remove();
      _settings.$list.removeClass('is-hidden');
    }

    _settings.$list.append(comment);
    _settings.$element.find('textarea').val('');
  };

  // -------------------------------------
  //   Build Comment
  // -------------------------------------

  var _buildComment = function(data) {
    var comment = '';
    comment+=
      '<li id="comment-' + data.doc._id + '" class="list-item is-added js-editComment" data-id="' + data.doc.comments[0].id + '">' +
        '<div class="bucket">' +
          '<div class="bucket-media">' +
            '<img class="thumb" src="' + data.doc.comments[0].user.avatar_url + '" width="50">' +
          '</div>' +
          '<div class="bucket-content">' +
            '<div class="split mbm tfh">' +
              '<div class="split-item">' +
                '<div class="split-cell">' +
                  '<span class="mrs twb">' + data.doc.comments[0].user.name + '</span>' +
                  '<time class="tcs tsi">Today</time>' +
                '</div>' +
                '<div class="split-cell">' +
                  '<button class="link js-editComment-editBtn">Edit</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<p class="mbf js-editComment-comment">' + data.doc.comments[0].body + '</p>' +
            '<form class="form js-editComment-form is-hidden" action="">' +
              '<textarea class="form-input form-textarea js-autosize js-editComment-textarea">' + data.doc.comments[0].body + '</textarea>' +
              '<div class="split split--center">' +
                '<div class="split-item">' +
                  '<div class="split-cell">' +
                    '<button class="link link--error js-editComment-deleteBtn">Delete</button>' +
                  '</div>' +
                  '<div class="split-cell">' +
                    '<div class="has-btn">' +
                      '<button class="btn btn--a--bordered js-editComment-cancelBtn">Cancel</button>' +
                      '<button class="btn js-editComment-saveBtn">Save Changes</button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</form>' +
          '</div>' +
        '</div>' +
      '</li>';

    return comment;
  };

  // -------------------------------------
  //   Build Moderation Comment
  // -------------------------------------

  var _buildModerationComment = function(data) {
    var comment = '';

    comment +=
      '<li class="list-item">' +
        '<p class="mbf tac tce tsi">Hang tight! Your comment needs to be moderated.</p>' +
      '</li>';

    return comment;
  };

  // -------------------------------------
  //   Post Comment
  // -------------------------------------

  var _postComment = function(form) {
    var url = form.attr('action');

    $.post(url, form.serialize(), function(data) {
      var comment = '';

      _firstComment = false;

      if (_settings.$container.hasClass('is-empty')) {
        _firstComment = true;
        comment       = _buildComment(data);
      } else {
        if (data.doc.comments[0].flagged) {
          comment = _buildModerationComment(data);
        } else {
          comment = _buildComment(data);
        }
      }

      _appendComment(comment);
      _updateCommentNumber();
      JS.Modules.EditComment.init();
    });
  };

  // -------------------------------------
  //   Update Comment Number
  // -------------------------------------

  var _updateCommentNumber = function() {
    var number = parseInt(_settings.$number.first().text(), 10);

    number++;

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
// Spellbook.Modules.CreateComment.init()
//
