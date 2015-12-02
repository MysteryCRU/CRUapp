function addingEventToCalendar()
{
  console.log("Adding to event");
  var listvalues = localStorage.getItem('selectedItem');
  var finalvalue = JSON.parse(listvalues);
  
  var startDataObject = finalvalue["startDate"];
  var startDateFirstSplit = startDataObject.substring(0, startDataObject.indexOf("T")).split("-");
  var startDataSecondSplit = startDataObject.substring(startDataObject.indexOf("T") + 1, startDataObject.length - 1).split(":");   
    
  var startDate = new Date(startDateFirstSplit[0], parseInt(startDateFirstSplit[1], 10) - 1, startDateFirstSplit[2], startDataSecondSplit[0], startDataSecondSplit[1], 0, 0);
    
  var endDataObject = finalvalue["endDate"];
  var endDateFirstSplit = endDataObject.substring(0, endDataObject.indexOf("T")).split("-");
  var endDataSecondSplit = endDataObject.substring(endDataObject.indexOf("T") + 1, endDataObject.length - 1).split(":");                               
  var endDate = new Date(endDateFirstSplit[0], parseInt(endDateFirstSplit[1], 10) - 1, endDateFirstSplit[2], endDataSecondSplit[0], endDataSecondSplit[1], 0, 0);
    
  var title = finalvalue["name"];
  var notes = "None";
  var locationObject = finalvalue["location"];  
  var location = locationObject["street1"];
  
  var success = function(message) { alert("Success: " + JSON.stringify(message)); };
  var error = function(message) { alert("Error: " + message); };

  // create
  window.plugins.calendar.createEvent(title, location, notes, startDate, endDate, success, error);
      
  console.log("Successfully added event");
  //Test to see if plugin works by opening calendar
  window.plugins.calendar.openCalendar();

}
function onLoad()
{
   document.addEventListener("deviceready", addingEventToCalendar, false);
}
$(window).load(function() {
    var listvalues = localStorage.getItem('selectedItem');
    var finalvalue = JSON.parse(listvalues);
    console.log("Next page");
    console.log(finalvalue);
    document.getElementById("wasae").addEventListener("click", onLoad);
});
