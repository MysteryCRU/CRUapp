//Essentially manages viewing of the articles
//Also if you are following my controller to figure out how to make views linked with controllers, remember to do the following:

	//Add your script in the index.html
	//Whatever you name your module (Here I name is 'articles'), remember to add it in the 'controller.js' on the top with everyone else
		//there should be a line like 'var module = angular.module(...'
	//In the 'app.js' specify which controller your view is connected to

//'starter.controllers.articles' is just name of the module
//Requires some of the functionality from 'starter.controllers.utils'
var articles = angular.module('articles', ['starter.controllers.utils']);

//This will display and handle the list of articles that are available
//Params for function:
//$scope used to pass data from controller to view
//req used for making request
//constants are used for the defines in the util.js file
//$location is used for rerouting to a different page
articles.controller('articles_controller',function($scope, req, constants, $location) {

    //This will contain list of articles where the view can grab from
    list_of_articles = [];

    //When successfully getting the articles from the db, the following function
    //will be executed
    var success_getting_articles = function(data) {
        //Just a cool message
        console.log('Successfully got data: ' + data);

        //Getting list of articles from request
        articles = data['data'];

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

        //Makes a request to db for list of articles
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
