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
