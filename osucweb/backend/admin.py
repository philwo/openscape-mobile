# -*- coding: utf-8 -*-
#
#  This file is part of the OpenScape UC Touch HTML5 client.
#
#  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
#
from django.contrib import admin
from osucweb.backend.models import *


class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "name", "latitude", "longitude", "accuracy", "presence", "device",)

admin.site.register(Profile, ProfileAdmin)
