function injectHtml() {
    var filePath = window.location.pathname;
    var wwwFilePath = filePath.substring(filePath.indexOf("www"));
    //numDirectoriesAway == 0 if currently in the www folder
    var numDirectoriesAway = wwwFilePath.split('/').length - 2;
    var pathInjection = "";
    var i;
    
    for (i = 0; i < numDirectoriesAway; i++) {
        pathInjection += '../';
    }
    
    //setUpHead(pathInjection);
    setUpDrawer(pathInjection);
    //setUpJS(pathInjection);
}

function setUpHead(injectPath) {
    $('head').html('<title>CRU App</title>' +
		'<meta charset="utf-8" />' +
		'<meta http-equiv="Content-type" content="text/html; charset=utf-8">' +

        '<!-- see http://webdesign.tutsplus.com/tutorials/htmlcss-tutorials/quick-tip-dont-forget-the-viewport-meta-tag -->' +
        '<!-- <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1"> -->' +
        '<meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=no">' +
        '<!-- <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes, minimum-scale=1, maximum-scale=2"> -->' +
        '<style>' +
         '   /* following two viewport lines are equivalent to meta viewport statement above, and is needed for Windows */' +
        '    /* see http://www.quirksmode.org/blog/archives/2014/05/html5_dev_conf.html and http://dev.w3.org/csswg/css-device-adapt/ */' +
         '   @-ms-viewport { width: 100vw ; min-zoom: 100% ; zoom: 100% ; }          @viewport { width: 100vw ; min-zoom: 100% zoom: 100% ; }' +
          '  @-ms-viewport { user-zoom: fixed ; min-zoom: 100% ; }                   @viewport { user-zoom: fixed ; min-zoom: 100% ; }' +
           ' /*@-ms-viewport { user-zoom: zoom ; min-zoom: 100% ; max-zoom: 200% ; }   @viewport { user-zoom: zoom ; min-zoom: 100% ; max-zoom: 200% ; }*/' +
        '</style>' +
		'<!--[if lte IE 8]><script src="' + injectPath + 'js/ie/html5shiv.js"></script><![endif]-->' +
		'<link rel="stylesheet" href="' + injectPath + 'css/template/main.css" />' +
		'<!--[if lte IE 8]><link rel="stylesheet" href="' + injectPath + 'css/ie8.css" /><![endif]-->' +
        '<script src="' + injectPath + 'js/template/jquery.min.js"></script>' +
        '<script src="' + injectPath + 'js/template/jquery.scrollzer.min.js"></script>' +
        '<script src="' + injectPath + 'js/template/jquery.scrolly.min.js"></script>' +
                   $('head').html());
}

function setUpDrawer(injectPath){
    
    $('#header').html('<header>' +
                '<span class="image avatar"><img src="images/avatar.jpg" alt="" /></span>' +
                '<h1 id="logo"><a href="#">CRU</a></h1>' +
                '<p>I got reprogrammed by a rogue AI<br />' +
                'and now Im totally cray</p>' +
            '</header>' +
            '<nav id="nav">' +
                '<ul>' +
                    '<li><a href="' + injectPath + 'events/events.html" class="active">Events</a></li>' +
                    '<li><a href="'  + injectPath + '#two">Resources</a></li>' +
                    '<li><a href="' + injectPath + 'missions/missions.html">Summer Missions</a></li>' +
                    '<li><a href="'  + injectPath + '#four">Teams</a></li>' +
                    '<li><a href="'  + injectPath + '#one">Community Groups</a></li>' +
                    '<li><a href="'  + injectPath + '#one">Rides</a></li>' +
                    '<li><a href="' + injectPath + '#one">Settings</a></li>' +
                '</ul>' +
            '</nav>');
}

function setUpJS(injectPath) {
    $('body').html($('body').html() + '<!-- Scripts -->' +
			'<script src="' + injectPath + 'js/template/skel.min.js"></script>' +
			'<script src="' + injectPath + 'js/template/util.js"></script>' +
			'<!--[if lte IE 8]><script src="' + injectPath + 'js/template/ie/respond.min.js"></script><![endif]-->' +
			'<script src="' + injectPath + 'js/template/main.js"></script>' +

            '<script src="' + injectPath + 'cordova.js"></script>          <!-- "Phantom" cordova.js required for projects that use plugins -->' +
    
        '<!--  <script src="' + injectPath + 'js/index.js"></script> -->' +
        '<script src="' + injectPath + 'js/app.js"></script>           <!-- for your event code, see README and file comments for details -->' +
        '<script src="' + injectPath + 'js/init-app.js"></script>      <!-- for your init code, see README and file comments for details -->' +
        '<script src="' + injectPath + 'js/init-dev.js"></script>     <!-- normalizes device and document ready events, see file for details -->');
}