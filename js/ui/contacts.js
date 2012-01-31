/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {

    osuc.ui.contactsTab = (function() {
        var uiClass = Ext.extend(Ext.List, {
            constructor: function(config) {
                config = config || {};
                
                config.title = 'Contacts';
                config.iconCls = 'bookmarks';
                config.scroll = 'vertical';
                config.cls = 'card-contacts';
                
                config.dockedItems = [{
                    xtype: 'toolbar',
                    dock: 'top',
                    title: 'Contacts',
                }];
                
                config.tpl = ['<tpl for=".">',
                    '<div class="contact" dataid="{id}">',
                        '<div style="background: url(/media/img/touch/presence_{userStatus}.png) 2% center no-repeat, url(/media/img/touch/media_{mediaStatus}.png) 95% center no-repeat; background-size: 32px 32px; line-height: 2em">',
                            '<strong>{givenName}</strong> {lastName}',
                        '</div>',
                    '</div>',
                '</tpl>'];
                config.itemSelector = 'div.contact';
                
                config.singleSelect = true;
                config.grouped = true;
                config.indexBar = true;
                
                config.store = osuc.data.contactsStore,
                
                uiClass.superclass.constructor.apply(this, [config]);
            },
            
            initComponent: function() {
                uiClass.superclass.initComponent.call(this);
                
                this.on("activate", function() {
                    if (osuc.logged_in == true) {
                        osuc.data.contactsStore.loadPage(0);
                    }
                });
                
                this.on("selectionchange", function(self, selections) {
                    if (selections.length != 1) {
                        return;
                    }
                    
                    osuc.ui.contactdetailsPopup.userid = selections[0].attributes.getNamedItem("dataid").nodeValue;
                    
                    Ext.Ajax.request({
                        url: '/api/v1/contactdetails.json',
                        method: 'GET',
                        params: {
                            id: selections[0].attributes.getNamedItem("dataid").nodeValue
                        },
                        success: function(response, opts) {
                            var obj = Ext.decode(response.responseText);
                            
                            if (obj.success == true) {
                                osuc.data.contactDetailsStore.loadData(obj.contactdetails);
                                osuc.data.contactDetailsStore.sort("order", "ASC");
                                
                                osuc.ui.contactdetailsPopup.show();
                                osuc.ui.contactdetailsPopup.setSize(osuc.ui.tabpanel.getWidth() * 0.9, osuc.ui.tabpanel.getHeight() * 0.7);
                            }
                        }
                    });
                });
            }
        });

        return new uiClass();
    })();
    
    osuc.ui.contactdetailsPopup = (function() {
        var uiClass = Ext.extend(Ext.List, {
            constructor: function(config) {
                config = config || {}

                config.tpl = ['<tpl for=".">',
                    '<div class="contactdetail" dataid="{id}">',
                        '<div style="background: url(/media/{icon}) 2% center no-repeat; background-size: 48px 48px; line-height: 2em">',
                            '<strong>{name}</strong><br />{value}',
                        '</div>',
                    '</div>',
                '</tpl>'];
                
                config.itemSelector = 'div.contactdetail';

                config.singleSelect = true;
                config.centered = true;
                config.modal = true;
                config.floating = true;
                config.hidden = true;

                config.store = osuc.data.contactDetailsStore,
    
                uiClass.superclass.constructor.apply(this, [config]);
                
                this.on("selectionchange", function(self, selections) {
                    if (selections.length != 1) {
                        return;
                    }
            
                    var record_idx = this.store.find("id", selections[0].attributes.getNamedItem("dataid").nodeValue);
                    var record = this.store.getAt(record_idx);
                    self.hide();
            
                    var action = record.data.action;
                    var value = record.data.value;
            
                    if (action == "email") {
                        window.location = "mailto:" + value;
                    } else if (action == "call") {
                        if (!this.popup) {
                            Ext.Ajax.request({
                                url: '/api/v1/call.json',
                                method: 'POST',
                                params: {
                                    dest: value
                                },
                                success: function(response, opts) {
                                    var obj = Ext.decode(response.responseText);
                                }
                            });
                    
                            this.popup = new Ext.Panel({
                                floating: true,
                                modal: true,
                                centered: true,
                                width: 320,
                                height: 300,
                                styleHtmlContent: true,
                                html: '<p>Call in progress ...</p>',
                                dockedItems: [{
                                    dock: 'top',
                                    xtype: 'toolbar',
                                    title: 'Calling ...'
                                }],
                                scroll: 'vertical'
                            });
                        }
                        this.popup.show('pop');
                    } else if (action == "map") {
                        osuc.ui.tabpanel.setCard(Ext.getCmp('card-location'));
                        Ext.Ajax.request({
                            url: '/api/v1/location.json',
                            method: 'GET',
                            params: {
                                id: osuc.ui.contactdetailsPopup.userid
                            },
                            success: function(response, opts) {
                                var obj = Ext.decode(response.responseText);
                                
                                if (obj.success == true) {
                                    if (obj.location != null) {
                                        osuc.geo.trackMyPosition = false;
                                        var map = osuc.ui.locationTab.items.items[0].map;
                                        map.panTo(new google.maps.LatLng(obj.location.latitude, obj.location.longitude));
                                        alert("panning to " + obj.location.latitude + ", " + obj.location.longitude);
                                    }
                                }
                            }
                        })
                    }
                });
            },
            
            initComponent: function() {
                uiClass.superclass.initComponent.call(this);
            }
        });
        
        return new uiClass();
    })();
});
