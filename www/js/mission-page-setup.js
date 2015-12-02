$(window).load(function() {
    var listvalues = localStorage.getItem('selectedItem');
    var finalvalue = JSON.parse(listvalues);
    console.log("Next page");
    console.log(finalvalue);
    $("#name_of_event").text(finalvalue["name"]);
    var imageObject = finalvalue["image"];
    $("#image_of_event").attr("src", imageObject["url"]);
    $("#description_of_event").text(finalvalue["description"]);
    document.getElementById("wasae").addEventListener("click", onLoad);
});