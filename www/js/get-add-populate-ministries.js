var eventsData = "test";
var url = "http://54.86.175.74:8080/ministries";
console.log("Start");

$.ajax({
   url: url,
   type: "GET",
    dataType: "json",
   success: function (data)
    {
        eventsData = data;
        console.log("In callback");
        console.log(data);
        jQuery.each(data, function( key, value ) {
            console.log(key);
            console.log(value["name"]);
            $("#list_of_ministries").append("<li id=\"" + key + "\"><a href=\"../events/events.html\">" + value["name"] + "</a></li>");
        }); 
    }
});
