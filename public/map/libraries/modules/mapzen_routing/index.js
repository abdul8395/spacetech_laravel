var mapZenControl = L.Routing.control(L.extend(window.lrmConfig, {
		waypoints: [
			L.latLng(57.74, 11.94),
			L.latLng(57.6792, 11.949)
		],
		geocoder: L.Control.Geocoder.nominatim(),
		routeWhileDragging: true,
		reverseWaypoints: true,
		showAlternatives: true,
		altLineOptions: {
			styles: [
				{color: 'black', opacity: 0.15, weight: 9},
				{color: 'white', opacity: 0.8, weight: 6},
				{color: 'blue', opacity: 0.5, weight: 2}
			]
		}
}));

var mapZenErrorControl = L.Routing.errorControl(mapZenControl);
function addRemoveMapZenService(){
	if(mapZenControl._map==undefined){
		map.addControl(mapZenControl);
		map.addControl(mapZenErrorControl);
	}
	else{
		map.removeControl(mapZenControl);
		map.removeControl(mapZenErrorControl);
	}
}