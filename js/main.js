/* Stylesheet by William D Gannon, 2019 */

//load the data from geojson
function createMap() {
	//create the map
	var map = L.map('map', {
		center: [37.8, -96],
		zoom: 4
	});

	//add OSM base tilelayer
	L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		subdomains: 'abcd',
		minZoom: 0,
		maxZoom: 20,
		ext: 'png'
	}).addTo(map);
	getData(map);
}

//processData
function processData(data) {
	var attributes = [];

	var properties = data.features[0].properties;
	//put each attribute into array
	for (var attribute in properties) {
		if (attribute.indexOf('SEASON') > -1) {
			attributes.push(attribute);
		}
	}

	return attributes
}
//createSequence
//create new sequence controls IN MAP
function createSequenceControls(map, attributes, geodata) {
	var SequenceControl = L.Control.extend({
		options: {
			position: 'bottomleft'
		},

		onAdd: function (map) {
			// create the control container div with a particular class name
			var container = L.DomUtil.create('div', 'sequence-control-container');

			// ... initialize other DOM elements, add listeners, etc.
			$(container).append('<img class="skip" id="reverse" src="img/left.svg"/>');
			$(container).append('<input class="range-slider" type="range"/>');
			$(container).append('<img class="skip" id="forward" src="img/right.svg"/>');

			$(container).on('mousedown dblclick pointerdown', function (ev) {
				L.DomEvent.stopPropagation(ev);
			});

			return container;
		}
	});

	map.addControl(new SequenceControl());
	addSequencing(map, attributes, geodata);
}

//adds event listeners to slider and buttons after created in createSequenceControls
function addSequencing(map, attributes, geodata) {

	$('.range-slider').attr({
		max: 8,
		min: 0,
		value: 8,
		step: 1
	});

	$('.skip').click(function () {
		//get the old index value
		var index = $('.range-slider').val();

		//increment or decrement depending on button clicked
		if ($(this).attr('id') == 'forward') {
			index++;
			//if past the last attribute, wrap around to first attribute
			index = index > 8 ? 0 : index;

		} else if ($(this).attr('id') == 'reverse') {
			index--;
			//if past the first attribute, wrap around to last attribute
			index = index < 0 ? 8 : index;
		}

		//update slider
		$('.range-slider').val(index);
		updatePropSymbols(map, attributes[index]);
		updateLegend(map, attributes[index]);
	});

	$('.range-slider').on('input', function () {
		var index = $(this).val();
		updatePropSymbols(map, attributes[index]);
		updateLegend(map, attributes[index]);
	});
}




//Step 2: Import GeoJSON data
function getData(map) {
	//load the data
	$.ajax("data/GameAttendance.geojson", {
		dataType: "json",
		success: function (response) {
			var attributes = processData(response);
			var geodata = response
			//callfunction to get data
			//console.log(attributes);
			//call function to create proportional symbols
			createPropSymbols(response, map, attributes);
			createSequenceControls(map, attributes, geodata);
			createLegend(map, attributes);
			createSearch(map, geodata);
		}
	});
}

