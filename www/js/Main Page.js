$(document).ready(function() {                      //do not show "move" button when page loaded;
    $("#move").hide();
});


//$(window).load(function(){                          
function initializeUIButtons(){  
  $(".button").click(function() {                   //select one car at the time on click;
    console.log('clicked');
    $('.highlighted').removeClass('highlighted');   //removes highlight from a car which was searched;
    $('.selected').removeClass('selected');
    $(this).addClass('selected');    
  });

                                 
  $('#logo').click(function(){                              //onclick logo sign removes both selected and highlighted; 
    if (!$('.trackbutton').hasClass('highlightTrack')) {    //doesn't work if tracks are highlighted;
      $('.highlighted').removeClass('highlighted');
      $('.selected').removeClass('selected');
    };
  });

   function search(){
    $('.button').filter(checkForMatch).each(highlight);     //search through html elements located on the page which has class "button" meaning cars;
    $('html, body').animate({scrollTop: $(".highlighted").offset().top, scrollLeft: $(".highlighted").offset().left}, "fast");        //scrolls screen to the found car; 
   };    

  $("#searchbutton").click(search);                     //onclick "search" button 
  $('#search').on('keydown', function(e) {              //onkeydown tells the android phone to do something when a specific key is pushed down. 
    if (e.which == 13) {                                // 13 is the keycode for the search input field
      search();                                         // The entire function allows you to activate the search function by pressing the search button and enter on the phone keyboard
    }
  });



  $(".button").click(function() {                      //when a car is clicked shows and hides "move" button;
    if ($(".button").hasClass('selected')) {
      $("#move").show();
    } else {
      $("#move").hide();
    }
  });

  $("#move").click(enableTrackButtons);             //onclick "move" enable track buttons;

    $("#move").click(function(){
    $('html,body').animate({scrollTop: $(".trackbutton").offset().top, scrollLeft: $(".trackbutton").offset().left}, "fast");
  });

}




var checkForMatch = function() {                        //check if the car is displayed on the page;
  var carName = $(this).text();                         //text displayed on the car;
  var searchText = $('#searchfield').prop('value');     //input in the search field;
  if (carName.match(searchText)) {                      //partial match: checks if text on the car contains the search input;
    return true;
  }
};

var highlight = function() {                            //if found highlights the car;
  console.log($(this));
  $('.selected').removeClass('selected');               //removes any selections
  $('.highlighted').removeClass('highlighted');         //or highlights from other cars;
  $("#move").hide();
  $(this).addClass('highlighted');
};


var enableTrackButtons = function(){
  $('.trackbutton').addClass('highlightTrack');
  $('.trackbutton').on('click', moveCarToTrack);    //onclick "move" enable track buttons;
}

var moveCarToTrack = function(){                                          //function: move a car from trck_A to track_B;
  var track = $(this).parent();                                           //div "track_B" which stores units (and the track button which was clicked);
  var emptyUnitCount = track.children('.empty_unit').length;              //counts empty units on the "track_B";
  var car = $('.selected');                                               //the car which is going to be moved (still on the "track_A");
  var carId = car.attr('id').replace("car_","");                          //takes ID of the car;
                                                                          //replace takes out "car_" from the ID 
                                                                          //because button's id was created like "car_ + actual id";
  var carLength = findById(carId).cars.car_length;                        //takes length of the car based on its id;
  var currentUnit;                                                        //declare variable: unit from the "track_A" where the car is currently located,
                                                                          //if car is longer than one unit, this is the first one;

    if(carLength > emptyUnitCount) {                                      //compare the length of the car with available space on the "track_B";
      alert('car is too long!');
      //$('.selected').parent('.unit').removeClass('empty_unit');
    } else {
      var r = confirm("Are you sure you want to move");                   //if it is enough space,confirm the move action;
      if (r===true) {
        //$('.selected').parent('.unit').toggleClass('empty_unit');
        currentUnit = $('.selected').parent('.unit');                     //define variable: unit from the "track_A" where the car is currently located (first one);
        currentUnit.addClass('empty_unit');                               //set it "empty";
        var newUnit = $(this).parent().children('.empty_unit').first();   //unit from the "track_B" where the car will be located after "move" is submitted;
                                                                          //this: trackButton; parent: div "track"; children: units;
                                                                          //takes the first empty unit on the "track_B";
        newUnit.append($('.selected'));                                   //actual movement: appends the first empty unit on the "track_B" with the car;
        newUnit.removeClass('empty_unit');                                //removes "empty_unit" class from the appended unit;

        if (carLength > 1) {                                              //this loop fixes the "empty_unit" class issue for greater than one unit long cars;
          for (i=1;i<carLength;i++) {
            currentUnit = currentUnit.next();                             //.next() takes the next element in array;
            currentUnit.addClass('empty_unit');
            newUnit = newUnit.next();
            newUnit.removeClass('empty_unit');
            //$('.selected').parent('.unit').next().toggleClass('empty_unit');
          }
        };         
    }
  }                                                                       //after "move" is done:
   $("button.button.selected").removeClass("selected");                   //removes "select" from the car,
   $("button.trackbutton.highlightTrack").removeClass("highlightTrack");  //removes "highlight" from tracks,
   $(this).off('click', moveCarToTrack);                                  //disables "click" on tracks buttons,
   $("#move").hide();                                                     //hides "move" button;
  
};

