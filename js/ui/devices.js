/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {

    osuc.ui.devicesTab = (function() {
        var uiClass = Ext.extend(Ext.List, {
            constructor: function(config) {
                config = config || {};
                
                config.title = 'Devices';
                config.iconCls = 'favorites';
                config.scroll = 'vertical';
                config.cls = 'card-devices';
                
                config.dockedItems = [{
                    xtype: 'toolbar',
                    dock: 'top',
                    title: 'Devices',
                }];
                
                config.tpl = ['<tpl for=".">',
                    '<div class="device" dataid="{id}">',
                        '<div style="background: url(/media/img/touch/device_{type}.png) 2% center no-repeat, url(/media/img/touch/active_{preferred}.png) 98% center no-repeat; background-size: 32px 32px; line-height: 2em">',
                            '<strong>{name}</strong>',
                        '</div>',
                    '</div>',
                '</tpl>'];
                config.itemSelector = 'div.device';
                
                config.singleSelect = true;
                config.grouped = false;
                config.indexBar = false;
                
                config.store = osuc.data.devicesStore;
                
                uiClass.superclass.constructor.apply(this, [config]);
            },
            
            initComponent: function() {
                uiClass.superclass.initComponent.call(this);
                
                this.on("activate", function() {
                    this.store.loadPage(0);
                });
                
                this.on("selectionchange", function(self, selections) {
                    if (selections.length != 1) {
                        return;
                    }
                    
                    osuc.data.set_device(selections[0].attributes.getNamedItem("dataid").nodeValue);
                });
            }
        });

        return new uiClass();
    })();

});