//fillcolor
//defines the fill coloring of the prop symbols based on team name, distinct per team
//color codes from https://teamcolorcodes.com/
function fillColoring(t) {
	if (t === "Anaheim Ducks") {
		var color1 = "#F47A38"
		return color1;
		//var color2 = "#B09862"
		//return [color1,color2];
	} else if (t === "Arizona Coyotes") {
		var color1 = "#8C2633"
		//var color2 = "#E2D6B5"
		return color1;
		//return [color1,color2];
	} else if (t === "Boston Bruins") {
		var color1 = "#FFB81C"
		return color1;
		//var color2 = "#000000"
		//return [color1,color2];
	} else if (t === "Buffalo Sabres") {
		var color1 = "#002654"
		return color1;
		// var color2 = "#FCB514"
		//return [color1,color2];
	} else if (t === "Calgary Flames") {
		var color1 = "#C8102E"
		return color1;
		// var color2 = "#F1BE48"
		//return [color1,color2];
	} else if (t === "Carolina Hurricanes") {
		var color1 = "#CC0000"
		return color1;
		// var color2 = "#000000"
		//return [color1,color2];
	} else if (t === "Chicago Blackhawks") {
		var color1 = "#CF0A2C"
		return color1;
		//var color2 = "#D18A00"
		// return [color1,color2];
	} else if (t === "Colorado Avalanche") {
		var color1 = "#6F263D"
		return color1;
		// var color2 = "#236192"
		//return [color1,color2];
	} else if (t === "Columbus Blue Jackets") {
		var color1 = "#002654"
		return color1;
		// var color2 = "#CE1126"
		//return [color1,color2];
	} else if (t === "Dallas Stars") {
		var color1 = "#8F8F8C"
		return color1;
		// var color2 = "#006847"
		//return [color1,color2];
	} else if (t === "Detroit Red Wings") {
		var color1 = "#FFFFFF"
		return color1;
		//var color2 = "#CE1126"
		//return [color1,color2];
	} else if (t === "Edmonton Oilers") {
		var color1 = "#041E42"
		return color1;
		// var color2 = "#FF4C00"
		// return [color1,color2];
	} else if (t === "Florida Panthers") {
		var color1 = "#B9975B"
		return color1;
		//var color2 = "#C8102E"
		//return [color1,color2];
	} else if (t === "Los Angeles Kings") {
		var color1 = "#111111"
		return color1;
		//var color2 = "#A2AAAD"
		//return [color1,color2];
	} else if (t === "Minnesota Wild") {
		var color1 = "#154734"
		return color1;
		//var color2 = "#DDCBA4"
		//return [color1,color2];
	} else if (t === "Montreal Canadiens") {
		var color1 = "#AF1E2D"
		return color1;
		//var color2 = "#192168"
		//return [color1,color2];
	} else if (t === "Nashville Predators") {
		var color1 = "#FFB81C"
		return color1;
		//var color2 = "#041E42"
		//return [color1,color2];
	} else if (t === "New Jersey Devils") {
		var color1 = "#CE1126"
		return color1;
		// var color2 = "#000000"
		// return [color1,color2];
	} else if (t === "NY Islanders") {
		var color1 = "#00539B"
		return color1;
		// var color2 = "#F47D30"
		//return [color1,color2];
	} else if (t === "NY Rangers") {
		var color1 = "#0038A8"
		return color1;
		//var color2 = "#CE1126"
		// return [color1,color2];
	} else if (t === "Ottawa Senators") {
		var color1 = "#000000"
		// var color2 = "#E31837"
		// return [color1,color2];
	} else if (t === "Philadelphia Flyers") {
		var color1 = "#F74902"
		return color1;
		var color2 = "#000000"
		//return [color1,color2];
	} else if (t === "Pittsburgh Penguins") {
		var color1 = "#000000"
		return color1;
		// var color2 = "#FCB514"
		//  return [color1,color2];
	} else if (t === "San Jose Sharks") {
		var color1 = "#006D75"
		return color1;
		//var color2 = "#FFFFFF"
		// return [color1,color2];
	} else if (t === "St. Louis Blues") {
		var color1 = "#002F87"
		return color1;
		//var color2 = "#FCB514"
		// return [color1,color2];
	} else if (t === "Tampa Bay Lightning") {
		var color1 = "#002868"
		return color1;
		//var color2 = "#FFFFFF"
		// return [color1,color2];
	} else if (t === "Toronto Maple Leafs") {
		var color1 = "#003E7E"
		return color1;
		//var color2 = "#FFFFFF"
		// return [color1,color2];
	} else if (t === "Vancouver Canucks") {
		var color1 = "#001F5B"
		return color1;
		// var color2 = "#00843D"
		// return [color1,color2];
	} else if (t === "Vegas Golden Knights") {
		var color1 = "#B4975A"
		return color1;
		//var color2 = "#333F42"
		//return [color1,color2];
	} else if (t === "Washington Capitals") {
		var color1 = "#FFFFFF"
		return color1;
		// var color2 = "#C8102E"
		//return [color1,color2];
	} else if (t === "Winnipeg Jets") {
		var color1 = "#041E42"
		return color1;
		//var color2 = "#004C97"
		//return [color1,color2];
	} else {
		var color1 = "#60223B"
		// var color2 = "#000"
		return color1;
		//return [color1,color2];
	}
}

