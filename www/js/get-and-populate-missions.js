var missionData = "test";
var url = "http://54.86.175.74:8080/summerMissions";
console.log("Start");

$.ajax({
   url: url,
   type: "GET",
   dataType: "json",
   success: function (data)
   {
        missionData = data;
        console.log("In callback");
        console.log(data);
        jQuery.each(data, function( key, value ) {
            console.log(key);
            console.log(value["name"]);
            $("#list_of_events").append("<li id=\"" + key + "\"><a href=\"mission-details.html\">" + value["name"] + "</a></li>");
             document.getElementById(key).addEventListener("click", saveData);
        }); 
    }
});

function saveData()
{
   console.log("Hi guys!" + this.id);
   localStorage.setItem('selectedItem', JSON.stringify(missionData[parseInt(this.id, 10)]));
}

console.log("End")