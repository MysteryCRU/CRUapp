var utils = angular.module('starter.controllers.utils', []);

// creates a list of constants that are accessible anywhere
utils.constant('constants', {
    'BASE_SERVER_URL': 'http://ec2-52-91-208-65.compute-1.amazonaws.com:3002/api/',
    'PLACEHOLDER_IMAGE': 'img/cru-logo.jpg',
    'PERSON_IMAGE': 'img/person.png',
    'GCM_SENDER_ID': '276638088511',

    'CAMPUSES_CONFIG': 'campuses',
    'MY_RIDES_RIDER': 'myRidesRider',
    'MY_RIDES_DRIVER': 'myRidesDriver',
    'SELECTED_RIDE': 'selectedRide',
    'RIDER_SIGNUP_BACK_TO_START': -2,
    'RIDER_VIEW_DRIVER_BACK_TO_START': -1,
    'DRIVER_SIGNUP_BACK_TO_START': -1,
    'DRIVER_VIEW_RIDERS_BACK_TO_START': -1,
    'FILTER_DATE_RANGE': 6
});

// sets up easy access key value store for local storage on device
utils.factory('$localStorage', ['$window', function($window, constants) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        removeObject: function(key) {
            $window.localStorage.removeItem(key);
        }
    };
}]);

// utitity methods for making http requests/posts
utils.factory('req', ['$window', '$http', function($window, $http) {
    return {
        get: function(url, success, err) {
            // Simple GET request
            $http({
                method: 'GET',
                url: url
            }).then(success, err);
        },
        post: function(url, data, success, err) {
            $http.post(url, data).then(success, err);
        },
        delete: function(url, success, err) {
            // Simple GET request
            $http({
                method: 'DELETE',
                url: url
            }).then(success, err);
        }
    };
}]);

utils.factory('api', ['req', 'constants', function(req, constants) {
    return {
        getAllEvents: function(success, err) {
            var url = constants.BASE_SERVER_URL + 'events'; 
            req.get(url, success, err);
        },
        getMinistryEvents: function(params, success, err) {
            var url = constants.BASE_SERVER_URL + 'events/search';
            req.post(url, params, success, err);
        },
        getEvent: function(id, success, err) {
            var url = constants.BASE_SERVER_URL + 'events/' + id;
            req.get(url, success, err);
        },
        getAllMissions: function(success, err) {
            var url = constants.BASE_SERVER_URL + 'summermissions/';
            req.get(url, success, err);
        },
        getMission: function(id, success, err) {
            var url = constants.BASE_SERVER_URL + 'summermissions/' + id;
            req.get(url, success, err);
        },
        getAllTeams: function(success, err) {
            var url = constants.BASE_SERVER_URL + 'ministryteams/';
            req.get(url, success, err);
        },
        // sorry for the confusing name, but gets teams with ministry specific search params
        getMinistryTeams: function(params, success, err) {
            var url = constants.BASE_SERVER_URL + 'ministryteams/find';
            req.post(url, params, success, err);
        },
        getTeam: function(id, success, err) {
            var url = constants.BASE_SERVER_URL + 'ministryteams/' + id;
            req.get(url, success, err);
        },
        getMinistry: function(id, success, err) {
            var url = constants.BASE_SERVER_URL + 'ministries/' + id;
            req.get(url, success, err);
        },
		getAllCommunityGroups: function(success, err) {
            var url = constants.BASE_SERVER_URL + 'communitygroups/';
            req.get(url, success, err);
        },
		getCommunityGroup: function(id, success, err) {
			var url = constants.BASE_SERVER_URL + 'communitygroups/' + id;
            req.get(url, success, err);
		},
		getUser: function(id, success, err) {
			var url = constants.BASE_SERVER_URL + 'users/' + id;
            req.get(url, success, err);
		},
        getFilteredRides: function(params, success, err) {
            var url = constants.BASE_SERVER_URL + 'rides/find';
            req.post(url, params, success, err);
        },
        getFilteredUsers: function(params, success, err) {
            var validateUrl = constants.BASE_SERVER_URL + 'users/find';
            req.post(validateUrl, params, success, err);
        },
        createRide: function(params, success, err) {
            var url = constants.BASE_SERVER_URL + 'rides';
            req.post(url, params, success, err);
        },
        createPassenger: function(params, success, err) {
            var url = constants.BASE_SERVER_URL + 'passengers';
            req.post(url, params, success, err);
        },
        addPassenger: function(rideID, params, success, err) {
            var url = constants.BASE_SERVER_URL + 'rides/' + rideID + '/passengers';
            req.post(url, params, success, err);
        },
        getPassengers: function(driverID, success, err) {
            var url = constants.BASE_SERVER_URL + 'rides/' + driverID;
            req.get(url, success, err);
        },
        getDriver: function(driverID, success, err) {
            var url = constants.BASE_SERVER_URL + 'rides/' + driverID;
            req.get(url, success, err);
        },
        getPassenger: function(passengerID, success, err) {
            var url = constants.BASE_SERVER_URL + 'passengers/' + passengerID;
            req.get(url, success, err);
        },
        deleteRide: function(driverID, success, err) {
            var url = constants.BASE_SERVER_URL + 'rides/' + driverID;
            req.delete(url, success, err);
        },
        deletePassenger: function(driverID, passengerID, success, err) {
            var url = constants.BASE_SERVER_URL + 'rides/' + driverID + '/passengers/' + passengerID;
            req.delete(url, success, err);
        }
    };
}]);

