$(document).ready(function() {

	// Load page load functions on main page load
	// This ISN'T called again when the page state changes.
	// loadSounds();
	sizeHandler();
	pageRefreshFunctions();
	changeActiveFigure();
	detectBrowser();

	setTimeout(function(){
		popStateActive = true;
	}, 500);

	stateChangeLink.on('click', function(e){
		e.preventDefault();
		stateChangeFunction($(this), 400);
	});

	jsOpenContact.on('click', function(e){
		e.preventDefault();
		jsContactModal.show();
    document.body.style.overflow = 'hidden';
    if (smoothScroll) smoothScroll.off();
		setTimeout(function(){
			dataActiveOn(jsContactModal);
		}, 20);
	});
	jsCloseContact.on('click', function(e){
		e.preventDefault();
		dataActiveOff(jsContactModal);
    document.body.style.overflow = 'auto';
		setTimeout(function(){
			jsContactModal.hide();
      if (smoothScroll) smoothScroll.on();
		}, 1000);
	});
	jsMobNavBtn.on('click', function(e){
		e.preventDefault();
		if ((jsMobNavBtn).attr('data-mob-nav-on') == 'on') {
			dataActiveOff(jsMobNav);
			(jsMobNavBtn).attr('data-mob-nav-on', 'off');
		} else {
			dataActiveOn(jsMobNav);
			(jsMobNavBtn).attr('data-mob-nav-on', 'on');
		}
	});

	jsCursorFollowerActive.on('mouseenter', function(e){
		dataActiveOn(jsHandCursorFollower);
		jsHandCursorFollower.css({
		    'transform' : 'translate3d('+halfWindowWidth+'px,'+halfWindowHeight+'px,0)'
	    });
		cursorFollowerIntervalActive = 'true';
		cursorFollowerInterval();
	});
	jsCursorFollowerActive.on('mouseleave', function(e){
		dataActiveOff(jsHandCursorFollower);
		cursorFollowerIntervalActive = 'false';
	});
	jsSoundOnOff.on('click', function(e){
		e.preventDefault();
		if (soundActive == false) {
			$(this).addClass('sound-turned-on');
			playSound('cough', 0.3, 0);
			setTimeout(function(){
				soundActive = true;
			}, 500);
		} else {
			soundActive = false;
			$(this).removeClass('sound-turned-on');
			dataActiveOff($(this));
		}
	});

	$('.js-contact-social').on('mouseenter', function(e){
		$(this).addClass('hover');
	});
	$('.js-contact-social').on('mouseleave', function(e){
		$(this).removeClass('hover');
	});

});

function stateChangeFunction(e, sweepTimer) {
	var thisClick = e;
	newState = thisClick.attr('data-new-state');
	// TURN OFF THE MAIN CONTENT BEFORE CHANGING IT
	dataActiveOff(mainContainer);
	// ANY CODE PARTS WHICH START SOMETHING AT CLICK AND END AS NEW SCENE IS IN
	scrollActive = false;

	if (newState != 'project') {
		dataActiveOn(jsFiguresWrap);
		dataActiveOn(jsFiguresHorizon);
	}

	noActiveFigure();

	setTimeout(function(){

		// WHAT IS THE NEW STATE

		jsMainNav.attr('data-state', newState);

		// CHANGE THE STATE OF THE ELEMENT WHICH CHANGES FROM PAGE TO PAGE
		jsWatchState.attr('data-state', newState);

		setTimeout(function(){
      // UPDATE COLOR-LED ASSETS
			updateColorForeground(newState);

			href = thisClick.attr('href');
      var newID = null

			if (newState == 'project') {
        newID = thisClick.attr('data-new-id');
        content.load(href);
			} else {
				content.load(href);
			}

			// INTRODUCE THE BETWEEN CONTENT PRELOADER
			setTimeout(function(){
				betweenContentLoading = true;
				betweenContentLoop();
				dataActiveOn(preloaderShield);
			}, 400);

			setTimeout(function(){
				askContentLoaded(newState, newID);
				changeActiveFigure();
			}, 900);

		}, 460);

	}, sweepTimer);
}

function noActiveFigure() {
	$('.figure-mover').removeClass('active');
}

function changeActiveFigure() {
	if (newState == 'intro') {
		$('.intro-figures').addClass('active');
	} else if (newState == 'who') {
		$('.who-figures').addClass('active');
	} else if (newState == 'what') {
		$('.what-figures').addClass('active');
	} else if (newState == 'work') {
		$('.work-figures').addClass('active');
	}
}

