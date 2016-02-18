//Essentially manages viewing of the articles
//Also if you are following my controller to figure out how to make views linked with controllers, remember to do the following:

	//Add your script in the index.html
	//Whatever you name your module (Here I name is 'articles'), remember to add it in the 'controller.js' on the top with everyone else
		//there should be a line like 'var module = angular.module(...'
	//In the 'app.js' specify which controller your view is connected to

//'starter.controllers.articles' is just name of the module
//Requires some of the functionality from 'starter.controllers.utils'
var articles = angular.module('articles', ['starter.controllers.utils']);

//This is a helper function to sort the articles by date
var sortArticles = function(unsorted) {
    return unsorted.sort(function(a, b) {
        var aDate = a.date;
        var bDate = b.date;

        if (aDate > bDate) {
            return -1;
        } else if (bDate > aDate) {
            return 1;
        } else {
            return 0;
        }
    });
};

//This will display and handle the list of articles that are available
//Params for function:
//$scope used to pass data from controller to view
//req used for making request
//constants are used for the defines in the util.js file
//$location is used for rerouting to a different page
articles.controller('articles_controller',function($scope, $ionicModal, req, constants, $location) {

    // set up searching modal for articles
    // data structure for holding search parameters
    $scope.articleSearchData = {};
    $scope.title = 'Resources';
    $scope.isSearching = false;
    // creating the modal using ionicModal
    $ionicModal.fromTemplateUrl('templates/resources/articles/articleSearch.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.articleModal = modal;
    });

    // Triggered in the modal to close it
    $scope.closeSearch = function() {
        $scope.articleModal.hide();
    };

    // Open the modal
    $scope.openSearch = function() {
        $scope.articleModal.show();
    };

    // submit the search results
    $scope.search = function() {
        url = constants.BASE_SERVER_URL + 'resource/find';

        // regex (?i: makes it case insensitive)
        var queryParams = {};

        if (typeof $scope.articleSearchData.title !== 'undefined') {
            queryParams['title'] = {'$regex':  '(?i:' + $scope.articleSearchData.title + ')'};
        }

        if (typeof $scope.articleSearchData.author !== 'undefined') {
            queryParams['author'] = {'$regex':  '(?i:' + $scope.articleSearchData.author + ')'};
        }

        req.post(url, queryParams, success_getting_articles, failure_getting_articles);
        console.log('SEARCHING' + $scope.articleSearchData.title);

        //Set up the title of the page
        if ($scope.articleSearchData && $scope.articleSearchData.title !== '') {
            $scope.title = 'Search: ' + $scope.articleSearchData.title;
            $scope.isSearching = true;
        } else {
            $scope.title = 'Resources';
        }
        $scope.articleModal.hide();
    };

    $scope.clearSearch = function() {
        var url = constants.BASE_SERVER_URL + 'resource/list';

        // make request to db
        req.get(url, success_getting_articles, failure_getting_articles);
        $scope.isSearching = false;
        $scope.title = 'Resources';

    };

    //This will contain list of articles where the view can grab from
    list_of_articles = [];

    //When successfully getting the articles from the db, the following function
    //will be executed
    var success_getting_articles = function(data) {
        //Just a cool message
        console.log('Successfully got data: ' + data);

        //Getting list of articles from request
        articles = data['data'];

        //sort the articles by date
        articles = sortArticles(articles);

        //Setting scope so view can have access to them
        $scope.articles = articles;

        //Debugging to view data

        for (var i = 0; i < articles.length; i++) {
            console.log(articles[i]);
        }
    };

    //When failing to get the articles from the db, the following function
    //will be executed
    var failure_getting_articles = function(data) {
        //Just a sad message :(
        console.log('Failure got data: ' + data);

        //Goes to that lovely error page we have
        $location.path('/app/error');
    };

    //Every time screen loads, we will attempt to get articles from CRU's db
    angular.element(document).ready(function() {
        //URL for accessing resources
        url = constants.BASE_SERVER_URL + 'resource/list';

        //Just a simple print statement so I don't go insane
        console.log('Getting from ' + url);

        // make request to db
        req.get(url, success_getting_articles, failure_getting_articles);
    });

    //When clicking a specific article, it will reroute to another page
    //consisting specific info for the article.
    //Also note, you have to add to the app.js file so that it routes properly
    $scope.view_selected_article = function(article) {
        //Don't really need a separate page since all we are just displaying the url
        //page for the article
        cordova.InAppBrowser.open(article['url'], '_blank', 'location=no');
    };
});

function setupSearchModal(ionicModal, scope) {

}
