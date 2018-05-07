var Tools = new Object();
if (build_text_effects) build_text_effects(Tools);
if (build_scroll_effects) build_scroll_effects(Tools);

//Settings
var usesTouch = false;
var showTopBar = false;

//Start
window.onload = function() {
	//Check for touch event
	window.addEventListener('touchstart', function onFirstTouch() {
		//add touch-device class, set state, remove listener
		document.body.classList.add('touch-device');
		usesTouch = true;
		window.removeEventListener('touchstart', onFirstTouch, false);
		console.log('Uses touch events');
	}, false);
	
	//on resize
	$(window).resize(function() {
		updateScreen();
	});
	updateScreen();
	
	//Create text effects
	var textEffects = new Tools.TextEffects();
	textEffects.autoLoad();
	
	//Create scroll effects
	var scrollEffects = new Tools.ScrollEffects();
	var topBarScrollAnim = new scrollEffects.CustomAction('site-main-views', 'welcome-logo', null, function(data){
		if (!showTopBar){
			if (data.visibility == 0){
				showTopBar = true;
				$("#site-top-bar").removeClass('hide');
				$("#welcome-scroll-indicator").fadeOut(300);
			}
		}else{
			if (data.visibility == 1.0){
				showTopBar = false;
				$("#site-top-bar").addClass('hide');
				$("#welcome-scroll-indicator").fadeIn(300);
			}
		}
	});
	var pAnimOptions = {pixelDuration: 150};
	$('.info-box').each(function(){
		var scrollAnim = new scrollEffects.CustomAction('site-main-views', this, pAnimOptions, function(data){
			//console.log(JSON.stringify(data));
			var styles = {
				transition: "opacity 0.25s",
				opacity: data.visibility
			};
			$(data.target).css(styles);
		});
	});
	
	//Fullscreen mode
	document.getElementById('welcome-logo').addEventListener("click", function(){
		enterFullscreen();
	});
	document.getElementById('top-bar-logo').addEventListener("click", function(){
		enterFullscreen();
	});
};

//Update some screen elements
function updateScreen(){
	//welcome box
	$('.welcome-box').css("min-height", $(window).height());
}

//Switch to fullscreen
function enterFullscreen(element){
	if (!element){
		element = document.documentElement;
	}
	if(element.requestFullscreen){
		element.requestFullscreen();
	}else if(element.mozRequestFullScreen){
		element.mozRequestFullScreen();
	}else if(element.msRequestFullscreen){
		element.msRequestFullscreen();
	}else if(element.webkitRequestFullscreen){
		element.webkitRequestFullscreen();
	}
}