function fillColor(t) {
	if (t === "Anaheim Ducks") {
		//var color1 = "#F47A38"
		//return color1;
		var color2 = "#B09862"

		return color2;
		//return [color1,color2];
	} else if (t === "Arizona Coyotes") {
		//var color1 = "#8C2633"
		//return color1;
		var color2 = "#E2D6B5"
		return color2;
		//return [color1,color2];
	} else if (t === "Boston Bruins") {
		//var color1 = "#FFB81C"
		//return color1;
		var color2 = "#000000"
		return color2;
		//return [color1,color2];
	} else if (t === "Buffalo Sabres") {
		// var color1 = "#002654"
		//return color1;
		var color2 = "#FCB514"
		return color2;
		//return [color1,color2];
	} else if (t === "Calgary Flames") {
		// var color1 = "#C8102E"
		//return color1;
		var color2 = "#F1BE48"
		return color2;
		//return [color1,color2];
	} else if (t === "Carolina Hurricanes") {
		//var color1 = "#CC0000"
		//return color1;
		var color2 = "#000000"
		return color2;
		//return [color1,color2];
	} else if (t === "Chicago Blackhawks") {
		//var color1 = "#CF0A2C"
		//return color1;
		var color2 = "#D18A00"
		return color2;
		// return [color1,color2];
	} else if (t === "Colorado Avalanche") {
		//var color1 = "#6F263D"
		//return color1;
		var color2 = "#236192"
		return color2;
		//return [color1,color2];
	} else if (t === "Columbus Blue Jackets") {
		//var color1 = "#002654"
		//return color1;
		var color2 = "#CE1126"
		return color2;
		//return [color1,color2];
	} else if (t === "Dallas Stars") {
		// var color1 = "#8F8F8C"
		//return color1;
		var color2 = "#006847"
		return color2;
		//return [color1,color2];
	} else if (t === "Detroit Red Wings") {
		//var color1 = "#FFFFFF"
		//return color1;
		var color2 = "#CE1126"
		return color2;
		//return [color1,color2];
	} else if (t === "Edmonton Oilers") {
		// var color1 = "#041E42"
		//return color1;
		var color2 = "#FF4C00"
		return color2;
		// return [color1,color2];
	} else if (t === "Florida Panthers") {
		// var color1 = "#B9975B"
		//return color1;
		var color2 = "#C8102E"
		return color2;
		//return [color1,color2];
	} else if (t === "Los Angeles Kings") {
		// var color1 = "#111111"
		//return color1;
		var color2 = "#A2AAAD"
		return color2;
		//return [color1,color2];
	} else if (t === "Minnesota Wild") {
		//var color1 = "#154734"
		//return color1;
		var color2 = "#DDCBA4"
		return color2;
		//return [color1,color2];
	} else if (t === "Montreal Canadiens") {
		// var color1 = "#AF1E2D"
		//return color1;
		var color2 = "#192168"
		return color2;
		//return [color1,color2];
	} else if (t === "Nashville Predators") {
		//var color1 = "#FFB81C"
		//return color1;
		var color2 = "#041E42"
		return color2;
		//return [color1,color2];
	} else if (t === "New Jersey Devils") {
		//var color1 = "#CE1126"
		//return color1;
		var color2 = "#000000"
		return color2;
		// return [color1,color2];
	} else if (t === "NY Islanders") {
		// var color1 = "#00539B"
		//return color1;
		var color2 = "#F47D30"
		return color2;
		//return [color1,color2];
	} else if (t === "NY Rangers") {
		//var color1 = "#0038A8"
		//return color1;
		var color2 = "#CE1126"
		return color2;
		// return [color1,color2];
	} else if (t === "Ottawa Senators") {
		//var color1 = "#000000"
		var color2 = "#E31837"
		return color2;
		// return [color1,color2];
	} else if (t === "Philadelphia Flyers") {
		//var color1 = "#F74902"
		//return color1;
		var color2 = "#000000"
		return color2;
		//return [color1,color2];
	} else if (t === "Pittsburgh Penguins") {
		//var color1 = "#000000"
		//return color1;
		var color2 = "#FCB514"
		return color2;
		//  return [color1,color2];
	} else if (t === "San Jose Sharks") {
		//var color1 = "#006D75"
		//return color1;
		var color2 = "#FFFFFF"
		return color2;
		// return [color1,color2];
	} else if (t === "St. Louis Blues") {
		// var color1 = "#002F87" 
		//return color1;
		var color2 = "#FCB514"
		return color2;
		// return [color1,color2];
	} else if (t === "Tampa Bay Lightning") {
		//var color1 = "#002868"
		//return color1;
		var color2 = "#FFFFFF"
		return color2;
		// return [color1,color2];
	} else if (t === "Toronto Maple Leafs") {
		//var color1 = "#003E7E"
		//return color1;
		var color2 = "#FFFFFF"
		return color2;
		// return [color1,color2];
	} else if (t === "Vancouver Canucks") {
		//var color1 = "#001F5B"
		//return color1;
		var color2 = "#00843D"
		return color2;
		// return [color1,color2];
	} else if (t === "Vegas Golden Knights") {
		//var color1 = "#B4975A"
		//return color1;
		var color2 = "#333F42"
		return color2;
		//return [color1,color2];
	} else if (t === "Washington Capitals") {
		//var color1 = "#FFFFFF"
		//return color1;
		var color2 = "#C8102E"
		return color2;
		//return [color1,color2];
	} else if (t === "Winnipeg Jets") {
		//var color1 = "#041E42"
		//return color1;
		var color2 = "#004C97"
		return color2;
		//return [color1,color2];
	} else {
		var color1 = "#60223B"
		//var color2 = "#000"
		return color1;
		//return [color1,color2];
	}
}

