# -*- coding: utf-8 -*-
#
#  This file is part of the OpenScape UC Touch HTML5 client.
#
#  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
#
from django.db import models


class Profile(models.Model):
    """
    Profile object, which is used to store information about geographical profiles for users
    """
    id = models.AutoField(primary_key=True)
    owner = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=10, decimal_places=6)
    longitude = models.DecimalField(max_digits=10, decimal_places=6)
    accuracy = models.IntegerField(help_text=u"Radius of activation, in meters")
    presence = models.CharField(max_length=100)
    device = models.CharField(max_length=100)

    def __unicode__(self):
        return "<Profile: %s, %s, %s, %s, %s, %s, %s>" % (self.owner.symphonia_id, self.name, self.latitude, self.longitude, self.activation, self.presence.name, self.device.name,)
