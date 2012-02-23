/*global Ext: false, osuc: false */
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
            // find static/img -name "map-marker.png"
            // find static/img/touch -name "presence_*.png"
            // find static/img/touch -name "media_*.png"
            // find static/img/touch -name "device_*.png"
            // find static/img/touch -name "call_*_*.png"
            // find static/img/touch -name "active_*.png"
            //
            var images = [];
            images[0] = "/static/img/map-marker.png";
            images[1] = "/static/img/touch/presence_.png";
            images[2] = "/static/img/touch/presence_1.png";
            images[3] = "/static/img/touch/presence_10.png";
            images[4] = "/static/img/touch/presence_2.png";
            images[5] = "/static/img/touch/presence_3.png";
            images[6] = "/static/img/touch/presence_4.png";
            images[7] = "/static/img/touch/presence_5.png";
            images[8] = "/static/img/touch/media_.png";
            images[9] = "/static/img/touch/media_1.png";
            images[10] = "/static/img/touch/media_2.png";
            images[11] = "/static/img/touch/device_.png";
            images[12] = "/static/img/touch/device_0.png";
            images[13] = "/static/img/touch/device_4.png";
            images[14] = "/static/img/touch/device_email.png";
            images[15] = "/static/img/touch/device_homephone.png";
            images[16] = "/static/img/touch/device_officephone.png";
            images[17] = "/static/img/touch/device_phone.png";
            images[18] = "/static/img/touch/device_voicemail.png";
            images[19] = "/static/img/touch/call_in_busy.png";
            images[20] = "/static/img/touch/call_in_failed.png";
            images[21] = "/static/img/touch/call_in_ok.png";
            images[22] = "/static/img/touch/call_OU_busy.png";
            images[23] = "/static/img/touch/call_OU_NR.png";
            images[24] = "/static/img/touch/call_OU_ok.png";
            images[25] = "/static/img/touch/call_OU_UN.png";
            images[26] = "/static/img/touch/active_.png";
            images[27] = "/static/img/touch/active_false.png";
            images[28] = "/static/img/touch/active_true.png";

            // Start preloading
            for (i=0; i<=28; i+=1)
            {
                imageObj.src = images[i];
            }
        },
        init: function() {
            osuc.ui.loginForm.show();
            //navigator.geolocation.getCurrentPosition(osuc.geo.handle_success, osuc.geo.handle_error, {timeout: 5000});
        }
    };

});
