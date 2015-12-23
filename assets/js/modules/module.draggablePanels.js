;(function ( $, window, document, undefined ) {

	// defaults
	var pluginName = 'resizablePanels',
      defaults = {
        selectors : {
          outer: '.code-editor__panels',
          handle: '.code-editor__handle',
          panel: '.code-editor-panel',
          layoutToggleBtn: '[data-layouttoggle]',
          fullscreenToggleBtn: '.code-editor__fullscreen-btn'
        }
      },
      $window = $(window),
      selector,
      shouldUnWrap = false;

  // Plugin constructor
 	function ResizablePanels(element, options) {
 		this.element = element;

 		// merge default options with instance specific options
 		this.options = $.extend( {}, defaults, options);
    this.selector = selector = this.options.selectors;

		this._defaults = defaults;
 		this._name = pluginName;

    var self = this,
        $container = $(self.element),
        $resizeHandle = $(selector.handle, $container),
        $panel = $(selector.panel, $container),
        $topPanels, // required for dragEvents
        $bottomPanels, // required for dragEvents
        $toggleLayoutBtn = $(selector.layoutToggleBtn, $container),
        $toggleFullScreenBtn = $(selector.fullscreenToggleBtn, $container),
        currentLayout,
        containmentHeight,
        containmentWidth,
				btnSelectedClass = 'selected';

    var toggleLayout = function(e) {
      e.preventDefault();
      var isSelected = $(this).hasClass(btnSelectedClass),
          thisLayout = $(this).data('layouttoggle');

      if(isSelected) {
        return false;
      }

      $('[data-layouttoggle].' + btnSelectedClass, $container).removeClass(btnSelectedClass);
      $(this).addClass(btnSelectedClass);

      $container.attr('data-layout', thisLayout);

      self.reset();
      self.update();
    }

    var toggleFullScreen = function(e) {
      e.preventDefault();
      var isSelected = $container.hasClass('resize-panel--fullscreen');

      if(isSelected) {
        $container.removeClass('resize-panel--fullscreen');
      }
      else {
        $container.addClass('resize-panel--fullscreen');
      }

			$(this).toggleClass(btnSelectedClass);

      self.reset();
			self.update();
    }

    var setDragOptions = function(layout, $container, $resizeHandle) {
      if(!layout) {
        return;
      }

      var options_x = {
            axis: 'x',
            containment: $container
          },
          options_y = {
            axis: 'y',
            containment: $container
          },
          $resizerHandle_x,
          $resizerHandle_y,
          setSelectors = {
            split: function() {
              $resizerHandle_x = $resizeHandle.eq(1);
              $resizerHandle_y = $resizeHandle.eq(0);
              $topPanels = $panel.filter(function(i){return i < 2});
              $bottomPanels = $panel.filter(function(i){return i > 1});
            },
            bottom: function() {
              $resizerHandle_x = $resizeHandle.filter(function(i){return i < 2});
              $resizerHandle_y = $resizeHandle.eq(2);
              $topPanels = $panel.filter(function(i){return i < 3});
              $bottomPanels = $panel.eq(3);
            },
            top: function() {
              $resizerHandle_x = $resizeHandle.filter(function(i){return i > 0});
              $resizerHandle_y = $resizeHandle.eq(0);
              $topPanels = $panel.eq(0);
              $bottomPanels = $panel.filter(function(i){return i > 0});

							// needed for safari...
							var initPosition = $resizerHandle_y.position().top;
							$resizerHandle_y.css('top', initPosition);
            }
          }

      setSelectors[layout]();

      $resizerHandle_x.draggabilly(options_x);
      $resizerHandle_y.draggabilly(options_y);
    }

    var onDrag = function(e) {
      var data = $(this).data('draggabilly'),
          handleIndx = $(this).index(),
          axis = data.options.axis,
          $top = $topPanels,
          $bottom = $bottomPanels,
          $otherResizer = $(this).siblings(),
          dragAmount = data.position[axis],
          diff,
          $panels,
          $otherPanels;

      if(currentLayout === 'split') {
        if(axis === 'x')
        {
          diff = containmentWidth - dragAmount;

          $panels = $panel.filter(':even');
          $otherPanels = $panel.filter(':odd');

          $panels.css('flex', '0 0 ' + dragAmount + 'px');
          $otherPanels.css('flex', '0 0 ' + diff + 'px');
        }
        else if(axis === 'y') {
          diff = containmentHeight - dragAmount;
          $top.css('height', dragAmount);
          $bottom.css('height', diff);
        }
      }
      else if(currentLayout === 'bottom') {

        if(axis === 'x')
        {
					var panelDragAmount,
							otherPanelsDragAmount;

					diff = containmentWidth - dragAmount;

					if(handleIndx == 1) {
						$otherResizer = $resizeHandle.eq(0);
						$panels = $panel.eq(2);

						panelDragAmount = diff;
						otherPanelsDragAmount = dragAmount/2;
					}
					else if(handleIndx === 0) {
						$otherResizer = $resizeHandle.eq(1);
						$panels = $panel.eq(0);

						panelDragAmount = dragAmount;
						otherPanelsDragAmount = diff/2;
					}

					$otherPanels = $panel.filter(function(i) {return i != $panels.index() && i != 3});

					var offset = $otherPanels.eq(0).position().left + $otherPanels.eq(0).outerWidth();

          $panels.css('flex', '0 0 ' + panelDragAmount + 'px');
         	$otherPanels.css('flex', '0 0 ' + otherPanelsDragAmount + 'px');
					$otherResizer.css('left', offset);
        }
        else if(axis === 'y') {
          diff = containmentHeight - dragAmount;
          $top.css('height', dragAmount);
          $otherResizer.css('height', dragAmount);
          $bottom.css('height', diff);
        }
      }
			else if(currentLayout === 'top') {
				if(axis === 'x')
        {
					var panelDragAmount,
							otherPanelsDragAmount;

					diff = containmentWidth - dragAmount;

					if(handleIndx == 1) {
						$otherResizer = $resizeHandle.eq(2);
						$panels = $panel.eq(1);

						panelDragAmount = dragAmount;
						otherPanelsDragAmount = diff/2;
					}
					else if(handleIndx === 2) {
						$otherResizer = $resizeHandle.eq(1);
						$panels = $panel.eq(3);

						panelDragAmount = diff;
						otherPanelsDragAmount = dragAmount/2;
					}

					$otherPanels = $panel.filter(function(i) {return i != $panels.index() && i > 0});

					var offset = $otherPanels.eq(0).position().left + $otherPanels.eq(0).outerWidth();

          $panels.css('flex', '0 0 ' + panelDragAmount + 'px');
         	$otherPanels.css('flex', '0 0 ' + otherPanelsDragAmount + 'px');
					$otherResizer.css('left', offset);
        }
        else if(axis === 'y') {
          diff = containmentHeight - dragAmount;
          $top.css('height', dragAmount);
          $otherResizer.css('height', diff);
          $bottom.css('height', diff);
        }
			}
    }
    var onDragEnd = function(e) {
      $(window).trigger('onResizePanels');
    }

    self.init = function() {
      // setup
      currentLayout = self.getCurrentLayout();
      setDragOptions(currentLayout, $container, $resizeHandle);
      containmentHeight = $(selector.outer, $container).height();
      containmentWidth = $(selector.outer, $container).width();

			$resizeHandle.each(function(i) {
				$(this).data('index', $(this).index());
			});

      // bind events
      $resizeHandle.on('dragMove', onDrag);
      $resizeHandle.on('dragEnd', onDragEnd);

      $window.on('onResizeEnd', function() {
        self.reset();
        containmentHeight = $(selector.outer, $container).height();
        containmentWidth = $(selector.outer, $container).width();
      });

      $toggleLayoutBtn.on('click', toggleLayout);
      $toggleFullScreenBtn.on('click', toggleFullScreen);
   	};

    self.getCurrentLayout = function() {
      if($container.attr('data-layout')) {
        return $container.attr('data-layout');
      }
      else {
        console.log('cannot find attr data-layout');
      }
    }

    self.reset = function() {
      $panel.removeAttr('style');
      $resizeHandle.removeAttr('style').removeClass('active');
			$(window).trigger('onResizePanels');
      containmentHeight = $(selector.outer, $container).height();
      containmentWidth = $(selector.outer, $container).width();
    }

    self.update = function() {
      currentLayout = self.getCurrentLayout();
      setDragOptions(currentLayout, $container, $resizeHandle);
    }

    self.destroy = function() {
      $resizeHandle.draggabilly('destroy');
      $(window).off('onResizePanels');
      $toggleLayoutBtn.off('click');
      $toggleFullScreenBtn.off('click');
    }

    self.init();
  };

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + pluginName )) {
          $.data(this, 'plugin_' + pluginName ,
          new ResizablePanels( this, options));
      }
		});
	};

})( jQuery, window, document );
