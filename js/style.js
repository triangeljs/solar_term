$(function(){
	var clientW = document.body.clientWidth;
	var clientH = document.body.clientHeight;
	var jq = ['立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至','小寒','大寒'];
	var curDeg = 0;
	var cur = 0;
	var startX,EndX;
	
	var step1 = function() {
		// init
		var Template = _.template($("#synopsisTemplate").html());
		$('#wrapper').html(Template);
		
		// animate
		$('#synopsis h1, #synopsis div').css({ '-webkit-transform': 'translate3d(0px,-40px,0px)', 'opacity': '1' });
		$('#synopsis p').css({ 'opacity': '1' });
		$('#synopsis p').on('mouseup touchend', synopsisOut);
		
		// event
		function synopsisOut(e) {
			e.preventDefault();
			e.stopPropagation();
			$('#synopsis').on('webkitTransitionEnd', function(){
				step2();
			});
			$('#synopsis').css({ '-webkit-transition-duration': '0.5s', '-webkit-transform': 'translate3d(0px,-60px,0px)', 'opacity': '0' });
		}
	};
	
	var step2 = function() {
		// init
		var Template = _.template($("#info1Template").html());
		$('#wrapper').html(Template);
		
		// animate
		$('#info1').css({ '-webkit-transform': 'scale3d(1,1,1)' });
		$('#info1 h1, #info1 h2, #info1 h3').css({ '-webkit-transform': 'translate3d(0px,-40px,0px)', 'opacity': '1' });
		window.setTimeout(function(){
			$('#info1 h1, #info1 h2, #info1 h3').css({ '-webkit-transform': 'translate3d(0px,-60px,0px)', 'opacity': '0' });
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
		$('#info2 h1, #info2 h2, #info2 h3, #info2 h4').css({ '-webkit-transform': 'translate3d(0px,-40px,0px)', 'opacity': '1' });
		window.setTimeout(function(){
			$('#info2 h1, #info2 h2, #info2 h3, #info2 h4').css({ '-webkit-transform': 'translate3d(0px,-60px,0px)', 'opacity': '0' });
			$('#info2 h4').on('webkitTransitionEnd', function(){
				$('#info2 h4').off('webkitTransitionEnd');
				step4();
			});
		},3000)
	}
	
	var step4 = function() {
		// init
		var Template = _.template($("#discTemplate").html());		
		$('#wrapper').html(Template).attr('id','discWrapper');
		var temp = [];
		for(var i=0,len=jq.length; i<len; i++){
			temp.push('<span style="-webkit-transform: rotate(' + i * 15 + 'deg);">'+ jq[i] +'</span>'); 
		}
		
		// animate
		window.setTimeout(function(){
			$('#disc').css({ '-webkit-transform': 'scale3d(0.2,0.2,0.2)' });
		},10)
		window.setTimeout(function(){
			$('#disc').prepend(temp.join(''));
			$('#beautifyDisc').css({ '-webkit-transform': 'scale3d(1,1,1)', 'opacity': '1' })
			$('#disc').css({ '-webkit-transform': 'scale3d(1,1,1)' }).addClass('bgXg')
			$('#triangle-up').css({ '-webkit-transform': 'translate3d(0px,-20px,0px)', 'opacity': '1' })
			
			$('#triangle-up').on('webkitTransitionEnd', function(){
				$('#triangle-up').off('webkitTransitionEnd');
				step5();
			});
		},700)
		
		var step5 = function() {
			$('#discBox').css({'-webkit-transform': 'translate3d(0px, ' + (clientH / 2) + 'px,0px)'});
			$('#discBox').on('webkitTransitionEnd', function(e){
				$(this).off('webkitTransitionEnd');
				
				$('#discBox').css({
					'-webkit-transition-duration': '0.5s',
					'-webkit-transform': 'translate3d(0px, ' + (clientH / 2) + 'px,0px) scale3d(0.3,0.3,0.3)'
				})
				step6();
				
				//事件绑定
				$('#beautifyDisc').on('mouseup touchend', discOut);
				$('#coverBox').on('mouseup touchend', coverBoxOut);
			})
		}
		
		var step6 = function() {
			var Template = _.template($("#itemTemplate").html());
			var w = (clientW - $('#itemBox').width()) / 2;
			var h = (clientH - $('#itemBox').height()) / 2;
			$('#itemBox').html(Template).show().css({ 'left': w, 'top': h });
			$('body').css({ 'background-image': 'none' });
			
			//调整正文位置
			var curInt = 0;
			$('.itemDoc div:first').css({ '-webkit-transform': 'translate3d('+ (clientW - 680)/2 +'px,0px,0px)', 'opacity': '1' });
			$('.itemDoc div:gt(0)').css({ '-webkit-transform': 'translate3d('+ clientW +'px,0px,0px)', 'opacity': '0' });
			$('.itemNav li').on('mouseup touchend',function() {
				var idx = $(this).index();
				$(this).addClass('cur').siblings('li').removeClass('cur');
				jqTab(curInt,idx);
				curInt = idx;
			})
			
			/*正文滚动开始*/
			var ts = 0;
			$('#itemBox div').on('touchstart', function(e) {
				var tEvt = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				ts = tEvt.pageY;
			});
			
			$('#itemBox div').on('touchmove', function(e) {
				var tEvt = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				var st = $(this).scrollTop();
				$(this).scrollTop(st - tEvt.pageY + ts);
				ts = tEvt.pageY;
			});
			/*正文滚动结束*/
		}
	}

	//禁止滑动
	function forbidMove(e) {
		e.preventDefault();
		e.stopPropagation();
	}
	
	//节气菜单唤出
	function discOut(e) {
		e.preventDefault();
		e.stopPropagation();
		$('#coverBox').show();
		$('#disc span').on('mouseup touchend', discOpt);
		$('#discBox').css({ '-webkit-transform': 'translate3d(0px, ' + (clientH / 2) + 'px,0px) scale3d(1,1,1)' });
	}
	
	//节气菜单退出
	function coverBoxOut(e) {
		e.preventDefault();
		e.stopPropagation();
		$('#coverBox').hide();
		$('#disc span').off('mouseup touchend');
		$('#discBox').css({ '-webkit-transform': 'translate3d(0px, ' + (clientH / 2) + 'px,0px) scale3d(0.3,0.3,0.3)' });
	}
	
	//节气操作
	function discOpt(e) {
		e.preventDefault();
		e.stopPropagation();
		var nextInt = $(this).index();
		curDeg += discArray(cur, nextInt);
		cur = nextInt;
		$('#disc').css({ '-webkit-transform': 'scale3d(1,1,1) rotate('+ curDeg +'deg)' });
		nextInt = null;
		addDeg = null;
	}
	
	//获取转盘运动
	function discArray(curInt,nextInt) {
		var solar = [];
		solar.push(curInt);
		for(var i=1;i<13;i++) {
			solar.push((curInt + i > 23) ? ((curInt + i) % 24) : (curInt + i));
			solar.unshift((curInt - i < 1) ? ((curInt - i + 24) % 24) : (curInt - i));
		}
		solar.pop();
		console.log(solar);
		for(var i=0,len=solar.length;i<len;i++) {
			if(solar[i]==nextInt) { solar = null; return (12 - i) * 15; }
		}
		solar = null;
		return 0;
	}
	
	//节气4个选项
	function jqTab(curInt,nextInt) {
		//console.log('curInt:' + curInt);
		$('.itemDoc div:eq('+ curInt +')').siblings('div').css({ '-webkit-transition-duration': '0s', '-webkit-transform': 'translate3d('+ clientW +'px,0px,0px)', 'opacity': '0' });
		
		$('.itemDoc div:eq('+ curInt +')').css({ '-webkit-transition-duration': '0.5s', '-webkit-transform': 'translate3d(-' + (clientW / 2 + 680) + 'px,0px,0px)', 'opacity': '0' });
		$('.itemDoc div:eq('+ nextInt +')').css({ '-webkit-transition-duration': '0.5s', '-webkit-transform': 'translate3d(' + (clientW - 680) / 2 + 'px,0px,0px)', 'opacity': '1' });
		
		/*
		$('.itemDoc div:eq('+ curInt +')').on('webkitTransitionEnd', function(e){
			$(this).off('webkitTransitionEnd');
		})
		
		$('.itemDoc div:eq('+ nextInt +')').on('webkitTransitionEnd', function(e){
			$(this).off('webkitTransitionEnd');
		})
		*/
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
	
	//启动
	var run = function() {
		$(document).on('touchmove',forbidMove);
		step4();
	};
	run();
});