// calendar utility for adding things to the native calendar
utils.factory('cal', ['$localStorage', '$cordovaCalendar', '$ionicPopup', function($localStorage, $cordovaCalendar, $ionicPopup) {
    return {
        addToCalendar: function(eventName, location, _id, originalStartDate, originalEndDate) {
            startDateAndTime = this.getTimeAndDate(originalStartDate);
            startDate = startDateAndTime[0];
            startTime = startDateAndTime[1];

            endDateAndTime = this.getTimeAndDate(originalEndDate);
            endDate = endDateAndTime[0];
            endTime = endDateAndTime[1];

            finalStartDate = this.createDate(startDate, startTime);    
            finalEndDate = this.createDate(endDate, endTime);

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
                var alertPopup = $ionicPopup.alert({
                    title: 'Event Added',
                    template: eventName + ' has been added to your calendar!'
                });
            }, function(err) {
                //If unsuccessful added, then an alert with a error should pop up
                console.error('There was an error: ' + err);
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Could not add event to calendar: ' + err
                });
            });
        },
        getTimeAndDate: function(timeAndDate) {
            //Split at the "T" to separate the date and time
            splitDateAndTime = timeAndDate.split('T');
            
            //Splitting up the date into pieces
            date = splitDateAndTime[0].split('-');
            
            //Splitting up the time into pieces
            time = splitDateAndTime[1].split(':');
            return [date, time];
        },
        createDate: function(date, time) {
            date = new Date(date[0], Number(date[1]) - 1, date[2], time[0], time[1], 0, 0, 0);
            return date;
        }
    };
}]);

// various convenience methods that are used in various parts of the app
utils.factory('convenience' , ['$location', '$ionicLoading', function($location, $ionicLoading) {
    return {
        contains: function(value, array) {
            for (val in array) {
                if (array[val] === value) {
                    return true;
                }
            }

            return false;
        },
        containsAtIndex: function(item, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].rideId === item) {
                    return i;
                }
            }

            return -1;
        },
        // takes a date object and makes the string to be seen by a user
        formatDate: function(date, includeDay) {
            var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var day = '';

            if (includeDay) {
                day = days[date.getDay()] + ' - ';
            }

            return day + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        },
        // takes a message that can be used to help locate an error, like where is was called
        // and returns a function that can be used by any function that requires an error callback
        defaultErrorCallback: function(controllerName, message) {
            return function(err) {
                $ionicLoading.hide();
                console.error(controllerName + ': ' + message);
                console.error(err);
                $location.path('/app/error');
            };
        },
        
        //Get the JSON object to send the the server from a location string
        getLocationObject: function(locationStr) {
            if (locationStr) {
                var splitStr = locationStr.split(",");
                var size = splitStr.length;
                var street, suburb, state, postcode;
                var country = "USA";
                var splitState;
                
                //get street address
                if (size >= 1) {
                    street = splitStr[0];
                }
                
                //get city
                if (size >= 2) {
                    suburb = splitStr[1];
                }
                
                //state and postal code
                if (size >= 3) {
                    splitState = splitStr[2].split(" ");
                    
                    if (splitState.length > 1) {
                        postcode = splitState[1];
                    }
                    
                    state = splitState[0];
                }
                
                return {
                    postcode: postcode,
                    suburb: suburb,
                    street1: street,
                    state: state,
                    country: country
                };
            }
            
            return {
                country: "USA"
            };
        },
        
        //Takes a location object and returns the formated address
        formatLocation: function(location) {
            var address = '';
            var country = 'USA';
            
            if (location) {
                //street address
                if (location.street1) {
                    address += location.street1;
                }
                
                //city
                if (location.suburb) {
                    address += ", " + location.suburb;
                }
                
                //state
                if (location.state) {
                    address += ", " + location.state;
                    
                    //postal code
                    if (location.postcode) {
                        address += " " + location.postcode;
                    }
                }
                
                address += country;
                console.log(address);
                return address;
            }
            
            return country;
        },

        showLoadingScreen: function(message) {
            $ionicLoading.show({
                delay: 1000,
                template: '<ion-spinner class="spinner-positive"></ion-spinner><br>' + message + '...',
                noBackdrop: true
             });
        },
        hideLoadingScreen: function() {
            $ionicLoading.hide();
        }
    };
}]);