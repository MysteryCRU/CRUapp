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

describe('MissionCtrl', function() {
	var rootScope, scope, controller, location, httpBackend,
		getList, conv;

	// create a fake instance of SummerMissionCtrl to test
	beforeEach(angular.mock.module('MissionCtrl'));
	// use some mock objects found commonly found throughout the app
	beforeEach(angular.mock.module('CruMocks'));

	// set up each of the variables so they are the same before each unit
	// tests runs. Inject the following objects into my fake SummerMissionCtrl
	// these are coming from default mock objects provided by angular itself
	beforeEach(inject(function($rootScope, $controller, $location, $httpBackend, convenience) {
	    // make new general angular components
	    rootScope = $rootScope;
	    scope = $rootScope.$new();
	    conv = convenience;
	    controller = function() {
	    	return $controller('MissionsCtrl', {
		    	$scope: scope,
		    	location: $location
		    });
	    };

	    location = $location;
	    httpBackend = $httpBackend;
	    getList = httpBackend.when('GET', constants.BASE_SERVER_URL + 'summermissions/')
	    	.respond([{test: 1}, {test: 2}, {test: 3}]);
	}));

	afterEach(function() {
    	httpBackend.verifyNoOutstandingExpectation();
    	httpBackend.verifyNoOutstandingRequest();
   	});

   	it('gets a list of summer missions', function() {
   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'summermissions/');
   		controller();
   		httpBackend.flush();

   		expect(scope.missions.length).toBeGreaterThan(0);
   	});

   	it('sets the placeholder image', function() {
   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'summermissions/');
   		controller();
   		httpBackend.flush();

   		scope.missions.forEach(function(test) {
   			expect(test.image.url).toBe(constants.PLACEHOLDER_IMAGE);
   		});
   	});

   	it('does not overwrite existing images', function() {
   		getList.respond([{test: 1, image: 'test'}, {test: 2, image: 'test'}]);
   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'summermissions/');
   		controller();
   		httpBackend.flush();

   		scope.missions.forEach(function(test) {
   			expect(test.image).toBe('test');
   		});
   	});

   	it('navigates to the correct mission page', function() {
   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'summermissions/');
   		
   		controller();
   		spyOn(location, 'path');
   		httpBackend.flush();

   		var fakeId = 2;
   		scope.goToMission(fakeId);
   		expect(location.path).toHaveBeenCalledWith('/app/missions/' + fakeId);
   	});

   	it('navigates to the error page when 500 received', function() {
		getList.respond(500, '');
		httpBackend.expectGET(constants.BASE_SERVER_URL + 'summermissions/');
		
		spyOn(location, 'path');
		controller();
		httpBackend.flush();

		expect(location.path).toHaveBeenCalledWith('/app/error');
	});

	it('formats the dates', function() {
		var date = new Date();
		getList.respond([{startDate: date}]);

		httpBackend.expectGET(constants.BASE_SERVER_URL + 'summermissions/');
   		controller();
   		httpBackend.flush();

		expect(scope.missions[0].startDate).toBe(conv.formatDate(date, false));
	});
});

describe('MissionCtrl', function() {
	const fakeId = 2;
	var rootScope, scope, controller, location, httpBackend,
		mission, conv;
	const ciab = {open: function(url, browserType, options){}};

	// create a fake instance of SummerMissionCtrl to test
	beforeEach(angular.mock.module('MissionCtrl'));
	// use some mock objects found commonly found throughout the app
	beforeEach(angular.mock.module('CruMocks'));

	// set up each of the variables so they are the same before each unit
	// tests runs. Inject the following objects into my fake SummerMissionCtrl
	// these are coming from default mock objects provided by angular itself
	beforeEach(inject(function($rootScope, $controller, $location, $httpBackend, convenience) {
	    // make new general angular components
	    rootScope = $rootScope;
	    scope = $rootScope.$new();
	    conv = convenience;
	    controller = function() {
	    	return $controller('MissionCtrl', {
		    	$scope: scope,
		    	$stateParams: {missionId: fakeId},
		    	location: $location,
		    	$cordovaInAppBrowser: ciab
		    });
	    };

	    location = $location;
	    httpBackend = $httpBackend;
	    mission = httpBackend.when('GET', constants.BASE_SERVER_URL + 'summermissions/' + fakeId)
	    	.respond({test: 1});
	}));

	afterEach(function() {
    	httpBackend.verifyNoOutstandingExpectation();
    	httpBackend.verifyNoOutstandingRequest();
   	});

   	it('gets an event from the server', function() {
   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'summermissions/' + fakeId);
   		controller();
   		httpBackend.flush();

   		expect(scope.mySummerMission.test).toEqual(1);
   	});

   	it('formats the event start date', function() {
   		const start = new Date(1995, 11, 17);
   		mission.respond({startDate: start});
   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'summermissions/' + fakeId);

   		controller();
   		httpBackend.flush();

   		expect(scope.mySummerMission.startDate).toBe(conv.formatDate(start));
   	});

   	it('formats the event end date', function() {
   		const end = new Date(2001, 6, 21);
   		mission.respond({endDate: end});
   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'summermissions/' + fakeId);

   		controller();
   		httpBackend.flush();

   		expect(scope.mySummerMission.endDate).toBe(conv.formatDate(end));
   	});

   	it('sets the placeholder image', function() {
   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'summermissions/' + fakeId);
   		controller();
   		httpBackend.flush();

   		expect(scope.mySummerMission.image.url).toEqual(constants.PLACEHOLDER_IMAGE);
   	});

   	it('does not overwrite existing images', function() {
   		const img = '/img/test.png';
   		mission.respond({image: img});
   		httpBackend.expectGET(constants.BASE_SERVER_URL + 'summermissions/' + fakeId);

   		controller();
   		httpBackend.flush();

   		expect(scope.mySummerMission.image).toBe(img);
   	});

   	it('navigates to the error page when 500 received', function() {
		mission.respond(500, '');
		httpBackend.expectGET(constants.BASE_SERVER_URL + 'summermissions/' + fakeId);
		
		spyOn(location, 'path');
		controller();
		httpBackend.flush();

		expect(location.path).toHaveBeenCalledWith('/app/error');
	});

	it('opens the in app browser', function() {
		spyOn(ciab, 'open');
		httpBackend.expectGET(constants.BASE_SERVER_URL + 'summermissions/' + fakeId);
   		controller();
   		httpBackend.flush();

		const testUrl = 'www.test.url';
		scope.showOnline(testUrl);
		expect(ciab.open).toHaveBeenCalled();
	});
});