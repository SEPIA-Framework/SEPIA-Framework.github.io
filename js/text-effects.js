//TEXT EFFECTS
function build_text_effects(ParentObj){
	ParentObj.TextEffects = function(){
	
		//Inject required CSS to body
		var css = document.createElement("style");
		css.type = "text/css";
		css.innerHTML = ".text-effects-typing > .wrap { border-right: 0.08em solid #666 }";
		document.body.appendChild(css);
		
		//AUTO-LOAD with DOM data:
		
		//Get all elements and create animations
		this.autoLoad = function(){
			var elements = document.getElementsByClassName('text-effects-typing');
			for (var i=0; i<elements.length; i++) {
				var toType = elements[i].getAttribute('data-type');
				var period = elements[i].getAttribute('data-period');
				if (toType) {
					new this.TypeAnimation(elements[i], JSON.parse(toType), period);
				}
			}
		}

		//ANIMATIONS:
		
		//Typing animation
		this.TypeAnimation = function(elOrId, toType, period) {
			if (typeof elOrId === "string"){
				this.el = document.getElementById(elOrId);
			}else{
				this.el = elOrId;
			}
			this.toType = toType;
			this.loopNum = 0;
			this.period = parseInt(period, 10) || 2000;
			this.txt = '';
			this.tick();
			this.isDeleting = false;
		};

		this.TypeAnimation.prototype.tick = function() {
			var i = this.loopNum % this.toType.length;
			var fullTxt = this.toType[i];

			if (this.isDeleting) {
				this.txt = fullTxt.substring(0, this.txt.length - 1);
			} else {
				this.txt = fullTxt.substring(0, this.txt.length + 1);
			}

			this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

			var that = this;
			var delta = 300 - Math.random() * 100;

			if (this.isDeleting) { delta /= 2; }

			if (!this.isDeleting && this.txt === fullTxt) {
				delta = this.period;
				this.isDeleting = true;
			} else if (this.isDeleting && this.txt === '') {
				this.isDeleting = false;
				this.loopNum++;
				delta = 500;
			}

			setTimeout(function() {
				that.tick();
			}, delta);
		};
	}
}