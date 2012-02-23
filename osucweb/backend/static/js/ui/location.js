/*global Ext: false, osuc: false, google: false */
/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {

    osuc.ui.locationTab = (function() {
        var UiClass = Ext.extend(Ext.Panel, {
            constructor: function(config) {
                config = config || {};

                config.title = 'Location';
                config.iconCls = 'search';
                config.cls = 'card-location';
                config.id = 'card-location';

                config.dockedItems = [{
                    xtype: 'toolbar',
                    dock: 'top',
                    title: 'Location',
                    items: [{
                        xtype: 'splitbutton',
                        id: 'location-sbtnAutoPresence',
                        activeButton: 0,
                        items: [{
                            text: 'Off',
                            id: 'location-btnOffline',
                            handler: function(button, event) {
                                osuc.geo.privacy = 0;
                                osuc.geo.delete_location_from_server();
                            }
                        }, {
                            text: 'Privacy',
                            id: 'location-btnPrivacy',
                            handler: function(button, event) {
                                osuc.geo.privacy = 1;
                                osuc.geo.delete_location_from_server();
                            }
                        }, {
                            text: 'Public',
                            id: 'location-btnPublic',
                            handler: function(button, event) {
                                osuc.geo.privacy = 2;
                                osuc.geo.publish_location_to_server();
                            }
                        }]
                    }, {
                        xtype: 'spacer'
                    }, {
                        text: 'Remember',
                        ui: 'action',
                        handler: function(button, event) {
                            if (osuc.geo.state === "ok") {
                                var geocoder = new google.maps.Geocoder();
                                var latlng = new google.maps.LatLng(osuc.geo.latitude, osuc.geo.longitude);

                                geocoder.geocode({'latLng': latlng}, function(results, status) {
                                    /* Do reverse geocoding on the current position to get a nice name for the profile */
                                    var profile_name = "Unknown";

                                    if (status === google.maps.GeocoderStatus.OK) {
                                        if (results[0]) {
                                            profile_name = results[0].formatted_address;
                                        }
                                    }

                                    /* Create / update profile on the server */
                                    Ext.Ajax.request({
                                        url: '/api/v1/profiles.json',
                                        method: 'POST',
                                        params: {
                                            action: "remember",
                                            id: osuc.geo.currentProfile_id,
                                            name: profile_name,
                                            latitude: osuc.geo.latitude,
                                            longitude: osuc.geo.longitude,
                                            accuracy: 500,
                                            presence_id: "current",
                                            device_id: "current"
                                        },
                                        success: function(response, opts) {
                                            var obj = Ext.decode(response.responseText);

                                            if (obj.success === true) {
                                                osuc.data.profilesStore.loadData(obj.profiles);
                                            }
                                        }
                                    });
                                });
                            }
                        }
                    }]
                }];

                config.layout = "fit";
                config.items = [{
                    xtype: 'map',
                    mapOptions: {
                        zoom: 15
                    }
                }];

                UiClass.superclass.constructor.apply(this, [config]);
            },

            initComponent: function() {
                UiClass.superclass.initComponent.call(this);

                this.on("activate", function() {
                    osuc.geo.trackMyPosition = true;
                    osuc.geo.update_maps();

                    if (osuc.geo.privacy === 0) {
                        Ext.getCmp("location-sbtnAutoPresence").setActive("location-btnOffline");
                    } else if (osuc.geo.privacy === 1) {
                        Ext.getCmp("location-sbtnAutoPresence").setActive("location-btnPrivacy");
                    } else if (osuc.geo.privacy === 2) {
                        Ext.getCmp("location-sbtnAutoPresence").setActive("location-btnPublic");
                    }
                });
            }
        });

        return new UiClass();
    })();

});
