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
