/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.namespace('osuc', 'osuc.data', 'osuc.ui', 'osuc.geo');

Ext.onReady(function() {

    osuc.logged_in = false;

    osuc.Main = {
        // Preload all used images to enhance user experience
        preload: function() {
            var i = 0;
            var imageObj = new Image();
            
            // List of images to be preloaded
            //
            // Result of:
            // find media/img -name "map-marker.png"
            // find media/img/touch -name "presence_*.png"
            // find media/img/touch -name "media_*.png"
            // find media/img/touch -name "device_*.png"
            // find media/img/touch -name "call_*_*.png"
            // find media/img/touch -name "active_*.png"
            //
            var images = new Array();
            images[0] = "/media/img/map-marker.png"
            images[1] = "/media/img/touch/presence_.png"
            images[2] = "/media/img/touch/presence_1.png"
            images[3] = "/media/img/touch/presence_10.png"
            images[4] = "/media/img/touch/presence_2.png"
            images[5] = "/media/img/touch/presence_3.png"
            images[6] = "/media/img/touch/presence_4.png"
            images[7] = "/media/img/touch/presence_5.png"
            images[8] = "/media/img/touch/media_.png"
            images[9] = "/media/img/touch/media_1.png"
            images[10] = "/media/img/touch/media_2.png"
            images[11] = "/media/img/touch/device_.png"
            images[12] = "/media/img/touch/device_0.png"
            images[13] = "/media/img/touch/device_4.png"
            images[14] = "/media/img/touch/device_email.png"
            images[15] = "/media/img/touch/device_homephone.png"
            images[16] = "/media/img/touch/device_officephone.png"
            images[17] = "/media/img/touch/device_phone.png"
            images[18] = "/media/img/touch/device_voicemail.png"
            images[19] = "/media/img/touch/call_in_busy.png"
            images[20] = "/media/img/touch/call_in_failed.png"
            images[21] = "/media/img/touch/call_in_ok.png"
            images[22] = "/media/img/touch/call_OU_busy.png"
            images[23] = "/media/img/touch/call_OU_NR.png"
            images[24] = "/media/img/touch/call_OU_ok.png"
            images[25] = "/media/img/touch/call_OU_UN.png"
            images[26] = "/media/img/touch/active_.png"
            images[27] = "/media/img/touch/active_false.png"
            images[28] = "/media/img/touch/active_true.png"
            
            // Start preloading
            for (i=0; i<=28; i++) 
            {
                imageObj.src = images[i];
            }
        },
        init: function() {
            osuc.ui.loginForm.show();
            //navigator.geolocation.getCurrentPosition(osuc.geo.handle_success, osuc.geo.handle_error, {timeout: 5000});
        }
    }

});
