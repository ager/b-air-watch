/*
 * @author André Gernandt
 */

window.requestAnimFrame = (function(){
	return	window.requestAnimationFrame		||
			window.webkitRequestAnimationFrame	||
			window.mozRequestAnimationFrame		||
			function() {
				window.alert("Sorry your Browser is not supported. Please download latest version of Google Chrome or Mozilla Firefox.")
			};
})();

window.cancelAnimFrame = (function(){
	return	window.cancelAnimationFrame			||
			window.webkitCancelAnimationFrame	||
			window.mozCancelAnimationFrame		||
			function() {
				window.alert("Error.")
			};
})();

var WEATHER;
var dataConverter = new DataConverter();

function main(day, month, year) {
	tiles = new Array();
	
	var row = 0;
	var col = 0;

	$.getJSON('data/live/' + year + '/' + year + '-' + month + '.json', function(data) {

		var pollutionData = dataConverter.convert(data[day]);
		WEATHER = dataConverter.getWeather(data[day]);
		var $infoBox = $("#info");
		
		var date = new Date();
		date.setDate(day);
		date.setMonth(parseInt(month) - 1);
		date.setYear(year);
		$(".date", $infoBox).text(day + "." + month + "." + year);
		
		
		$(".temperature", $infoBox).text(WEATHER.temperature);
		$(".direction", $infoBox).text(WEATHER.direction);
		$(".velocity", $infoBox).text(WEATHER.velocity);
		$(".humidity", $infoBox).text(WEATHER.humidity);


		for (var station in pollutionData) {

			// create new row for station containers
			if (col % 4 == 0) {
				$('#station-tiles').append(document.createElement('div'));
				$('#station-tiles > div:last').addClass('row');
				row++;
			};

			// create station container and title area and location-arrow icon inside each station container
			$('#station-tiles .row:last').append(document.createElement('div'));
			var $gridCell = $('#station-tiles .row:last > div:last');
			$gridCell.addClass('span2');
			$gridCell.append(document.createElement('div'));
			var $gridCellTitle = $('div', $gridCell).addClass('title').append(document.createElement('i'));
			$('i', $gridCellTitle).addClass('icon-location-arrow');
			$('i', $gridCellTitle).addClass(pollutionData[station].meta.type);

			$('i', $gridCellTitle).append(document.createElement('span'));
			$('i span', $gridCellTitle).text(pollutionData[station].meta.name);

			// create particles for each station
			tiles.push(new ParticleTile($gridCell, pollutionData[station], $('#address')));
			new TreeMap($gridCell, pollutionData[station]);

			// check current column and reset to 0 if necessary
			col++;
			if (col == 4) {
				col = 0;
			};
		}
		
		(function animloop(){
			animationInterval = requestAnimFrame(animloop);
			update();
		})();
		
		// animationInterval = window.setInterval(update, 40);
	});
}

var update = function() {
	var angle = WEATHER.direction;
	var speed = WEATHER.velocity / 100;

	// @TODO calculate angle
	var directionX = speed;
	var directionY = Math.cos(angle) * speed;

	for (var i = 0; i < tiles.length; i++) {
		for (var j = 0; j < tiles[i].particleSystems.length; j++) {
			var xAxis = new THREE.Vector3(directionX, directionY, 0);
			rotationMatrix = new THREE.Matrix4();
			rotationMatrix.makeRotationAxis(xAxis.normalize(), Math.PI / 180);
			rotationMatrix.multiply(tiles[i].particleSystems[j].matrix);
			tiles[i].particleSystems[j].matrix = rotationMatrix;
			tiles[i].particleSystems[j].rotation.setEulerFromRotationMatrix(tiles[i].particleSystems[j].matrix);

			tiles[i].renderer.render(tiles[i].scene, tiles[i].camera);
		};
	};
}

var cleanup = function() {
	window.cancelAnimFrame(animationInterval);
	$('#station-tiles').html('');
}

	/* main */
var tiles;

main("10", "06", "2013");

var animationInterval;


// EVENTS
$(".btnDisplayMode").on("click", function() {
	$("body").toggleClass("modeTreeMap");
})

$('#dateSelector').datepicker({
	format: "dd.mm.yyyy"
}).on("changeDate", function(ev) {
	var newDate = new Date(ev.date)
	if (newDate.getTime() < new Date().getTime()) {
		function addLeadingZero(n)  {
			return n < 10 ? '0' + n : n
		}
		cleanup();
		main(addLeadingZero(newDate.getDate()), addLeadingZero(newDate.getMonth() + 1), newDate.getFullYear().toString());
	}
})
