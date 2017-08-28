var init = {
	start:function(){
		this.screen();
		this.wheel();
		this.resize();
		this.navClick();
		var wrap = document.querySelector('.work-wrap');
		var pre = document.querySelector('.pre-page');
		var next = document.querySelector('.next-page');
		var box = wrap.querySelector('.work-box');
		var lis = box.querySelectorAll('li'),
			lisLength = lis.length;
		var moveLeft = lis[0].offsetWidth;
		var widths = moveLeft * lisLength;
		box.style.width = widths+'px';
		for(var i=0;i<lisLength;i++){
			lis[i].index = i;
		};
		var cIndex = 0;
		var self = this;
		this.addEvent(next,'click',function(){
			cIndex ++;
			workMove(cIndex);
		});
		this.addEvent(pre,'click',function(){
			cIndex --;
			workMove(cIndex);
		});
		function workMove(index) {
			if(index <0){
				cIndex = 0;
			}else if(index > (lisLength-1)){
				cIndex = lisLength-1;
			}
			self.doMove({
				el:box,
				attr:'left',
				dir:15,
				dis:-moveLeft*cIndex,
				time:10
			})
		}
	},
	currentIndex:0,
	preIndex:0,
	screen:function(){
		var Width = document.documentElement.offsetWidth;
		var Height = document.documentElement.offsetHeight;
		var wrap = document.querySelector('.wrap');
		var screen = document.querySelectorAll('.screen'),
			screenLength = screen.length;
		for(var i=0; i<screenLength; i++){
			screen[i].style.width = Width+'px';
			screen[i].style.height = Height+'px';
		}
	},
	resize:function(){
		var self = this;
		window.onresize = function(){
			var timer = null;
			var wrap = document.querySelector('.wrap');
			var Height = document.documentElement.offsetHeight;
			var nav = document.querySelector('.nav'),
			navs = nav.querySelectorAll('a'),
			navL = navs.length;
			for(var i=0;i<navL;i++){
				if(self.hasClass(navs[i],'active')){
					self.currentIndex = -i;
				}
			}
			timer = setTimeout(function(){
				self.screen();
				wrap.style.top = (Height*self.currentIndex)+'px';
			},30);
		}
	},
	wheel:function(){
		var self = this;
		var mousewheel=(/Firefox/i.test(navigator.userAgent))?"DOMMouseScroll": "mousewheel";
		this.addEvent(document,mousewheel,function(e){
			e = e || window.event;
			var delta =event.detail ?-event.detail/3 : event.wheelDelta/120;
			var currentIndex = self.currentIndex;
			currentIndex += delta;
			self.wrapMove(currentIndex);
			/*var Height = document.documentElement.offsetHeight;
			var cLoation = self.css(wrap,'top');
			if(cLoation == Height*self.preIndex ){
				self.currentIndex = currentIndex;
				if(self.currentIndex > 0){
					self.currentIndex = 0;
				}else if(self.currentIndex < -3){
					self.currentIndex = -3;
				}
				self.doMove({
					el:wrap,
					attr:'top',
					dir:10,
					dis:Height*self.currentIndex,
					time:10,
					callback:function(){
						self.removeClass(navs[-self.preIndex],'active');
						self.addClass(navs[-self.currentIndex],'active');
						self.preIndex = self.currentIndex;
					}
				});
			}*/
		});
	},
	navClick:function(){
		var wrap = document.querySelector('.wrap');
		var nav = document.querySelector('.nav'),
			navs = nav.querySelectorAll('a'),
			navL = navs.length;
		var self = this;
		for(var i=0;i<navL;i++){
			navs[i].index = i;
			self.addEvent(navs[i],'click',function(){
				self.wrapMove(-this.index);
				/*var Height = document.documentElement.offsetHeight;
				var cLoation = self.css(wrap,'top');
				if(cLoation == Height*self.preIndex ){
					self.currentIndex = -this.index;
					if(self.currentIndex > 0){
						self.currentIndex = 0;
					}else if(self.currentIndex < -3){
						self.currentIndex = -3;
					}
					self.doMove({
						el:wrap,
						attr:'top',
						dir:10,
						dis:Height*self.currentIndex,
						time:10,
						callback:function(){
							self.removeClass(navs[-self.preIndex],'active');
							self.addClass(navs[-self.currentIndex],'active');
							self.preIndex = self.currentIndex;
						}
					});
				}*/
			})
		}
	},
	wrapMove:function(newIndex){
		var self = this;
		var wrap = document.querySelector('.wrap');
		var nav = document.querySelector('.nav'),
			navs = nav.querySelectorAll('a'),
			navL = navs.length;
		var Height = document.documentElement.offsetHeight;
		var cLoation = this.css(wrap,'top');
		if(cLoation == Height*this.preIndex ){
			this.currentIndex = newIndex;
			if(this.currentIndex > 0){
				this.currentIndex = 0;
			}else if(this.currentIndex < -(navL-1)){
				this.currentIndex = -(navL-1);
			}
			this.doMove({
				el:wrap,
				attr:'top',
				dir:10,
				dis:Height*this.currentIndex,
				time:10,
				callback:function(){
					if(-self.currentIndex%2){
						self.addClass(nav,'nav-back');
					}else{
						self.removeClass(nav,'nav-back');
					}
					self.removeClass(navs[-self.preIndex],'active');
					self.addClass(navs[-self.currentIndex],'active');
					self.preIndex = self.currentIndex;
				}
			});
		}
	},
	doMove: function(init){
		var el = init.el; //绑定dom
		var attr = init.attr; //属性
		var dir = init.dir; //移动方向
		var dis = init.dis; //移动距离
		var self = this;
		dir = self.css(el,attr) < dis ? dir : -dir;
		clearInterval(el.timer); 
		el.timer = setInterval(function(){
			var speed = self.css(el,attr);
			speed += dir;
			if(speed > dis && dir >0 || speed < dis && dir<0){
				speed = dis;
			}
			el.style[attr] = speed +'px';
			if(speed == dis){
				clearInterval(el.timer);
				init.callback && init.callback();
			}
			
		},init.time);
	},
	addEvent:function(el,type,fn){
    	if(el.addEventListener){
    		el.addEventListener(type, fn, false);
    	}else if(el.attachEvent){
    		el.attachEvent('on'+type, fn)
    	}else{
    		el['on'+type] = fn;
    	}
	},
	css:function(el,attr,val){
		if(arguments.length == 2){
			if(el.currentStyle){
				val = el.currentStyle[attr];
			} else {
				val = getComputedStyle(el)[attr];
			}
			if(attr == "opacity"){
				return val*100;
			}
			return parseFloat(val);
		} else {
			if(attr == "opacity"){
				el.style.opacity = val/100;
				el.style.filter = "alpha(opacity= "+val+")";
			} else if(attr == "zIndex"){
				el.style[attr] = Math.round(val);
			}else {
				el.style[attr] = val + "px";
			}
		}
	},
	hasClass:function(el,cls){
		return el.className.match(new RegExp('(\\s|^)'+cls+ '(\\s|$)'));
	},
	addClass:function(el,cls){
		if(!this.hasClass(el,cls)){
			el.className += ' '+ cls;
		}
	},
	removeClass:function(el,cls){
		if(this.hasClass(el,cls)){
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
       		el.className = el.className.replace(reg, ' ');
		}
	}
}

