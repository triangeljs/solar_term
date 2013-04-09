$(function(){
	var clientW = document.body.clientWidth;
	var clientH = document.body.clientHeight;
	var jq = ['立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至','小寒','大寒'];
	var curDeg = 0;
	var cur = 0;
	var clientW = document.body.clientWidth;
	var clientH = document.body.clientHeight;
	var startX,EndX;
	
	var step1 = function() {
		// init
		var Template = _.template($("#synopsisTemplate").html());
		$('#wrapper').html(Template);
		
		// animate
		$('#synopsis h1, #synopsis div').css({ '-webkit-transform': 'translate(0px,-40px)', 'opacity': '1' });
		$('#synopsis p').css({ 'opacity': '1' });
		$('#synopsis p').on('mouseup touchend', synopsisOut);
		
		// event
		function synopsisOut(e) {
			$('#synopsis').on('webkitTransitionEnd', function(){
				step2();
			});
			$('#synopsis').css({ '-webkit-transition-duration': '0.5s', '-webkit-transform': 'translate(0px,-60px)', 'opacity': '0' });
		}
	};
	
	var step2 = function() {
		// init
		var Template = _.template($("#info1Template").html());
		$('#wrapper').html(Template);
		
		// animate
		$('#info1').css({ '-webkit-transform': 'scale(1,1)' });
		$('#info1 h1, #info1 h2, #info1 h3').css({ '-webkit-transform': 'translate(0px,-40px)', 'opacity': '1' });
		window.setTimeout(function(){
			$('#info1 h1, #info1 h2, #info1 h3').css({ '-webkit-transform': 'translate(0px,-60px)', 'opacity': '0' });
			$('#info1 h3').on('webkitTransitionEnd', function(){
				step3();
			});
		},3000)
	};
	
	var step3 = function() {
		// init
		var Template = _.template($("#info2Template").html());
		$('#wrapper').html(Template);
		
		// animate
		$('#info2 h1, #info2 h2, #info2 h3, #info2 h4').css({ '-webkit-transform': 'translate(0px,-40px)', 'opacity': '1' });
		window.setTimeout(function(){
			$('#info2 h1, #info2 h2, #info2 h3, #info2 h4').css({ '-webkit-transform': 'translate(0px,-60px)', 'opacity': '0' });
			$('#info2 h4').on('webkitTransitionEnd', function(){
				$('#info2 h4').off('webkitTransitionEnd');
				step4();
			});
		},3000)
	}
	
	var step4 = function() {
		// init
		var Template = _.template($("#discTemplate").html());
		$('#wrapper').remove();
		$('body').prepend(Template);
		//$('body').append('<div id="coverBox"></div>');
		var temp = [];
			for(var i=0,len=jq.length; i<len; i++){
				temp.push('<span style="-webkit-transform: rotate(' + i * 15 + 'deg);">'+ jq[i] +'</span>'); 
			}
			
		// animate
		window.setTimeout(function(){
			$('#disc').css({ '-webkit-transform': 'scale(0.2,0.2)' });
		},10)
		window.setTimeout(function(){
			$('#disc').prepend(temp.join(''));
			$('#beautifyDisc').css({ '-webkit-transform': 'scale(1,1)', 'opacity': '1' })
			//$('#disc').css({ '-webkit-transform': 'scale(1,1) rotate(90deg)', 'background-image': 'url(/solar_term/images/b_5.gif)' })
			$('#disc').css({ '-webkit-transform': 'scale(1,1)', 'background-image': 'url(/solar_term/images/b_5.gif)' })
			$('#triangle-up').css({ '-webkit-transform': 'translate(0px,-20px)', 'opacity': '1' })
			
			$('#triangle-up').on('webkitTransitionEnd', function(){
				$('#triangle-up').off('webkitTransitionEnd');
				step5();
			});
		},700)
		
		var step5 = function() {
			$('#discBox').css({'-webkit-transform': 'translate(0px, ' + (clientH / 2) + 'px)'});
			$('#discBox').on('webkitTransitionEnd', function(e){
				$(this).off('webkitTransitionEnd');
				
				$('#discBox').css({
					'-webkit-transition-duration': '0.5s',
					'-webkit-transform': 'translate(0px, ' + (clientH / 2) + 'px) scale(0.3,0.3)'
				})
				step6();
				
				//事件绑定
				$('#beautifyDisc').on('mouseup touchend', discOut);
				$('#disc span').on('mouseup touchend', discOpt);
				$('#coverBox').on('mouseup touchend', coverBoxOut);
			})
		}
		
		var step6 = function() {
			var Template = _.template($("#itemTemplate").html());
			var w = (clientW - 680) / 2;
			var h = (clientH - 768) / 2
			$('#itemBox').html(Template).show().css({ 'left': w, 'top': h });
			$('body').css({ 'background-image': 'none' })
		}
	}
	
	//启动
	var run = function() {
		step4();
	};
	run();
	
	//节气菜单唤出
	function discOut(e) {
		$('#coverBox').show();
		$('#discBox').off('webkitTransitionEnd');
		$('#discBox').css({ '-webkit-transform': 'translate(0px, ' + (clientH / 2) + 'px) scale(1,1)' });
	}
	
	//节气菜单退出
	function coverBoxOut(e) {
		$('#coverBox').hide();
		$('#discBox').css({ '-webkit-transform': 'translate(0px, ' + (clientH / 2) + 'px) scale(0.3,0.3)' });
	}
	
	//节气操作
	function discOpt(e) {
		var ring = Math.ceil(curDeg / 360);
		startX = getMouse(e);
		var next = $(this).index() + (24 * ring);
		if(startX > (clientW / 2)){
			curDeg = curDeg - (next - cur) * 15;
			$('#disc').css({ '-webkit-transform': 'scale(1,1) rotate('+ curDeg +'deg)' })
			cur = next;
			console.log('curDeg:' + curDeg)
			console.log('next' + next)
			console.log('cur' + cur)
			console.log('ring' + ring)
		}
	}
	
	//获取鼠标位置
	function getMouse(e){
		var mouse;
		var eDown = e.originalEvent.targetTouches || e.originalEvent.changedTouches;
		if (!! eDown) {
			mouse = eDown[0].pageX;
		} else {
			mouse = e.clientX;
		}
		return mouse;
	}
});