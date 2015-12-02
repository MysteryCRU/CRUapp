

var eventsData = "test";
var url = "http://54.86.175.74:8080/events";
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
            $("#list_of_events").append("<li id=\"" + key + "\"><a href=\"testEvent1.html\">" + value["name"] + "</a></li>");
             document.getElementById(key).addEventListener("click", saveData);
        }); 
    }
});
function saveData()
{
   console.log("Hi guys!" + this.id);
   localStorage.setItem('selectedItem', JSON.stringify(eventsData[parseInt(this.id, 10)]));
}
console.log("End")

