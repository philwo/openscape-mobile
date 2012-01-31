/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {
    Ext.regModel('Presence', {
        fields: [
            'id',
            'name',
            'active'
        ]
    });

    osuc.data.presenceStore = new Ext.data.JsonStore({
        sorters: 'id',
        autoLoad: false,
        model: 'Presence',
        proxy: {
            url: '/api/v1/presence.json',
            type: 'ajax',
            reader: {
                root: 'presence',
                type: 'json'
            }
        },
        storeId: 'presence'
    });

    osuc.data.set_presence = function(presence_id) {
        Ext.Ajax.request({
            url: '/api/v1/presence.json',
            method: 'POST',
            params: {
                id: presence_id
            },
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);

                if (obj.success == true) {
                    osuc.data.presenceStore.loadData(obj.presence);
                }
            }
        });
    };
});
