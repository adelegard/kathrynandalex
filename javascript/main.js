jQuery(function($) {
	
	/*smooth scroll*/
	$('nav a[href^="#"]').click(function(e) {
		var $NAV_ITEM = $(this)
			, TARGET    = $NAV_ITEM.attr('href')
			, DISTANCE  = $(TARGET).offset().top;

		$('body,html').animate(
			{scrollTop:DISTANCE}, 1000, 'easeOutExpo'
		);
		e.preventDefault();		
	});

	/*scrolling*/
	$(window).scroll(function(event) {			
		var Y_POSITION = $(this).scrollTop()
			, $ARROW_UP  = $('a.top','nav');

		//fade in top arrow
		(Y_POSITION > 220) ? $ARROW_UP.fadeIn() : $ARROW_UP.fadeOut();
	});
	
	/*show rsvp
	*************************************/
	$('.rsvp_trigger').click(function(e) {
		var $DROPDOWN = $('#dropdown')
			, $INPUT		= $('input[type="text"]','#rsvp')
			, TOGGLED   = $DROPDOWN.hasClass('show')
			, INPUT_VAL = $INPUT.val();

		if (TOGGLED)
			$DROPDOWN.removeClass('show');
		else {
			$DROPDOWN.addClass('show');
			setTimeout(function() {
				$INPUT.focus().val(INPUT_VAL);
			}, 700);	
		}
		e.preventDefault();
	});
  
	/*if start typing, remove input value
		and fade in the submit options
		then, if there is no value, show default value 
		*************************************/
	var rsvp_input_value = function(e) {
		var $INPUT     = $('input[type="text"]','#rsvp')
			, $SUBMITS   = $('div.submits','#rsvp')
			, $TARGET    = $(e.target)
			, TARGET_VAL = $TARGET.val()
			, HAS_VAL    = $TARGET.data('data-entered')
			, MESSAGE    = 'type the names of all attendees or regrets...';
			
		if ($TARGET && !HAS_VAL) {
			$TARGET.data('data-entered', true);
			$TARGET.val("");
		} else if ($TARGET && TARGET_VAL === "") {
			$TARGET.data('data-entered', false);
			$TARGET.val(MESSAGE);
		}
		
		(TARGET_VAL === "") ? $SUBMITS.hide() : $SUBMITS.show();
	};
	$('input[type="text"]','#rsvp').keydown(rsvp_input_value);
	$('input[type="text"]','#rsvp').blur(rsvp_input_value);	
  
	/*rsvp processing
	*************************************/
	$('input[type="submit"]','#rsvp').click(function() {		
		var $SUBMIT	 = $(this)
			, $NAME    = $('input[name=name]','#rsvp')
			, $EMAIL   = $('form','#rsvp').attr('action')
		 	, STATUS   = $SUBMIT.attr('class')
			, $ERROR   = $('p.error')
			,	$SUBMITS = $('div.submits')
		 	, DATA	   = 'name=' + $NAME.val() + '&email=' + $EMAIL + '&status=' + STATUS;

		if (!$NAME.val())
			$ERROR.fadeIn();
		else {
			$.ajax({
				url: templateDir+'/process.php',
				type: 'GET',
				data: DATA,		
				cache: false,
				success: function(html) {
					if (html==1) {	
						$SUBMITS.fadeOut();
						$NAME.attr({
							disabled:'true', 
							value:'Thank You! We received your submission'
						});
					} else 
						$ERROR.fadeIn();	
				}
			});
		}	
		return false;
	});
	
	/*target ie9
	*************************************/
	if ($.browser.msie && parseInt($.browser.version) == 9)
		$('#feature img, #party .avatar img, #photos .thumb img').css('display','none');

	/*shadowbox init
	*************************************/
	Shadowbox.init({ overlayOpacity: 0.80 });
	
});

/*page load effects
*************************************/
$(window).load(function(){
	var $LOADER   = $('.loader')
		, $DROPDOWN = $('#dropdown')
		, $FADE 		 = $('#fade');
		
	setTimeout(function() {
		$LOADER.fadeOut();
		$DROPDOWN.addClass('peek');
		setTimeout(function() {
			$FADE.addClass('fadeIn');
		}, 600);
	}, 500);
});