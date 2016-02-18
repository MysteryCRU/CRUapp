var ride = angular.module('starter.controllers.rides', ['starter.controllers.utils']);

//returns false if not in the array and true otherwise
var checkArr = function(item, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].rideId === item) {
            return i;
        }
    }

    return -1;
};

var changeTriptype = function(triptype) {
    //change the triptype to fit the server
    if (triptype === 'One Way (from Event)') {
        triptype = 'from';
    } else if (triptype === 'One Way (to Event)') {
        triptype = 'to';
    } else {
        triptype = 'both';
    }

    return triptype;
};

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

    return {
        time: time,
        date: date
    };
};

ride.controller('RidesCtrl', function($scope, $location, $ionicHistory, $ionicPopup, req, $localStorage, allEvents, constants) {
    //TO DO CHANGE URL
    /* url = $ajax.buildQueryUrl(constants.BASE_SERVER_URL + 'events', "mins",
                                       mins);
     */

    //reload page everytime
    $scope.$on('$ionicView.enter', function() {
        var myrides = [];

        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

        $scope.title = 'Rides';
        myrides = allEvents.getEvents();

        //disable the buttons if already a driver/rider
        var isDriving;
        var isRiding;
        var index;

        //loop through the rides to see if currently driving or riding
        for (index = 0; index < myrides.length; ++index) {
            isDriving = false;
            isRiding = false;

            if (checkArr(myrides[index]._id, driving) != -1) {
                isDriving = true;
            } else if (checkArr(myrides[index]._id, riding) != -1) {
                isRiding = true;
            }

            //adding the button text for the event
            myrides[index].driving = isDriving;
            myrides[index].riding = isRiding;
        }

        $scope.rides = myrides;
    });

    $scope.goToRideData = function(tempID, isDriving) {

        if (!isDriving) {
            var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);
            var isRider = checkArr(tempID, riding);

            if (isRider != -1) {
                var driverID = riding[isRider].driverId;
                $location.path('/app/rides/' + tempID + '/driver/' + driverID);
            } else {
                $location.path('/app/rides/' + tempID + '/drivers');
            }
        } else {
            var myPopup = $ionicPopup.show({
                template: '<p>Sorry, but you cannot get a ride to an event if you are already signed up as a driver.</p>',
                title: '<b>You Cannot Ride and Drive</b>',
                scope: $scope,
                buttons: [
                  {text: 'Ok', type: 'button-balanced'},
                ]
            });
        }
    };

    $scope.goToDriveData = function(tempID, isRiding) {

        // if the user is already a rider, don't allow them to sign up to drive
        if (!isRiding) {
            var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
            var isDriver = checkArr(tempID, driving);

            //if a driver for this event
            if (isDriver != -1) {
                $location.path('/app/drive/' + tempID + '/riders' + '/' + driving[isDriver].driverId);
            } else {
                $location.path('/app/drive/' + tempID);
            }
        } else {
            var myPopup = $ionicPopup.show({
                template: '<p>Sorry, but you cannot drive to an event if you are already signed up to be a rider</p>',
                title: '<b>You Cannot Drive and Ride</b>',
                scope: $scope,
                buttons: [
                  {text: 'Ok', type: 'button-balanced'},
                ]
            });
        }
    };
})

//form for signing up to be a rider
.controller('GetRideCtrl', function($scope, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams) {
    var eventID = $stateParams.rideId;
    var driveId = $stateParams.driverId;

    $scope.getRide = function(name, phone, triptype) {
        //get correct triptype for the server
        triptype = changeTriptype(triptype);

        var success = function(data) {
            var passenger = data.data.post;
            var id = passenger._id;

            var addSuccess = function(data) {
                var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

                //the local storage is currently empty
                if (typeof riding.length === 'undefined' || riding.length === 0) {
                    riding = [];
                    riding.push({
                        rideId: eventID,
                        driverId: driveId,
                        passengerId: id
                    });
                }
                //if the rider is not currently in the local storage
                else if (checkArr(eventID, riding) === -1) {
                    riding.push({
                        rideId: eventID,
                        driverId: driveId,
                        passengerId: id
                    });
                }

                $localStorage.setObject(constants.MY_RIDES_RIDER, riding);
            };

            var addErr = function(xhr, text, err) {
                console.log('add passenger error');
            };

            var addUrl = constants.BASE_SERVER_URL + 'ride/addPassenger';
            var addQuery = {
                ride_id: driveId,
                passenger_id: id
            };

            //adds the new passenger to the ride
            req.post(addUrl, addQuery, addSuccess, addErr);
        };

        var err = function(xhr, text, err) {
            //if there is an error (ie 404, 500, etc) redirect to the error page
            $location.path('/app/error');
        };

        var url = constants.BASE_SERVER_URL + 'passenger/create';
        var query = {
            name: name,
            phone: phone,
            direction: triptype
            /* TODO fill in the gcm_id */
        };

        //create a new passenger
        req.post(url, query, success, err);

        $ionicHistory.goBack(constants.RIDER_SIGNUP_BACK_TO_START);
    };
})

