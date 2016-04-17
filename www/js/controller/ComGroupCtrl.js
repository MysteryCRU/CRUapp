var groups = angular.module('ComGroupCtrl', []);

var err = function(location) {
    return function(data) {
        location.path('app/error');
    };
};

var minSuccess = function(scope) {
    return function(data) {
        //not sure if needed yet
    };
};

var leaderSuccess = function(com, date, comGroups, scope) {
    return function(data) {
        var leader = data.data;
        var idx;

        comGroups.push({
            _id:  com._id,
            ministry: com.parentMinistry,
            time: date.time,
            days: date.day,
            leader: leader.name.first + " " + leader.name.last,
            description: com.description
        });
        
        scope.group = comGroups[0];
        scope.leaderPhone = leader.phone;
    };
};

var dayArr = [{name: "Sun", checked: false}, {name: "Mon", checked: false}, {name: "Tues", checked: false}, 
              {name: "Wed", checked: false}, {name: "Thurs", checked: false}, {name: "Fri", checked: false},
              {name: "Sat", checked: false}];

var parseDate = function(eventDate) {
    var locale = 'en-us';

    // check whether the date is am or pm
    var ampm = eventDate.getHours() >= 12 ? ' pm' : ' am';
    var tempMinutes = eventDate.getMinutes();
    var minutes;
    //adds 0 to time to resemble normal clock time
    if (tempMinutes < 10) {
        minutes = '0' + tempMinutes;
    } else {
        minutes = '' + tempMinutes;
    }
    // format the time to be 12 hours. The || means if the time is 0 bc 24hr format, make it 12
    var time = (eventDate.getHours() % 12 || 12) + ':' + minutes + ampm;
    var date = eventDate.toLocaleDateString(locale, {month: 'long'}) + ' ' +
        eventDate.getDate() + ', ' + eventDate.getFullYear();
    var day = dayArr[eventDate.getDay()];  
    
    if (day != 'undefined') {
        day = day.name;
    }
    
    return {
        time: time,
        date: date,
        day: day
    };
};

groups.controller('GroupCtrl', function($scope, $location, $ionicModal, constants, req) {
    /* populating with dummy data to be changed when the db actually contains these groups
    $scope.groups = [
        { _id: 1, leader: "Donald Trumpcard", time: "1pm - 4pm", days: "Mon, Wed, Fri" },
        { _id: 1, leader: "Cody Beers", time: "5pm - 8pm", days: "Mon, Wed, Fri" },
        { _id: 1, leader: "Willy Wonka", time: "8am - 11am", days: "Tues, Thurs" },
        { _id: 1, leader: "Codemaster Cody", time: "4pm - 6pm", days: "Mon, Tues, Wed, Thurs" },
        { _id: 1, leader: "Some Dude", time: "10am - 2pm", days: "Wed, Fri" },
        { _id: 1, leader: "Janet Jackson", time: "1pm - 4pm", days: "Mon, Wed, Fri" },
        { _id: 1, leader: "Giovanni Paulo Murillo", time: "9am - 12pm", days: "Tues, Fri" },
        { _id: 1, leader: "Katy Perry (dream gurl)", time: "10pm - 12am", days: "Mon, Tues, Wed, Thurs, Fri" },
    ];*/
    $scope.days = dayArr;
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    
    if (hours < 10) {
        hours = '0' + hours;
    }
    
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    
    console.log(hours + ':' + minutes + ':' + seconds);
    $scope.currentTime = hours + ':' + minutes + ':' + seconds;
    
        
    var comSuccess = function(data) {
        var comList = data.data;
        var idx;
        var comGroups = [];
        var com;
        var date;
        
        var userURL = constants.BASE_SERVER_URL + 'user/';
        
        for (idx = 0; idx < comList.length; idx++) {
            com = comList[idx];
            date = parseDate(new Date(com.meetingTime));
            
            req.get(userURL + com.leaders[0], leaderSuccess(com, date, comGroups, $scope), err($location));
        }
        
        $scope.groups = comGroups;
    };
    
    var comURL = constants.BASE_SERVER_URL + 'communitygroup/list';
    
    req.get(comURL, comSuccess, err($location));
    
    
    $scope.viewDetails = function(id) {
        $location.path('/app/groups/' + id);  
    };
    
    $ionicModal.fromTemplateUrl('templates/communitygroup/groupFilter.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.groupFilterModal = modal;
    });

    // Triggered in the modal to close it
    $scope.closeGroupFilterModal = function() {
        $scope.groupFilterModal.hide();
    };

    // Open the modal
    $scope.openGroupFilterModal = function() {
        $scope.groupFilterModal.show();
    };
    
    $scope.filterGroups = function() {
        // do stuff here  
    };
})

.controller('GroupDetailCtrl', function($scope, $stateParams, $ionicModal, $location, constants, req, $cordovaSms, $ionicPopup) {
    var id = $stateParams.id; 
    
    /*$scope.group = {
        _id: 1,
        leader: "Donald Trumpcard",
        time: "1pm - 4pm",
        days: "Mon, Wed, Fri",
        description: "This is the group where Donald Trump meets to indoctronize the people with fear mongering and other bad things. I hope you enjoyed my political commentary hidden deep with the depths of the CRU app. I'll be accepting applause later, thank you for your time"
    };*/
    var comSuccess = function(data) {
        var comGroups = [];
        var com = data.data;
        var date;
        
        var userURL = constants.BASE_SERVER_URL + 'user/';

        date = parseDate(new Date(com.meetingTime));
        req.get(userURL + com.leaders[0], leaderSuccess(com, date, comGroups, $scope), err($location));
        
        //$scope.group = comGroups[0];
    };
    
    var comURL = constants.BASE_SERVER_URL + 'communitygroup/' + id;
    
    req.get(comURL, comSuccess, err($location));
    
    
    $ionicModal.fromTemplateUrl('templates/communitygroup/groupSignup.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.groupSignupModal = modal;
    });

    // Triggered in the modal to close it
    $scope.closeSignupModal = function() {
        $scope.groupSignupModal.hide();
    };

    // Open the modal
    $scope.openSignupModal = function() {
        $scope.groupSignupModal.show();
    };
    
    $scope.signupForGroup = function(groupSignupData) {
        var name = groupSignupData.name;
        var email = groupSignupData.email;
        var phone = groupSignupData.phone;
        
        //CONFIGURATION
        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                //intent: 'INTENT'  // send SMS with the native android SMS messaging
                intent: '' // send SMS without open any other app
            }
        };
        var message = "I would love to be added to your community group. My name is " + name + 
            ". Please contact me by email: " + email + " or phone: " + phone; 
        
        //TODO change hardcoded phone to this: $scope.leaderPhone
        //currently Cody's Google Voice number for testing
        var phoneToSend = "8052257931";

        $cordovaSms
          .send(phoneToSend, message, options)
          .then(function() {
                var myPopup = $ionicPopup.show({
                        template: '<p>Your request was successfully sent. You will be notified sortly.</p>',
                        title: 'Send Confirmation',
                        scope: $scope,
                        buttons: [
                          {text: 'Ok'},
                        ]
                });
          }, function(error) {
            // An error occurred
          });
        
        $scope.closeSignupModal();
    };
});