function updateScrollElement () {
  mobileScrollEl = document.querySelector('body')
}

// TRIGGERS AN EVENT WHEN THE USER GOES BACK OR FORWARD WITH BROWSER
// USE THIS TO DETECT THE 'NEW' CONTENT, AND AFFECTING THE HEAD TO SUIT
$(window).bind('popstate', function(event) {
	if (popStateActive == true) {
		$('.js-page-content').remove();
	    setTimeout(function(){
	    	location.reload();
		}, 10);
	}
});

$(window).resize(function() {
	sizeHandler();
}); // END OF RESIZE

function sizeHandler() {
	windowWidth = $(window).innerWidth();
	windowHeight = $(window).innerHeight();
	halfWindowWidth = windowWidth / 2;
	halfWindowHeight = windowHeight / 2;

	$('.js-full-height').each(function() {
      	$(this).css({
		    'height' : windowHeight
	    });
    });
}

// END OF SCROLL

function scrollInterval() {
	scrollYPos = (smoothScrollActive ? smoothScroll.vars.current : window.pageYOffset);

	scrollQuery(scrollYPos);
	if (scrollYPos >= 30) {
      siteNav.attr('data-page-scrolled', 'true');
  } else {
	    siteNav.attr('data-page-scrolled', '');
  }

	$('.js-monitor-scroll').each(function() {
      	positionChecker($(this), scrollYPos);
    });
    $('.js-monitor-scroll-count-up').each(function() {
      	positionCheckerCountUp($(this), scrollYPos);
    });

    if (newState == 'work') {

      let targetSkew,
          max = 10

      if (scrollYPos > lastScrollYPos) {
        targetSkew = (scrollYPos - lastScrollYPos)
        targetSkew = (targetSkew < 60 ? targetSkew / 6 : max)
      } else if (scrollYPos < lastScrollYPos) {
        targetSkew = (lastScrollYPos - scrollYPos)
        targetSkew = (targetSkew < 60 ? targetSkew / -6 : -max)
      } else if (scrollYPos === lastScrollYPos) {
        targetSkew = 0
      }

      currentSkew += (targetSkew - currentSkew) * .1 // Interpolate for ease animation
      currentSkew = Math.floor(currentSkew * 1000) / 1000 // Floor result to 2 decimal places
      currentSkew = (currentSkew > 0.002 || currentSkew < -0.002 ? currentSkew : 0) // Avoid getting stuck on last degree due to interpolation

      TweenMax.set($('.work-project-content'), {skewY: currentSkew})
    }

	setTimeout(function(){
		if (scrollActive != false) {
      lastScrollYPos = scrollYPos
			scrollInterval();
		}
    }, 30);
}

// function rarerScrollInterval() {

// 	if (soundPlaying == false && soundActive == true) {
// 		$('.js-monitor-sound').each(function() {
// 	    	if ($(this).attr('data-sound-played') == "no") {
// 	    		soundChecker($(this), $(this).offset().top, $(this).height());
// 	    	}
// 	    });
// 	}

// 	setTimeout(function(){
// 		if (scrollActive != false) {
// 			rarerScrollInterval();
// 		}
//     }, 500);
// }

function scrollQuery(y) {

	if (y >= windowHeight*0.15) {
		dataActiveOff(jsFiguresWrap);
		dataActiveOff(jsFiguresHorizon);
		dataActiveOff($('.js-masterhead'));
		dataActiveOff($('.scroll-arrow-wrap'));
	} else {
		dataActiveOn(jsFiguresWrap);
		dataActiveOn(jsFiguresHorizon);
		dataActiveOn($('.js-masterhead'));
		dataActiveOn($('.scroll-arrow-wrap'));
	}
}

