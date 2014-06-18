var KA = KA || {};
KA.func = KA.func || {};

(function () {
	"use strict";

	var COVER_IMAGES = [
		"images/couple/k_a_banner_1600_cropped.jpg",
		"images/couple/k_a_banner_1600_cropped_bw_bg.png"
	];

	KA.func = {
		initializeGoogleMap: function() {
			$(document).mapz({
				location0_title: "Minneapolis Club",
				location0_latitude: 44.974893,
				location0_longitude: -93.269909,
				location0_address: "<div>729 2nd Ave S, Minneapolis, MN</div><div><a href='tel:6123322292'>(612) 332-2292</a> - <a href='http://mplsclub.org' target='_blank'>mplsclub.org</a></div>"
			});
		},

		onNavLinkClick: function(e) {
			e.preventDefault();
			var $NAV_ITEM	= $(this)
				, TARGET    = $NAV_ITEM.attr('href')
				, DISTANCE  = $(TARGET).offset().top;

			$('body,html').animate(
				{scrollTop:DISTANCE}, 1000, 'easeOutExpo'
			);
		},

		onWindowScroll: function() {
			var Y_POSITION = $(this).scrollTop()
				, $ARROW_UP  = $('a.top','nav');

			//fade in top arrow
			(Y_POSITION > 220) ? $ARROW_UP.fadeIn() : $ARROW_UP.fadeOut();
		},

		onRsvpClick: function(e) {
			var $DROPDOWN 	= $('#dropdown')
				, $INPUT	= $('input[type="text"]','#rsvp')
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
		},

		/*if start typing, remove input value
			and fade in the submit options
			then, if there is no value, show default value
			*************************************/
		rsvp_input_value: function(e) {
			var $INPUT     	= $('input[type="text"]','#rsvp')
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
		},

		sendEmail: function() {
			var $SUBMIT	 	= $(this)
				, $NAME    	= $('input[name=name]','#rsvp')
				, $EMAIL   	= $('form','#rsvp').attr('action')
			 	, STATUS   	= $SUBMIT.attr('class')
				, $ERROR   	= $('p.error')
				, $SUBMITS 	= $('div.submits')
			 	, DATA	   	= 'name=' + $NAME.val() + '&email=' + $EMAIL + '&status=' + STATUS;

			if (!$NAME.val()) {
				$ERROR.fadeIn();
				return false;
			}
			$.ajax({
				type: 'POST',
				url: 'https://mandrillapp.com/api/1.0/messages/send.json',
				data: {
					'key': 'fjKbduW0JIFqYlRv12hz_A',
					'message': {
						'from_email': 'devdela@gmail.com',
						'to': [
							{
								'email': $EMAIL,
								'type': 'to'
							}
						],
						'autotext': 'true',
						'subject': 'Wedding RSVP (' + $NAME.val() + ')',
						'html': STATUS
					}
				},
				success: function() {
					$SUBMITS.fadeOut();
					$NAME.attr({
						disabled:'true',
						value:'Thank You! We received your submission'
					});
				},
				error: function() {
					$ERROR.fadeIn();
				}
			}).done(function(response) {
				console.log(response); // if you're into that sorta thing
			});
			return false;
		}
	};

	$(function($) {

		/* show random cover image */
		$("#feature").append("<img src='" + COVER_IMAGES[Math.floor(Math.random()*COVER_IMAGES.length)] + "'/>");

		KA.func.initializeGoogleMap();

		/*smooth scroll*/
		$('nav a[href^="#"]').click(KA.func.onNavLinkClick);

		/*scrolling*/
		$(window).scroll(KA.func.onWindowScroll);

		/*show rsvp
		*************************************/
		$('.rsvp_trigger').click(KA.func.onRsvpClick);


		$('input[type="text"]','#rsvp').keydown(KA.func.rsvp_input_value);
		$('input[type="text"]','#rsvp').blur(KA.func.rsvp_input_value);

		/*rsvp processing
		*************************************/
		$('input[type="submit"]','#rsvp').click(KA.func.sendEmail);

		/*target ie9
		*************************************/
		if ($.browser.msie && parseInt($.browser.version) == 9)
			$('#feature img, #party .avatar img, #photos .thumb img').css('display','none');

		/*shadowbox init
		*************************************/
		Shadowbox.init({ overlayOpacity: 0.80 });

	});

}());

/*page load effects
*************************************/
$(window).load(function(){
	var $LOADER_CONTAINER = $('.loader-container')
		, $LOADER = $('.loader-container .loader')
		, $DROPDOWN = $('#dropdown')
		, $FADE 		 = $('#fade');

	// $LOADER_CONTAINER.hide();
	// $("body").removeClass("loading");
	setTimeout(function() {
		$LOADER.fadeOut(400, function() {
			setTimeout(function() {
				$LOADER_CONTAINER.fadeOut(400, function() {
					$("body").removeClass("loading");
				});
			}, 500);
		});
		$DROPDOWN.addClass('peek');
		setTimeout(function() {
			$FADE.addClass('fadeIn');
		}, 600);
	}, 500);
});