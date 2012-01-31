/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {
    Ext.regModel('Device', {
        fields: [
            'id',
            'name',
            'type',
            'subType',
            'address',
            'preferred'
        ]
    });

    osuc.data.devicesStore = new Ext.data.JsonStore({
        sorters: 'id',
        autoLoad: false,
        model: 'Device',
        proxy: {
            url: '/api/v1/devices.json',
            type: 'ajax',
            reader: {
                root: 'devices',
                type: 'json'
            }
        },
        storeId: 'devices'
    });
    
    osuc.data.set_device = function(device_id) {
        Ext.Ajax.request({
            url: '/api/v1/devices.json',
            method: 'POST',
            params: {
                id: device_id
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);

                if (obj.success == true) {
                    osuc.data.devicesStore.loadData(obj.devices);
                }
            }
        });
    };
});