//pointTolayer
function pointToLayer(feature, latlng, attributes) {
	var attribute = attributes[0];
	//console.log(attribute);

	var team = feature.properties["TEAM"];
	//add in the marker options
	var options = {
		fillColor: fillColoring(team),
		color: fillColor(team),
		weight: 2,
		opacity: 1,
		fillOpacity: 0.75
	}
	//for each feature determine its val
	var attValue = Number(feature.properties[attribute]);
	//console.log(feature.properties);
	//console.log(attValue);
	//give each feature circlemarker a radius based on its attribute value
	options.radius = calcPropRadius(attValue);

	//create circle marker layers
	var layer = L.circleMarker(latlng, options);
	//console.log(layer)
	//create pop up labels
	createPopup(feature.properties, attribute, layer, options.radius);

	//return the circle marker to the L.geojson pointtolayer option
	return layer;
}
//createpropsymbols
function createPropSymbols(data, map, attributes) {
	//create a Leaflet GeoJSON layer and add it to the map
	//var markers = L.markerClusterGroup({
	//    showCoverageOnHover: false,
	//    zoomToBoundsOnClick: false
	// });
	//var teams
	L.geoJson(data, {
		pointToLayer: function (feature, latlng) {
			return pointToLayer(feature, latlng, attributes);
		}
	}).addTo(map);
	//markers.addLayer(teams);
	//markers.on('clustermouseover', function (a) {
	//    a.layer.spiderfy();
	//})

}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
	//scale factor to adjust symbol size evenly
	var radius = ((attValue - 13000) / 319.8) * 2;

	return radius;
}

