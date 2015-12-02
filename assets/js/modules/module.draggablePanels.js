window.APP = (function (module, $) {
    "use strict";

  module.draggablePanels = {};

  var panels = {},
      $window = $(window);

  function TopPanels($container) {
    var self = this,
        $panelsContainer = $container,
        $resizerHandle_x = $('.resizer-controls__handle:first-child', $panelsContainer),
        $resizerHandle_y = $('.resizer-controls__handle:last-child', $panelsContainer),
        options_x = {
          axis: 'x',
          containment: $panelsContainer
        },
        options_y = {
          axis: 'y',
          containment: $panelsContainer
        },
        containerWidth = $panelsContainer.width(),
        containerHeight = $panelsContainer.height();

    var onDrag_x = function() {
      var data = $(this).data('draggabilly'),
          $panel = $('.resizable-panel', $panelsContainer).eq(0),
          dragAmount = data.position.x,
          $otherPanel = $('.resizable-panel', $panelsContainer).eq(1),
          offsetAmount = containerWidth - dragAmount;

      $panel.css('flex', '0 0 ' + dragAmount + 'px');
      $otherPanel.css('flex', '0 0 ' + offsetAmount + 'px');
    }
    var onDrag_y = function() {
      var data = $(this).data('draggabilly'),
          $panel = $('.resizable-panel', $panelsContainer).eq(2),
          dragAmount = data.position.y,
          $otherPanels = $('.resizable-panel', $panelsContainer).filter(function(i){return i != 2;}),
          offsetAmount = containerHeight - dragAmount,
          $otherResizer = $(this).siblings();

      $panel.css('height', offsetAmount);
      $otherPanels.css('height', dragAmount);
      $otherResizer.css('height', dragAmount);
    }
    self.init = function() {
      // setup dragging
      $resizerHandle_x.draggabilly(options_x);
      $resizerHandle_y.draggabilly(options_y);

      $resizerHandle_x.on('dragMove', onDrag_x);
      $resizerHandle_y.on('dragMove', onDrag_y);

      $window.on('onResizeEnd', function() {
        containerWidth = $panelsContainer.width();
        containerHeight = $panelsContainer.height();
      });
    };
  };

  function SidePanels($container) {
    var self = this,
        $panelsContainer = $container,
        $resizerHandle_x = $('.resizer-controls__handle:last-child', $panelsContainer),
        $resizerHandle_y = $('.resizer-controls__handle:first-child', $panelsContainer),
        options_x = {
          axis: 'x',
          containment: $panelsContainer
        },
        options_y = {
          axis: 'y',
          containment: $panelsContainer
        },
        containerWidth = $panelsContainer.width(),
        containerHeight = $panelsContainer.height();
    var onDrag_x = function() {
      var data = $(this).data('draggabilly'),
          $panel = $('.resizable-panel', $panelsContainer).eq(2),
          dragAmount = data.position.x,
          $otherPanels = $('.resizable-panel', $panelsContainer).filter(function(i){return i != 2;}),
          offsetAmount = containerWidth - dragAmount,
          $otherResizer = $(this).siblings();

      $panel.css('width', offsetAmount);
      $otherPanels.css('width', dragAmount);
      $otherResizer.css('width', dragAmount);
    }
    var onDrag_y = function() {
      var data = $(this).data('draggabilly'),
          $panel = $('.resizable-panel', $panelsContainer).eq(1),
          dragAmount = data.position.y,
          $otherPanel = $('.resizable-panel', $panelsContainer).eq(0),
          offsetAmount = containerHeight - dragAmount;

      $panel.css('height', offsetAmount);
      $otherPanel.css('height', dragAmount);
    }
    self.init = function() {
      var $resizedPanels = $('.resizable-panel', $panelsContainer).filter(function(i){return i != 2;}),
          setPanelHeights = function() {
            setTimeout(function () {
             $resizedPanels.height(containerHeight/2);
            }, 100);
          };

      // setup dragging
      $resizerHandle_x.draggabilly(options_x);
      $resizerHandle_y.draggabilly(options_y);

      $resizerHandle_x.on('dragMove', onDrag_x);
      $resizerHandle_y.on('dragMove', onDrag_y);

      setPanelHeights();
      $window.on('onResizeEnd', function() {
        if($panelsContainer.data('layout') == 'side') {
          containerWidth = $panelsContainer.width();
          containerHeight = $panelsContainer.height();
          setPanelHeights();
        }
      });
    };
  };

  function InlinePanels($container) {
    var self = this,
        $panelsContainer = $container,
        $resizerHandle = $('.resizer-controls__handle', $panelsContainer),
        options = {
          axis: 'x',
          containment: $panelsContainer
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
        $container.data('layout', selectedLayout);
        $('.resizable-panel', $container).removeAttr('style');
        $('.resizer-controls__handle', $container).removeAttr('style').removeClass('resizer-controls__handle--active');

        $('.resizer-controls__handle', $container).off('dragMove');
        panels[selectedLayout]($container);
      }

    });
  }
  panels.fullScreen = function($container) {
    var setHeight = $container.outerHeight(),
        setContainerHeight = function() {
          $container.removeAttr('style');
          setHeight = $container.outerHeight();
          $container.height(setHeight);
        }
    if($container.is('[data-fullscreen]')) {
      $container.addClass('is-fullscreen');
      setContainerHeight();
      $window.on('onResizeEnd', setContainerHeight);
    }
  }
  var init = function() {
    var $panelsContainer = $('.resizable');

    panels.expandCollapse();

    $panelsContainer.each(function(i) {
      var layoutType = $(this).data('layout');
      panels.fullScreen($(this));
      panels[layoutType]($(this));
      panels.toggleLayout($(this));
    });

    $window.on('onResizeEnd', function() {
      $('.resizer-controls__handle').removeAttr('style');
      $('.resizable-panel').removeAttr('style');
    });

    $('.resizer-controls__handle').on('dragStart', function(e, pointer) {
      $('.resizer-controls__handle--active').removeClass('resizer-controls__handle--active');
      $(this).addClass('resizer-controls__handle--active');
    });
  }

  module.draggablePanels = function(){init()};

  return module;
})(window.APP || {}, window.jQuery);
