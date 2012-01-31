/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {
    
    //osuc.ui.tabpanel = new Ext.TabPanel({
    osuc.ui.tabpanel = (function() {
        var uiClass = Ext.extend(Ext.TabPanel, {
            constructor: function(config) {
                config = config || {};
                
                config.tabBar = {
                    dock: 'bottom',
                    layout: {
                        pack: 'center'
                    }
                };
                
                config.fullscreen = true;
                config.hidden = true;
                config.items = [];
                
                uiClass.superclass.constructor.apply(this, [config]);
            },
            
            initComponent: function() {
                uiClass.superclass.initComponent.call(this);
                
                this.add(osuc.ui.contactsTab);
                this.add(osuc.ui.journalTab);
                this.add(osuc.ui.myStatusTab);
                this.add(osuc.ui.devicesTab);
                this.add(osuc.ui.locationTab);
                this.add(osuc.ui.profilesTab);
            }
        });

        return new uiClass();
    })();

});
