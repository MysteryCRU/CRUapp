const constants = {
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
};

describe('EventsCtrl', function() {
	var rootScope, scope, controller, location, httpBackend,
		getList;

	// create a fake instance of EventCtrl to test
	beforeEach(angular.mock.module('EventCtrl'));
	// use some mock objects found commonly found throughout the app
	beforeEach(angular.mock.module('CruMocks'));

	// set up each of the variables so they are the same before each unit
	// tests runs. Inject the following objects into my fake EventCtrl
	// these are coming from default mock objects provided by angular itself
	beforeEach(inject(function($rootScope, $controller, $location, $httpBackend) {
	    // make new general angular components
	    rootScope = $rootScope;
	    scope = $rootScope.$new();
	    controller = function() {
	    	return $controller('EventsCtrl', {
		    	$scope: scope,
		    	$ionicHistory: {},
		    	$cordovaInAppBrowser: {},
		    	$cordovaCalendar: {},
		    	location: $location
		    });
	    };

	    location = $location;
	    httpBackend = $httpBackend;
	    getList = httpBackend.when('GET', constants.BASE_SERVER_URL + 'events').respond([{test: 1, test: 2, test: 3}]);
	}));

	afterEach(function() {
    	httpBackend.verifyNoOutstandingExpectation();
    	httpBackend.verifyNoOutstandingRequest();
   	});

	it('is not empty when no ministries have been chosen', function() {
		// because the events page is wrapped in a view enter event
		// must broadcast the event to ensure the code is run.
		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events');
		controller();
		rootScope.$broadcast('$ionicView.enter');
		httpBackend.flush();

		expect(scope.events.length).toBeGreaterThan(0);
	});

	it('navigates to the error page when 500 received', function() {
		getList.respond(500, '');
		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events');
		spyOn(location, 'path');

		controller();
		rootScope.$broadcast('$ionicView.enter');
		httpBackend.flush();

		expect(location.path).toHaveBeenCalledWith('/app/error');
	});

	it('navigates to the proper page', function() {
		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events');
		controller();
		rootScope.$broadcast('$ionicView.enter');
		httpBackend.flush();
		
		spyOn(location, 'path');
		
		var id = Math.random();
		scope.goToEvent(id);
		expect(location.path).toHaveBeenCalledWith('/app/events/' + id);
	});
});

describe('EventCtrl', function() {
	var rootScope, scope, controller, location, httpBackend,
		getEvent, localStorage;
	var id = 1;

	// create a fake instance of EventCtrl to test
	beforeEach(angular.mock.module('EventCtrl'));
	// use some mock objects found commonly found throughout the app
	beforeEach(angular.mock.module('CruMocks'));

	beforeEach(inject(function($rootScope, $controller, $location, $httpBackend, $localStorage) {
		rootScope = $rootScope;
		scope = $rootScope.$new();
		location = $location;
		localStorage = $localStorage;

		httpBackend = $httpBackend;
		controller = function() {
			return $controller('EventCtrl', {
				$scope: scope,
		    	$stateParams: {
		    		eventId: id
		    	},
		    	$ionicHistory: {},
          $ionicPopup: {},
		    	$cordovaInAppBrowser: {},
		    	$cordovaCalendar: {}
			});
		};

		getEvent = httpBackend.when('GET', constants.BASE_SERVER_URL + 'events/' + id).respond({test: 'test'});
	}));

	afterEach(function() {
    	httpBackend.verifyNoOutstandingExpectation();
    	httpBackend.verifyNoOutstandingRequest();
   	});

   	it('contains the event requested by the page', function() {
   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events/' + id);
   		controller();
   		httpBackend.flush();

   		expect(scope.myEvent.test).toEqual('test');
   	});

   	it('navigates to the error page on error', function() {
   		getEvent.respond(404, '');
   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events/' + id);
   		
   		controller();
   		spyOn(location, 'path');
   		httpBackend.flush();

   		expect(location.path).toHaveBeenCalledWith('/app/error');
   	});

   	it('navigates to the correct driver page', function() {
   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events/' + id);
   		controller();
   		spyOn(location, 'path');
   		httpBackend.flush();

   		var rideId = 1;
   		scope.goToGetRide(rideId);
   		expect(location.path).toHaveBeenCalledWith('/app/rides/' + rideId + '/drivers');
   	});

   	it('shows user is not driving', function() {
   		var testId = 'myId';
   		getEvent.respond({_id: testId});

   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events/' + id);
   		controller();
   		httpBackend.flush();

   		expect(scope.isRiding).toBe(false);
   	});

   	it('shows user is not riding', function() {
   		var testId = 'myId';
   		getEvent.respond({_id: testId});

   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events/' + id);
   		controller();
   		httpBackend.flush();

   		expect(scope.isRiding).toBe(false);
   	});

   	it('detects whether the user is riding', function() {
   		var testId = 'myId';
   		getEvent.respond({_id: testId});

   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events/' + id);
   		localStorage.setObject(constants.MY_RIDES_RIDER, [{rideId: testId}]);
   		controller();
   		httpBackend.flush();

   		expect(scope.isRiding).toBe(true);
   	});

   	it('detects whether the user is driving', function() {
   		var testId = 'myId';
   		getEvent.respond({_id: testId});

   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events/' + id);
   		localStorage.setObject(constants.MY_RIDES_DRIVER, [{rideId: testId}]);
   		controller();
   		httpBackend.flush();

   		expect(scope.isDriving).toBe(true);
   	});

   	it('detects whether the user is driving after navigating away from page', function() {
   		var testId = 'myId';
   		getEvent.respond({_id: testId});

   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events/' + id);
   		controller();
   		httpBackend.flush();

   		// localstorage changed after the request is flushed, on view enter is
   		// called to trigger navigated away from page effect
   		localStorage.setObject(constants.MY_RIDES_DRIVER, [{rideId: testId}]);
   		rootScope.$broadcast('$ionicView.enter');

   		expect(scope.isDriving).toBe(true);
   	});

   	it('detects whether the user is riding after navigating away from page', function() {
   		var testId = 'myId';
   		getEvent.respond({_id: testId});

   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events/' + id);
   		controller();
   		httpBackend.flush();

   		// localstorage changed after the request is flushed, on view enter is
   		// called to trigger navigated away from page effect
   		localStorage.setObject(constants.MY_RIDES_RIDER, [{rideId: testId}]);
   		rootScope.$broadcast('$ionicView.enter');

   		expect(scope.isRiding).toBe(true);
   	});

   	it('does not change the riding boolean when navigating away from page, when not updated', function() {
   		var testId = 'myId';
   		getEvent.respond({_id: testId});

   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events/' + id);
   		controller();
   		httpBackend.flush();

   		rootScope.$broadcast('$ionicView.enter');

   		expect(scope.isRiding).toBe(false);
   	});

   	it('does not change the driving boolean when navigating away from page, when not updated', function() {
   		var testId = 'myId';
   		getEvent.respond({_id: testId});

   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'events/' + id);
   		controller();
   		httpBackend.flush();

   		rootScope.$broadcast('$ionicView.enter');

   		expect(scope.isDriving).toBe(false);
   	});
});