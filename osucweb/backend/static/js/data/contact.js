/*global Ext: false, osuc: false */
/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {
    Ext.regModel('Contact', {
        fields: [
            'id',
            'givenName',
            'lastName',
            'userStatus',
            'userTimeZone',
            'userLocationLatitude',
            'userLocationLongitude',
            'mediaStatus'
        ]
    });

    Ext.regModel('ContactDetails', {
        fields: [
            'id',
            'order',
            'icon',
            'name',
            'value',
            'action'
        ]
    });

    osuc.data.contactsStore = new Ext.data.JsonStore({
        sorters: 'givenName',

        getGroupString : function(record) {
            return record.get('givenName')[0];
        },

        autoLoad: false,
        model: 'Contact',
        proxy: {
            url: '/api/v1/contacts.json',
            type: 'ajax',
            reader: {
                root: 'contacts',
                type: 'json'
            }
        },
        storeId: 'contacts'
    });

    osuc.data.contactDetailsStore = new Ext.data.JsonStore({
        sorters: 'order',
        defaultSortDirection: 'ASC',

        autoLoad: false,
        model: 'ContactDetails',
        proxy: {
            url: '/api/v1/contactdetails.json',
            type: 'ajax',
            reader: {
                root: 'contactdetails',
                type: 'json'
            }
        },
        storeId: 'contactdetails'
    });

});
