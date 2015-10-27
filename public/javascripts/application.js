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

// *************************************
//
//   Dispatcher
//   -> Run JS events based on current page
//      Credit: https://github.com/gitlabhq/gitlabhq/blob/master/app/assets/javascripts/dispatcher.js.coffee
//
// *************************************
//
// @param $element  { jQuery object }
// @param dataAttr  { string }
// @param events    { array (objects) }
//
// *************************************

JS.Classes.Dispatcher = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  Dispatcher.prototype._settings = {};

  // -------------------------------------
  //   Constructor
  // -------------------------------------

  function Dispatcher(options) {
    this.options = options;
    this.init();
  }

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  Dispatcher.prototype.init = function() {
    this._settings = $.extend({
      $element : $('.js-dispatcher'),
      dataAttr : 'dispatcher-page',
      events   : []
    }, this.options);

    this.dispatch();
  };

  // -------------------------------------
  //   Dispatch
  // -------------------------------------
  //
  // @param event { object }
  //
  // -------------------------------------

  Dispatcher.prototype.dispatch = function(event) {
    var i, len, page, ref, results;

    if (event == null) {
      event = null;
    }

    page = this._getCurrentPage();

    if (!page) {
      return false;
    }

    if (event == null) {
      ref = this._settings.events;
      results = [];

      for (i = 0, len = ref.length; i < len; i++) {
        event = ref[i];

        switch (event.page) {
          case page:
            event.run();
        }

        if (event.match) {
          if (page.match(event.match)) {
            results.push(event.run());
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }

      return results;

    } else {
      switch (event.page) {
        case page:
          return event.run();
      }
    }
  };

  // -------------------------------------
  //   Get Current Page
  // -------------------------------------

  Dispatcher.prototype._getCurrentPage = function() {
    return this._settings.$element.data(this._settings.dataAttr);
  };

  return Dispatcher;

})();

// *************************************
//
//   Form Validator
//   -> Validate multiple form input types
//
// *************************************
//
// @param $element     { jQuery object }
// @param $input       { jQuery object }
// @param $submit      { jQuery object }
// @param messageClass { string }
// @param errorClass   { string }
// @param delimiter    { string }
// @param dataAttr     { string }
// @param showMessage  { string }
// @param onError      { function }
// @param onSuccess    { function }
//
// *************************************

