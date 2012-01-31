/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {

    osuc.ui.journalTab = (function() {
        var uiClass = Ext.extend(Ext.List, {
            constructor: function(config) {
                config = config || {};
                
                config.title = 'Journal';
                config.iconCls = 'time';
                config.scroll = 'vertical';
                config.cls = 'card-journal';
                
                config.dockedItems = [{
                    xtype: 'toolbar',
                    dock: 'top',
                    title: 'Journal',
                }];
                
                config.tpl = ['<tpl for=".">',
                    '<div class="journal" dataid="{id}">',
                        '<div style="background: url(/media/img/touch/call_{direction}_{type}.png) 2% center no-repeat; background-size: 32px 32px; line-height: 2em; position: relative">',
                            '<strong>{callerInfoB_name}</strong>',
                            '<div style="position: absolute; top: 0px; right: 8px; font-weight: bold; font-size: 0.8em; text-align: right; line-height: 1.1em; color: #b7b7b7">',
                                '{createdTime}',
                            '</div>',
                        '</div>',
                    '</div>',
                '</tpl>'];
                config.itemSelector = 'div.journal';
                
                config.singleSelect = true;
                config.grouped = false;
                config.indexBar = false;
                config.badgeText = '4';
                
                config.store = osuc.data.journalStore;
                
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
                    
                    var record_idx = this.store.find("id", selections[0].attributes.getNamedItem("dataid").nodeValue);
                    var record = this.store.getAt(record_idx);
                    
                    Ext.Ajax.request({
                        url: '/api/v1/journal.json',
                        method: 'POST',
                        params: {
                            id: record.data.id,
                            name: record.data.name,
                            address: record.data.address,
                            type: record.data.type
                        },
                        success: function(response, opts) {
                            var obj = Ext.decode(response.responseText);

                            if (obj.success == true) {
                                osuc.data.journalStore.loadData(obj.journal);
                            }
                        }
                    });
                });
            }
        });

        return new uiClass();
    })();

});
