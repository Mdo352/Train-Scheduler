$( document ).ready(function() {
    
    var firebaseConfig = {
        apiKey: "AIzaSyC3bS46_NrshR18ftgG4EFMsCic_q3s7jA",
        authDomain: "train-scheduler-a3af6.firebaseapp.com",
        databaseURL: "https://train-scheduler-a3af6.firebaseio.com",
        projectId: "train-scheduler-a3af6",
        storageBucket: "train-scheduler-a3af6.appspot.com",
        messagingSenderId: "407987591325",
        appId: "1:407987591325:web:29d038bb3df748d7"
    };
    
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();
    var name = "";
    var city = "";
    var time = 0;
    var freq = 0;

    $(".btn").on("click", function(){
        event.preventDefault();
        name = $("#trainName").val().trim();
        city = $("#destination").val().trim();
        time = $("#time").val().trim();
        freq = $("#frequency").val().trim();

        database.ref().push({
            name:name,
            city:city,
            time:time,
            freq:freq
        });
    });

    database.ref().on("child_added", function(snapshot){
        var sv = snapshot.val();
        var trainName = sv.name;
        var trainCity = sv.city;
        var trainTime = sv.time;
        var trainFreq = sv.freq;

        var format = moment(trainTime, "HH:mm").format("X");


        var convertFirstTime = moment(trainTime, "HH:mm").subtract(1,"years");
        // console.log(convertFirstTime);

        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        var difference = moment().diff(moment.unix(format), "minutes");
        var timeRemainder = difference % trainFreq
        var minutesAway = trainFreq - timeRemainder;
        var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm A");
        console.log(trainFreq, timeRemainder);

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainCity),
            $("<td>").text(trainFreq),
            $("<td>").text(nextTrain),
            $("<td>").text(minutesAway)
        );
        
        $("#trainSchedule > tbody").append(newRow);

    }, function(errorObject){
        console.log("Errors handled: " + errorObject.code);
    });

});