//updatePropSymbol
function updatePropSymbols(map, attribute) {
	map.eachLayer(function (layer) {

		if (layer.feature && layer.feature.properties[attribute]) {
			//access feature properties
			var props = layer.feature.properties;

			//update each feature's radius based on new attribute values
			var radius = calcPropRadius(props[attribute]);
			layer.setRadius(radius);

			createPopup(props, attribute, layer, radius);
		}
	});
}
//create popup
function createPopup(properties, attribute, layer, radius) {
	//add city to popup content string
	var popupContent = "<p><b>Team:</b> " + properties.TEAM + "</p>";

	//add formatted attribute to content string
	var season = attribute;
	popupContent += "<p><b>Average Game Attendance for " + season + ":</b> " + properties[attribute] + " fans</p>";

	//replace the layer popup
	layer.bindPopup(popupContent, {
		offset: new L.Point(0, -radius)
	});
	layer.on({
		mouseover: function () {
			this.openPopup();
		},
		mouseout: function () {
			this.closePopup();
		}
	});
}
//createLegend
function createLegend(map, attributes) {
	var LegendControl = L.Control.extend({
		options: {
			position: 'bottomleft'
		},

		onAdd: function (map) {
			// create the control container with a particular class name
			var container = L.DomUtil.create('div', 'legend-control-container');

			//add temporal legend div to container
			$(container).append('<div id="temporal-legend">')

			//start attribute legend svg string
			var svg = '<svg id="attribute-legend" width="350px" height="185px">';

			//array of circle names to base loop on
			var circles = {
				max: 80,
				mean: 120,
				min: 160
			}

			//loop to add each circle and text to svg string
			for (var circle in circles) {
				//circle string
				svg += '<circle class="legend-circle" id="' + circle +
					'" fill="#D3D3D3" fill-opacity=".8" stroke="#000000" stroke-width="2" cx="92"/>';

				svg += '<text id="' + circle + '-text" x="200" y="' + circles[circle] + '"></text>';
			}

			svg += "</svg>";

			//add attribute legend svg to container
			$(container).append(svg);

			return container;
		}
	});
	map.addControl(new LegendControl());

	updateLegend(map, attributes[0]);
}
//updatelegend
function updateLegend(map, attribute) {
	//create content for legend
	var year = attribute;
	var content = "NHL Attendence for: " + year;

	//replace legend content
	$('#temporal-legend').html("<b id='legend-season'>" + content + "</b>");

	var circleValues = getCircleValues(map, attribute);

	for (var key in circleValues) {
		//get the radius
		var radius = calcPropRadius(circleValues[key]);

		//Step 3: assign the cy and r attributes
		$('#' + key).attr({
			cy: 150 - radius,
			r: radius
		});

		$('#' + key + '-text').html(Math.round(circleValues[key]) + " fans");
	}
}
//getcircle values
function getCircleValues(map, attribute) {
	//start with min at highest possible and max at lowest possible number
	var min = Infinity,
		max = -Infinity;

	map.eachLayer(function (layer) {
		//get the attribute value
		if (layer.feature) {
			var attributeValue = Number(layer.feature.properties[attribute]);

			//test for min
			if (attributeValue < min) {
				min = attributeValue;
			}

			//test for max
			if (attributeValue > max) {
				max = attributeValue;
			}
		}
	});

	//set mean
	var mean = (max + min) / 2;
	//return values as an object
	return {
		max: max,
		mean: mean,
		min: min
	};
}
//create search
function createSearch(map, geodata) {
	var features = geodata["features"];
	var teamList = [];
	for (var i = 0; i < features.length; i++) {
		var team = String(features[i]["properties"]["TEAM"]);
		teamList.push(team);
	}

	//alphabatizes team list for intuitive use
	var teamListABC = teamList.sort();

	var SearchControl = L.Control.extend({
		options: {
			position: 'bottomleft'
		},

		onAdd: function (map) {
			// create the control container with a particular class name
			var container = L.DomUtil.create('div', 'search-control-container');
			return container;
		}
	});

	map.addControl(new SearchControl());
	populateSearchDrop(map, geodata, teamListABC);
}
//populatesearchdropdown
function populateSearchDrop(map, geodata, list) {

	$(".search-control-container").append('<select id="select-drop-down"><option value="zoom">Zoom to...</option>');
	$("#select-drop-down").append('<option value="full">FULL MAP</option>');

	for (var i = 0; i < list.length; i++) {
		var team = list[i];
		var value = team.replace(/\s+/g, '');
		$("#select-drop-down").append('<option value=' + value + '>' + team + '</option>');
	}
	$(".search-control-container").append('</select>');

	//calls reZoom function upon selection change
	$("#select-drop-down").change(function () {
		reZoom(map, this, geodata);
	});
}
//zooms to selected team based on search control selection and resets to first option
function reZoom(map, e, data) {

	var team = e.options[e.selectedIndex].text;
	var features = data["features"];

	function teamCheck(element, index, array) {
		return element["properties"]["TEAM"] == team;
	}
	var index = Number(features.findIndex(teamCheck));
	if (team === "FULL MAP") {
		map.setView([37.8, -96], 4);
		$('#select-drop-down').get(0).selectedIndex = 0;
	} else if (index >= 0 && index < features.length) {
		var latitude = features[index]["geometry"]["coordinates"][1];
		var longitude = features[index]["geometry"]["coordinates"][0];
		//added these slight valuesto be off center
		map.setView([(latitude - .007), (longitude - .025)], 12);
		$('#select-drop-down').get(0).selectedIndex = 0;
	}
}

$(document).ready(createMap);
