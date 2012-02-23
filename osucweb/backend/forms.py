# -*- coding: utf-8 -*-
#
#  This file is part of the OpenScape UC Touch HTML5 client.
#
#  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
#
from django import forms


class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)
