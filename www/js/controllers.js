var module = angular.module('starter.controllers', ['starter.controllers.camp', 'starter.controllers.min', 'starter.controllers.rides', 'articles', 'videos', 'ngCordova', 'ionic','PushModule']);

// allows for access of variable across controllers
module.service('allEvents', function() {
    var events = [];

    return {
        getEvents: function() {
            return events;
        },
        setEvents: function(eventList) {
            events = eventList;
        }
    };
});

module.controller('AppCtrl', function($scope, $ionicModal, $timeout, $cordovaCalendar, $ionicPopup, $localStorage) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    //When a button is clicked, this method is invoked
    //Takes in as a param the eventName, startDate, endDate, and location
    $scope.addEventToCalendar = function(eventName, startDate, endDate, location, _id) {
        //Database has startDate as 2015-10-15T19:00:00.000Z
        //So I split at the "T" to seperate the date and time
        splitStartDateAndTime = startDate.split('T');
        //Splitting up the date into pieces
        splitStartDate = splitStartDateAndTime[0].split('-');
        //Splitting up the time into pieces
        splitStartTime = splitStartDateAndTime[1].split(':');

        //Same as before but now I am doing it for the end date
        splitEndDateAndTime = endDate.split('T');
        splitEndDate = splitEndDateAndTime[0].split('-');
        splitEndTime = splitEndDateAndTime[1].split(':');
        finalStartDate = new Date(splitStartDate[0], Number(splitStartDate[1]) - 1,
                                     splitStartDate[2], splitStartTime[0], splitStartTime[1], 0, 0, 0);
        finalEndDate = new Date(splitEndDate[0], Number(splitEndDate[1] - 1), splitEndDate[2],
                                   splitEndTime[0], splitEndTime[1], 0, 0, 0);
        console.log('Location: ' + location);

        helper_function_adding_calendar(eventName, location, finalStartDate, finalEndDate, _id, startDate, endDate);
    };

    helper_function_adding_calendar = function(eventName, location, finalStartDate, finalEndDate, _id, originalStartDate,
      originEndDate) {
        //Using ngcordova to create an event to their native calendar
        $cordovaCalendar.createEvent({
            title: eventName,
            location: location['street'],
            notes: 'This is a note',
            startDate: finalStartDate,
            endDate: finalEndDate
        }).then(function(result) {

            console.log('Event created successfully');

            //Get the data from the local storage of list of all added events
            list_of_added_events = $localStorage.getObject('list_of_added_events');
            if (list_of_added_events == null) {
                list_of_added_events = {};
            }
            list_of_added_events[_id] = {'name': eventName, 'location': location['street'], 'startDate': originalStartDate,
                  'endDate': originEndDate};
            //Added event information to local phone
            $localStorage.setObject('list_of_added_events', list_of_added_events);

            //If successfully added, then alert the user that it has been added
            var alertPopup = $ionicPopup.alert(
          {
              title: 'Event Added',
              template: eventName + ' has been added to your calendar :)'
          });

        }, function(err) {
            console.error('There was an error: ' + err);
            //If unsuccessful added, then an alert with a error should pop up
            //Not sure if we want to put the 'err' in the message
            //Get the data from the local storage of list of all added events

            //This needs to be removed, used for testing since i do not have android device
            list_of_added_events = $localStorage.getObject('list_of_added_events');
            list_of_added_events[_id] = {'name': eventName, 'location': location['street'], 'startDate': originalStartDate,
                  'endDate': originEndDate};
            //Added event information to local phone
            $localStorage.setObject('list_of_added_events', list_of_added_events);

            var alertPopup = $ionicPopup.alert(
          {
              title: 'Error',
              template: 'Could not add event to calendar: ' + err
          });
        });
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };

    //facebook setup
    $scope.showEventFacebook = function(url) {
        cordova.InAppBrowser.open(url, '_system', 'location=no');
    };
})

