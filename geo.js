OpenLayers.ProxyHost = "proxy.cgi?url=";

var map,info, first_layer, second_layer, info;

$(function() 
{
	$( "#accordion" ).accordion();
});


function init() 
{
	// map bounds
	var bounds = new OpenLayers.Bounds(
	556900, 4165000,
	589700, 4202000
	);

	//scales
	var myscales= [50000, 150000, 250000];
	
	// map options
	var options = {
		scales: myscales,
		maxExtent: bounds,
		projection: "EPSG:2100", 
		units: "m"
		
		};
	
	map = new OpenLayers.Map('xartis', options);

	// define ota wms layer
	var basemap = new OpenLayers.Layer.WMS(
			"ΝΗΣΟΣ ΑΝΔΡΟΣ", "http://atlas.geocenter.survey.ntua.gr:8080/geoserver/wms",
			{
				srs: 'EPSG:2100',
				layers: 'w_ibersimi:map_impersimi',
				styles: '',
				format:'image/png',
                                transparent:true,
			},
			{
				singleTile: true,
				isBaseLayer: true,				
				ratio: 1
			}
			);
	
	// add ota wms layer
	map.addLayer(basemap);
	map.zoomToExtent(bounds);
	////////////////////////////////////////////////////////////////////////////
	// define and add first_layer as WMS layer (overlay)
		first_layer = new OpenLayers.Layer.WMS(
				"Οικισμοί",  "http://atlas.geocenter.survey.ntua.gr:8080/geoserver/wms",
				{
					layers: "w_ibersimi:Paralia",
					transparent: "true",
					format:'image/png'
				},
				{
					isBaseLayer: false,
					visibility: true
				});
		map.addLayer(first_layer);
	
	
	///////////////////////////////////////////////////////////////////////////////////////////
			// Set up symbols for points
	        var simiaStyle = new OpenLayers.Style({
	           	fillOpacity: 0.1,
				strokeColor: "#555555",
				strokeWidth: 1,
				pointRadius: 10,
				fillColor: "#fae318"
	        });
	       // Blue symbol for selected gardens
	        var selectedsimiaStyle = new OpenLayers.Style({
	            externalGraphic: "bank1.png",
				graphicWith: 20,
				graphicHeight: 20	
                });
	        // Set up style map for gardens
	        var gardenStyleMap = new OpenLayers.StyleMap({'default': simiaStyle,'select': selectedsimiaStyle});

	        // Define the gardens GeoJSON layer
	        var simiaLayer = new OpenLayers.Layer.Vector("Τραπεζικά Καταστήματα", {
	            projection: 'EPSG:2100',
	            strategies: [new OpenLayers.Strategy.Fixed()],
	            protocol: new OpenLayers.Protocol.HTTP({
	                url: "bank.geojson",
	                format: new OpenLayers.Format.GeoJSON()
	            }),
	            styleMap: gardenStyleMap
	        });
	
	map.addLayer(simiaLayer);

 // Define the gardens GeoJSON layer
	        var simiaLayer1 = new OpenLayers.Layer.Vector("ATM", {
	            projection: 'EPSG:2100',
	            strategies: [new OpenLayers.Strategy.Fixed()],
	            protocol: new OpenLayers.Protocol.HTTP({
	                url: "atm.geojson",
	                format: new OpenLayers.Format.GeoJSON()
	            }),
	            styleMap: gardenStyleMap
	        });
	
	map.addLayer(simiaLayer1);
	////////////////////////////////////////////////
		
	// Add controls
	map.addControl(new OpenLayers.Control.MousePosition());
	map.addControl(new OpenLayers.Control.Navigation());
	map.addControl(new OpenLayers.Control.LayerSwitcher({roundedCorner: false}));
	map.addControl(new OpenLayers.Control.OverviewMap());
	map.addControl(new OpenLayers.Control.Scale());
	map.addControl(new OpenLayers.Control.ScaleLine());
	map.addControl(new OpenLayers.Control.Permalink());
	
	//////////////////////////////////////////////////////////////////////////
	var select = new OpenLayers.Control.SelectFeature([gardensLayer,simiaLayer]);
	map.addControl(select);
	select.activate();
	
	/////////////////////////////////////////////////////////////////////////////
	gardensLayer.events.on({
        featureselected: function(event) {
        var feature = event.feature;
        var id = feature.attributes.OBJECTID;
        var output = feature.attributes.Name;
        document.getElementById('summaryLabel').innerHTML = output;
    }	
	});

	simiaLayer.events.on({
        featureselected: function(event) {
        var feature = event.feature;
        var id = feature.attributes.OBJECTID;
        var output = feature.attributes.Name;
        document.getElementById('summaryLabel').innerHTML = output;
    }
	});
	
}


function updateFilter(){

	// λήψη κειμένου από filter
	var filter = document.getElementById('filter').value;
		
	// by default, reset all filters
	var filterParams = {
		filter: null,
		cql_filter: null,
		featureId: null
	};
	if (OpenLayers.String.trim(filter) != "") //αν η τιμή του filter είναι διάφορη του κενού
	{
			filterParams["cql_filter"] = filter;
	}
	// κλήση της συνάρτησης mergeNewParams που ξανασχεδιάζει το wms layer
	mergeNewParams(filterParams);
}

function mergeNewParams(params){
	first_layer.mergeNewParams(params);
}
