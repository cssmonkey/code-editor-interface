window.APP = (function (module, $) {
    "use strict";

  module.draggablePanels = {};

  var panels = {},
      $window = $(window);

  function TopPanels($container) {
    var self = this,
        $panelsContainer = $container,
        $resizerHandle = $('.resizer-controls__handle', $panelsContainer);

    self.init = function() {
      console.log('top hiya');
    };
  };

  function SidePanels($container) {
    var self = this,
        $panelsContainer = $container,
        $resizerHandle = $('.resizer-controls__handle', $panelsContainer);

    self.init = function() {
      console.log('side hiya');
    };
  };

  function InlinePanels($container) {
    var self = this,
        $panelsContainer = $container,
        $resizerHandle = $('.resizer-controls__handle', $panelsContainer),
        options = {
          axis: 'x',
          containment: $container
        };

    var onDrag = function() {
      var data = $(this).data('draggabilly'),
          indx = $(this).is(':first-child') ? 0 : 2,
          $panel = $('.resizable-panel', $panelsContainer).eq(indx),
          dragAmount = indx == 2 ? $panelsContainer.width() - data.position.x : data.position.x,
          $otherResizer = $(this).siblings(),
          $otherPanels = $('.resizable-panel', $panelsContainer).filter(function(i){return i != indx;}),
          offsetAmount = $otherPanels.eq(0).position().left + $otherPanels.eq(0).outerWidth();

      $otherPanels.removeAttr('style');
      $panel.css('flex', '0 0 '+ dragAmount + 'px');
      $otherResizer.css('left', offsetAmount);
    }
    self.init = function() {
        // setup dragging
        $resizerHandle.draggabilly(options);
        $resizerHandle.on('dragMove', onDrag);
        $resizerHandle.on('dragStart', function(e, pointer) {
          $('.resizer-controls__handle--active', $panelsContainer).removeClass('resizer-controls__handle--active');
          $(this).addClass('resizer-controls__handle--active');
        });
    }
  }
  // for when 2 panels are displayed on top, 3rd panel sits below
  panels.top = function($container) {
    var panels = new TopPanels($container);
    panels.init();
  };
  // for panels arranged alongside each other
  panels.inline = function($container) {
    var panels = new InlinePanels($container);
    panels.init();
  };
  // for when 2 panels are displayed on lefthand side, 3rd panel sits to the right
  panels.side = function($container) {
    var panels = new SidePanels($container);
    panels.init();
  };
  panels.expandCollapse = function() {
    var $expandBtn = $('.resizer-btn--expand'),
        $collapseBtn = $('.resizer-btn--collapse');

    $expandBtn.on('click', function(e) {
      e.preventDefault();
      var $panelsContainer = $(this).closest('.resizable'),
          $thisPanel = $(this).closest('.resizable-panel');

      $thisPanel.removeAttr('style');

      if($thisPanel.hasClass('resizable-panel--expand')) {
        $thisPanel.removeClass('resizable-panel--expand');
      }
      else {
        $thisPanel.addClass('resizable-panel--expand');
      }
      adjustResizerPosition($panelsContainer);
    });
    $collapseBtn.on('click', function(e) {
      e.preventDefault();
      var $panelsContainer = $(this).closest('.resizable'),
          $thisPanel = $(this).closest('.resizable-panel');

      $thisPanel.removeAttr('style');

      if($thisPanel.hasClass('resizable-panel--collapse')) {
        $thisPanel.removeClass('resizable-panel--collapse');
      }
      else {
        $thisPanel.addClass('resizable-panel--collapse');
      }
      adjustResizerPosition($panelsContainer);
    });

    function adjustResizerPosition($panelsContainer) {

    }
  }
  panels.toggleLayout = function($container) {
    var $layoutToggle = $('.resizer-controls--layout-toggle .btn', $container),
        btnSelectedClass = 'btn--active';

    $layoutToggle.on('click', function(e) {
      e.preventDefault();

      if(!$(this).hasClass(btnSelectedClass)) {
        var selectedLayout = $(this).data('layouttoggle');

        $('.' + btnSelectedClass, $container).removeClass(btnSelectedClass);
        $(this).addClass(btnSelectedClass);

        $container.attr('data-layout', selectedLayout);
        $('.resizable-panel', $container).removeAttr('style');
        $('.resizer-controls__handle', $container).removeAttr('style');
        panels[selectedLayout]($container);
      }

    });
  }
  var init = function() {
    var $panelsContainer = $('.resizable');

    panels.expandCollapse();
    $panelsContainer.each(function(i) {
      var layoutType = $(this).data('layout');
      panels[layoutType]($(this));
      panels.toggleLayout($(this));
    });

    $window.on('onResizeEnd', function() {
      $('.resizer-controls__handle').removeAttr('style');
      $('.resizable-panel').removeAttr('style');
    });
  }

  module.draggablePanels = function(){init()};

  return module;
})(window.APP || {}, window.jQuery);