.controller('EventsCtrl', function($scope, $location, req, $localStorage, $location, req, constants, $ionicHistory, allEvents, $cordovaCalendar) {

    //reloads page everytime
    $scope.$on('$ionicView.enter', function() {

        var mins = $localStorage.getObject(constants.CAMPUSES_CONFIG).ministries;
        console.log(mins + 'hmmmm');
        var url;

        var events = [];
        var success = function(data) {
            jQuery.each(data.data, function(key, value) {
                var val = value;
                var locale = 'en-us';

                var eventDate = new Date(val.startDate);
                val.startDate = eventDate.toLocaleDateString(locale, {weekday: 'long'}) + ' - '            +
                            eventDate.toLocaleDateString(locale, {month: 'long'}) + ' '            +
                            eventDate.getDate() + ', ' + eventDate.getFullYear();

                // i <3 code duplication
                eventDate = new Date(val.endDate);
                val.endDate = eventDate.toLocaleDateString(locale, {weekday: 'long'}) + ' - '            +
                            eventDate.toLocaleDateString(locale, {month: 'long'}) + ' '            +
                            eventDate.getDate() + ', ' + eventDate.getFullYear();

                if (!value.image) {
                    val.image = {url: 'img/cru-logo.jpg'};
                }
                console.log('hello!');
                helper_function_updating_calendar(val);

                events.push(val);
            });
        };

        var err = function(response) {
            $location.path('/app/error');
        };

        console.log('MINISITRIES' + JSON.stringify(mins));

        if (mins === '' || mins === []) {
            url = constants.BASE_SERVER_URL + 'event/list';
            req.get(url , success, err);
            console.log('getting the event list\n');
        } else {

            url = constants.BASE_SERVER_URL + 'event/find?Content-Type: application/x-www-form-urlencoded';
            minsIds = [];
            for (var i = 0; i < mins.length; i++) {
                minsIds.push(mins[i]._id);
            }
            console.log('MINISITRYIDS' + JSON.stringify(minsIds));

            var queryParams = {
                'parentMinistries': {'$in': minsIds}
            };
            req.post(url, queryParams, success, err);
        }
        $scope.events = events;
        console.log('Events added: ' + events);
        allEvents.setEvents(events);
        $scope.goToEvent = function(id) {
            $location.path('/app/events/' + id);
        };
    });

    helper_function_updating_calendar = function(val) {
        console.log('In helper_function_updating_calendar!');
        //check if event changed
        list_of_added_events = $localStorage.getObject('list_of_added_events');
        info_for_event = list_of_added_events[val._id];
        if (!(info_for_event == null)) {
            console.log('I am in the infor_for_event check!');
            if (!(info_for_event['name'] == val.name && info_for_event['location'] ==
               val.location['street'] && info_for_event['startDate'] == val.startDate          &&
                      info_for_event['endDate'] == val.endDate)) {
                //The event was changed bro
                console.log('hi');
                update_event(info_for_event, val);
            }
        }
    };

    update_event = function(info_for_event, val) {
        $cordovaCalendar.deleteEvent({
            newTitle: info_for_event['name'],
            location: info_for_event['location'],
            notes: 'This is a note',
            startDate: info_for_event['startDate'],
            endDate: info_for_event['endDate']
        }).then(function(result) {
          // success
        }, function(err) {
            // error
        });
        helper_function_update_calendar(val);
    };

    helper_function_update_calendar = function(val) {
        //Using ngcordova to create an event to their native calendar
        $cordovaCalendar.createEvent({
            title: val.name,
            location:  val.location['street'],
            notes: 'This is a note',
            startDate: val.startDate,
            endDate: val.endDate
        }).then(function(result) {

            console.log('Event created successfully');

            //Get the data from the local storage of list of all added events
            list_of_added_events = $localStorage.getObject('list_of_added_events');

            list_of_added_events[val._id] = {'name': val.name, 'location': val.location['street'], 'startDate': val.startDate,
                'endDate': val.endDate};

            //Added event information to local phone
            $localStorage.setObject('list_of_added_events', list_of_added_events);

        }, function(err) {
            console.error('There was an error: ' + err);

        });
    };

})

