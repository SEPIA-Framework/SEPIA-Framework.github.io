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
	
	//On resize
	$(window).resize(function() {
		updateScreen();
	});
	updateScreen();
	
	//Initialize pop-up windows
	$('.popup-button').each(function(){
		var btn = this;
		$(btn).on('click', function(event){
			event.preventDefault();
			var popupId = btn.getAttribute("data-window-id");
			$('#' + popupId).fadeIn(300);
		});
	});
	
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
	var pAnimOptions = {pixelDuration: 250};
	$('.info-box').each(function(){
		var scrollAnim = new scrollEffects.CustomAction('site-main-views', this, pAnimOptions, function(data){
			//console.log(JSON.stringify(data));
			var vis = Math.max(data.visibility, 0.20);
			var styles = {
				transition: "opacity 0.25s",
				opacity: vis
			};
			$(data.target).css(styles);
		});
	});
	var kwAnimOptions = {pixelDuration: 150};
	$('.topic-keywords').each(function(){
		$(this).css({
			color: "#888"
		});
		var scrollAnim = new scrollEffects.CustomAction('site-main-views', this, kwAnimOptions, function(data){
			//console.log(JSON.stringify(data));
			if (data.visibility == 1.0){
				data.clearScrollEvent();
				var styles = {
					transition: "color 3.0s",
					color: "#ceff1a"
				};
				$(data.target).css(styles);
			}
		});
	});
	var imgAnimOptions = {pixelDuration: 150};
	$('.topic-images').each(function(){
		$(this).css({
			transform: "scaleX(0.001)"
		});
		var scrollAnim = new scrollEffects.CustomAction('site-main-views', this, imgAnimOptions, function(data){
			//console.log(JSON.stringify(data));
			if (data.visibility == 1.0){
				data.clearScrollEvent();
				var styles = {
					transition: "transform 0.5s ease-in-out",
					transform: "scaleX(1.0)"
				};
				$(data.target).css(styles);
			}
		});
	});
	
	//Scroll-indicator
	document.getElementById('welcome-scroll-indicator').addEventListener("click", function(){
		//var elmnt = document.getElementsByClassName('info-box');
		//elmnt[0].scrollIntoView();
		$('#site-main-views').animate({
			scrollTop: $('.info-box').first().position().top - 50
		}, 300);
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

//Close pop-up windows
function closePopup(closeBtnEle){
	$(closeBtnEle).closest(".site-popup").fadeOut(150);
}