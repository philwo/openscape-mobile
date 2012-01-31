/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.setup({
    icon: 'icon.png',
    glossOnIcon: false,
    onReady: function() {
        osuc.Main.preload();
        osuc.Main.init();
    }
});
