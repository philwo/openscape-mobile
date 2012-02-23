/*global Ext: false, osuc: false */
/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {
    Ext.regModel('Journal', {
        fields: [
            'id',
            'createdTime',
            'type',
            'direction',
            'deviceA',
            'deviceB',
            'deviceC',
            'duration',
            'callerInfoB_name',
            'callerInfoB_id'
        ]
    });

    osuc.data.journalStore = new Ext.data.JsonStore({
        sorters: 'createdTime',
        autoLoad: false,
        model: 'Journal',
        proxy: {
            url: '/api/v1/journal.json',
            type: 'ajax',
            reader: {
                root: 'journal',
                type: 'json'
            }
        },
        storeId: 'journal'
    });
});
