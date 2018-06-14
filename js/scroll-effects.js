//SCROLL EFFECTS
function build_scroll_effects(ParentObj){
	ParentObj.ScrollEffects = function(){
		
		//ANIMATIONS:
		
		//Use data in callback to make custom action
		this.CustomAction = function(scrollAreaIdOrEle, targetIdOrEle, options, callback){
			var scrollArea;
			var targetEle;
			if (typeof scrollAreaIdOrEle === "string"){
				scrollArea = document.getElementById(scrollAreaIdOrEle);
			}else{
				scrollArea = scrollAreaIdOrEle;
			}
			if (typeof targetIdOrEle === "string"){
				targetEle = document.getElementById(targetIdOrEle);
			}else{
				targetEle = targetIdOrEle;
			}
			//check requirements
			if (!scrollArea || !targetEle || !callback){
				return;
			}
			if (!options) options = {};
			var pixelDuration = options.pixelDuration || 0;
			
			//animation or action
			function submitData(){
				var areaHeight = jQuery(scrollArea).height();
				var scrolled = jQuery(scrollArea).scrollTop();
				var realHeight = jQuery(targetEle).height();
				var heightOffset = (pixelDuration)? (pixelDuration - realHeight) : 0;
				var elementHeight = realHeight + heightOffset;
				var elementOffsetTop = jQuery(targetEle).offset().top;
				var fromBottom = areaHeight - elementOffsetTop - elementHeight;
				var visPixelFromBottom = (fromBottom < 0)? (fromBottom + elementHeight) : elementHeight;
				var fromTop = elementOffsetTop - heightOffset;
				var visPixelFromTop = (fromTop < 0)? (fromTop + elementHeight) : elementHeight;
				var percentVisibleTop = (visPixelFromTop > 0)? (visPixelFromTop/elementHeight) : 0;
				var percentVisibleBottom = (visPixelFromBottom > 0)? (visPixelFromBottom/elementHeight) : 0;
				var threshh = 1.0;
				//console.log('id: ' + this.id + ', areaHeight: ' +areaHeight+ ', scrolled: ' +scrolled+ ', elementHeight: ' +elementHeight+ ', elementOffsetTop: ' +elementOffsetTop);
				//console.log('id: ' + this.id + ', fromBottom: ' +fromBottom + ', fromTop: ' +fromTop+ ', visTop: ' +percentVisibleTop+ ', visBottom: ' +percentVisibleBottom+ ', scrolled: ' +scrolled);
				callback({
					scrolled: scrolled,
					target: targetEle,
					targetHeight: realHeight,
					distanceTop: (fromTop + heightOffset),
					distanceBottom: (fromBottom + heightOffset),
					visibilityTop: percentVisibleTop,
					visibilityBottom: percentVisibleBottom,
					visibility: Math.min(percentVisibleTop, percentVisibleBottom),
					clearScrollEvent: clearScroll
				});
			}
			
			//listen to scroll
			var scrollHandler = function(){
				submitData();
			}
			jQuery(scrollArea).scroll(scrollHandler);
			
			//remove listener
			var clearScroll = function(){
				jQuery(scrollArea).off("scroll", scrollHandler);
			}
			
			//init
			submitData();
		}
	}
}