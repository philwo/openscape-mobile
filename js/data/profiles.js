/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {
    Ext.regModel('Profile', {
        fields: [
            'id',
            'name',
            'latitude',
            'longitude',
            'accuracy',
            'presence_id',
            'presence_name',
            'device_id',
            'device_name'
        ]
    })

    osuc.data.profilesStore = new Ext.data.JsonStore({
        sorters: 'id',
        autoLoad: false,
        model: 'Profile',
        proxy: {
            url: '/api/v1/profiles.json',
            type: 'ajax',
            reader: {
                root: 'profiles',
                type: 'json'
            }
        },
        storeId: 'profiles',
        filterOnLoad: false,
        sortOnLoad: false
    });
});
