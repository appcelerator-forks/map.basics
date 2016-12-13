var MapModule = require('ti.map');

/**
 * Runs after the devices successfuly gets the users location
 * @param {object} data
 * @return {null} updates the ui
 * @author sam
 */
var locationCallback = function(_event) {

	if (_event.success && _event.coords) {

		$.MapView.setRegion({
			latitude : _event.coords.latitude,
			longitude : _event.coords.longitude,
			zoom : 15,
			tilt : 45
		});

		// Remove the vent listener
		Ti.Geolocation.removeEventListener('location', locationCallback);

		$.MapView.userLocation = true;

	} else {

		console.log("There has been a error getting your location.....");

	}

};

/**
 * Listeners to the window open
 * @param {object} data
 * @return {null} updates the ui
 * @author sam
 */
function showCurrentPosition(_event) {

	if (Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE)) {

		Ti.Geolocation.addEventListener('location', locationCallback);
		
	}

	/**
	 * Checks the device has correct permissions and authorizes
	 * @param {object} data
	 * @return {null} updates the ui
	 * @author sam
	 */
	Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE, function(e) {

		console.log("requestLocationPermissions", e);
		if (e.success) {

			if (OS_IOS) {

				Ti.Geolocation.showCalibration = false;
				Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
				Ti.Geolocation.addEventListener('location', locationCallback);

			}

			if (OS_ANDROID) {

				Ti.Geolocation.Android.manualMode = false;
				Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
				Ti.Geolocation.addEventListener('location', locationCallback);

			}

		} else {

			alert("Error");

		}
	});

}

$.index.open();