function scrollQueryWorkPage(e, y) {

	thisY = e.offset().top;
	thisRange = thisY + e.height();
	if (thisY <= (windowHeight*0.85) && (thisRange-(windowHeight*0.85)) >= 0) {

		oldWorkProjectScrollState = $('.work-projects-scroll').attr('data-active-project');
		newWorkProjectScrollState = e.attr('data-work-project');

		// IS THE VALUE OF THIS PROJECT THE SAME AS THE CURRENT ACTIVE PROJECT?
		if ( oldWorkProjectScrollState != newWorkProjectScrollState ) {

			if ((newWorkProjectScrollState - oldWorkProjectScrollState) < 0 ) {
				$('.work-projects-scroll').attr('data-direction', 'backwards');
			} else {
				$('.work-projects-scroll').attr('data-direction', 'forwards');
			}
			$('.work-projects-scroll').attr('data-active-project', e.attr('data-work-project'));

			dataActiveOn(e);
			$('.js-work-scroll-ledge div').css({
			    'transform' : 'rotate('+e.attr('data-angle')+'deg) translate3d('+e.attr('data-x')+'%,'+e.attr('data-y')+'%,0)'
		    });

		}

	} else {
		dataActiveOff(e);
	}
}

function calculateProjectAngle(e) {
	thisProjectAngle = e.attr('data-angle');
	thisDiv = e.find(".project-thumb");
	thisDivNegativeRotate = e.find(".thumb-negative-rotate");
	thisDiv.css({
	    'transform' : 'rotate('+thisProjectAngle+'deg)'
    });
    thisDivNegativeRotate.css({
	    'transform' : 'rotate('+(thisProjectAngle*-1)+'deg)'
    });
    if (thisProjectAngle <= 0) {
    	e.find(".thumb-mover").addClass('negative-angle');
    }
}

function positionChecker(e) {
	thisY = e[0].getBoundingClientRect().top;

	if (thisY <= (windowHeight*0.85)) {
		dataActiveOn(e);
	} else {
		dataActiveOff(e);
	}
}

function soundChecker(e, offset, h) {
	rangeBeginning = windowHeight*0.26;
	rangeEnd = rangeBeginning - h;
	if (offset <= rangeBeginning && offset >= rangeEnd) {
		// WHEN WITHIN THE RANGE
		e.attr('data-sound-played', 'yes');
		sound = e.attr('data-sound-name');
		playSound(sound, 0.3, 0);
		soundPlaying = true;
		setTimeout(function(){
		    soundPlaying = false;
		}, 5000);
	}
}

function positionCheckerCountUp(e) {
	thisY = e[0].getBoundingClientRect().top;

	awardCount = $('.award-count').attr('data-award-number');
	if (thisY <= (windowHeight*0.65) && awardCounted == false) {
		awardCounted = true;
		var awardCount = new CountUp("award-counter", 0, awardCount, 0, 3, options);
		setTimeout(function(){
		   	awardCount.start();
		   	setTimeout(function(){
			   	$('.js-monitor-scroll-count-up').addClass('counted')
			}, 1700);
		}, 400);
	} else {

	}
}

function askContentLoaded(newPage, newID) {
	// THIS TIMEOUT ASKS IF THE CONTENT IS LOADED, BY DETECTING THE STATE OF THE
	// SCROLLING CONTENT DIV – ASKING IF IT MATCHES THE NEW STATE.
	// UPON IT MATCHING, THE PAGE FUNCTIONS ARE THEN FIRED.

	if ($('.js-scrolling-content').attr('data-state') == newPage && $('.js-scrolling-content').attr('data-project-id') == newID || $('.js-scrolling-content').attr('data-state') == newPage && !newID) {
		contentLoadFunctions();
		betweenContentLoading = false;
		setTimeout(function(){
			if (projectInternalRefresh == true) {
				location.reload();
			} else {
        updateScrollElement();
				dataActiveOn(mainContainer);
			}
		}, 200);
	} else {
		setTimeout(function(){
			askContentLoaded(newPage, newID);
		}, 50);
	}
}