.controller('EventCtrl', function($scope, $stateParams, $location, $localStorage, req, convenience, constants) {
    var url = constants.BASE_SERVER_URL + 'event/' + $stateParams.eventId;

    var val;

    var success = function(value) {
        val = value.data;
        var locale = 'en-us';

        // make the dates human readable
        var eventDate = new Date(val.startDate);
        val.startDate = eventDate.toLocaleDateString(locale, {weekday: 'long'}) + ' - '        +
                eventDate.toLocaleDateString(locale, {month: 'long'}) + ' '        +
                eventDate.getDate() + ', ' + eventDate.getFullYear();

        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

        // check to see if the user is riding or driving to the event
        var isDriving = convenience.contains(val._id, driving);
        var isRiding = convenience.contains(val._id, riding);

        $scope.isDriving = isDriving;
        $scope.isRiding = isRiding;
        $scope.myEvent = val;
    };

    var err = function(response) {
        $location.path('/app/error');
    };

    req.get(url, success, err);

    $scope.$on('$ionicView.beforeEnter', function() {
        if (val) {
            var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
            var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

            $scope.isDriving = convenience.contains(val._id, driving);
            $scope.isRiding = convenience.contains(val._id, riding);
        }
    });

    // button functions
    $scope.goToGetRide = function(id) {
        $location.path('/app/rides/' + id + '/drivers');
    };

    $scope.viewDriverInfo = function(id) {
        // Hard coded. Needs to be linked to server
        var driverID = 1;
        $location.path('/app/rides/' + id + '/driver/' + driverID);
    };

    $scope.signUpToDrive = function(id) {
        $location.path('/app/drive/' + id);
    };

    $scope.viewRidersInfo = function(id) {
        $location.path('/app/drive/' + id + '/riders');
    };
})

.controller('MissionsCtrl', function($scope, $location, req, constants) {
    var url = constants.BASE_SERVER_URL + 'summermission/list';
    var missions = [];
    var success = function(data) {
        jQuery.each(data.data, function(key, value) {
            var val = value;
            var locale = 'en-us';

            var eventDate = new Date(value.startDate);
            val.startDate = eventDate.toLocaleDateString(locale, {weekday: 'long'}) + ' - '          +
                      eventDate.toLocaleDateString(locale, {month: 'long'}) + ' '          +
                      eventDate.getDate() + ', ' + eventDate.getFullYear();

            if (!value.image) {
                val.image = {url: 'img/cru-logo.jpg'};
            }

            missions.push(val);
        });
    };

    var err = function(response) {
        $location.path('/app/error');
    };

    req.get(url, success, err);
    $scope.missions = missions;
    $scope.goToMission = function(id) {
        $location.path('/app/missions/' + id);
    };
})

.controller('MissionCtrl', function($scope, $stateParams, req, constants) {
    var url = constants.BASE_SERVER_URL + 'summermission/' + $stateParams.missionId;
    var success = function(value) {
        var val = value.data;
        var locale = 'en-us';

        // Make dates human readable
        var eventDate = new Date(val.startDate);
        var endDate = new Date(val.endDate);
        val.startDate = eventDate.toLocaleDateString(locale, {month: 'long'}) + ' '        +
                eventDate.getDate() + ', ' + eventDate.getFullYear();
        val.endDate = endDate.toLocaleDateString(locale, {month: 'long'}) + ' '        +
                endDate.getDate() + ', ' + endDate.getFullYear();

        $scope.mySummerMission = val;
    };

    var err = function(response) {
        $location.path('/app/error');
    };

    req.get(url, success, err);
});

