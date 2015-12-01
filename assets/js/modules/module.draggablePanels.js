window.APP = (function (module, $) {
    "use strict";

  module.draggablePanels = {};

  function DraggablePanels() {
    var self = this,
        $container = $('.resizable');

    var setUpInlineLayout = function(_$container) {
      var $dragX = $('.resizable__resizer--xaxis', _$container);

      $dragX.draggabilly({axis: 'x', containment: _$container});

      $dragX.on('dragMove', function() {
        var dragData = $(this).data('draggabilly'),
            indx = $(this).is(':first-child') ? 0 : 2,
            $panel = $('.resizable-panel', _$container).eq(indx),
            dragAmount = indx == 2 ? _$container.width() - dragData.position.x : dragData.position.x,
            $otherResizer = $(this).siblings(),
            $otherPanels = $('.resizable-panel', _$container).filter(function(i){return i != indx;}),
            offsetAmount = $otherPanels.eq(0).position().left + $otherPanels.eq(0).outerWidth();

          console.log(dragAmount);

          $panel.css('flex', '0 0 '+ dragAmount + 'px');
          $otherResizer.css('left', offsetAmount);

          // if(!$otherPanels.hasClass('resizable-panel--rigid')) {
          //   $otherPanels.each(function() {
          //     var thisWidth = $(this).width();
          //     $(this).css('flex', thisWidth +'px 0 0');
          //   })
          //   $otherPanels.addClass('resizable-panel--rigid')
          // }

      });
      $dragX.on('dragEnd', function() {
        $('.resizable-panel--rigid', _$container).removeClass('resizable-panel--rigid');
      });
      
      _$container.on('click', '.resizable__fullsize', function(e) {
        e.preventDefault();
        
        var $container = $(this).closest('.resizable'),
            $thisPanel = $(this).closest('.resizable-panel'),
            $otherPanels = $('.resizable-panel', $container).filter(function(i){return i != $thisPanel.index();});
        
        $otherPanels.css('flex', '0 0 0');
        $thisPanel.css('flex', '1 0 0');
        console.log($container);
        $container.addClass('resizable--fullsize-enabled');
      });

    }
    this.init = function() {
      $container.each(function(i) {
        var layoutType = $(this).data('layout');

        switch(layoutType) {
          case 'inline':
            setUpInlineLayout($(this));
            break;
          case 'top':
            break;
          case 'side':
            break;
        }
      });
//var draggableBars = $elem.draggabilly({axis: 'x', containment: $container});
    }
    this.addNew = function($container) {

    }
  }

  module.draggablePanels = new DraggablePanels;

  return module;
})(window.APP || {}, window.jQuery);
