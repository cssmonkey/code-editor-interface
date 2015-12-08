window.APP = (function (module, $) {
    "use strict";

    var resizeTimerId;
    // global(ish) variable for the current width of the device
    var deviceWidth = $(window).resize(function () {
        clearTimeout(resizeTimerId);
        APP.deviceWidth = $(this).width();
        resizeTimerId = setTimeout(function () {
            $(window).trigger("onResizeEnd");
        }, 250);
    }).width();

    $(function() {
      var success = function(response){
        $('.code-editor').resizablePanels()
      }
      var script = $.getScript('//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js').then(success)
    });

  return module;
})(window.APP || {}, window.jQuery);
