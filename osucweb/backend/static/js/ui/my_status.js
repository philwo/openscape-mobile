/*global Ext: false, osuc: false */
/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {

    osuc.ui.myStatusTab = (function() {
        var UiClass = Ext.extend(Ext.List, {
            constructor: function(config) {
                config = config || {};

                config.title = 'My Status';
                config.iconCls = 'user';
                config.scroll = 'vertical';
                config.cls = 'card-status';

                config.dockedItems = [{
                    xtype: 'toolbar',
                    dock: 'top',
                    title: 'My Status'
                }];

                config.tpl = ['<tpl for=".">',
                    '<div class="status" dataid="{id}">',
                        '<div style="background: url(/static/img/touch/presence_{id}.png) 2% center no-repeat, url(/static/img/touch/active_{active}.png) 98% center no-repeat; background-size: 32px 32px; line-height: 2em">',
                            '<strong>{name}</strong>',
                        '</div>',
                    '</div>',
                '</tpl>'];
                config.itemSelector = 'div.status';

                config.singleSelect = true;
                config.grouped = false;
                config.indexBar = false;

                config.store = osuc.data.presenceStore;

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

                    osuc.data.set_presence(selections[0].attributes.getNamedItem("dataid").nodeValue);
                });
            }
        });

        return new UiClass();
    })();

});
