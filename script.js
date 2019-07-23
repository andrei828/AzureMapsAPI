toogle = true

function GetMap(){
	document.getElementById('buttonid').addEventListener('click', openDialog);

	function openDialog() {
 		document.getElementById('fileid').click();
	}

    //Instantiate a map object
	var map = new atlas.Map("myMap", {
		//Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
		authOptions: {
		    authType: 'subscriptionKey',
		    subscriptionKey: 'NSF4iGmEjmi624dA7uO-mi-m4aoXVix8F0npqMoESGQ'
		}
		});

	//Wait until the map resources are ready.
	map.events.add('ready', function() {

		//Create a data source and add it to the map.
		datasource = new atlas.source.DataSource();
		map.sources.add(datasource);

		//Add a layer for rendering point data.
		var resultLayer = new atlas.layer.SymbolLayer(datasource, null, {
		    iconOptions: {
		        image: 'pin-round-darkblue',
		        anchor: 'center',
		        allowO2verlap: true
		    },
		    textOptions: {
		        anchor: "center"
		    }
		});

		map.layers.add(resultLayer);

		// Use SubscriptionKeyCredential with a subscription key
		var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey());
		// Use subscriptionKeyCredential to create a pipeline
		var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential);
		// Construct the SearchURL object
		var searchURL = new atlas.service.SearchURL(pipeline);

		var query =  'gasoline-station';
		var radius = 3500;
		var lat = 44.4440446;
		var lon = 26.1348271;
		//44.4440446,26.1348271,14

		searchURL.searchPOI(atlas.service.Aborter.timeout(10000), query, {
			limit: 10,
			lat: lat,
			lon: lon,
			radius: radius
		}).then((results) => {

			// Extract GeoJSON feature collection from the response and add it to the datasource
			var data = results.geojson.getFeatures();
			datasource.add(data);
			
			// testing 
			var sample = {
				"type": "Feature",
				"geometry": {
				    "type": "Point",
				    "coordinates": [-122.126986, 47.639754]
				}
			}

			datasource.add(sample);

			// end of testing

			// set camera to bounds to show the results
			map.setCamera({
			    bounds: data.bbox,
			    zoom: 10
			});
		});

		//Create a popup but leave it closed so we can update it and display it later.
		popup = new atlas.Popup();

		//Add a mouse over event to the result layer and display a popup when this event fires.
		map.events.add('mouseover', resultLayer, showPopup);


	});

	function showPopup(e) {
		//Get the properties and coordinates of the first shape that the event occured on.

		var p = e.shapes[0].getProperties();
		var position = e.shapes[0].getCoordinates();

		//Create HTML from properties of the selected result.
		var html = ['<div style="padding:5px;"><div><b>', p.poi.name,
		    '</b></div><div>', p.address.freeformAddress,
		    '</div><div>', position[1], ', ', position[0], '</div></div>'];

		//Update the content and position of the popup.
		popup.setPopupOptions({
		    content: html.join(''),
		    position: position
		});

		//Open the popup.
		popup.open(map);
	}
}

function dropdownPressed() {
	var menu1 = document.getElementsByClassName("menu1")[0];
	var menu2 = document.getElementsByClassName("menu2")[0];
	var menu3 = document.getElementsByClassName("menu3")[0];

	menu1.addEventListener("animationend", function() {
		if (toogle)
			menu1.style.display = "none";
		else 
			menu1.style.display = "block";
	});

	menu2.addEventListener("animationend", function() {
		if (toogle)
			menu2.style.display = "none";
		else 
			menu2.style.display = "block";
	});

	menu3.addEventListener("animationend", function() {
		if (toogle) 
			menu3.style.display = "none";
		else 
			menu3.style.display = "block";
	});

	if (toogle) {	
		menu1.style.animationName = "dropdown";
		menu2.style.animationName = "dropdown";
		menu3.style.animationName = "dropdown";
		menu1.style.display = "block";
		menu2.style.display = "block";
		menu3.style.display = "block";
		toogle = false;
	} else {
		menu1.style.animationName = "dropup";
		menu2.style.animationName = "dropup";
		menu3.style.animationName = "dropup";
		toogle = true;
	}
}





























