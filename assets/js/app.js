window.APP = (function (module, $) {
    "use strict";

    $(function() {
      module.draggablePanels.init();
    });

  return module;
})(window.APP || {}, window.jQuery);