function contentLoadFunctions(e) {
	// ANY BESPOKE FUNCTIONS FOR PAGES GO IN HERE
	awardCounted = false;
	// THIS SET TIMEOUT IS TO DO NEW JS FUNCTIONS TO NEWLY EXISTING PARTS
	setTimeout(function(){
    // SMOOTH SCROLL

    if (smoothScroll) smoothScroll.destroy();

    if (smoothScrollActive) {
      smoothScroll = new Smooth({ native: true, preload: true });
      smoothScroll.init();
    }

   	letteringJS();
   	scrollActive = true;
		scrollInterval();

		$('.js-state-change').on('click', function(e){
			stateChangeFunction($(this), 400);
			return false;
		});

		$('.box-arrow-link').on('click', function(e){
			$(this).addClass('clicked');
		});

		if (newState == 'who') {

			jonnyScrollVal = $('.jon-profile-figure').offset().top - (windowHeight / 8);
			leighScrollVal = $('.leigh-profile-figure').offset().top - (windowHeight / 8);

			$('.js-scroll-to-jonny').on('click', function(e){
				e.preventDefault();
          if (smoothScrollActive) {
            TweenMax.to(window, 0.95, {scrollTo: jonnyScrollVal, ease: Expo.easeInOut});
          } else {
            TweenMax.to($('.js-scrolling-content'), 0.95, {scrollTo: jonnyScrollVal, ease: Expo.easeInOut});
          }
			});

			$('.js-scroll-to-leigh').on('click', function(e){
				e.preventDefault();
          if (smoothScrollActive) {
            TweenMax.to(window, 0.95, {scrollTo: leighScrollVal, ease: Expo.easeInOut});
          } else {
            TweenMax.to($('.js-scrolling-content'), 0.95, {scrollTo: leighScrollVal, ease: Expo.easeInOut});
          }
			});
		}

		$('.scroll-arrow-wrap').on('click', function(e){
			e.preventDefault();
			arrowScrollVal = windowHeight / 1.4;
		    TweenMax.to($('.js-scrolling-content'), 0.95, {scrollTo:arrowScrollVal, ease: Expo.easeInOut});
		    if (newState == 'work') {
		    	changeWorkProject(1);
		    }
		});

		$('.js-back-to-top').on('click', function(e){
			e.preventDefault();
      if (smoothScrollActive) {
        TweenMax.to(window, 0.95, {scrollTo:0, ease: Expo.easeInOut});
      } else {
        TweenMax.to($('.js-scrolling-content'), 0.95, {scrollTo:0, ease: Expo.easeInOut});
      }
		});

		// WORK PAGE ONLY FUNCTIONS
		if (newState == 'work') {
			dataActiveOn($('.scroll-arrow-wrap'));
			siteNav.attr('data-page-scrolled', '');

      lastScrollYPos = 0
      currentSkew = 0

			// SEPARATE THEORY FOR PROJECT CLICKS TO AVOID FLASH GLITCH
			$('.js-view-project, .js-nav-logo').on('click', function(e){
				$('.work-project-content, .js-work-scroll-ledge').addClass('force-out');
				thisClick = $(this);
				setTimeout(function(){
					stateChangeFunction(thisClick, 150);
				}, 300);

				return false;
			});

			// DETECT NO. OF PROJECTS TO REMOVE NAV NUMBERS
      $('.js-view-project').on('mouseenter', function(e){
        $('.work-projects-scroll').attr('data-hovered', true);
      });
      $('.js-view-project').on('mouseleave', function(e){
        $('.work-projects-scroll').attr('data-hovered', false);
      });

		} else {
			$('body').unbind("mousewheel");
		}

		// PROJECT PAGE ONLY FUNCTIONS
		if (newState == 'project') {

			dataAssets = $('.project-blocks-wrap');
			projectBGColor = dataAssets.attr('data-bg-color');
			projectAccentColor = dataAssets.attr('data-accent-color');
			 $('.js-project-bg-color').css({
			    'background-color' : ''+projectBGColor+''
		    });
	    	$('.project-block').each(function() {
		    	thisBGColor = $(this).attr('data-bg-color');
		    	$(this).css({
				    'background-color' : ''+thisBGColor+''
			    });
	    	});
	    	$('.js-carousel-next').on('click', function(e){
	    		thisCarousel = $(this).closest('.project-carousel');
	    		currentCarouselImg = parseInt(thisCarousel.attr('data-carousel-current-img'));
				currentCarouselImg += 1;
				totalImgCarouselImgs = thisCarousel.attr('data-total-carousel-imgs');
				if (currentCarouselImg <= totalImgCarouselImgs) {
					thisCarousel.attr('data-carousel-current-img', currentCarouselImg);
				} else {
					thisCarousel.attr('data-carousel-current-img', 1);
				}
				return false;
			});
			$('.js-carousel-prev').on('click', function(e){
	    		thisCarousel = $(this).closest('.project-carousel');
	    		currentCarouselImg = parseInt(thisCarousel.attr('data-carousel-current-img'));
				currentCarouselImg -= 1;
				totalImgCarouselImgs = thisCarousel.attr('data-total-carousel-imgs');
				if (currentCarouselImg > 0) {
					thisCarousel.attr('data-carousel-current-img', currentCarouselImg);
				} else {
					thisCarousel.attr('data-carousel-current-img', totalImgCarouselImgs);
				}
				return false;
			});
			$('.js-carousel-jump').on('click', function(e){
				thisCarouselJump = $(this).attr('data-carousel-jump');
				thisCarousel = $(this).closest('.project-carousel');
				thisCarousel.attr('data-carousel-current-img', thisCarouselJump);
				return false;
			});

			$('.project-footer-next-project, .project-footer-prev-project').on('click', function(e){
				projectInternalRefresh = true;
				dataActiveOff(siteNav);
				preloaderShield.hide();
			});

		} else {
			projectInternalRefresh = false;
		}

	}, 50);

}

