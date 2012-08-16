/*
*
* jmFullWall.js
* DEVELOPED BY
* MORENO DI DOMENICO
* www.moretech.it
* moreno@moretech.it
* 05 Aug 2011
*
*
* http://www.moretech.it/demo/plugins/jmFullWall
*
*/

(function($){

  // declare plugin name
  $.fn.jmFullWall = function( options ) {
  
  		// declare default options
        var defaults = {
			/** options **/
			'itemTransition'	       : 'fadeIn',
			'itemTransitionSpeed'      : 200,
			'itemsForRow' 		       : 5,
			'itemsBtnNext'		       : 'jmFullWall-next',
			'itemsBtnPrev'		       : 'jmFullWall-prev',
			'itemsBtnClose'		       : 'jmFullWall-close',
			'detailTransitionIn'  	   : 'fadeIn',
			'detailTransitionInSpeed'  : 500,
			'detailTransitionOut'  	   : 'fadeOut',
			'detailTransitionOutSpeed' : 500,
			'showTooltip'			   : true,
			'imgPanning'			   : true,
			'imgPanningCenter'	       : true,
			'imgPanningZoom'	       : true
			
		}


		options = $.extend(defaults, options);
		var $this;

		/* constants */
		var wall_top = "#wall-top";
		var wall_top_height = parseInt($(wall_top).css('height'));
		
		
		var wall_container = "#wall-container";
		var wall_container_w;
		var wall_container_h;

		var wall_loading = "#wall-loading";

		var wall_detail = "#wall-detail";
		var wall_detail_image_container = '.wall-detail-image';
		var wall_detail_controls_container = '.wall-detail-controls';
		var wall_detail_info = '.wall-detail-info';

		var wall = "#wall";
		var wall_rows;

		var wall_items = ".wall-item";
		var wall_items_count = $(wall_items).length;
		var wall_items_for_row = options.itemsForRow;
		
		
		var x = 0;
	

		
		/** set wall & items dimensions **/
		wallDimension = function(resize)
		{
		

			/** get wall width & height **/
			wall_container_w = parseInt( $(window).width() );
			wall_container_h = parseInt( $(window).height()-wall_top_height );
			/** set wall dimensions **/
			$(wall).css({ width : wall_container_w, height : wall_container_h });	
	
			/** calculate wall rows **/
			wall_rows = parseInt(wall_items_count/wall_items_for_row)+1;
			if(wall_items_count % wall_items_for_row == 0) { wall_rows = wall_rows-1 }
			
			/** calculate wall items width **/
			wall_items_w = parseInt(wall_container_w/wall_items_for_row);
			
			/** calculate wall items height **/
			wall_items_h = parseInt(wall_container_h/wall_rows);
			
			$(wall_items).css({'width': wall_items_w, 'height' : wall_items_h});
				if($(wall_detail).is(':visible')){
					setBgImage(0);
			}
			
			/** if window resizing **/
			if ( resize ){
				$(wall_items).css({'width': wall_items_w, 'height' : wall_items_h});
				if($(wall_detail).is(':visible')){
					setBgImage(0);
				}
			}
		}
		


		setItem = function (pos){
			x++;
			if(x > wall_items_count){
				$(wall_loading).fadeOut();
				return;
			}
			
			var $item = $(wall_items).eq(pos);
			
			var item_bg = $item.find(".bg").html();
	
			$.imgpreload(item_bg, function(){
				//$item.append("<img src= '" + item_bg + "' />");
				$item.css({'background-image' : 'url('+ item_bg +')'});
				$item.animate(
					{width : wall_items_w, height : wall_items_h }, 1, function()
						{ 
							switch (options.itemTransition)
							{
								case 'fadeIn' : 
									$item.fadeIn(options.itemTransitionSpeed, function(){
										setItem(x);
									});
								break;
								
								case 'slideDown' : 
									$item.slideDown(options.itemTransitionSpeed, function(){
										setItem(x)
									});
								break;
								
								default : 
									$item.toggle(1, function(){
										setItem(x)
									});
								break;
								
							}
						}
				);
			});
		}


		/** set events on items **/
		itemActions = function()
		{
			a = $(wall_items).find("a");
			
			a.mouseover(function(){
				$(this).find("span.title").show();
			});
	
			a.mouseout(function(){
				$(wall_items).find("span.title").hide();
			});
	
			a.bind('click', function(){
				var $img_detail = $(this).parent(wall_items).find("span.img_detail").html();
				var $text = $(this).parent(wall_items).find("span.tooltip").html();
				$(wall_loading).fadeIn();
				
				var position = $(wall_items).find("a").index(this)+1;
				(position >= wall_items_count) ? next_item = 0 : next_item = position;
				
				position = position-2;
				(position < 0) ? prev_item = (wall_items_count-1) : prev_item = position;
				
				
				$.imgpreload($img_detail, function(){
					var $img = new Image();
					$img.src = $img_detail;
					
					ht = '';
					ht += '<div class="'+wall_detail_controls_container+'">';
					ht += '<a href="#" rel="'+prev_item+'" class="'+options.itemsBtnClose+'"><\/a>';
					ht += '<a href="#" rel="'+prev_item+'" class="'+options.itemsBtnPrev+'"><\/a>';
					ht += '<a href="#" rel="'+next_item+'" class="'+options.itemsBtnNext+'"><\/a>';
					ht += '<span class="'+wall_detail_info.split(".").join('')+'">'+$text+'<\/span>';
					ht += '<\/div>';
					ht += '<div class="'+wall_detail_image_container+'">';
					ht += setBgImage($img.src, $img.width, $img.height);
					ht += '<\/div>';
					
					switch (options.detailTransitionIn)
					{
						case 'fadeIn':
							$(wall_detail).empty().html(ht).fadeIn(options.detailTransitionInSpeed, function(){
									if(options.imgPanning)
									{
										(options.imgPanningCenter) ? $imgOrient = 'center' : $imgOrient = 'top';
										(options.imgPanningZoom)   ? $imgZoom = 'yes' : $imgZoom = 'no';
										$pancontainer = $(wall_detail);
										$this = $pancontainer;
										$this.css('cursor', 'move');
										$img = $this.find('img:eq(0)');
										$options={$pancontainer:$this, pos:$imgOrient, curzoom:1, canzoom:$imgZoom, wrappersize:[$this.width(), $this.height()]};
										$img.imgmover($options);
									}
								
									$(wall_loading).fadeOut(200, function(){
										if(options.showTooltip)
										{
											$(wall_detail).find(wall_detail_info).animate({bottom:20});
										}
									});
							});
						break;
						
						case 'slideDown':
							$(wall_detail).empty().html(ht).slideDown(options.detailTransitionInSpeed, function(){
									if(options.imgPanning)
									{
										(options.imgPanningCenter) ? $imgOrient = 'center' : $imgOrient = 'top';
										(options.imgPanningZoom)   ? $imgZoom = 'yes' : $imgZoom = 'no';
										$pancontainer = $(wall_detail);
										$this = $pancontainer;
										$this.css('cursor', 'move');
										$img = $this.find('img:eq(0)');
										$options={$pancontainer:$this, pos:$imgOrient, curzoom:1, canzoom:$imgZoom, wrappersize:[$this.width(), $this.height()]};
										$img.imgmover($options);
									}
								
									$(wall_loading).fadeOut(200, function(){
										if(options.showTooltip)
										{
											$(wall_detail).find(wall_detail_info).animate({bottom:20});
										}
									});
							});
						break;
						
						default:
							$(wall_detail).empty().html(ht).toggle(1, function(){
									if(options.imgPanning)
									{
										(options.imgPanningCenter) ? $imgOrient = 'center' : $imgOrient = 'top';
										(options.imgPanningZoom)   ? $imgZoom = 'yes' : $imgZoom = 'no';
										$pancontainer = $(wall_detail);
										$this = $pancontainer;
										$this.css('cursor', 'move');
										$img = $this.find('img:eq(0)');
										$options={$pancontainer:$this, pos:$imgOrient, curzoom:1, canzoom:$imgZoom, wrappersize:[$this.width(), $this.height()]};
										$img.imgmover($options);
									}
								
									$(wall_loading).fadeOut(200, function(){
										if(options.showTooltip)
										{
											$(wall_detail).find(wall_detail_info).animate({bottom:20});
										}
									});
							});
						break;
					}
				});

				return false;
			});
			
				
			
			$('.'+options.itemsBtnPrev).live("click", function(){
				prev_items = $(this).attr("rel");
				$(wall_items).find('a').eq(prev_items).trigger('click');
				return false;
			});
			
			$('.'+options.itemsBtnNext).live("click", function(){
				next_items = $(this).attr("rel");
				$(wall_items).find('a').eq(next_items).trigger('click');
				return false;
			});
			
			$('.'+options.itemsBtnClose).live("click", function(){

					switch (options.detailTransitionOut)
					{
						case 'fadeOut':
							$(wall_detail).fadeOut(options.detailTransitionOutSpeed, function(){
								$(this).empty();
							});
						break;
						
						case 'slideUp':
							$(wall_detail).slideUp(options.detailTransitionOutSpeed, function(){
								$(this).empty();
							});
						break;
						
						default:
							$(wall_detail).toggle(1, function(){
								$(this).empty();
							});
						break;
					}


				$(wall_detail).fadeOut(200, function(){
					$(this).empty();
				});
				return false;
			});
			

		}
		
		
		/** resizing image in detail div**/
		setBgImage = function(img, w, h)
		{
			if(img != 0){
				img_src = img;
				img_w = w;
				img_h = h;
			}
			
			var w_ratio = wall_container_w / img_w;
			var h_ratio = wall_container_h / img_h;
			
			var w_diff = h_ratio * img_w;
			var h_diff = w_ratio * img_h;
			
			var image;
			if(h_diff>wall_container_h) {
				image = '<img src="'+img_src+'" width="'+wall_container_w+'" height="'+h_diff+'" class="imgZoom" />';
				new_w = wall_container_w;
				new_h = h_diff;
			} 
			else
			{
				image = '<img src="'+img_src+'" width="'+w_diff+'" height="'+wall_container_h+'" class="imgZoom" />';
				new_w = w_diff;
				new_h = wall_container_h;
			}

			if(img!=0)
			{
				return image;	
			}
			
			else{
				$('.imgZoom').css('width', new_w);
				$('.imgZoom').css('height', new_h);
			}
			
		}
		
		
		
		/** wall creation **/
		createWall = function()
		{
			/** set wall dimensions **/
			wallDimension(1);
			
			/** cycling items **/
			setItem(0);
			
			/** events on items **/
			itemActions();

			/** if resizing **/
			$(window).resize(function(){
				 wallDimension(1);	
			});
		}
		
		
		
		// cycling all elements
		return this.each(function(){
			 $this = $(this);
			 createWall();
		});

  };
})(jQuery);