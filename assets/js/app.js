window.APP = (function (module, $) {
    "use strict";

    var resizeTimerId;
    // global(ish) variable for the current width of the device
    APP.deviceWidth = $(window).resize(function () {
        clearTimeout(resizeTimerId);
        APP.deviceWidth = $(this).width();
        resizeTimerId = setTimeout(function () {
            $(window).trigger("onResizeEnd");
        }, 250);
    }).width();

    $(function() {
      module.draggablePanels();
    });

  return module;
})(window.APP || {}, window.jQuery);
