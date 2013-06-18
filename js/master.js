var curJqId = 0;
var curDeg = 0;

$(function(){
	var clientW = document.body.clientWidth;
	var clientH = document.body.clientHeight;
	
	if(clientW < clientH){
		clientW = document.body.clientHeight;
		clientH = document.body.clientWidth;
	}
	
	window.setTimeout(function(){
		$(document).on('touchmove',forbidMove);
		document.body.scroll = 'no';
		step1();
	},3000)
	
	//开始菜单
	var step1 = function(){
		var Template = _.template($("#synopsisTemplate").html());
		$('#wrap').html(Template);
		$('#synopsis h1, #synopsis div').css({ '-webkit-transform': 'translate3d(0px,-40px,0px)', 'opacity': '1' });
		$('#synopsis p').css({ 'opacity': '1' });
		$('#synopsis p').on('mouseup touchend', synopsisOut);
		
		function synopsisOut(e){
			e.preventDefault();
			e.stopPropagation();
			$('#synopsis div').on('webkitTransitionEnd', function(){
				$(this).off('webkitTransitionEnd');
				step2();
			})
			$('#synopsis p').css({ 'opacity': '0' });
			$('#synopsis h1, #synopsis div').css({ '-webkit-transform': 'translate3d(0px,-60px,0px)', 'opacity': '0' });
		}
	};
	
	//已过去的节气
	var step2 = function(){
		var Template = _.template($("#info1Template").html(),getSolarTerms());
		$('#wrap').html(Template);
		$('#preSolarTerms').css({ '-webkit-transform': 'scale3d(1,1,1)' });
		$('#preSolarTerms h1, #preSolarTerms h2, #preSolarTerms h3').css({ '-webkit-transform': 'translate3d(0px,-40px,0px)', 'opacity': '1' });
		window.setTimeout(function(){
			$('#preSolarTerms h1, #preSolarTerms h2, #preSolarTerms h3').css({ '-webkit-transform': 'translate3d(0px,-60px,0px)', 'opacity': '0' });
			$('#preSolarTerms h3').on('webkitTransitionEnd', function(){
				$(this).off('webkitTransitionEnd');
				step3();
			});
		},3000)
	};
	
	//下一个节气
	var step3 = function(){
		var Template = _.template($("#info2Template").html(),getSolarTerms());
		$('#wrap').html(Template);
		$('#nextSolarTerms h1, #nextSolarTerms h2, #nextSolarTerms h3, #nextSolarTerms h4').css({ '-webkit-transform': 'translate3d(0px,-40px,0px)', 'opacity': '1' });
		window.setTimeout(function(){
			$('#nextSolarTerms h1, #nextSolarTerms h2, #nextSolarTerms h3, #nextSolarTerms h4').css({ '-webkit-transform': 'translate3d(0px,-60px,0px)', 'opacity': '0' });
			$('#nextSolarTerms h4').on('webkitTransitionEnd', function(){
				$(this).off('webkitTransitionEnd');
				$('#nextSolarTerms').css({ '-webkit-transform': 'scale3d(0.2,0.2,0.2)' });
				window.setTimeout(function(){
					step4();
				},500)
			})
		},3000)
	};
	
	//24节气动画
	var step4 = function(){
		var Template = _.template($("#discTemplate").html());
		$('#wrap').html(Template);
		var temp = [];
		for(var i=0,len=solar_term_info.length; i<len; i++){
			temp.push('<span style="-webkit-transform: rotate(' + i * 15 + 'deg);">'+ solar_term_info[i].title +'</span>'); 
		}
		$('#disc').prepend(temp.join(''));
		
		$('#searchBox').css({'left': (clientW - 904) / 2, 'top': '-710px'});
		$('#aboutBox').css({'left': (clientW - 413) / 2, 'top': '-705px'});
		
		$('#beautifyDisc').css({ '-webkit-transform': 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,135,135,0,1)' });
		$('#disc').css({ '-webkit-transform': 'scale3d(1,1,1) rotate('+ curDeg +'deg)', 'opacity': '1' });
		$('#beautifyDisc').on('webkitTransitionEnd', function(){
			$(this).off('webkitTransitionEnd');
			//$('#disc').css({ '-webkit-transform': 'scale3d(1,1,1) rotate('+ curDeg +'deg)', 'opacity': '1' });
			$('#triangle-up').css({ '-webkit-transform': 'translate3d(0px,-20px,0px)', 'opacity': '1' });
		});
		$('#triangle-up').on('webkitTransitionEnd', function(){
			$(this).off('webkitTransitionEnd');
			step5();
		})
	}
	
	//24节气菜单缩小
	var step5 = function(){
		$('#discBox').css({'-webkit-transform': 'translate3d(0px, ' + (clientH / 2) + 'px,0px)'});
		$('#discBox').on('webkitTransitionEnd', function(e){
				$(this).off('webkitTransitionEnd');
				$('#discBox').css({ '-webkit-transition-duration': '0.5s', '-webkit-transform': 'translate3d(0px, ' + (clientH / 2) + 'px,0px) scale3d(0.3,0.3,0.3)' })
				step6();
			})
	}
	
	//显示节气
	var step6 = function(){
		var Template = _.template($("#itemTemplate").html(),jieqiInfo(curJqId));
		$('#item').html(Template);
		jieqiReveal();
		
		$('#coverBox').on('mouseup touchend', coverBoxOut);
		$('#discBox').on('mouseup touchend', discHandle);
		$('#searchBtn').on('mouseup touchend', searchHandle);
		$('#aboutBtn').on('mouseup touchend', aboutHandle);
		$('#solarBtn').on('mouseup touchend', solarBtnHandle);
	}

	//节气菜单唤出
	function discHandle(e) {
		e.preventDefault();
		e.stopPropagation();
		$(this).off('mouseup touchend');
		$('#coverBox').show();
		$('#disc span').on('mouseup touchend', choiceSolarTerm);
		$('#discBox').css({ '-webkit-transform': 'translate3d(0px, ' + (clientH / 2) + 'px,0px) scale3d(1,1,1)' });
	}
	
	//搜索菜单唤出
	function searchHandle(e) {
		e.preventDefault();
		e.stopPropagation();
		getSolarSearch();
		$('#discBox').css({ 'z-index': '60' });
		$('#coverBox').show(0, function() {
			$('#searchBox').css({ '-webkit-transform': 'translate3d(0px, 710px, 0px)' });
		});
	}
	
	//关于我们菜单唤出
	function aboutHandle(e) {
		e.preventDefault();
		e.stopPropagation();
		$('#discBox').css({ 'z-index': '60' });
		$('#coverBox').show(0, function() {
			$('#aboutBox').css({ '-webkit-transform': 'translate3d(0px, 705px, 0px)' });
		});
	}
	
	//背景黑幕退出
	function coverBoxOut(e) {
		e.preventDefault();
		e.stopPropagation();
		$('#discBox').css({ 'z-index': '90' });
		$('#disc span').off('mouseup touchend');
		$('#discBox').on('mouseup touchend', discHandle);
		$('#discBox').css({ '-webkit-transform': 'translate3d(0px, ' + (clientH / 2) + 'px,0px) scale3d(0.3,0.3,0.3)' });
		$('#aboutBox').css({ '-webkit-transform': 'translate3d(0px, 0px, 0px)' });
		$('#searchBox').css({ '-webkit-transform': 'translate3d(0px, 0px, 0px)' });
		$('#coverBox').hide();
	}
	
	//节气查询结果
	function solarBtnHandle(e) {
		e.preventDefault();
		e.stopPropagation();
		var select1 = $("#select1").val();
		var select2 = $("#select2").val();
		for(var i=0; i<solar_term_info.length;i++){
			if(solar_term_info[i].title == select2){
				var myDate = new Date();
				var timestamp = myDate.getTime();
				var upperDate = new Date(select1, solar_term_info[i].riqi[select1]['m'] - 1, solar_term_info[i].riqi[select1]['d']);
				var upperTimeStamp = upperDate.getTime();
				if(timestamp > upperTimeStamp){
					$('#solarInfo').show().html(select1 +'年'+ solar_term_info[i].riqi[select1]['m'] +'月'+ solar_term_info[i].riqi[select1]['d'] +'日');
				}else{
					var a = Math.ceil((upperTimeStamp - timestamp) / 86400000);
					$('#solarInfo').show().html(select1 +'年'+ solar_term_info[i].riqi[select1]['m'] +'月'+ solar_term_info[i].riqi[select1]['d'] +'日，还有'+ a +'天');
				}
			}
		}
	}
	
	//选择24节气
	function choiceSolarTerm(e) {
		e.preventDefault();
		e.stopPropagation();
		var nextInt = $(this).index();
		curDeg += discArray(cur, nextInt);
		cur = nextInt;
		$('#disc').css({ '-webkit-transform': 'scale3d(1,1,1) rotate('+ curDeg +'deg)' });
		$('#disc').on('webkitTransitionEnd', function(){
			$(this).off('webkitTransitionEnd');
			coverBoxOut(e);
			var Template = _.template($("#itemTemplate").html(),jieqiInfo(curJqId));
			$('#item').html(Template);
			jieqiReveal();
		})
	}

	//节气展示
	function jieqiReveal(){
		//调整正文位置
		var curInt = 0;
		$('.itemDoc div:first').css({ '-webkit-transform': 'translate3d('+ (clientW - 700)/2 +'px,0px,0px)', 'opacity': '1' });
		$('.itemDoc div:gt(0)').css({ '-webkit-transform': 'translate3d('+ clientW +'px,0px,0px)', 'opacity': '0' });
		$('.itemNav li').on('mouseup touchend',function() {
			var idx = $(this).index();
			$(this).addClass('cur').siblings('li').removeClass('cur');
			jqTab(curInt,idx);
			curInt = idx;
		})
		
		/*正文操作开始*/
		//正文上下滚动
		var ts = 0;
		var startX,EndX;
		$('#item div').on('touchstart', function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			var tEvt = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			ts = tEvt.pageY;
			startX = tEvt.pageX;
		});
		$('#item div').on('touchmove', function(e) {
			var tEvt = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			var st = $(this).scrollTop();
			$(this).scrollTop(st - tEvt.pageY + ts);
			ts = tEvt.pageY;
		});
		
		//正文左右滚动
		$('#item div').on('mouseup touchend', function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			var tEvt = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			EndX = tEvt.pageX;
			if(EndX > startX && EndX > (startX + 200)) {
				var idx = (curInt - 1 + 4)%4
				var idx = curInt - 1 > -1 ? curInt - 1 : 0;
				jqRightTab(curInt,idx);
				curInt = idx;
			}else if(EndX < startX && EndX < (startX - 200)) {
				//var idx = (curInt + 1)%4;
				var idx = curInt + 1 < 4 ? curInt + 1 : 3;
				jqLeftTab(curInt,idx);
				curInt = idx;
			}
			$('.itemNav li').removeClass('cur');
			$('.itemNav li:eq('+ curInt +')').addClass('cur');
		})
		/*正文操作结束*/
	}
	
	//获取节气信息
	function jieqiInfo(id) {
		var myDate = new Date();
		var year = myDate.getFullYear();
		var cMonth = myDate.getMonth();
		var cDate = myDate.getDate();
		var nMonth = solar_term_info[id].riqi[year]['m'] - 1;
		var nDate = solar_term_info[id].riqi[year]['d'];
		var cTime = Date.UTC(year,cMonth,cDate);
		var nTime = Date.UTC(year,nMonth,nDate);
		var time = (nTime - cTime) / (1000 * 60 * 60 * 24);
		var timeTxt;
		if(nTime - cTime > 0){
			timeTxt = year +'年'+ (nMonth + 1) +'月'+ nDate +'日，还有'+ time +'天';
		}else{
			timeTxt = year +'年'+ (nMonth + 1) +'月'+ nDate +'日，已过';
		}
		
		return { 'title': solar_term_info[id].title, 'jieshao': solar_term_info[id].jieshao.ctn, 'youlai': solar_term_info[id].youlai.ctn, 'xisu': solar_term_info[id].xisu.ctn, 'yangsheng': solar_term_info[id].yangsheng.ctn, 'time': timeTxt }
	}
	
	//获取转盘运动
	function discArray(curInt,nextInt) {
		curJqId = nextInt;
		var solar = [];
		solar.push(curInt);
		for(var i=1;i<13;i++) {
			solar.push((curInt + i > 23) ? ((curInt + i) % 24) : (curInt + i));
			solar.unshift((curInt - i < 1) ? ((curInt - i + 24) % 24) : (curInt - i));
		}
		solar.pop();
		for(var i=0,len=solar.length;i<len;i++) {
			if(solar[i]==nextInt) { solar = null; return (12 - i) * 15; }
		}
		solar = null;
		return 0;
	}
	
	//节气4个选项点击
	function jqTab(curInt,nextInt) {
		//console.log('curInt:' + curInt)
		$('.itemDoc div:lt('+ curInt +')').css({ '-webkit-transition-duration': '0s', '-webkit-transform': 'translate3d('+ clientW +'px,0px,0px)', 'opacity': '0' });
		$('.itemDoc div:gt('+ curInt +')').css({ '-webkit-transition-duration': '0s', '-webkit-transform': 'translate3d('+ clientW +'px,0px,0px)', 'opacity': '0' });
		window.setTimeout(function(){
			$('.itemDoc div:eq('+ curInt +')').css({ '-webkit-transition-duration': '0.3s', '-webkit-transform': 'translate3d(-' + (clientW / 2 + 680) + 'px,0px,0px)', 'opacity': '0' });
			$('.itemDoc div:eq('+ nextInt +')').css({ '-webkit-transition-duration': '0.3s', '-webkit-transform': 'translate3d(' + (clientW - 680) / 2 + 'px,0px,0px)', 'opacity': '1' });
		},200)
	}
	
	//节气4个选项左滚动
	function jqLeftTab(curInt,nextInt) {
		//console.log('curInt:' + curInt)
		if(curInt != nextInt){
			$('.itemDoc div').css({ '-webkit-transition-duration': '0s', '-webkit-transform': 'translate3d('+ clientW +'px,0px,0px)', 'opacity': '0' });
			$('.itemDoc div:eq('+ curInt +')').css({ '-webkit-transition-duration': '0.3s', '-webkit-transform': 'translate3d(-' + (clientW / 2 + 680) + 'px,0px,0px)', 'opacity': '0' });
			
			window.setTimeout(function(){
				$('.itemDoc div:eq('+ nextInt +')').css({ '-webkit-transition-duration': '0.3s', '-webkit-transform': 'translate3d(' + (clientW - 680) / 2 + 'px,0px,0px)', 'opacity': '1' });
			},200)
		}
	}
	
	//节气4个选项右滚动
	function jqRightTab(curInt,nextInt) {
		//console.log('curInt:' + curInt)
		if(curInt != nextInt){
			$('.itemDoc div').css({ '-webkit-transition-duration': '0s', '-webkit-transform': 'translate3d('+ -680 +'px,0px,0px)', 'opacity': '0' });
			$('.itemDoc div:eq('+ curInt +')').css({ '-webkit-transition-duration': '0.3s', '-webkit-transform': 'translate3d(' + (clientW / 2 + 680) + 'px,0px,0px)', 'opacity': '0' });
			
			window.setTimeout(function(){
				$('.itemDoc div:eq('+ nextInt +')').css({ '-webkit-transition-duration': '0.3s', '-webkit-transform': 'translate3d(' + (clientW - 680) / 2 + 'px,0px,0px)', 'opacity': '1' });
			},200)
		}
	}
	
})