JS.Classes.FormValidator = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  FormValidator.prototype._settings   = {};
  FormValidator.prototype._input      = null;
  FormValidator.prototype._errors     = [];
  FormValidator.prototype._validators = ['required'];

  // -------------------------------------
  //   Constructor
  // -------------------------------------

  function FormValidator(options) {
    this.options = options;
    this.init();
  }

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  FormValidator.prototype.init = function() {
    this._settings = $.extend({
      $element     : $('.js-formValidator'),
      $input       : $('.js-formValidator-input'),
      $submit      : $('.js-formValidator-submit'),
      messageClass : 'js-formValidator-message',
      errorClass   : 'is-invalid',
      delimiter    : '|',
      dataAttr     : 'validate',
      showMessage  : true,
      onError      : null,
      onSuccess    : null
    }, this.options);

    this._setEventHandlers();
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  FormValidator.prototype._setEventHandlers = function() {

    this._settings.$element.on('submit', (function(_this) {
      return function(event) {
        if (!_this._validateAllFields()) {
          event.preventDefault();
        }
      };
    })(this));

  };

  // -------------------------------------
  //   Validate All Fields
  // -------------------------------------

  FormValidator.prototype._validateAllFields = function() {
    this._settings.$input.each((function(_this) {
      return function(index, element) {
        _this._input = $(element);
        _this.validate(_this._input);
      };
    })(this));

    if (this._errors.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  // -------------------------------------
  //   Validate
  // -------------------------------------

  FormValidator.prototype.validate = function(input) {
    var i, key, len, parameter, results;

    parameter     = this._parseValidators(input.data(this._settings.dataAttr));
    this._element = input;

    if (Array.isArray(parameter)) {
      results = [];
      for (i = 0, len = parameter.length; i < len; i++) {
        key = parameter[i];
        results.push(this._matchValidators(key));
      }
      return results;
    } else {
      this._matchValidators(parameter);
    }
  };

  // -------------------------------------
  //   Match Validators
  // -------------------------------------

  FormValidator.prototype._matchValidators = function(match) {
    switch (match) {
      case 'required':
        if (this._validateRequired()) {
          this._setValidationState('error', 'The field is required.');
        } else {
          this._setValidationState('success');
        }
    }
  };

  // -------------------------------------
  //   Set Validation State
  // -------------------------------------

  FormValidator.prototype._setValidationState = function(state, message) {
    switch (state) {
      case 'error':
        this._setError(message);
        this._setInputState(message);
        if (this._settings.onError != null) {
          this._settings.onError(this._settings);
        }
        break;
      case 'success':
        this._removeError();
        this._removeInputState();
        if (this._settings.onSuccess != null) {
          this._settings.onSuccess(this._settings);
        }
    }
  };

  // -------------------------------------
  //   Parse Validators
  // -------------------------------------

  FormValidator.prototype._parseValidators = function(parameter) {
    var i, len, param, parameters, split;

    parameters = [];
    split      = parameter.split(this._settings.delimiter);

    if (split.length > 1) {
      for (i = 0, len = split.length; i < len; i++) {
        param = split[i];
        parameters.push(param);
      }
      return parameters;
    } else {
      return parameter;
    }
  };

  // -------------------------------------
  //   Is Validator
  // -------------------------------------

  FormValidator.prototype._isValidator = function(parameter) {
    return this._validators.indexOf(parameter) !== -1;
  };

  // -------------------------------------
  //   Validate Required
  // -------------------------------------

  FormValidator.prototype._validateRequired = function() {
    if (!/\S/.test(this._input.val())) {
      return true;
    } else {
      return false;
    }
  };

  // -------------------------------------
  //   Set Error
  // -------------------------------------

  FormValidator.prototype._setError = function(message) {
    this._errors.push({
      element: this._input.attr('name'),
      message: message
    });
  };

  // -------------------------------------
  //   Remove Error
  // -------------------------------------

  FormValidator.prototype._removeError = function() {
    var index;
    index = this._errors.indexOf(this._input);
    this._errors.splice(index, 1);
  };

  // -------------------------------------
  //   Set Input State
  // -------------------------------------

  FormValidator.prototype._setInputState = function(message) {
    this._removeInputState();
    this._input.addClass(this._settings.errorClass);
    if (this._settings.showMessage) {
      this._input.after("<p class='" + this._settings.messageClass + "'>" + message + "</p>");
    }
  };

  // -------------------------------------
  //   Remove Input State
  // -------------------------------------

  FormValidator.prototype._removeInputState = function() {
    this._input.removeClass(this._settings.errorClass);
    if (this._settings.showMessage) {
      this._input.next("." + this._settings.messageClass).remove();
    }
  };

  return FormValidator;

})();

// *************************************
//
//   Course
//   -> Dispatch events
//
// *************************************

JS.Pages.Course = function() {

  // -------------------------------------
  //   Modules
  // -------------------------------------

  JS.Modules.Toggle.init({
    $element    : $('.js-courseLayout-toggle'),
    proximity   : $('.js-courseLayout'),
    toggleClass : 'is-active'
  });

  // -------------------------------------
  //   Local
  // -------------------------------------

  // ----- Preloading ----- //

  $('.js-courseLayout').addClass('is-loaded');
  $('.js-preload').addClass('is-hidden');

};

// *************************************
//
//   Feedback
//   -> Dispatch events
//
// *************************************

JS.Pages.Feedback = function() {

  // -------------------------------------
  //   Classes
  // -------------------------------------

  new JS.Classes.FormValidator();

  // -------------------------------------
  //   Modules
  // -------------------------------------

  JS.Modules.SaveProgress.init();

  // -------------------------------------
  //   Vendor
  // -------------------------------------

  autosize($(JS.Globals.Vendor.autosizeQuery));

};

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

// *************************************
//
//   News
//   -> Dispatch events
//
// *************************************

JS.Pages.News = function() {

  // -------------------------------------
  //   Classes
  // -------------------------------------

  new JS.Classes.FormValidator();

  // -------------------------------------
  //   Modules
  // -------------------------------------

  JS.Modules.LoadStories.init();
  JS.Modules.SaveProgress.init();

  // -------------------------------------
  //   Services
  // -------------------------------------

  JS.Services.expel({
    $toggle     : $('.js-alert-close'),
    elementNode : '.js-alert'
  });

  // -------------------------------------
  //   Vendor
  // -------------------------------------

  autosize($(JS.Globals.Vendor.autosizeQuery));

};

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

// *************************************
//
//   Load Stories
//   -> Asynchronous story loader
//
// *************************************

JS.Modules.LoadStories = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings = {};

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function(options) {
    _settings = $.extend({
      $element        : $('.js-loadFeed'),
      $button         : $('.js-loadFeed-btn'),
      $list           : $('.js-loadFeed-list'),
      lastDate        : $(".js-loadFeed-list .list-item .externalLink").last().data("pub"),
      path            : '/news?pub_date=',
      hiddenClass     : 'is-hidden'
    }, options);

    _setEventHandlers();
  };

  // -------------------------------------
  //   Append Stories
  // -------------------------------------

  var _appendStories = function(data) {
    var stories = data.docs,
        markup  = '';

    stories.forEach(function(story) {
      markup +=
        '<li class="list-item">' +
          '<article class="bucket">' +
            '<div class="bucket-media">' +
              '<img class="thumb" src="' + story.user.avatar_url + '" width="50"/>' +
            '</div>' +
            '<div class="bucket-content">' +
              '<h2 class="h h--4">' +
                '<a class="externalLink tct twb" href="' + story.url + '" target="_blank">' + story.title +
                  '<svg width="16" height="16" class="icon externalLink-icon">' +
                    '<use xlink:href="#icon-external"/>' +
                  '</svg>' +
                '</a>' +
              '</h2>' +
              '<p class="mbf tcs tfh tss">' +
                'via ' + '<span class="twsb">' + story.user.name + '</span>' +
                ' | ' + '<a class="' + commentClass(story.comment_count) + '" href="/news/' + story.slug + '#comments">View Discussion ' + commentNumber(story.comment_count) + '</a>' +
              '</p>' +
            '</div>' +
          '</article>' +
        '</li>';
    });


    _settings.$list.append(markup);
  };

  // -------------------------------------
  //   Get Stories
  // -------------------------------------

  var _getStories = function() {
    $.get(_settings.path + _settings.lastDate, function(data) {
      _appendStories(data);
      _toggleButton(data);
      _setNewLastDate(data);
    });
  };

  // -------------------------------------
  //   Comment Class
  // -------------------------------------
  //
  // @param count { integer }
  //
  // -------------------------------------

  var commentClass = function(count) {
    return count > 2 ? 'link link--highlighted' : '';
  };

  // -------------------------------------
  //   Comment Number
  // -------------------------------------
  //
  // @param count { integer }
  //
  // -------------------------------------

  var commentNumber = function(count) {
    if (count > 0) {
      return '(' + count + ')';
    } else {
      return '';
    }
  };

  // -------------------------------------
  //   Set New Last Date
  // -------------------------------------

  var _setNewLastDate = function(data) {
    var newDate = data.docs[data.docs.length - 1].published_at;
    _settings.lastDate = new Date(newDate).valueOf()
    console.log(_settings.lastDate)
    
  };

  // -------------------------------------
  //   Toggle Button
  // -------------------------------------

  var _toggleButton = function(data) {
    var isMoreStories = data.more;

    if (!isMoreStories) {
      _settings.$button.parent().addClass(_settings.hiddenClass);
    }
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {
    _settings.$button.on('click', function(){
      _getStories();
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
// JS.Modules.LoadStories.init()
//

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

// *************************************
//
//   Expel
//   -> Pest control
//
// *************************************
//
// @param $toggle     { jQuery object }
// @param elementNode { string }
//
// *************************************

JS.Services.expel = function(options) {
  var settings = $.extend({
    $toggle     : $('.js-expel-toggle'),
    elementNode : '.js-expel',
    expelClass  : 'is-dismissed'
  }, options);

  settings.$toggle.on('click', function(event) {
    event.preventDefault();

    var element = $(this);

    element
      .closest(settings.elementNode)
      .addClass(settings.expelClass);

    setTimeout(function() {
      element
        .closest(settings.elementNode)
        .remove();
    }, 500);
  });
};

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.Services.expel();
//

// *************************************
//
//   Inject SVG
//   -> Asynchronously append an SVG
//
// *************************************
//
// @param assetPath { string }
//
// *************************************

JS.injectSvg = function (options) {
  var settings = $.extend({
    assetPath : null
  }, options);

  $.get(settings.assetPath, function (data) {
    var $element = $(new XMLSerializer().serializeToString(data.documentElement));

    $element.css({ display : 'none' }).appendTo('body');
  });
}

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.injectSvg({ assetPath : '/path/to/file.svg' });
//

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

// *************************************
//
//   News Show
//   -> Dispatch events
//
// *************************************

JS.Pages.News.Show = function() {

  // -------------------------------------
  //   Modules
  // -------------------------------------

  JS.Modules.CreateComment.init();
  JS.Modules.EditComment.init();

};
