var preload;
var queue = new createjs.LoadQueue(true);
var scrollcontainer = document.getElementById('ps-scroll-container');
var siteLoading;
var betweenContentLoading = false;
var volumeSetter = 1;
var soundActive = false;
var soundPlaying = false;
var amountOfPlays = 0;
var popStateActive = false;

// NUMERICAL VARS
var windowWidth;
var windowHeight;
var halfWindowWidth;
var halfWindowHeight;

var href;

// ELEMENTS
var bodyEl = $('body');
var htmlEl = $('html');
var mainContainer = $('#page-content');
var content  = mainContainer.smoothState().data('smoothState');
var newState = bodyEl.attr('data-state');

var preloaderShield = $('.preloader-shield');
var siteNav = $('nav');
var jsScrollingContent = $('.js-scrolling-content');
var jsMonitorScroll = $('.js-monitor-scroll');
var jsWatchState = $('.js-watch-state');
var jsWatchForegroundColor = $('.js-watch-foreground-color');
var jsMainNav = $('.js-main-nav');
var stateChangeLink = $('.js-main-nav a, .js-nav-logo');
var jsPageContent = $('.js-page-content');
var jsContactModal = $('.js-contact-modal');
var jsOpenContact = $('.js-open-contact');
var jsCloseContact = $('.js-close-contact');
var jsCursorFollowerActive = $('.js-cursor-follower-active');
var jsHandCursorFollower = $('.js-hand-cursor-follower');
var cursorFollowerIntervalActive;
var handCursorX;
var handCursorY;
var jsSoundOnOff = $('.js-sound-on-off');
var jsMobNavBtn = $('.js-mob-nav-btn');
var jsMobNav = $('.js-mob-nav');

// FIGURES
var jsFiguresWrap = $('.js-figures-wrap');
var jsFiguresHorizon = $('.js-figures-horizon');
var letteringEl = $('.letter-split');
var isEdge = navigator.userAgent.toLowerCase().indexOf('edge') > -1;

if (isEdge) {
  document.body.setAttribute('data-edge', true);
}

//NUMERICALS / BOOLEANS
var scrollActive;
var smoothScrollActive = (window.innerWidth <= 1024 || isEdge ? false : true);
var mobileScrollEl = document.querySelector('.scrolling-content')
var projectScrollActive;
var lastScrollYPos
var currentSkew

var workProjectOffsets = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var workScrollActive = true;
var awardCounted = false;
var options = {
    useEasing : true,
    useGrouping : true,
    separator : ',',
    decimal : '.',
    prefix : '',
    suffix : ''
}

var smoothScroll;

var touchActive = 'off';
var absolute;
var alpha;
var beta;
var gamma;
if (htmlEl.hasClass('touchevents')) {
	touchActive = "on";
}

projectInternalRefresh = false;