//禁止滑动
function forbidMove(e) {
	e.preventDefault();
	e.stopPropagation();
}

//获取鼠标位置
function getMouse(e){
	var mouse;
	var eDown = e.originalEvent.touches || e.originalEvent.changedTouches;
	if (!! eDown) {
		mouse = eDown[0].pageX;
	} else {
		mouse = e.clientX;
	}
	return mouse;
}
	
//获取当前节气和下一个节气
function getSolarTerms() {
	var myDate = new Date();
	var year = myDate.getFullYear();
	var cMonth = myDate.getMonth() + 1;
	var pMonth = (cMonth + 11) % 12;
	var nMonth = (cMonth + 1) % 12;
	var date = myDate.getDate();
	var arrP = solar_term[year][pMonth];
	var arrC = solar_term[year][cMonth];
	var arrN = solar_term[year][nMonth];
	
	var str = '';
	var njieqi = '';
	var ndate;
	var timestamp = myDate.getTime();
	var upperDate = 0;
	
	if (date < arrC[0].d) {
		str = '已过' + solar_term_info[arrP[1].id].title;
		upperDate = new Date(year, cMonth - 1, arrC[0].d);
		njieqi = solar_term_info[arrC[0].id].title;
		nmonth = cMonth;
		ndate = arrC[0].d;
		cur = arrC[0].id;
		curDeg = -arrC[0].id * 15;
		curJqId = arrC[0].id;
	} else if (date == arrC[0].d) {
		str = solar_term_info[arrC[0].id].title;
		upperDate = new Date(year, cMonth - 1, arrC[1].d);
		njieqi = solar_term_info[arrC[1].id].title;
		nmonth = cMonth;
		ndate = arrC[1].d;
		cur = arrC[1].id;
		curDeg = -arrC[1].id * 15;
		curJqId = arrC[1].id;
	} else if (date < arrC[1].d) {
		str = '已过' + solar_term_info[arrC[0].id].title;
		upperDate = new Date(year, cMonth - 1, arrC[1].d);
		njieqi = solar_term_info[arrC[1].id].title;
		nmonth = cMonth;
		ndate = arrC[1].d;
		cur = arrC[1].id;
		curDeg = -arrC[1].id * 15;
		curJqId = arrC[1].id;
	} else if (date == arrC[1].d) {
		str = solar_term_info[arrC[1].id].title;
		njieqi = solar_term_info[arrN[0].id].title;
		nmonth = nMonth;
		ndate = arrN[0].d;
		cur = arrN[0].id;
		curDeg = -arrN[0].id * 15;
		curJqId = arrN[0].id;
		if (12 == cMonth) {
			upperDate = new Date(year + 1, nMonth - 1, arrN[0].d);
		} else {
			upperDate = new Date(year, nMonth - 1, arrN[0].d);
		}
	} else {
		str = '已过' + solar_term_info[arrC[1].id].title;
		njieqi = solar_term_info[arrN[0].id].title;
		nmonth = nMonth;
		ndate = arrN[0].d;
		cur = arrN[0].id;
		curDeg = -arrN[0].id * 15;
		curJqId = arrN[0].id;
		if (12 == cMonth) {
			upperDate = new Date(year + 1, nMonth - 1, arrN[0].d);
		} else {
			upperDate = new Date(year, nMonth - 1, arrN[0].d);
		}
	}
	timestamp = upperDate.getTime() - timestamp;
	return { 'month': cMonth, 'date': date, 'jieqi': str, 'nmonth': nmonth, 'ndate': ndate, 'njieqi': njieqi, 'ts': Math.ceil(timestamp / 86400000) };
}

//搜索节气展示
function getSolarSearch() {
	var myDate = new Date();
	var year = myDate.getFullYear();
	var timeTemp = [];
	var solarTemp = [];
	for(i=0;i<solar_term_info.length;i++) {
		timeTemp.push('<li>'+ solar_term_info[i].title +'<br><span>'+ solar_term_info[i].riqi[year]['m'] +'月'+ solar_term_info[i].riqi[year]['d'] +'日</span></li>');
		solarTemp.push('<option value="'+ solar_term_info[i].title +'">'+ solar_term_info[i].title +'</option>');
	}
	$('.solarTermTable').html(timeTemp.join(''));
	$('#select2').html(solarTemp.join(''));
	$('.searchRight h1 span').html(year);
	$('#solarInfo').hide().html();
}