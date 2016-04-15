var min = angular.module('starter.controllers.min', ["PushModule"]);

min.controller('MinCtrl', function($scope, $location, $ionicHistory, req, $localStorage, $ionicPopup, selectedCampuses, constants, pushService) {

    var url = constants.BASE_SERVER_URL + "ministries/search";
    
    var or = [];
    selectedCampuses.getCampuses().forEach(function(c) {
        or.push({'campus': c._id});
    });
    var queryParams = {'campus': {$or: or}};

    var success = function(data) {
        // makes the objects "checkable"
        for (var i = 0; i < data.data.length; ++i) {
            data.data[i].checked = false;
            
            if (data.data[i].name !== "Slo Cru") {
                if (!data.data[i].image) {
                    data.data[i].image = { url: 'img/cru-logo.jpg' };
                } else if (!data.data[i].image.url) {
                    data.data[i].image.url = 'img/cru-logo.jpg';
                }
            } else {
                data.data[i].image = { url: 'img/cru-logo.jpg' };
            }
            
            if (!data.data[i].description || data.data[i].description.length === 0) {
                data.data[i].description = 'Sorry, but there is no available description for this ministry.';
            }
        }
        $scope.ministries = data.data;
    };

    var err = function(xhr, text, err) {
        //if there is an error (ie 404, 500, etc) redirect to the error page
        $location.path('/app/error');
    };

    req.post(url, queryParams, success, err);
    /**
    * This function is meant to  support the header contining lists. This function will return a boolean: whether or not
    * the header has changed from the previous item.
    */
    $scope.setupHeader = function(ministry) {

        showHeader = currentHeader !== $scope.campuses[ministry.campuses[0]];
        currentHeader = $scope.campuses[ministry.campuses[0]];
        return showHeader;
    };

    /**
    * This function will handle going to the next page and also storing the list of ministries and campuses. to local storage
    */
    $scope.goToNext = function() {
        var mins = [];
        var topics = [];
        //adds ministries user checked to list and update topics list
        for (var i = 0; i < $scope.ministries.length; ++i) {
            if ($scope.ministries[i].checked) {
                mins.push($scope.ministries[i]);
                topics.push($scope.ministries[i]._id);
            }
        }
        //register to the Topics from above;
        pushService.registerTopics(topics);

        $localStorage.setObject(constants.CAMPUSES_CONFIG, {
            campuses: selectedCampuses.getCampuses(),
            ministries: mins
        });

        $location.path('/app');
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
        });


    };
    
    $scope.showInfo = function(name, desc) {
        $ionicPopup.show({
            title: name,
            template: desc,
            buttons: [{ text: 'Ok', type: 'button-energized' }]
        });
    };

    $scope.title = 'Select Ministries';
    $scope.next = 'Start Using App!';
    /**
   * Store the list of campuses within an object where the keys are the campus id's
   **/
    $scope.campuses = selectedCampuses.getCampusesObject();
    /**
    * This value keeps track of the current header in the list.
    **/
    currentHeader = '';
});

