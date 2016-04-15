var eventCtrl = angular.module('EventCtrl', []);

//timeAndDate is in the form 2015-10-15T19:00:00.000Z
//returns an array with:
//index 0: date
//index 1: time
eventCtrl.getTimeAndDate = function(timeAndDate)
{
    //Split at the "T" to separate the date and time
    splitDateAndTime = timeAndDate.split('T');
    
    //Splitting up the date into pieces
    date = splitDateAndTime[0].split('-');
    
    //Splitting up the time into pieces
    time = splitDateAndTime[1].split(':');

    return [date, time];
}

//Takes in date and time to return Date object
eventCtrl.createDate = function(date, time)
{
    date = new Date(date[0], Number(date[1]) - 1, date[2], time[0], time[1], 0, 0, 0);
    return date;
}

eventCtrl.controller('EventsCtrl', function($scope, $location, req, $localStorage, $location, req, constants, $ionicHistory, allEvents, $cordovaCalendar, convenience) {
    //reloads page everytime
    $scope.$on('$ionicView.enter', function() {
        var mins = $localStorage.getObject(constants.CAMPUSES_CONFIG).ministries;
        var url;

        var events = [];
        var success = function(data) {
            data.data.forEach(function(value) {
                var val = value;

                val.secretStartDate = val.startDate;
                val.secretEndDate = val.endDate;
                val.startDate = convenience.formatDate(new Date(val.startDate), true);
                val.endDate = convenience.formatDate(new Date(val.endDate), true);
				
                if (!value.image) {
                    val.image = {url: constants.PLACEHOLDER_IMAGE};
                }

                helperFunctionUpdatingCalendar(val);
                events.push(val);
            });
        };

        var err = convenience.defaultErrorCallback('EventCtrl',
            'Could not retrieve list of events from the server');


        if (mins === '' || mins === [] || typeof mins === 'undefined') {
            url = constants.BASE_SERVER_URL + 'events/';
            req.get(url , success, err);
        } else {
            url = constants.BASE_SERVER_URL + 'events/search';
            minsIds = [];
            for (var i = 0; i < mins.length; i++) {
                minsIds.push(mins[i]._id);
            }

            var queryParams = {
                'ministries': {'$in': minsIds}
            };
            req.post(url, queryParams, success, err);
        }

        $scope.events = events;
        allEvents.setEvents(events);

        $scope.goToEvent = function(id) {
            $location.path('/app/events/' + id);
        };
    });


    var helperFunctionUpdatingCalendar = function(val) {
        //check if event changed
        listOfAddedEvents = $localStorage.getObject('listOfAddedEvents');
        infoForEvent = listOfAddedEvents[val._id];

        if (!(infoForEvent == null)) {
            if (!(infoForEvent['name'] === val.name && JSON.stringify(infoForEvent['location']) ===
               JSON.stringify(val.location['street']) && infoForEvent['secretStartDate'] === val.secretStartDate &&
                infoForEvent['secretEndDate'] === val.secretEndDate)) {
                //The event was changed bro
                updateEvent(infoForEvent, val);
            }
        }
    };

    var updateEvent = function(infoForEvent, val) {
        var originalStartDate = infoForEvent['secretStartDate'];
        var originalEndDate = infoForEvent['secretEndDate'];
        
        startDateAndTime = eventCtrl.getTimeAndDate(originalStartDate);
        startDate = startDateAndTime[0];
        startTime = startDateAndTime[1];

        endDateAndTime = eventCtrl.getTimeAndDate(originalEndDate);
        endDate = endDateAndTime[0];
        endTime = endDateAndTime[1];

        finalStartDate = eventCtrl.createDate(startDate, startTime);    
        finalEndDate = eventCtrl.createDate(endDate, endTime);
        
        $cordovaCalendar.deleteEvent({
            newTitle: infoForEvent['name'],
            location: infoForEvent['location'],
            startDate: finalStartDate,
            endDate: finalEndDate
        }).then(function(result) {
            helperFunctionUpdateCalendar(val);
            // success
        }, function(err) {
            // error
            console.error("Failed to delete event from calender: " + err);
        });
    };

    var helperFunctionUpdateCalendar = function(val) {
      var originalStartDate = val.secretStartDate;
      var originalEndDate = val.secretEndDate;

      startDateAndTime = eventCtrl.getTimeAndDate(originalStartDate);
      startDate = startDateAndTime[0];
      startTime = startDateAndTime[1];

      endDateAndTime = eventCtrl.getTimeAndDate(originalEndDate);
      endDate = endDateAndTime[0];
      endTime = endDateAndTime[1];

      finalStartDate = eventCtrl.createDate(startDate, startTime);    
      finalEndDate = eventCtrl.createDate(endDate, endTime);

      //Using ngcordova to create an event to their native calendar
      $cordovaCalendar.createEvent({
          title: val.name,
          location:  val.location['street'],
          startDate: finalStartDate,
          endDate: finalEndDate
      }).then(function(result) {
          //Get the data from the local storage of list of all added events
          listOfAddedEvents = $localStorage.getObject('listOfAddedEvents');

          listOfAddedEvents[val._id] = {'name': val.name, 'location': val.location['street'], 'secretStartDate': val.secretStartDate,
          'secretEndDate': val.secretEndDate};

          //Added event information to local phone
          $localStorage.setObject('listOfAddedEvents', listOfAddedEvents);
      }, function(err) {
          console.error('There was an error: ' + err);
      });
    };

})

