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

describe('RidesCtrl', function() {
	var scope;
	var httpBackend;
	var location;
    var rootScope;
    var controller;
    var getList;
    var allE;
    var localStorage;

	beforeEach(angular.mock.module("starter.controllers.rides"));
	beforeEach(angular.mock.module('CruMocks'));  

    beforeEach(inject(function($rootScope, $controller, $httpBackend, $location, allEvents, $localStorage) {
	    scope = $rootScope.$new();
        rootScope = $rootScope;
	    httpBackend = $httpBackend;
	    location = $location;
        allE = allEvents;
        localStorage = $localStorage;
        
        controller = function() {
	    	return $controller('RidesCtrl', {
		    	$scope: scope,
		    	$ionicHistory: {},
                $ionicPopup: {},
		    	$cordovaInAppBrowser: {},
		    	$cordovaCalendar: {},
		    	location: $location
		    });
	    };
        
	    getList = httpBackend.when('GET', constants.BASE_SERVER_URL + 'ride/list').respond([{test: 1, test: 2, test: 3}]);
	}));


	angular.module('constants', []);
	      
	angular.mock.module(function($provide){
		$provide.service('constants', function(){});
	});

	it('has title set correctly', function(){
        controller();
        rootScope.$broadcast('$ionicView.enter');
    	expect(scope.title).toEqual('Rides');
	});
    
    it('has rides populated', function(){
        //$localStorage.setObject(constants.)
        allE.setEvents([{test: 1, test: 2}]);
        controller();
        rootScope.$broadcast('$ionicView.enter');
    	expect(scope.rides.length).toBeGreaterThan(0);
	});
    
    
    it('sets driving to true', function(){
        allE.setEvents([{_id: 1, test: 1}, {_id: 2, test: 2}]);
        localStorage.setObject(constants.MY_RIDES_DRIVER, [{rideId: 1}, {rideId: 2}]);
        localStorage.setObject(constants.MY_RIDES_RIDER, []);
        controller();
        rootScope.$broadcast('$ionicView.enter');
    	expect(scope.rides[0].driving).toEqual(true);
	});
    
    it('has riding as false when driving', function(){
        allE.setEvents([{_id: 1, test: 1}, {_id: 2, test: 2}]);
        localStorage.setObject(constants.MY_RIDES_DRIVER, [{rideId: 1}, {rideId: 2}]);
        localStorage.setObject(constants.MY_RIDES_RIDER, []);
        controller();
        rootScope.$broadcast('$ionicView.enter');
    	expect(scope.rides[0].riding).toEqual(false);
	});
    
    it('sets riding to true', function(){
        allE.setEvents([{_id: 1, test: 1}, {_id: 2, test: 2}]);
        localStorage.setObject(constants.MY_RIDES_DRIVER, []);
        localStorage.setObject(constants.MY_RIDES_RIDER, [{rideId: 1}, {rideId: 2}]);
        controller();
        rootScope.$broadcast('$ionicView.enter');
    	expect(scope.rides[0].riding).toEqual(true);
	});
    
    it('has driver as false when riding', function(){
        allE.setEvents([{_id: 1, test: 1}, {_id: 2, test: 2}]);
        localStorage.setObject(constants.MY_RIDES_DRIVER, []);
        localStorage.setObject(constants.MY_RIDES_RIDER, [{rideId: 1}, {rideId: 2}]);
        controller();
        rootScope.$broadcast('$ionicView.enter');
    	expect(scope.rides[0].driving).toEqual(false);
	});
});

