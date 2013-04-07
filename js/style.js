$(function(){
	
	var step1 = function() {
		// init
		var synopsisTemplate = _.template($("#synopsisTemplate").html());
		$('#wrapper').html(synopsisTemplate);
		
		// animate
		$('#synopsis').css({ '-webkit-transform': 'translate(0px,-40px)', 'opacity': '1' });
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
		var infoTemplate = _.template($("#infoTemplate").html());
		$('#wrapper').html(infoTemplate);
		
		// animate
		$('#info').css({ '-webkit-transform': 'scale(1,1)' });
		$('#info .xs1').css({ '-webkit-transform': 'translate(0px,-40px)', 'opacity': '0' });
		$('#info .xs1 h1,#info .xs1 h2,#info .xs1 h3').css({ '-webkit-transform': 'translate(0px,-40px)', 'opacity': '1' });
		$('#info .xs2').css({ '-webkit-transform': 'translate(0px,-200px)', 'opacity': '1' });
		$('#info .xs2 h1,#info .xs2 h2,#info .xs2 h3,#info .xs2 h4').css({ '-webkit-transform': 'translate(0px,-40px)', 'opacity': '1' });
		
		$('#info .xs2 h4').on('webkitTransitionEnd', function(){
			$('#info .xs2').css({ '-webkit-transition-delay': '0s', 'opacity': '0' });
			step3();
		});
	};
	
	var step3 = function() {		
		$('#info').css({ '-webkit-transition-delay': '0.5s', '-webkit-transform': 'scale(0.4,0.4)' });
		$('#info').remove();
		/*$('#info').on('webkitTransitionEnd', function(){
			step2();
		});*/
		
		var discTemplate =  _.template($("#discTemplate").html());
		$('#wrapper').html(discTemplate);
		$('#disc').css({ '-webkit-transform': 'scale(0.4,0.4) rotateY(180deg)' });
	}
	
	var run = function() {
		step1();
	};
	run();

});