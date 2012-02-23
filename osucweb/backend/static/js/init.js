/*global Ext: false, osuc: false */
/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */

Ext.namespace('osuc', 'Main');

Ext.setup({
    icon: 'icon.png',
    glossOnIcon: false,
    onReady: function() {
        osuc.Main.preload();
        osuc.Main.init();
    }
});