describe('GetRideCtrl', function() {
	var scope;
	var httpBackend;
	var location;
    var rootScope;
    var controller;
    var getList;
    var allE;
    var localStorage;
    
    var id = 1;
    var name = "TestName";
    var phone = "1234567890";
    var triptype = "both"

	beforeEach(angular.mock.module("starter.controllers.rides"));
	beforeEach(angular.mock.module('CruMocks'));  

    beforeEach(inject(function($rootScope, $controller, $httpBackend, $location, allEvents, $localStorage) {
	    scope = $rootScope.$new();
        rootScope = $rootScope;
	    httpBackend = $httpBackend;
	    location = $location;
        allE = allEvents;
        localStorage = $localStorage;
        
        controller = function() {
	    	return $controller('GetRideCtrl', {
		    	$scope: scope,
		    	$ionicHistory: {goBack: function(a) {}},
                $ionicPopup: {},
		    	$cordovaInAppBrowser: {},
		    	$cordovaCalendar: {},
                $stateParams: {
		    		rideId: id,
                    driverId: id
		    	},
		    	location: $location,
                pushService: {getToken: function() {return 1;}}
		    });
	    };
        
	    createPass = httpBackend.when('POST', constants.BASE_SERVER_URL + 'passenger/create').respond({test: "test"});
        addPass = httpBackend.when('POST', constants.BASE_SERVER_URL + 'ride/addPassenger').respond({test: "test"});
	}));


	angular.module('constants', []);
	      
	angular.mock.module(function($provide){
		$provide.service('constants', function(){});
	});

    it('contains the ride with the passenger requested by the page', function() {
        createPass.respond({post: {_id: 2}});
        httpBackend.expectPOST(constants.BASE_SERVER_URL + 'passenger/create');
        httpBackend.expectPOST(constants.BASE_SERVER_URL + 'ride/addPassenger');
   		controller();
        scope.getRide(name, phone, triptype);
   		httpBackend.flush();

        var retObject = localStorage.getObject(constants.MY_RIDES_RIDER);
        expect(retObject[0]).toEqual({
                        rideId: 1,
                        driverId: 1,
                        passengerId: 2
                    });
   	});
    
    it('navigates to the error page on error when adding passenger to ride', function() {
   		addPass.respond(404, '');
        createPass.respond({post: {_id: 2}});
   		httpBackend.expectPOST(constants.BASE_SERVER_URL + 'passenger/create');
        httpBackend.expectPOST(constants.BASE_SERVER_URL + 'ride/addPassenger');
   		
   		controller();
        scope.getRide(name, phone, triptype);
   		spyOn(location, 'path');
   		httpBackend.flush();

   		expect(location.path).toHaveBeenCalledWith('/app/error');
   	});
    
    it('navigates to the error page on error when creating new passenger', function() {
   		createPass.respond(404, '');
   		httpBackend.expectPOST(constants.BASE_SERVER_URL + 'passenger/create');
   		
   		controller();
        scope.getRide(name, phone, triptype);
   		spyOn(location, 'path');
   		httpBackend.flush();

   		expect(location.path).toHaveBeenCalledWith('/app/error');
   	});
});

describe('ChooseDriverCtrl', function() {
	var scope;
	var httpBackend;
	var location;
    var rootScope;
    var controller;
    var getList;
    var allE;
    var localStorage;
    
    var id = 1;
    var name = "TestName";
    var phone = "1234567890";
    var triptype = "both";
    
    var shown = 0;
    var hidden = 0;
    var removed = 0;
    var defered;

	beforeEach(angular.mock.module("starter.controllers.rides"));
	beforeEach(angular.mock.module('CruMocks'));  

    beforeEach(inject(function($rootScope, $controller, $httpBackend, $location, allEvents, $localStorage, $q) {
	    scope = $rootScope.$new();
        rootScope = $rootScope;
	    httpBackend = $httpBackend;
	    location = $location;
        allE = allEvents;
        localStorage = $localStorage;
        shown = 0;
        hidden = 0;
        removed = 0;
        prom = $q(function(resolve, reject) {
            resolve({
                    show: function() {shown = 1;},
                    hide: function() {hidden = 1;},
                    remove: function() {removed = 1;}
                });
        });

        
        controller = function() {
	    	return $controller('ChooseDriverCtrl', {
		    	$scope: scope,
		    	$ionicHistory: {goBack: function(a) {}},
                $ionicPopup: {},
                /*$ionicModal: {fromTemplateUrl: function(a, b) {return {
                    show: function() {shown = 1;},
                    hide: function() {hidden = 1;},
                    remove: function() {removed = 1;}
                }}},*/
                $ionicModal: {fromTemplateUrl: function(a, b) {return prom;}},
		    	$cordovaInAppBrowser: {},
		    	$cordovaCalendar: {},
                $stateParams: {
		    		rideId: id,
                    driverId: id
		    	},
		    	location: $location,
                pushService: {getToken: function() {return 1;}}
		    });
	    };
        
	    createPass = httpBackend.when('POST', constants.BASE_SERVER_URL + 'passenger/create').respond({test: "test"});
        addPass = httpBackend.when('POST', constants.BASE_SERVER_URL + 'ride/addPassenger').respond({test: "test"});
	}));


	angular.module('constants', []);
	      
	angular.mock.module(function($provide){
		$provide.service('constants', function(){});
	});

    /*it('contains the proper functions for the ionic modal', function() {
        controller();
        
        expect(typeof scope.openModal).toEqual('function');
        expect(typeof scope.closeModal).toEqual('function');
        //expect(typeof scope.modal).toEqual('Object');
    });*/
});