function pageRefreshFunctions(e) {
	loadSiteHeader();
	contentLoadFunctions();
}

function showElementWithTransition(e) {
	e.show();
	setTimeout(function(){
	   	e.addClass('active');
	}, 20);
}

function hideElementWithTransition(e) {
	e.removeClass('active');
	setTimeout(function(){
	   	e.hide();
	}, 1000);
}

function destroyElementWithTransition(e) {
	e.removeClass('active');
	setTimeout(function(){
	   	e.remove();
	}, 1000);
}

function updateColorForeground(newState) {
	if (newState == "what" || newState == "who" || newState == "work") {
		newColor="white";
	} else if (newState == "intro" || newState == "project")  {
		newColor="black";
	}
	jsWatchForegroundColor.attr('data-color-state', newColor);
}

function loadSiteHeader() {
	siteLoading = true;
	preload = new createjs.LoadQueue();
	preload.on("complete", siteLoaded); // ON ALL LOADED, RUN FUNCTION siteLoaded
	preload.on("progress", loadProgress); // ON ALL LOADED, RUN FUNCTION siteLoaded
	preload.loadFile("/wp-content/themes/toybox/img/ui/logo/tf-white.svg");
	preload.loadFile("/wp-content/themes/toybox/img/figures/tinified/who-figures.png");
	preload.loadFile("/wp-content/themes/toybox/img/figures/tinified/what-figures.png");
	preload.loadFile("/wp-content/themes/toybox/img/figures/tinified/work-figures.png");
	preload.loadFile("/wp-content/themes/toybox/img/figures/tinified/footer-rock.png");
	preloaderLoop();
}

function siteLoaded(event) {
	siteLoading = false; // THIS GIVES THE SIGNAL THAT SITE IS NO LONGER LOADING
	jsFiguresWrap.attr('data-scaled', 'slow-off');
	jsFiguresHorizon.attr('data-preloading', 'off');
	$('.monitor-preload').attr('data-preloading', 'off');

	setTimeout(function(){
		jsFiguresWrap.attr('data-scaled', 'off');

		if (touchActive == "on") {
			window.addEventListener("deviceorientation", handleOrientation, true);
		} else {
			mouseMovement(0.08);
		}
	}, 1900);
}

function loadProgress() {}

function changeWorkProject(e) {
	if (e != 0) {
		dataActiveOff(jsFiguresWrap);
		dataActiveOff(jsFiguresHorizon);
		dataActiveOff($('.scroll-arrow-wrap'));
		siteNav.attr('data-page-scrolled', 'true');
	} else {
		dataActiveOn(jsFiguresWrap);
		dataActiveOn(jsFiguresHorizon);
		dataActiveOn($('.scroll-arrow-wrap'));
		siteNav.attr('data-page-scrolled', '');
		$('.js-work-scroll-ledge div').css({
		    'transform' : 'rotate(0deg) translate3d(0%,0%,0)'
	    });
	}
	eWithAngles = $('.work-project:nth-child('+e+')');
	$('.js-work-scroll-ledge div').css({
	    'transform' : 'rotate('+eWithAngles.attr('data-angle')+'deg) translate3d('+eWithAngles.attr('data-x')+'%,'+eWithAngles.attr('data-y')+'%,0)'
    });
	$('.work-project-monitor').attr('data-active-project', e);
}

function siteLoadedTrigger(event) {
	setTimeout(function(){
	    $('body').removeClass('preloading');
	}, preloaderTimeout);
}

