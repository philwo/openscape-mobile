/*global Ext: false, osuc: false */
/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {

    osuc.ui.profilesTab = (function() {
        var UiClass = Ext.extend(Ext.List, {
            constructor: function(config) {
                config = config || {};

                config.title = 'Profiles';
                config.iconCls = 'settings';
                config.scroll = 'vertical';
                config.cls = 'card-profiles';

                config.dockedItems = [{
                    xtype: 'toolbar',
                    dock: 'top',
                    title: 'Profiles'
                }];

                config.tpl = ['<tpl for=".">',
                    '<div class="profile" dataid="{id}">',
                        '<strong>{name}</strong><br />',
                        'Position: {latitude}, {longitude}, +- {accuracy}m<br />',
                        'Presence: {presence_name}<br />',
                        'Device: {device_name}',
                    '</div>',
                '</tpl>'];
                config.itemSelector = 'div.profile';

                config.singleSelect = true;
                config.grouped = false;
                config.indexBar = false;

                config.store = osuc.data.profilesStore;

                UiClass.superclass.constructor.apply(this, [config]);
            },

            initComponent: function() {
                UiClass.superclass.initComponent.call(this);

                this.on("activate", function() {
                    this.store.loadPage(0);
                });

                this.on("selectionchange", function(self, selections) {
                    if (selections.length !== 1) {
                        return;
                    }

                    Ext.Ajax.request({
                        url: '/api/v1/profiles.json',
                        method: 'POST',
                        params: {
                            action: "delete",
                            id: selections[0].attributes.getNamedItem("dataid").nodeValue
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
        });

        return new UiClass();
    })();

});
