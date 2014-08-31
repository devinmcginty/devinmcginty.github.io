// Lazy constants
var SECOND = 1000;
var MINUTE = SECOND * 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
var LATLNG = new google.maps.LatLng(40.043736, -75.182705);
var COLOR_MAP = [
    "#72FE95",
    "#74FEF8",
    "#B0A7F1",
    "#FFA4FF",
    "#FFA8A8"
]

var END_DATE = "Sep 20, 2014 15:00:00";

var targetDate = new Date(END_DATE).getTime();

function initializeMap() {
    var coolMap = [
        {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [
                { hue: '#000000' },
                { saturation: -100 },
                { lightness: -100 },
                { visibility: 'on' }
            ]
        },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
                { hue: '#000000' },
                { saturation: -100 },
                { lightness: -100 },
                { visibility: 'on' }
            ]
        },{
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        },{
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
                { hue: '#01B0F0' },
                { saturation: 98 },
                { lightness: -38 },
                { visibility: 'on' }
            ]
        },{
            featureType: 'water',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        },{
            featureType: 'road.highway',
            elementType: 'all',
            stylers: [
                { hue: '#FF358B' },
                { saturation: 100 },
                { lightness: -6 },
                { visibility: 'on' }
            ]
        },{
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [
                { hue: '#AEEE00' },
                { saturation: 100 },
                { lightness: -39 },
                { visibility: 'on' }
            ]
        },{
            featureType: 'road.local',
            elementType: 'geometry',
            stylers: [
                { hue: '#ffffff' },
                { saturation: -100 },
                { lightness: 100 },
                { visibility: 'on' }
            ]
        },{
            featureType: 'administrative',
            elementType: 'all',
            stylers: [{ visibility: 'off' }]
        }
    ];

    var mapOptions = {
        center: LATLNG,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        zoomControl: false,
        // zoomControlOptions: {
        //     position: google.maps.ControlPosition.TOP_LEFT
        // },
        streetViewControl: false,
        scaleControl: false,
        overviewMapControl: false,
        tilt: 0,
        styles: coolMap
    }

    var map = new google.maps.Map(
        document.getElementById("mapCanvas"), mapOptions
    );

    var marker = new google.maps.Marker({
        position: LATLNG,
        map: map,
        animation: google.maps.Animation.BOUNCE
    });
}

function timeWords(days, hours, minutes, seconds) {
    var t = "" + days;
    t += (days===1)?" day<br/>":" days<br/>";
    t += hours;
    t += (hours===1)?" hour<br/>":" hours<br/>";
    t += minutes;
    t += (minutes===1)?" minute<br/>":" minutes<br/>";
    t += seconds;
    t += (seconds===1)?" second":" seconds";
    return t;
}

function leadingZeros(num,division,size) {
    var n = "000000" + parseInt(num / division);
    return n.substr(n.length - size);
}

function timeOut() {
    var filler = "PARTY TIME";
    var div = document.getElementById("lastday");
    if ($("#lastday").hasClass("invisible")) {
        $("#lastday").removeClass("invisible");
        $("#multiday").addClass("invisible");
    }
    var toggle = false;
    var color = 0;
    setInterval( function() {
        if (toggle) {
            toggle = false;
            color = (color + 1) % 5;
            div.innerHTML = filler.fontcolor(COLOR_MAP[color]);
        }
        else {
            toggle = true;
            div.innerHTML = filler.fontcolor("white");
        }
    }, 100);
}

function lastDayCounter() {
    var div = document.getElementById("lastday");
    if ($("#lastday").hasClass("invisible")) {
        $("#lastday").removeClass("invisible");
        $("#multiday").addClass("invisible");
    }
    var timer = setInterval( function() {
        var timeLeft = targetDate - new Date().getTime();
        console.log(timeLeft);
        if (timeLeft < 0) {
            clearInterval(timer);
            timeOut();
        }
        var tminus = "";
        if (timeLeft > HOUR) {
            tminus += leadingZeros(timeLeft,HOUR,2) + ":";
            timeLeft %= HOUR;
        }
        if (timeLeft > MINUTE) {
            tminus += leadingZeros(timeLeft,MINUTE,2) + ":";
            timeLeft %= MINUTE;
        }
        tminus += leadingZeros(timeLeft,SECOND,2) + ":";
        timeLeft %= SECOND;
        tminus += leadingZeros(timeLeft,1,3);
        div.innerHTML = tminus;
    });
}

function multiDay() {
    var div = document.getElementById("multiday");
    if ($("#multiday").hasClass("invisible")) {
        $("#multiday").removeClass("invisible");
    }
    var timer = setInterval( function() {
        var timeLeft = targetDate - new Date().getTime();
        if (timeLeft < DAY) {
            clearInterval(timer);
            lastDayCounter();
        }
        var daysLeft = parseInt(timeLeft / DAY);
        timeLeft %= DAY;
        var hoursLeft = leadingZeros(timeLeft,HOUR,2);
        timeLeft %= HOUR;
        var minutesLeft = leadingZeros(timeLeft,MINUTE,2);
        timeLeft %= MINUTE;
        var secondsLeft = leadingZeros(timeLeft,SECOND,2);
        var tminus = timeWords(daysLeft, hoursLeft, minutesLeft, secondsLeft);
        tminus += "<br /><span id=\"partytime\">'TIL PARTY TIME</span>";
        div.innerHTML = tminus;
    }, 1000);
}

function main() {
    google.maps.event.addDomListener(window, "load", initializeMap());
    var tminus = targetDate - new Date().getTime()
    if (tminus > DAY) {
        multiDay();
    }
    else if (tminus > 0) {
        lastDayCounter();
    }
    else {
        timeOut();
    }
}

$(document).ready(function() {
    initializeMap();
    main();
})
