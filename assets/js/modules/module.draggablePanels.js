window.APP = (function (module, $) {
    "use strict";

  function DraggablePanel() {
    var self = this;

    self.init = function() {

    }

    self.init();
  }
  // var $draggable = $('.draggable').draggabilly({
  //   // options...
  // })

  module.draggablePanels = function() {
    var draggablePanel = new DraggablePanel;
  }

  return module;
})(window.APP || {}, window.jQuery);
