/*
 * Please see the included README.md file for license terms and conditions.
 */


// This file is a suggested starting place for your code.
// It is completely optional and not required.
// Note the reference that includes it in the index.html file.

/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */

var serverURL = "http://54.86.175.74:8080/";
var tempUserID = "564ee19f6c2f1876527be562";

/* instantiate snapper object, and define pane to slide left or right */
var snapper = new Snap({
    element: document.getElementById('content')
});

/*snapper.on('ignore', function(){
  snapper.open('left');
});*/

//window.app = window.app || {};

// This file contains your event handlers, the center of your application.
// NOTE: see app.initEvents() in init-app.js for event handler initialization code.

function myEventHandler() {
    "use strict" ;

    var ua = navigator.userAgent ;
    var str ;

    if( window.Cordova && dev.isDeviceReady.c_cordova_ready__ ) {
            str = "It worked! Cordova device ready detected at " + dev.isDeviceReady.c_cordova_ready__ + " milliseconds!" ;
    }
    else if( window.intel && intel.xdk && dev.isDeviceReady.d_xdk_ready______ ) {
            str = "It worked! Intel XDK device ready detected at " + dev.isDeviceReady.d_xdk_ready______ + " milliseconds!" ;
    }
    else {
        str = "Bad device ready, or none available because we're running in a browser." ;
    }

    alert(str) ;
}


// ...additional event handlers here...
function menuEvent() {
    
    if( snapper.state().state=="left" ){
        snapper.close();
    } else {
        snapper.open('left');
    }
}

function addUserEvent() {
    var push = PushNotification.init({ 
        android: {senderID: "276638088511", forceShow:true},
        ios: {alert: "true", badge: true, sound: 'false'}, 
        windows: {} } );
    
    push.on('registration', function(data) {
        console.log("Storing registration ID");
        $("#userInfo").html("registered id: " + data.registrationId);
        window.localStorage.setItem("pushID", data.registrationId);
    });

    push.on('notification', function(data) {
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
        console.log("officially push notified: " + data.message);
        alert("recieved notification"+data.message);
    });

    push.on('error', function(e) {
        console.log(e.message);
        $("#userInfo").html("error: " + e.message);
    });
}

function postNewUser() {
    console.log("post user reg id from storage: " + window.localStorage.getItem("pushID"));
    $.post(serverURL + "users/" + tempUserID+ "/push", 
        {
            token: window.localStorage.getItem("pushID"),  
            type: device.platform
        },
          function(data, status, xhr) {
        console.log("post status: " + status);
    });
}

/*function setUpDrawer(){

    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf('/')+1);
    
    if (filename != "index.html") {
        $(".snap-drawers").html('<div class="snap-drawer snap-drawer-left">' +
                '<div>' +
                    '<h4>CRU is Coo</h4>' +
                    '<ul>' +
                        '<li><a href="../events/events.html">Events</a></li>' +
                        '<li><a href="../resources/resources.html">Resources</a></li>' +
                        '<li><a href="../missions/missions.html">Missions</a></li>' +
                        '<li><a href="../teams/teams.html">Teams</a></li>' +
                        '<li><a href="../cg/cg.html">Community Groups</a></li>' +
                        '<li><a href="../rides/rides.html">Rides</a></li>' +
                    '</ul>' +
                '</div>' +
            '</div>');
        
        $("#toolbar").html('<a href="#" id="open-left" data-snap-ignore="true">&#9776;</a>' +
                '<h1 class="align-center">CRU Baby</h1>' +
                '<br>' + $("#toolbar").html());
    }
        

}
/*    $.post(serverURL + "users",
    {
        name: "DonaldDuck"
    },
    function(data, status){
        var jData = JSON.parse(data);
        $("#userInfo").innerHTML = jData.id;
        window.localStorage.setItem("userID", jData.id);
        
        if (window.localStorage.getItem("pushID") !== null) {
        $.post(serverURL + "users/" + jData.id + "/push", 
        {
            token: window.localStorage.getItem("pushID"),  
            type: device.platform
        });
    }
    });
    console.log("got here");
    if (window.localStorage.getItem("pushID") !== null) {
        $("#userInfo").html(window.localStorage.getItem("pushID"));
    }
    else {
        $("#userInfo").html("Failed bro, anil messed up");
    }
}*/