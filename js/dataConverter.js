function DataConverter() {
	this.convert = function(data) {
		var output = {};

		for (var i = 0; i < data.stations.length; i++) {
			var stationId = parseInt(this.extractFirstNumber(data.stations[i].name));
			output[stationId] = this.getStation(stationId);
			output[stationId].data = {};
			output[stationId].data.children = [];
			for (pollution in data.stations[i]) {
				if (typeof data.stations[i][pollution] == 'object') {
					var pollutionData = data.stations[i][pollution];
					pollutionData.name = pollution;
					output[stationId].data.children.push(pollutionData);
				};
			}
		};
		return output;
	}

	this.extractFirstNumber = function(string) {
		var pattern = new RegExp("(^|\\s)([0-9]+)($|\\s)");
		return string.match(pattern)[0];
	}

	this.getStation = function(id) {
		for (var STATION in STATIONS) {
			if (STATIONS[STATION].meta.id == id) {
				return STATIONS[STATION];
			};
		}
		return false;
	}

	this.getWeather = function(data) {
		var output = {};

		for (weatherItem in data.values) {
			if (weatherItem == "velocity") {
				output[weatherItem] = parseFloat(data.values[weatherItem].substring(1));
			} else {
				output[weatherItem] = parseFloat(data.values[weatherItem]);
			}
		}
		return output;
	}

}
