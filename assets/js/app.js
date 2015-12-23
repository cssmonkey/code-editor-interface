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
      var script,
          loadEditor;

      loadEditor = function(response){
        var $codeBlock = $('.code-editor-panel__codeblock');

        $('.code-editor').resizablePanels();

        $codeBlock.each(function() {
          var id = $(this).attr('id'),
              mode = $(this).data('mode'),
              thisEditor = ace.edit(id);

          thisEditor.setTheme('ace/theme/chrome');
          thisEditor.getSession().setMode(mode);

          $(window).on('onResizePanels', function() {
            thisEditor.resize();
          });
        });


      }

      if(typeof ace === 'undefined') {
        script = $.getScript('//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js').then(loadEditor)
      }
      else {
        loadEditor();
      }
    });

  return module;
})(window.APP || {}, window.jQuery);
