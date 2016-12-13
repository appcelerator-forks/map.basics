var MapModule = require('ti.map');
var moment = require("alloy/moment");
Ti.App.location = {};

/**
 * Runs after the devices successfuly gets the users location
 * @param {object} data
 * @return {null} updates the ui
 * @author sam
 */
var locationCallback = function(_event) {

	if (_event.success && _event.coords) {

		Ti.App.location = _event.coords;

		if (OS_IOS) {

			var cam = MapModule.createCamera({
				altitude : 600,
				centerCoordinate : {
					latitude : Ti.App.location.latitude,
					longitude : Ti.App.location.longitude
				},
				heading : Ti.App.location.heading,
				pitch : 45
			});

			$.MapView.animateCamera({
				camera : cam,
				curve : Ti.UI.ANIMATION_CURVE_EASE_IN
			});

			$.MapView.userLocation = true;

		}

		// Remove the vent listener
		Ti.Geolocation.removeEventListener('location', locationCallback);

	} else {

		console.log("There has been a error getting your location.....");

	}

};

/**
 * Fires when the map completes loading
 * @param {object} data
 * @return {null} updates the ui
 * @author sam
 */
$.MapView.addEventListener('complete', function(_event) {

	if (OS_ANDROID) {

		$.MapView.setRegion({
			latitude : Ti.App.location.latitude,
			longitude : Ti.App.location.longitude,
			bearing : Ti.App.location.heading,
			zoom : 15,
			tilt : 45
		});

		$.MapView.userLocation = true;

	}

});

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
