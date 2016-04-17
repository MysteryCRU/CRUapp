/**
* This module is dedicated to creating Mock objects 
* for services that are created in the CRU application
*/
var cruMocks = angular.module('CruMocks',[]);

/**
* This local storage stub stores all values within a regular json object 
* We keep this out of our window's local storage to not mess with multiple
* Unit tests.
*/

cruMocks.factory('$localStorage', function(){
   var store = {};
   return {
      set: function(key, value) {
         store[key] = value;
      },
      get: function(key, defaultValue) {
         return store[key] || defaultValue;
      },
      setObject: function(key, value) {
          store[key] = JSON.stringify(value);
      },
      getObject: function(key) {
          return JSON.parse(store[key] || '{}');
      },
      removeObject: function(key) {
          delete store[key];
      }
   };
});


cruMocks.factory('selectedCampuses', function(){
  var campusesList = [];
  return {
      getCampuses: function() {
          return campusesList;
      },
      setCampuses: function(campusesList) {
          campusesList = campusesList; 
      },
      getCampusesObject: function() {
          return {};
      }
  };
});

/**
* This service is kept similar to its original counterpart because what
* it wraps, $http, is already mocked with angular-mocks
* To send back the data you want use $httpBackend
*/
cruMocks.factory('req', function($http){
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

        buildQueryUrl: function(url, varName, values) {

            varName += '[]=';

            if (values.length > 0) {
                url += '?' + varName + '' + values[0]._id;
                for (var i = 1; i < values.length; ++i) {
                    url += '&' + varName + '' + values[i]._id;
                }
            }

            return url;
        }
    };
});

cruMocks.constant('constants', {
    'BASE_SERVER_URL': 'http://ec2-52-91-208-65.compute-1.amazonaws.com:3001/api/',
    'PLACEHOLDER_IMAGE': 'img/cru-logo.jpg',
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

cruMocks.factory('convenience' , ['$location', function($location) {
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
            return {country: "USA"};
        },
        
        //Takes a location object and returns the formated address
        formatLocation: function(location) {
            return "USA";
        }
    };
}]);

// allows for access of variable across controllers
cruMocks.service('allEvents', function() {
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