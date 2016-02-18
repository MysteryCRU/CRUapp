// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
    console.log('App setup');
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

  .state('app.splash', {
      url: '/splash',
      views: {
          'menuContent': {
              templateUrl: 'templates/splash.html',
              controller: 'AppCtrl'
          }
      }
  })

  .state('app.campuses', {
      url: '/campuses',
      views: {
          'menuContent': {
              templateUrl: 'templates/signup.html',
              controller: 'CampusCtrl'
          }
      }
  })

  .state('app.ministries', {
      url: '/ministries',
      views: {
          'menuContent': {
              templateUrl: 'templates/ministries.html',
              controller: 'MinCtrl'
          }
      }
  })

  .state('app.search', {
      url: '/search',
      views: {
          'menuContent': {
              templateUrl: 'templates/search.html'
          }
      }
  })

  .state('app.settings', {
      url: '/settings',
      views: {
          'menuContent': {
              templateUrl: 'templates/settings.html'
          }
      }
  })

  .state('app.events', {
      url: '/events',
      views: {
          'menuContent': {
              templateUrl: 'templates/events.html',
              controller: 'EventsCtrl'
          }
      }
  })

  .state('app.single', {
      url: '/events/:eventId',
      views: {
          'menuContent': {
              templateUrl: 'templates/event.html',
              controller: 'EventCtrl'
          }
      }
  })

  // main rides list by event
  .state('app.rides', {
      url: '/rides',
      views: {
          'menuContent': {
              templateUrl: 'templates/rideSharing/rides.html',
              controller: 'RidesCtrl'
          }
      }
  })

  // main drives list by event
  .state('app.drive', {
      url: '/drive',
      views: {
          'menuContent': {
              templateUrl: 'templates/rideSharing/drives.html',
              controller: 'RidesCtrl'
          }
      }
  })

  // form for driver
  .state('app.giveRide', {
      url: '/drive/:rideId',
      views: {
          'menuContent': {
              templateUrl: 'templates/rideSharing/give.html',
              controller: 'GiveRideCtrl'
          }
      }
  })

  // form for the rider
  .state('app.getRide', {
      url: '/rides/:rideId/get/:driverId',
      views: {
          'menuContent': {
              templateUrl: 'templates/rideSharing/get.html',
              controller: 'GetRideCtrl'
          }
      }
  })

  // drivers that are available for the event (before form for rider)
  .state('app.rideDriverList', {
      url: '/rides/:rideId/drivers',
      views: {
          'menuContent': {
              templateUrl: 'templates/rideSharing/driverList.html',
              controller: 'ChooseDriverCtrl'
          }
      }
  })

  // Signed up for ride as rider, shows driver info
  .state('app.rideDriver', {
      url: '/rides/:rideId/driver/:driverId',
      views: {
          'menuContent': {
              templateUrl: 'templates/rideSharing/driver.html',
              controller: 'DriverViewCtrl'
          }
      }
  })

  // signed up to drive, list of riders
  .state('app.giveList', {
      url: '/drive/:rideId/riders/:driverId',
      views: {
          'menuContent': {
              templateUrl: 'templates/rideSharing/ridersList.html',
              controller: 'RideListCtrl'
          }
      }
  })

  .state('app.missions', {
      url: '/missions',
      views: {
          'menuContent': {
              templateUrl: 'templates/missions.html',
              controller: 'MissionsCtrl'
          }
      }
  })

  .state('app.mission', {
      url: '/missions/:missionId',
      views: {
          'menuContent': {
              templateUrl: 'templates/mission.html',
              controller: 'MissionCtrl'
          }
      }
  })

  .state('app.error', {
      url: '/error',
      views: {
          'menuContent': {
              templateUrl: 'templates/error.html'
          }
      }
  })

.state('app.resources', {
      url: '/resources',
      abstract: true,
      views: {
          'menuContent': {
              templateUrl: 'templates/resources.html'
          }
      }

  })

  .state('app.resources.articles', {
      url: '/articles',
      views: {
          'resources-articles': {
              templateUrl: 'templates/resources/articles/articles.html',
              controller: 'articles_controller'

          }

      }
  })

.state('app.resources.videos', {
      url: '/videos',
      views: {
          'resources-videos': {
              templateUrl: 'templates/videos.html',
              controller: 'videos_controller'
          },

          'menuContent': {
              templateUrl: 'templates/videos.html',
              controller: 'videos_controller'
          }

      }
  });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/events');
});
