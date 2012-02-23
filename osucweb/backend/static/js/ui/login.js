/*global Ext: false, osuc: false */
/**
 * This file is part of the OpenScape UC Touch HTML5 client.
 *
 *  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
 */
Ext.onReady(function() {

    osuc.ui.loginForm = new Ext.form.FormPanel({
        scroll: 'vertical',
        title: 'Login',
        cls: 'card1',
        iconCls: 'info',
        fullscreen: true,
        hidden: true,

        items: [{
            xtype: 'component',
            styleHtmlContent: true,
            html: '<h2>OpenScape UC Web 2.0</h2>'
        }, {
            xtype: 'component',
            id: 'loginResponse',
            styleHtmlContent: true,
            html: ''
        }, {
            xtype: 'fieldset',
            title: 'Login Data',
            defaults: {
                required: true,
                labelAlign: 'left'
            },
            items: [{
                xtype: 'textfield',
                name : 'username',
                label: 'Username',
                value: 'contacts-contact'
            }, {
                xtype: 'passwordfield',
                name : 'password',
                label: 'Password',
                value: '!PW_Frei1'
            }]
        }],

        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [
                {xtype: 'spacer'},
                {
                    text: 'Reset',
                    handler: function() {
                        form.reset();
                    }
                },
                {
                    text: 'Login',
                    ui: 'action',
                    handler: function() {
                        //console.log(osuc.ui.loginForm.getValues());
                        Ext.Ajax.request({
                            url: '/api/v1/login.json',
                            method: 'POST',
                            params: {
                                username: osuc.ui.loginForm.getValues().username,
                                password: osuc.ui.loginForm.getValues().password
                            },
                            success: function(response, opts) {
                                var obj = Ext.decode(response.responseText);
                                Ext.getCmp('loginResponse').update(obj.message);

                                if (obj.success === true) {
                                    // Set global state to "logged in"
                                    osuc.logged_in = true;

                                    // Destroy login and show real UI
                                    osuc.ui.loginForm.destroy();
                                    osuc.ui.tabpanel.show();

                                    // Start geo-location engine
                                    osuc.geo.start();

                                    // Preload all stores, so data is immediately available to the user
                                    osuc.data.contactsStore.loadPage(0);
                                    osuc.data.devicesStore.loadPage(0);
                                    osuc.data.journalStore.loadPage(0);
                                    osuc.data.presenceStore.loadPage(0);
                                    osuc.data.profilesStore.loadPage(0);
                                }
                            }
                        });
                    }
                }
            ]
        }]
    });

});