function preloaderLoop() {
	if (preloaderShield.attr('data-color-state') == 'black') {
		preloaderShield.attr('data-color-state', 'white');
	} else {
		preloaderShield.attr('data-color-state', 'black');
	}
	setTimeout(function(){
		if (siteLoading == true) {
			preloaderLoop();
		} else {
			dataActiveOn(siteNav);
			dataActiveOff(preloaderShield);
			dataActiveOn(mainContainer);

			setTimeout(function(){
				preloaderShield.addClass('between-content');
				preloaderShield.attr('data-color-state', 'white');
			}, 700);

		}
	}, 1100);
}

function betweenContentLoop() {
	if (preloaderShield.attr('data-color-state') == 'black') {
		preloaderShield.attr('data-color-state', 'white');
	} else {
		preloaderShield.attr('data-color-state', 'black');
	}
	setTimeout(function(){
		if (betweenContentLoading == true) {
			betweenContentLoop();
		} else {
			dataActiveOff(preloaderShield);
			setTimeout(function(){
				preloaderShield.attr('data-color-state', 'white');
			}, 700);
		}
	}, 1100);
}

function mouseMovement(moveAmount) {

	bodyEl.mousemove(function( e) {

	  	var cursorX = e.pageX;
    	var cursorY = e.pageY;

    	var moveX = (cursorX - (halfWindowWidth))*-moveAmount;
		var moveY = (cursorY - (halfWindowHeight))*-moveAmount;
		var rotateY = moveX*-0.09;
    	TweenMax.to($('.figure-mover.active .js-figure-2'),
			1.175, {
				x: moveX,
				y: moveY,
				rotationY: rotateY
			}
		);
		TweenMax.to($('.figure-mover.active .js-figure'),
			1.175, {
				x: moveX*0.4,
				y: moveY*0.8,
				rotationY: rotateY*0.4
			}
		);
	});

}

function handleOrientation(event) {

	absolute = event.absolute;
  	alpha    = (event.alpha).toFixed(2);
	beta     = (event.beta).toFixed(2);
	gamma    = (event.gamma).toFixed(2);

	beta -= 25;
	// gamma *= -1;
	beta *= -0.5;
	gamma *= -0.7;
	rotateY = gamma * -0.75;

	$('h2.tiltstats').text(gamma);

	TweenMax.to($('.figure-mover.active .js-figure'),
		1.2, {
			// rotationY: gamma,
			// rotationX: beta
			x: gamma,
			y: beta,
			rotationY: rotateY
		}
	);

	TweenMax.to($('.figure-mover.active .js-figure-2'),
		1.2, {
			// rotationY: gamma,
			// rotationX: beta
			x: gamma*0.7,
			y: beta*0.7,
			rotationY: rotateY
		}
	);

}

function cursorFollowerInterval() {

	htmlEl.mousemove(function(e) {
	  	handCursorX = e.pageX;
    	handCursorY = e.pageY;
    });
    TweenMax.to(jsHandCursorFollower,
		0.63, {
			x: handCursorX,
			y: handCursorY
		}
	);
    setTimeout(function(){
		if (cursorFollowerIntervalActive != 'false') {
			cursorFollowerInterval();
		} else {
			htmlEl.off();
		}
    }, 60);
}

// SOUND FUNCTIONS
function loadSounds () {
	// UI SOUNDS
	createjs.Sound.registerSound("/audio/ui/hover.mp3", "ui-1");
	createjs.Sound.registerSound("/audio/speaking/intro-main.mp3", "intro-main");
	createjs.Sound.registerSound("/audio/ui/cough.mp3", "cough");
	createjs.Sound.registerSound("/audio/speaking/bryan-nerd.mp3", "bryan-nerd");
	createjs.Sound.setVolume(volumeSetter);
}

function playSound (e, v, l) {
	var instance = createjs.Sound.play(e);  // play using id.  Could also use full sourcepath or event.src.
	instance.volume = v;
	instance.pan = 0.0001;
	instance.loop = l;
}

// UTILITY FUNCTIONS

function detectBrowser() {

	is_safari = navigator.userAgent.indexOf('Safari') > -1;
    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
    	htmlEl.addClass('safari-browser');
    }

}

function dataActiveOff(e) {
	e.attr('data-active', 'off');
}
function dataActiveOn(e) {
	e.attr('data-active', 'on');
}
function dataState(e, x) {
	e.attr('data-state', x);
}
function letteringJS(e) {
	e = $('.letter-split');
	e.lettering();
	// $('span', e).lettering();
}