.controller('EventCtrl', function($scope, $stateParams, $location, $localStorage, $cordovaCalendar, $ionicPopup, $cordovaInAppBrowser, req, convenience, constants) {
    var url = constants.BASE_SERVER_URL + 'events/' + $stateParams.eventId;
    var val;

    var success = function(value) {
        val = value.data;

        // make the dates human readable
        val.secretStartDate = val.startDate;
        val.secretEndDate = val.endDate;
        val.startDate = convenience.formatDate(new Date(val.startDate), true);

        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

        // check to see if the user is riding or driving to the event
        $scope.isDriving = convenience.containsAtIndex(val._id, driving) >= 0 ? true : false;
        $scope.isRiding = convenience.containsAtIndex(val._id, riding) >= 0 ? true : false;
        $scope.myEvent = val;
    };

    var err = convenience.defaultErrorCallback('EventCtrl', 
        'Could not retrieve event ' + $stateParams.eventId + ' from the server');

    req.get(url, success, err);

    $scope.$on('$ionicView.enter', function() {
        if (val) {
            var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
            var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

            $scope.isDriving = convenience.containsAtIndex(val._id, driving) >= 0 ? true : false;
            $scope.isRiding = convenience.containsAtIndex(val._id, riding) >= 0 ? true : false;
        }
    });

    //When a button is clicked, this method is invoked
    //Takes in as a param the eventName, startDate, endDate, and location
    $scope.addEventToCalendar = function(eventName, location, _id, originalStartDate, originalEndDate) {
        
        startDateAndTime = eventCtrl.getTimeAndDate(originalStartDate);
        startDate = startDateAndTime[0];
        startTime = startDateAndTime[1];

        endDateAndTime = eventCtrl.getTimeAndDate(originalEndDate);
        endDate = endDateAndTime[0];
        endTime = endDateAndTime[1];

        finalStartDate = eventCtrl.createDate(startDate, startTime);    
        finalEndDate = eventCtrl.createDate(endDate, endTime);

        helperFunctionAddingCalendar(eventName, location, finalStartDate, finalEndDate, _id, originalStartDate, originalEndDate);
    };

    var helperFunctionAddingCalendar = function(eventName, location, finalStartDate, finalEndDate, _id, originalStartDate,
        originalEndDate) 
    {

        //Using ngcordova to create an event to their native calendar
        $cordovaCalendar.createEvent({
            title: eventName,
            location: location['street'],
            startDate: finalStartDate,
            endDate: finalEndDate
        }).then(function(result) {

            //Get the data from the local storage of list of all added events
            listOfAddedEvents = $localStorage.getObject('listOfAddedEvents');
            
            if (listOfAddedEvents == null) {
                listOfAddedEvents = {};
            }

            listOfAddedEvents[_id] = {'name': eventName, 'location': location['street'], 
                'secretStartDate': originalStartDate, 'secretEndDate': originalEndDate};
            
            //Added event information to local phone
            $localStorage.setObject('listOfAddedEvents', listOfAddedEvents);

            //If successfully added, then alert the user that it has been added
            var alertPopup = $ionicPopup.alert(
            {
                title: 'Event Added',
                template: eventName + ' has been added to your calendar!'
            });

        }, function(err) {
            console.error('There was an error: ' + err);
            //If unsuccessful added, then an alert with a error should pop up

            var alertPopup = $ionicPopup.alert(
            {
                title: 'Error',
                template: 'Could not add event to calendar: ' + err
            });
        });
    };

    // button functions
    $scope.goToGetRide = function(id) {
        $location.path('/app/rides/' + id + '/drivers');
    };

    $scope.viewDriverInfo = function(id) {
        var rides = $localStorage.getObject(constants.MY_RIDES_RIDER);
        var index = convenience.containsAtIndex(id, rides);
        $location.path('/app/rides/' + id + '/driver/' + rides[index].driverId);
    };

    $scope.signUpToDrive = function(id) {
        $location.path('/app/drive/' + id);
    };

    $scope.viewRidersInfo = function(id) {
        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var index = convenience.containsAtIndex(id, driving);
        $location.path('/app/drive/' + id + '/riders/' + driving[index].driverId);
    };
    
    $scope.showEventFacebook = function(url) {
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        var options = {};
        var browserType = '';
        if (isIOS)
        {
            options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'yes',
                zoom: 'no'
            };
            browserType = '_blank';
        }
        else if (isAndroid)
        {
            options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'no',
                zoom: 'no'
            };
            browserType = '_system';
        }
        $cordovaInAppBrowser.open(url, browserType, options);
    };
});