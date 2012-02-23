# -*- coding: utf-8 -*-

from django.conf import settings
from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

import osucweb.backend.views

urlpatterns = patterns('',
    url(r'^api/v1/login\.json$', osucweb.backend.views.v1_login_json, name="backend_v1_login_json"),
    url(r'^api/v1/contacts\.json$', osucweb.backend.views.v1_contacts_json, name="backend_v1_contacts_json"),
    url(r'^api/v1/contactdetails\.json$', osucweb.backend.views.v1_contactdetails_json, name="backend_v1_contactdetails_json"),
    url(r'^api/v1/journal\.json$', osucweb.backend.views.v1_journal_json, name="backend_v1_journal_json"),
    url(r'^api/v1/presence\.json$', osucweb.backend.views.v1_my_presence_json, name="backend_v1_my_presence_json"),
    url(r'^api/v1/devices\.json$', osucweb.backend.views.v1_devices_json, name="backend_v1_devices_json"),
    url(r'^api/v1/call\.json$', osucweb.backend.views.v1_call_json, name="backend_v1_call_json"),
    url(r'^api/v1/profiles\.json$', osucweb.backend.views.v1_profiles_json, name="backend_v1_profiles_json"),
    url(r'^api/v1/location\.json$', osucweb.backend.views.v1_location_json, name="backend_v1_location_json"),
    url(r'^$', direct_to_template, {"template": "index.html"}),
)

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),
   )
