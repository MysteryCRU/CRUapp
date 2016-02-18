var min = angular.module('starter.controllers.min', []);

min.controller('MinCtrl', ['$scope', '$location', '$ionicHistory', 'req', '$localStorage','selectedCampuses', 'constants', function($scope, $location, $ionicHistory, req, $localStorage, selectedCampuses, constants) {
    var url = constants.BASE_SERVER_URL + 'ministry/find';
    var queryParams = {
        'campuses': {$in: Object.keys(selectedCampuses.getCampusesObject())}
    };
    var success = function(data) {
        //makes the objects "checkable"
        for (var i = 0; i < data.data.length; ++i) {
            data.data[i].checked = false;
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

        //adds ministries user checked to list
        for (var i = 0; i < $scope.ministries.length; ++i) {
            if ($scope.ministries[i].checked) {
                mins.push($scope.ministries[i]);
            }
        }

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
}]);