//list of drivers to choose from
.controller('ChooseDriverCtrl', function($scope, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams, $ionicModal) {
    //id from the url
    var rideID = $stateParams.rideId;

    var mydrivers = [];
    var fullDriverList = [];

    $ionicModal.fromTemplateUrl('templates/rideSharing/filterModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    //filters rides based on input from the user
    $scope.filterRides = function(date) {

        //function to call when the query is successful for filtering
        var filterSuccess = function(data) {
            var rides = data.data;
            mydrivers = [];
            /*TODO change mydrivers based on data given back*/
            for (var i = 0; i < rides.length; i++) {
                ride = rides[i];

                var eventDate = parseDate(new Date(ride.time));

                mydrivers.push({
                    id: ride._id,
                    event_id: ride.event,
                    name: ride.driverName,
                    phone: ride.driverNumber,
                    time: eventDate.time,
                    date: eventDate.date,
                    pickup: ride.location.country
                });
            }

            $scope.drivers = mydrivers;

        };

        var filterErr = function(xhr, text, err) {
            //if there is an error (ie 404, 500, etc) redirect to the error page
            $location.path('/app/error');
        };

        //query with a 6 hour range for the database
        //the start date for the range of the query
        var startDate = new Date(date);
        var startTime = startDate.getHours() - constants.FILTER_DATE_RANGE;
        if (startTime < 0) {
            startTime = 0;
        }
        startDate.setHours(startTime);

        //the end range of the query
        var endDate = new Date(startDate);
        var endTime = endDate.getHours() + (constants.FILTER_DATE_RANGE * 2);
        if (endTime > 24) {
            endTime = 24;
        }
        endDate.setHours(endTime);

        var filterQuery = {
            time: {
                $gt: startDate,
                $lt: endDate
            },
            event: rideID

        };
        var filterUrl = constants.BASE_SERVER_URL + 'ride/find';

        //filters the drivers by date driving and event
        req.post(filterUrl, filterQuery, filterSuccess, filterErr);
    };

    //success callback for overall query for all the drivers in an event
    var success = function(data) {
        rides = data.data;
        for (var i = 0; i < rides.length; i++) {
            ride = rides[i];

            var eventDate = parseDate(new Date(ride.time));

            mydrivers.push({
                id: ride._id,
                event_id: ride.event,
                name: ride.driverName,
                phone: ride.driverNumber,
                time: eventDate.time,
                date: eventDate.date,
                pickup: ride.location.country
            });

        }
        $scope.drivers = mydrivers;
        fullDriverList = mydrivers;
    };

    var err = function(xhr, text, err) {
        //if there is an error (ie 404, 500, etc) redirect to the error page
        $location.path('/app/error');
    };

    //query for only the selected event
    var fullQuery = {
        event: rideID
    };

    var url = constants.BASE_SERVER_URL + 'ride/find';
    req.post(url, fullQuery, success, err);

    $scope.chooseDriver = function(driveId) {
        $location.path('/app/rides/' + rideID + '/get/' + driveId);
    };

    $scope.clearFilters = function() {
        mydrivers = fullDriverList;
        $scope.drivers = mydrivers;
    };
})

.controller('GiveRideCtrl', function($scope, $ionicPopup, $timeout, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams) {
    //id from the url
    var tempID = $stateParams.rideId;

    $scope.checkRider = function(name, phonenumber, location, seats, leaving, triptype) {

        //change the triptype to fit the server
        triptype = changeTriptype(triptype);

        //create the post call to create the driver in the DB
        var url = constants.BASE_SERVER_URL + 'ride/create';
        var data = {
            gcm_id: 'dummy_id',
            driverName: name,
            driverNumber: phonenumber,
            /* TODO fill in the location */
            //location: location,
            event: tempID,
            direction: triptype,
            seats: seats,
            time: leaving
        };

        //check if rider is valid by name in DB
        /* TODO: change this valid statement */
        var valid = true;
        if (!valid) {
            //popup for driver error
            var myPopup = $ionicPopup.show({
                template: '<p>Sorry, you are not a valid driver.</p>',
                title: 'Driver Error',
                scope: $scope,
                buttons: [
                  {text: 'Ok'},
                ]
            });

            myPopup.then(function(res) {
                console.log('Driver Error', res);
            });

            $timeout(function() {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        } else {
            var success = function(data) {
                var driveID = data.data.post._id;
                console.log('Drive ID: ' + driveID);

                var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);

                if (typeof driving.length === 'undefined' || driving.length === 0) {
                    console.log('Not driving yet');
                    driving = [];
                    driving.push({
                        rideId: tempID,
                        driverId: driveID
                    });
                } else if (checkArr(tempID, driving) === -1) {
                    driving.push({
                        rideId: tempID,
                        driverId: driveID
                    });
                }

                $localStorage.setObject(constants.MY_RIDES_DRIVER, driving);

                $ionicHistory.goBack(constants.DRIVER_SIGNUP_BACK_TO_START);
            };

            var fail = function(data) {
                //if there is an error (ie 404, 500, etc) redirect to the error page
                $location.path('/app/error');
            };

            //create new driver for the given event
            req.post(url, data, success, fail);
        }
    };

})

.controller('DriverViewCtrl', function($scope, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams) {
    //id from the url
    var rideID = $stateParams.rideId;
    var driverID = $stateParams.driverId;

    var success = function(data) {
        var driverInfo = data.data;

        var eventDate = parseDate(new Date(driverInfo.time));

        var mydriver = {
            id: driverID,
            name: driverInfo.driverName,
            phone: driverInfo.driverNumber,
            time: eventDate.time,
            date: eventDate.date,
            pickup: driverInfo.location.country
        };

        $scope.driver = mydriver;
    };

    var err = function(xhr, text, err) {
        //if there is an error (ie 404, 500, etc) redirect to the error page
        $location.path('/app/error');
    };

    var url = constants.BASE_SERVER_URL + 'ride/' + driverID;
    //gets the riders information
    req.get(url, success, err);

    $scope.cancelRide = function() {
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);
        var idx = checkArr(rideID, riding);
        if (idx != -1) {
            var dropSuccess = function(data) {
                //do nothing for now
            };

            var dropErr = function(xhr, text, err) {
                console.log('error dropping the passenger');
            };

            var dropUrl = constants.BASE_SERVER_URL + 'ride/dropPassenger';
            var dropQuery = {
                ride_id: driverID,
                passenger_id: riding[idx].passengerId
            };

            //deletes passenger on the database
            req.post(dropUrl, dropQuery, dropSuccess, dropErr);

            riding.splice(idx, 1);
            $localStorage.setObject(constants.MY_RIDES_RIDER, riding);
        }

        /* TODO: (push) notify riders that the driver canceled */

        $ionicHistory.goBack(constants.DRIVER_VIEW_RIDERS_BACK_TO_START);
    };

})

.controller('RideListCtrl', function($scope, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams) {
    //id from the url
    var rideID = $stateParams.rideId;
    var driverID = $stateParams.driverId;

    var success = function(data) {
        var myriders = [];
        var passengers = data.data.passengers;
        console.log(passengers);
        var passUrl = constants.BASE_SERVER_URL + 'passenger/';

        var passSuccess = function(data) {
            var pass = data.data;

            myriders.push({
                name: pass.name,
                phone: pass.phone
            });
        };

        var passErr = function(data) {
            //do nothing for now
        };

        for (var idx = 0; idx < passengers.length; idx++) {
            //get each passengers info
            req.get(passUrl + passengers[idx], passSuccess, passErr);
        }

        $scope.riders = myriders;
    };

    var err = function(xhr, text, err) {
        //if there is an error (ie 404, 500, etc) redirect to the error page
        $location.path('/app/error');
    };

    var url = constants.BASE_SERVER_URL + 'ride/' + driverID;
    //get the passenger information from the given driver
    req.get(url, success, err);

    $scope.cancelRide = function() {
        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var idx = checkArr(rideID, driving);
        if (idx != -1) {
            driving.splice(idx, 1);
            $localStorage.setObject(constants.MY_RIDES_DRIVER, driving);
        }

        /* TODO: delete driver from database */
        /* TODO: (push) notify riders that the driver canceled */

        $ionicHistory.goBack(constants.DRIVER_VIEW_RIDERS_BACK_TO_START);
    };

});