//declare global variables
var thegame;
thegame = new mygame;

//create your object 
function mygame(){      
  this.tracks = [];     //empty arrays to store objects from JSON;
  this.yards = [];
  this.unit = [];
  this.cars = [];

  this.addtrack = function (jsonTrack){     //to add a track the function takes JSON as a parameter;
    var newtrack = new track();             //creates a function;
    jQuery.extend(newtrack, jsonTrack);     //.extend() merges the contents of two objects together into the first object; 
                                            //jQuery.extend( target [, object1 ] [, objectN ] );
    this.tracks.push(newtrack);             //pushes objects into array;
    newtrack.show();                        //calls the function;
  };
  this.addyard = function (jsonYard){
    var newyard = new yard();
    jQuery.extend(newyard, jsonYard);
    this.yards.push(newyard);
    newyard.showYardName();    
  };
  this.addunit = function (jsonUnit, trackid){    //this function takes two parameters:  
    var newunit = new unit();                     //trackid is used to show which units belong to which track;
    jQuery.extend(newunit, jsonUnit);
    this.unit.push(newunit);
    newunit.show(trackid);  

  };
    this.addcar = function (jsonUnit, unitid){
    var newcar = new car();
    jQuery.extend(newcar, jsonUnit);
    this.cars.push(newcar);
    newcar.show(unitid); 
    };
}

function yard(){
  this.showYardName = function () {
    var yard = $("#yard");                                                            //#yard is the div created in the body of html page;
    yard.append('<h2 align="center">'+this.yard_name+'</h2>').trigger('create');      //takes the yard name from JSON and appends it to the yard;
  };
}

function track(){                 //creates a track div and a track button inside the div; pulls track_name from JSON;
   this.show = function () {
    $('#yard').append('<div class="track" id="t'+this.track_id+'"><button class="trackbutton" style="font-weight:bold">'+this.track_name+'</button></div>').trigger('create'); 
  };                              //gives id to the created element "t"+ id from JSON to make it unique;
}

function unit(){                  //creates div "unit" which belongs to specific track (recognizes it by id);
  this.show = function (id) {
    $('#'+id).append('<div class="unit" id="u'+this.unit_id+'"></div>').trigger('create'); 
  };
}

function car(){                   //creates a car button inside the unit (based on its id); pulls car_number fromJSON;
  this.show = function (id) {
    $('#'+id).append('<button class="button" id="car_'+this.cars.car_id+'">'+this.cars.car_number+'</button>').trigger('create'); 
  };
}

var found = false;
function lookForCar (currentCarId) {                      //checks if car with a specific id have been created;
  for (c=0;c<thegame.cars.length;c++) {                   //looks inside the cars array which was created in thegame();
    if (thegame.cars[c].cars.car_id === currentCarId) {   
          found = true;
          break;
          }
  }
}


function findById(id) {                                   //finds the car by its id inside the cars array;
    for (c=0;c<thegame.cars.length;c++) {                 
      if (thegame.cars[c].cars.car_id === id) {
        return thegame.cars[c];                           //returns car object;  
      }
    }    
  }

$(document).ready (function(){                                //builds the yard from JSON;
  
  var server = new ajaxServiceLayer();                        
  var tracksFromJSON = server.gettracks();

});

