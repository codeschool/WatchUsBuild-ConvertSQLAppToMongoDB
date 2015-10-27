angular.module('javascriptcom').factory('jsSuccessCloud', ['jsChallengeProgress', function(jsChallengeProgress) {
  return {
    trigger: function() {
      var iconMarkup = '', delay,scale, xOffset, zIndex;

      for (var i = 0; i < 12; i++) {
        xOffset = _.random(18, 82)
        scale = _.random(0.5, 1.4)
        zIndex = scale < 1 ? -1 : 1;
        delay = _.random(0, 0.5)

        iconMarkup += "<div class='message-icon' style='left: " + xOffset + "vw; transform: scale(" + scale + "); z-index: " + zIndex + "'><div class='message-icon-item has-handle tci' style='animation-delay: " + delay + "s'><svg width='70' height='70' class='handle icon'><use xlink:href='#icon-check'></use></svg></div></div>";
      }

      $('body').append("<div class='message js-message'><p class='message-text'>Success!</p>" + iconMarkup + "</div>");

      setTimeout(function() {
        $('.js-message').remove();
      }, 2000);
    }
  }
}]);
