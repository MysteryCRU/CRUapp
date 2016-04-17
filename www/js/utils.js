var utils = angular.module('starter.controllers.utils', []);

// creates a list of constants that are accessible anywhere
utils.constant('constants', {
    'BASE_SERVER_URL': 'http://ec2-52-91-208-65.compute-1.amazonaws.com:3001/api/',
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
        }
    };
}]);

// various convenience methods that are used in various parts of the app
utils.factory('convenience' , ['$location', function($location) {
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
        }
    };
}]);