function BuildYard(tracksFromJSON){
  console.log('tracksFromJSON');
  console.log(tracksFromJSON);
  thegame.addyard(tracksFromJSON);                            //pulls a yard name;

  for (t=0;t<tracksFromJSON.tracks.length;t++)  {             //loops on track's level; 
    var currentTrack = tracksFromJSON.tracks[t]               //takes a track object;
    thegame.addtrack(currentTrack);                           //creates div "track" and "track" button for the currentTrack;

    for (u=0;u<currentTrack.units.length;u++) {               //loops on unit's level;
      var trackid = "t"+currentTrack.track_id;                //track's id from the first loop (id="t"+id: the value from html div "track"); 
      var currentUnit = currentTrack.units[u];                //takes a unit object;
      var unitid = "u"+currentUnit.unit_id;                   //id of the current unit;
      thegame.addunit(currentTrack.units[u],trackid);         //creates a div "unit" for the current track; 

      if (currentUnit.hasOwnProperty('cars')) {               //checks if there is a car on the current unit;
        lookForCar(currentUnit.cars.car_id);                  //if true, checks if that car haven't been created yet;
        if (found === false) {
          thegame.addcar(currentUnit,unitid);                 //if not, creates a "car" button for the current unit;
            
            var carid = "car_"+currentUnit.cars.car_id;       //id of the current car;

            switch(currentUnit.cars.car_length) {             //checks the length of the curren car
              case "1":                                       //and gives different classes based on the length
              $('#'+carid).addClass('carOneUnit');            //what makes cars' buttons different sizes;
              break;
              case "2":
              $('#'+carid).addClass('carTwoUnits');
              break;
              case "3":
              $('#'+carid).addClass('carThreeUnits');
              break;
              case "5":
              $('#'+carid).addClass('carFiveUnits');
              break;
            };

            switch(currentUnit.cars.car_status) {             //checks the status of the current car
              case "ready":                                   //and makes it specific color;
              $('#'+carid).addClass('white');
              break;
              case "just_arrived":
              $('#'+carid).addClass('blue');
              break;
              case "not_workable":
              $('#'+carid).addClass('red');
              break;
              case "ready_to_be_released":
              $('#'+carid).addClass('green');
              break;
            };

            switch(currentUnit.cars.car_type) {               //checks the type of the current car
              case "flat":                                    //and appends specific symbol with the length inside to the button;
              $('#'+carid).append('<h3 style="font-size:10px; line-height:0.5">|_'+currentUnit.cars.car_length+'_|</h3>');
              break;
              case "box":
              $('#'+carid).append('<h3 style="font-size:10px; line-height:0.5">[_'+currentUnit.cars.car_length+'_]</h3>');
              break;
              case "gondola":
              $('#'+carid).append('<h3 style="font-size:10px; line-height:0.5">{_'+currentUnit.cars.car_length+'_}</h3>');
              break;              
            }
        }       
        
        else {
            found = false;                                    //the car was found, so sets var found to false for the next unit;
        }
       // }
      }
     else {
        $('#'+unitid).addClass('empty_unit');                 //if the unit doesn't have car, gives it class "empty_unit";
     } 
    }
  };
  initializeUIButtons();

}


