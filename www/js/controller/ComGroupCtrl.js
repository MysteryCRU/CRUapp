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
			machineTime: new Date(com.meetingTime),
            days: date.day,
            leader: leader.name.first + " " + leader.name.last,
            description: com.description,
			name: com.name
        });
        
        scope.group = comGroups[0];
        scope.leaderPhone = leader.phone;
    };
};

var dayArr = [{name: "Sun", checked: false}, {name: "Mon", checked: false}, {name: "Tues", checked: false}, 
              {name: "Wed", checked: false}, {name: "Thurs", checked: false}, {name: "Fri", checked: false},
              {name: "Sat", checked: false}];
var comGroups = [];
var searchResults = [];


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
    
    if (typeof day != 'undefined') {
        day = day.name;
    }
    
    return {
        time: time,
        date: date,
        day: day
    };
};
var foo = {timeStart: new Date(), timeEnd: new Date()};
groups.controller('GroupCtrl', function($scope, $location, $ionicModal, constants, api) {
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
    $scope.currentTime = new Date();
    
        
    var comSuccess = function(data) {
        console.log(data);
        var comList = data.data;
        var idx;
        comGroups = [];
        var com;
        var date;
        
        
        for (idx = 0; idx < comList.length; idx++) {
            com = comList[idx];
            date = parseDate(new Date(com.meetingTime));
            console.log(idx);
			api.getUser(com.leaders[0]._id, leaderSuccess(com, date, comGroups, $scope), err($location));
        }

        $scope.groups = comGroups;
    };
    
	api.getAllCommunityGroups(comSuccess, err($location));
    
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
	
	matchesDay = function(day, dayarr) {
		for (idx = 0; idx < dayarr.length; idx++) {
			var dayOption = dayarr[idx];
			if (day == dayOption.name && dayOption.checked) {
				return true;
			}
		}
		return false;
	}
	
	matchesTime = function(time, timePeriod) {
		time.setFullYear(2015);
		time.setDate(30);
		time.setMonth(7);
		var morningEveningThresh = new Date(2015, 7, 30, 0, 0, 0, 0).getTime();
		var morningAfternoonThresh = new Date(2015, 7, 30, 12, 0, 0, 0).getTime();
		var afternoonEveningThresh = new Date(2015, 7, 30, 18, 0, 0, 0).getTime();
		var eveningMorningThresh = new Date(2015, 7, 30, 23, 59, 59, 999).getTime();
		console.log("time is " + time);
		if (timePeriod == "Morning") {
			return time <= morningAfternoonThresh && time > morningEveningThresh;
		}
		else if (timePeriod == "Afternoon") {
			console.log(morningAfternoonThresh);
			console.log(afternoonEveningThresh);
			return time <= afternoonEveningThresh && time > morningAfternoonThresh;
		}
		else {
			return time <= eveningMorningThresh && time > afternoonEveningThresh;
		}
	};
	
	isMatch = function(group, options) {
		return matchesDay(group.days, options.days) && matchesTime(group.machineTime, options.time);
	};
    
    $scope.isSearchingIOS = false;
    $scope.isSearchingAndroid = false;
    $scope.filterGroups = function(meetTime) { 
        $scope.isSearchingIOS = ionic.Platform.isIOS();
        $scope.isSearchingAndroid = ionic.Platform.isAndroid();

		searchResults = [];
		var options = {days: $scope.days, time: meetTime};
		for (var idx = 0; idx < comGroups.length; idx++) {
            var group = comGroups[idx];
			if (isMatch(group, options)) {
				searchResults.push(group);
			}
        }
		
        $scope.search = searchResults[0].days + ' ' + options.time; 
        $scope.groups = searchResults;
		$scope.groupFilterModal.hide();
    };

    $scope.removeResults = function() {
        $scope.isSearchingIOS = false;
        $scope.isSearchingAndroid = false;
        $scope.groups = comGroups;
    };
})

.controller('GroupDetailCtrl', function($scope, $stateParams, $ionicModal, $location, constants, api, $cordovaSms, $ionicPopup) {
    var id = $stateParams.id; 
    $scope.groupSignupData = {};
    var comSuccess = function(data) {
        var comGroups = [];
        var com = data.data;
        var date;

        date = parseDate(new Date(com.meetingTime));
        api.getUser(com.leaders[0]._id, leaderSuccess(com, date, comGroups, $scope), err($location));
    };
    
	api.getCommunityGroup(id, comSuccess, err($location));
    
    
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
    
    $scope.signupForGroup = function() {

        var name = $scope.groupSignupData.name;
        var email = $scope.groupSignupData.email;
        var phone = $scope.groupSignupData.phone;
        
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
})

