/*global Ext: false, osuc: false */
/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {

    osuc.geo = {
        start: function() {
            osuc.geo.latitude = null;
            osuc.geo.longitude = null;
            osuc.geo.mockLatitude = 35.669075;
            osuc.geo.mockLongitude = 139.651466;
            osuc.geo.location_deleted = false;
            osuc.geo.privacy = 2; // 0 = offline, 1 = privacy, 2 = public

            //osuc.geo.watchhandle = navigator.geolocation.watchPosition(osuc.geo.handle_success, osuc.geo.handle_error, {maximumAge: 60000});
            osuc.geo.mock_my_position();
            osuc.geo.trackMyPosition = true;
            osuc.geo.mapHandlerInjected = false;
            osuc.geo.profileCircles = {};
            osuc.geo.buddyMarkers = {};
            document.title = "OpenScape UC Touch (geo: init)";
        },

        mock_my_position: function() {
            osuc.geo.handle_success({coords: {latitude: osuc.geo.mockLatitude, longitude: osuc.geo.mockLongitude}});
            document.title = "OpenScape UC Touch (geo: mock, profile: " + osuc.geo.currentProfile_id + ", privacy: " + osuc.geo.privacy + ")";
            setTimeout("osuc.geo.mock_my_position()", 1000);
            setTimeout("osuc.data.contactsStore.loadPage(0)", 1000);
        },

        inject_maps_handler: function() {
            var map = osuc.ui.locationTab.items.items[0].map;
            if (map != null && osuc.geo.mapHandlerInjected == false) {
                osuc.geo.mapHandlerInjected = true;

                // Stop jumping to the current position when the user dragged the map somewhere.
                google.maps.event.addListener(map, 'dragstart', function() {
                    osuc.geo.trackMyPosition = false;
                });

                // When debugging, we use a mock location which can be set by clicking on the map
                google.maps.event.addListener(map, 'click', function(mouseEvent) {
                    osuc.geo.mockLatitude = mouseEvent.latLng.lat();
                    osuc.geo.mockLongitude = mouseEvent.latLng.lng();
                });
            }
        },

        update_maps: function() {
            var map = osuc.ui.locationTab.items.items[0].map;

            if (map != null) {
                // Show my current position
                var position = new google.maps.LatLng(osuc.geo.latitude, osuc.geo.longitude);

                marker = osuc.ui.locationTab.marker || new google.maps.Marker({
                    position: position,
                    map: map,
                    icon: new google.maps.MarkerImage(
                        "/static/img/map-marker.png", // url
                        new google.maps.Size(16, 16, "px", "px"), // size
                        new google.maps.Point(0, 0), // origin
                        new google.maps.Point(8, 8), // anchor
                        new google.maps.Size(16, 16, "px", "px") // scaledSize
                    )
                });
                marker.setPosition(position);
                osuc.ui.locationTab.marker = marker

                // Create circles according to saved profiles
                osuc.data.profilesStore.data.each(function(item, index, length) {
                    circle = osuc.geo.profileCircles[item.data.id] || new google.maps.Circle({
                        center: new google.maps.LatLng(item.data.latitude, item.data.longitude),
                        radius: item.data.accuracy,
                        clickable: false,
                        map: map,
                        fillColor: "#00aaff",
                        strokeColor: "#0080ff",
                        strokeWeight: 2
                    });
                    if (item.data.id == osuc.geo.currentProfile_id) {
                        circle.setOptions({
                            fillColor: "#ffc000",
                            strokeColor: "#ff9000"
                        });
                    } else {
                        circle.setOptions({
                            fillColor: "#00aaff",
                            strokeColor: "#0080ff"
                        });
                    }
                    circle.setCenter(new google.maps.LatLng(item.data.latitude, item.data.longitude));
                    circle.setRadius(item.data.accuracy);
                    osuc.geo.profileCircles[item.data.id] = circle;
                });

                // Delete all circles referring to deleted profiles from the map
                for (var c in osuc.geo.profileCircles) {
                    var still_valid = false;

                    osuc.data.profilesStore.data.each(function(item, index, length) {
                        if (item.data.id == c) {
                            still_valid = true;
                        }
                    });

                    if (still_valid == false) {
                        osuc.geo.profileCircles[c].setMap(null);
                    }
                }

                // Create marker according to location of contacts
                osuc.data.contactsStore.data.each(function(item, index, length) {
                    marker = osuc.geo.buddyMarkers[item.data.id] || new google.maps.Marker({
                        position: new google.maps.LatLng(item.data.userLocationLatitude, item.data.userLocationLongitude),
                        map: map
                    });
                    marker.setPosition(new google.maps.LatLng(item.data.userLocationLatitude, item.data.userLocationLongitude));
                    osuc.geo.buddyMarkers[item.data.id] = marker;
                });

                // Delete all markers referring to contacts' locations not valid anymore
                for (var c in osuc.geo.buddyMarkers) {
                    var still_valid = false;

                    osuc.data.contactsStore.data.each(function(item, index, length) {
                        if (item.data.id == c) {
                            still_valid = true;
                        }
                    });

                    if (still_valid == false) {
                        osuc.geo.buddyMarkers[c].setMap(null);
                    }
                }

                if (osuc.geo.trackMyPosition == true) {
                    map.panTo(position);
                }
            }
        },

        update_profile: function() {
            var best_distance = null;
            var best_profile_id = null;

            // Find nearest-neighbor to current location
            var my_location = new LatLon(osuc.geo.latitude, osuc.geo.longitude);
            osuc.data.profilesStore.data.each(function(item, index, length) {
                var this_location = new LatLon(item.data.latitude, item.data.longitude);
                var this_distance = this_location.distanceTo(my_location);

                if (best_distance == null || best_distance > this_distance) {
                    if (this_distance * 1000 < item.data.accuracy) {
                        best_distance = this_distance;
                        best_profile_id = item.data.id;
                    }
                }
            });

            // Let's check if we entered a new position
            if (osuc.geo.currentProfile_id != best_profile_id) {
                osuc.geo.currentProfile_id = best_profile_id;

                if (best_profile_id != null) {
                    // Get profile-object from datastore
                    profile_index = osuc.data.profilesStore.find("id", best_profile_id)
                    osuc.geo.currentProfile = osuc.data.profilesStore.getAt(profile_index).data;

                    // Set preferred device
                    osuc.data.set_device(osuc.geo.currentProfile.device_id);

                    // Set presence
                    osuc.data.set_presence(osuc.geo.currentProfile.presence_id);
                } else {
                    osuc.geo.currentProfile = null;
                }
            }
        },

        delete_location_from_server: function() {
            if (osuc.geo.privacy != 2 && !osuc.geo.location_deleted) {
                Ext.Ajax.request({
                    url: '/api/v1/location.json',
                    method: 'POST',
                    params: {
                        action: "delete"
                    }
                });

                osuc.geo.location_deleted = true;
            }
        },

        publish_location_to_server: function() {
            if (osuc.geo.privacy == 2) {
                var distance = 999999;

                if (osuc.geo.last_location != null) {
                    var my_location = new LatLon(osuc.geo.latitude, osuc.geo.longitude);
                    distance = osuc.geo.last_location.distanceTo(my_location) * 1000;
                }

                if (distance > 10) {
                    var name = ""
                    if (osuc.geo.currentProfile != null) {
                        name = osuc.geo.currentProfile.name
                    }

                    Ext.Ajax.request({
                        url: '/api/v1/location.json',
                        method: 'POST',
                        params: {
                            action: "publish",
                            name: name,
                            latitude: osuc.geo.latitude,
                            longitude: osuc.geo.longitude
                        }
                    });

                    osuc.geo.last_location = new LatLon(osuc.geo.latitude, osuc.geo.longitude);
                    osuc.geo.location_deleted = false;
                }
            }
        },

        handle_success: function(position) {
            osuc.geo.state = "ok";
            osuc.geo.latitude = position.coords.latitude;
            osuc.geo.longitude = position.coords.longitude;

            osuc.geo.inject_maps_handler();
            osuc.geo.update_maps();
            osuc.geo.update_profile();
            osuc.geo.delete_location_from_server();
            osuc.geo.publish_location_to_server();

            document.title = "OpenScape UC Touch (geo: ok)";
        },

        handle_error: function(code, message) {
            osuc.geo.state = "error";
            document.title = "OpenScape UC Touch (geo: error)";
        }
    }

});