function ajaxServiceLayer(){
  
  this.gettracks = function(){

    /*$.getJSON("http://ishparii.github.io/TTX_JSON", function (data) {
          //prompt("Success !");
          console.log(data)
          var yard = JSON.parse(data);
        });*/
    
    $.get("http://ishparii.github.io/TTX_JSON")
      .done(function(data){
        var retval = JSON.parse(data);
        BuildYard(retval);  
      });
    
  };
  
}

    //fake the server for now
    //http://www.w3schools.com/json/json_syntax.asp
   /* var yard = {
    
            "yard_id": "1",
            "yard_name": "Yard1",
            "yard_location": "location1",
            "tracks": [
                {
                    "track_id": "1",
                    "track_name": "j1",
                    "units": [
                        {
                            "unit_id": "1",
                            "unit_name": "u1",
                            "cars": {
                                "car_id": "1",
                                "car_initials": "TTX",
                                "car_number": "11101",
                                "car_type": "flat",
                                "car_length": "1",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "2",
                            "unit_name": "u2",
                            "cars": {
                                "car_id": "2",
                                "car_initials": "TTX",
                                "car_number": "11102",
                                "car_type": "flat",
                                "car_length": "1",
                                "car_status": "just_arrived"
                            }

                        },
                        {
                            "unit_id": "3",
                            "unit_name": "u3",
                            "cars": {
                                "car_id": "3",
                                "car_initials": "TTX",
                                "car_number": "11103",
                                "car_type": "flat",
                                "car_length": "2",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "4",
                            "unit_name": "u4",
                            "cars": {
                                "car_id": "3",
                                "car_initials": "TTX",
                                "car_number": "11103",
                                "car_type": "flat",
                                "car_length": "2",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "5",
                            "unit_name": "u5"
                        },
                        {
                            "unit_id": "6",
                            "unit_name": "u6"
                        }
                    ]
                },
                {
                    "track_id": "2",
                    "track_name": "j2",
                    "units": [
                        {
                            "unit_id": "7",
                            "unit_name": "u1",
                            "cars": {
                                "car_id": "4",
                                "car_initials": "TTX",
                                "car_number": "11104",
                                "car_type": "flat",
                                "car_length": "1",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "8",
                            "unit_name": "u2",
                            "cars": {
                                "car_id": "5",
                                "car_initials": "TTX",
                                "car_number": "11105",
                                "car_type": "flat",
                                "car_length": "1",
                                "car_status": "not_workable"
                            }
                        },
                        {
                            "unit_id": "9",
                            "unit_name": "u3",
                            "cars": {
                                "car_id": "6",
                                "car_initials": "TTX",
                                "car_number": "11106",
                                "car_type": "gondola",
                                "car_length": "2",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "10",
                            "unit_name": "u4",
                            "cars": {
                                "car_id": "6",
                                "car_initials": "TTX",
                                "car_number": "11106",
                                "car_type": "gondola",
                                "car_length": "2",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "11",
                            "unit_name": "u5",
                            "cars": {
                                "car_id": "7",
                                "car_initials": "TTX",
                                "car_number": "11107",
                                "car_type": "flat",
                                "car_length": "1",
                                "car_status": "ready_to_be_released"
                            }
                        }
                    ]
                },
                {
                    "track_id": "3",
                    "track_name": "j3",
                    "units": [
                        {
                            "unit_id": "12",
                            "unit_name": "u1",
                            "cars": {
                                "car_id": "8",
                                "car_initials": "TTX",
                                "car_number": "11108",
                                "car_type": "box",
                                "car_length": "1",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "13",
                            "unit_name": "u2",
                            "cars": {
                                "car_id": "9",
                                "car_initials": "TTX",
                                "car_number": "11109",
                                "car_type": "flat",
                                "car_length": "5",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "14",
                            "unit_name": "u3",
                            "cars": {
                                "car_id": "9",
                                "car_initials": "TTX",
                                "car_number": "11109",
                                "car_type": "flat",
                                "car_length": "5",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "15",
                            "unit_name": "u4",
                            "cars": {
                                "car_id": "9",
                                "car_initials": "TTX",
                                "car_number": "11109",
                                "car_type": "flat",
                                "car_length": "5",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "16",
                            "unit_name": "u5",
                            "cars": {
                                "car_id": "9",
                                "car_initials": "TTX",
                                "car_number": "11109",
                                "car_type": "flat",
                                "car_length": "5",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "17",
                            "unit_name": "u6",
                            "cars": {
                                "car_id": "9",
                                "car_initials": "TTX",
                                "car_number": "11109",
                                "car_type": "flat",
                                "car_length": "5",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "18",
                            "unit_name": "u7"
                        },
                        {
                            "unit_id": "19",
                            "unit_name": "u8"
                        }
                    ]
                },
                {
                    "track_id": "4",
                    "track_name": "j4",
                    "units": [
                        {
                            "unit_id": "20",
                            "unit_name": "u1",
                            "cars": {
                                "car_id": "10",
                                "car_initials": "TTX",
                                "car_number": "11110",
                                "car_type": "box",
                                "car_length": "1",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "21",
                            "unit_name": "u2",
                            "cars": {
                                "car_id": "11",
                                "car_initials": "TTX",
                                "car_number": "11111",
                                "car_type": "flat",
                                "car_length": "1",
                                "car_status": "ready"
                            }
                        },
                        {
                            "unit_id": "22",
                            "unit_name": "u3"
                        }
                    ]
                }
            ]
        
    
};*/
    //console.log(yard);
