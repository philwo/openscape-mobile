# OpenScape UC Touch HTML5 client

Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>

This is not a finished product. The information in this README is probably inaccurate and has to be updated.

## Important

The icons in the directory 'osucweb/backend/static/img/coquette-icons' are licensed under the DryIcons Free License Agreement which can be found at:
http://dryicons.com/terms/free/

## Requirements

The HTML5 client depends on the following prerequisites (see "Quickstart"):

- Django 1.2.1
- python-suds 0.4
- simplejson 2.1.1
- south 0.7.2

## Quickstart

### Install prerequisites

    wget http://www.djangoproject.com/download/1.2.1/tarball/
    tar xzvf Django-1.2.1.tar.gz
    cd Django-1.2.1
    sudo python setup.py install
    cd ..

    wget http://pypi.python.org/packages/source/s/simplejson/simplejson-2.1.1.tar.gz
    tar xvfz simplejson-2.1.1.tar.gz
    cd simplejson-2.1.1
    sudo python setup.py install
    cd ..

    wget http://www.aeracode.org/releases/south/south-0.7.2.tar.gz
    tar xvfz south-0.7.2.tar.gz
    cd south
    sudo python setup.py install
    cd ..

### Edit settings.py

Please change the database path to a location on your disc and change the OPENSCAPE_SERVER and WEBCLIENT_SERVER settings.

### Create database and import initial data

    python manage.py syncdb
    python manage.py migrate

### Start development server

    python manage.py runserver 0.0.0.0:8000

### Open Safari or Chrome, go to http://localhost:8000/

Finished. :)
