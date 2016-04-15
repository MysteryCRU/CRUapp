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
        
	    getList = httpBackend.when('GET', constants.BASE_SERVER_URL + 'rides/').respond([{test: 1, test: 2, test: 3}]);
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