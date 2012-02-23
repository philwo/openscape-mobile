# -*- coding: utf-8 -*-
#
#  This file is part of the OpenScape UC Touch HTML5 client.
#
#  Copyright (c) 2010 Philipp Wollermann <philipp@igowo.de>
#

from django.core.cache import cache
from django.http import HttpResponse, HttpResponseNotAllowed
from django.shortcuts import get_object_or_404

import simplejson as json
from functools import wraps

from models import Profile
from forms import LoginForm

CONTACT1_LOCATION_FIXTURE = '{"name": "Unknown", "latitude": 35.668879, "longitude": 139.651436}'
CONTACT2_LOCATION_FIXTURE = '{"name": "Unknown", "latitude": 35.667979, "longitude": 139.64999}'
CONTACT3_LOCATION_FIXTURE = '{"name": "Unknown", "latitude": 35.668885, "longitude": 139.650634}'
CONTACT4_LOCATION_FIXTURE = '{"name": "Unknown", "latitude": 35.668737, "longitude": 139.623203}'


# SOAP API mock functions
def getAuthToken(request, username=None, password=None):
    """
    Retrieves a valid authentication token for the SOAP-API, either from the session or by logging the user in
    """
    authToken = request.session.get("authToken", None)
    # Have we already logged the user in and stored the authentication token in the session?
    if authToken is None:
        # No, we have to log him in ...
        if username is not None and password is not None:
            authToken = '%s:%s' % (username, password,)
    return authToken


# Decorators
def need_authtoken():
    """
    Only allows access to the wrapped view, if the user is already logged in
    """
    def decorator(func):
        @wraps(func)
        def _wrapped_view(request, *args, **kw):
            if request.session.get("authToken", None) is None:
                return HttpResponse("Not logged in.")
            return func(request, *args, **kw)
        return _wrapped_view
    return decorator


def need_protocol(allowed_protocols):
    """
    Only allows access to the wrapped view, if the HTTP protocol of the request is specified in the *allowed_protocols* parameter
    """
    def decorator(func):
        @wraps(func)
        def _wrapped_view(request, *args, **kw):
            if not request.method in allowed_protocols:
                return HttpResponseNotAllowed(allowed_protocols)
            return func(request, *args, **kw)
        return _wrapped_view
    return decorator


def wrap_json():
    """
    Serializes the return value of the wrapped function using simplejson and returns it as an HttpResponse
    """
    def decorator(func):
        @wraps(func)
        def _wrapped_view(request, *args, **kw):
            return HttpResponse(json.dumps(func(request, *args, **kw), sort_keys=True, indent=4 * ' '))
        return _wrapped_view
    return decorator


# API v1
@need_protocol(["POST"])
@wrap_json()
def v1_login_json(request):
    request.session.clear()
    success = False
    message = ""
    form = LoginForm(request.POST)
    if form.is_valid():
        username = form.cleaned_data["username"]
        password = form.cleaned_data["password"]
        authToken = getAuthToken(request, username, password)

        if authToken != None:
            # Prewarm the cache with location fixtures
            cache.set('contacts-contact1:location', '{"name": "Unknown", "latitude": 35.668879, "longitude": 139.651436}', 3600)
            cache.set('contacts-contact2:location', '{"name": "Unknown", "latitude": 35.667979, "longitude": 139.64999}', 3600)
            cache.set('contacts-contact3:location', '{"name": "Unknown", "latitude": 35.668885, "longitude": 139.650634}', 3600)
            cache.set('contacts-contact4:location', '{"name": "Unknown", "latitude": 35.668737, "longitude": 139.623203}', 3600)

            request.session["authToken"] = authToken
            request.session["username"] = username
            request.session["password"] = password
            success = True
            message = "You're logged in."
        else:
            message = "Wrong username or password."
    return {"success": success, "message": message}


@need_authtoken()
@need_protocol(["GET"])
@wrap_json()
def v1_contacts_json(request):
    contacts = [{
            "id": "contacts-contact1",
            "givenName": 'John',
            "lastName": 'Smith',
            "userStatus": cache.get('contacts-contact1:presence', 1),
            "userTimeZone": 'dummy',
            "userLocationLatitude": json.loads(cache.get('contacts-contact1:location', CONTACT1_LOCATION_FIXTURE))['latitude'],
            "userLocationLongitude": json.loads(cache.get('contacts-contact1:location', CONTACT1_LOCATION_FIXTURE))['longitude'],
            "mediaStatus": 1,
        }, {
            "id": "contacts-contact2",
            "givenName": 'Juan',
            "lastName": 'Pérez',
            "userStatus": cache.get('contacts-contact2:presence', 2),
            "userTimeZone": 'dummy',
            "userLocationLatitude": json.loads(cache.get('contacts-contact2:location', CONTACT2_LOCATION_FIXTURE))['latitude'],
            "userLocationLongitude": json.loads(cache.get('contacts-contact2:location', CONTACT2_LOCATION_FIXTURE))['longitude'],
            "mediaStatus": 1,
        }, {
            "id": "contacts-contact3",
            "givenName": 'Jens',
            "lastName": 'Jensen',
            "userStatus": cache.get('contacts-contact3:presence', 4),
            "userTimeZone": 'dummy',
            "userLocationLatitude": json.loads(cache.get('contacts-contact3:location', CONTACT3_LOCATION_FIXTURE))['latitude'],
            "userLocationLongitude": json.loads(cache.get('contacts-contact3:location', CONTACT3_LOCATION_FIXTURE))['longitude'],
            "mediaStatus": 2,
        }, {
            "id": "contacts-contact4",
            "givenName": 'Taro',
            "lastName": 'Yamada',
            "userStatus": cache.get('contacts-contact4:presence', 10),
            "userTimeZone": 'dummy',
            "userLocationLatitude": json.loads(cache.get('contacts-contact4:location', CONTACT4_LOCATION_FIXTURE))['latitude'],
            "userLocationLongitude": json.loads(cache.get('contacts-contact4:location', CONTACT4_LOCATION_FIXTURE))['longitude'],
            "mediaStatus": 1,
        }
    ]

    return {"success": True, "contacts": contacts}


@need_authtoken()
@need_protocol(["GET"])
@wrap_json()
def v1_contactdetails_json(request):
    contact_id = request.GET["id"]

    if contact_id == 'contacts-contact1':
        givenName = 'John'
        lastName = 'Smith'
        emailList = [('Home', 'john.smith@example.com'), ('Work', 'smith@acme-corp.com')]
        phoneList = [('Home', '+49 1234 12345678'), ('Mobile', '+49 999 11223344')]
        location_json = cache.get('contacts-contact1:location', CONTACT1_LOCATION_FIXTURE)
    elif contact_id == 'contacts-contact2':
        givenName = 'Juan'
        lastName = 'Pérez'
        emailList = [('Home', 'juan.perez@example.com'), ('Work', 'perez@acme-corp.com')]
        phoneList = [('Home', '+81 3 12345678'), ('Work', '+81 3 90807060')]
        location_json = cache.get('contacts-contact2:location', CONTACT2_LOCATION_FIXTURE)
    elif contact_id == 'contacts-contact3':
        givenName = 'Jens'
        lastName = 'Jensen'
        emailList = [('Home', 'jens.jensen@example.com'), ('Work', 'jensen@acme-corp.com')]
        phoneList = [('Mobile', '+49 456 976431')]
        location_json = cache.get('contacts-contact3:location', CONTACT3_LOCATION_FIXTURE)
    elif contact_id == 'contacts-contact4':
        givenName = 'Taro'
        lastName = 'Yamada'
        emailList = [('Home', 'taro.yamada@example.com'), ('Work', 'yamada@acme-corp.com')]
        phoneList = [('Home', '+81 3 93827154'), ('Mobile', '+81 80 19487263')]
        location_json = cache.get('contacts-contact4:location', CONTACT4_LOCATION_FIXTURE)
    else:
        raise Exception('Unknown user id')

    def make_counter(init_value=0):
        sum = [init_value]

        def inc(x=1):
            sum[0] += x
            return sum[0]
        return inc

    contactdetails = []
    order = make_counter(0)
    contactdetails.append({
        "id": "name",
        "order": order(),
        "icon": "img/coquette-icons/8/png/48x48/businesswoman.png",
        "action": None,
        "name": "Full name",
        "value": "%s %s" % (givenName, lastName),
    })

    contactdetails.extend([{
        "id": "email/" + x[0],
        "order": order(),
        "icon": "img/coquette-icons/6/png/48x48/yellow_mail.png",
        "action": "email",
        "name": x[0],
        "value": x[1],
    } for x in emailList])

    def getPhoneIcon(name):
        if name == "Home":
            return "img/coquette-icons/2/png/48x48/home.png"
        elif name == "Work":
            return "img/coquette-icons/5/png/48x48/office_folders.png"
        elif name == "Mobile":
            return "img/coquette-icons/2/png/48x48/mobile_phone.png"
        return "img/coquette-icons/2/png/48x48/mobile_phone.png"

    contactdetails.extend([{
        "id": "phone-" + x[0],
        "order": order(),
        "icon": getPhoneIcon(x[0]),
        "action": "call",
        "name": x[0],
        "value": x[1],
    } for x in phoneList])

    if location_json is not None:
        location = json.loads(location_json)
        value = "%s (%s, %s)" % (location["name"] if location["name"] != "" else "Unknown", location["latitude"], location["longitude"],)
        contactdetails.append({
            "id": "location",
            "order": order(),
            "icon": "img/coquette-icons/3/png/48x48/globe.png",
            "action": "map",
            "name": "Current location",
            "value": value,
        })

    return {"success": True, "contactdetails": contactdetails}


@need_authtoken()
@need_protocol(["GET", "POST"])
@wrap_json()
def v1_my_presence_json(request):
    if request.method == "POST":
        presence_id = int(request.POST["id"])
        cache.set('%s:presence' % (request.session["username"],), presence_id, 3600)

    myPresence = cache.get('%s:presence' % (request.session["username"],), 10)

    data = [
        {"id": 1, "name": "Do Not Disturb", "active": True if myPresence == 1 else False},
        {"id": 2, "name": "Be Right Back", "active": True if myPresence == 2 else False},
        {"id": 3, "name": "Unavailable", "active": True if myPresence == 3 else False},
        {"id": 4, "name": "Busy", "active": True if myPresence == 4 else False},
        {"id": 5, "name": "In A Meeting", "active": True if myPresence == 5 else False},
        {"id": 10, "name": "Available", "active": True if myPresence == 10 else False},
    ]

    return {"success": True, "presence": data}


@need_authtoken()
@need_protocol(["GET", "POST"])
@wrap_json()
def v1_devices_json(request):
    if request.method == "POST":
        for device_id in ['devices-device1', 'devices-device2', 'devices-device3', 'devices-device4']:
            cache.set('%s:%s:preferred' % (request.session['username'], device_id,), False, 3600)
        cache.set('%s:%s:preferred' % (request.session['username'], request.POST["id"],), True, 3600)
        cache.set('%s:preferred_device' % (request.session['username'],), request.POST["id"], 3600)

    devices = [{
        "id": d['id'],
        "type": d['type'],
        "subType": d['subType'],
        "name": d['name'],
        "address": d['address'],
        "preferred": d['preferred'],
    } for d in [
        {'id': 'devices-device1', 'type': 'homephone', 'subType': 0, 'name': 'Home', 'address': '1234', 'preferred': cache.get('%s:devices-device1:preferred' % (request.session['username'],), False)},
        {'id': 'devices-device2', 'type': 'officephone', 'subType': 0, 'name': 'Work', 'address': '4321', 'preferred': cache.get('%s:devices-device2:preferred' % (request.session['username'],), False)},
        {'id': 'devices-device3', 'type': 'phone', 'subType': 0, 'name': 'Meeting room', 'address': '6789', 'preferred': cache.get('%s:devices-device3:preferred' % (request.session['username'],), False)},
        {'id': 'devices-device4', 'type': 'voicemail', 'subType': 0, 'name': 'Voicemail', 'address': '9876', 'preferred': cache.get('%s:devices-device4:preferred' % (request.session['username'],), False)}
    ]]

    return {"success": True, "devices": devices}


@need_authtoken()
@need_protocol(["GET"])
@wrap_json()
def v1_journal_json(request):
    import locale
    locale.setlocale(locale.LC_TIME, "de_DE")

    # type is 'busy', 'failed', 'ok' for dir == 'in' or 'busy', 'NR', 'ok', for dir == 'OU'
    # direction is 'in' or 'OU'
    journal = [{
        "id": j['id'],
        "createdTime": j['date'],
        "type": j['type'],
        "direction": j['direction'],
        "deviceA": 'dummy',
        "deviceB": 'dummy',
        "deviceC": 'dummy',
        "duration": '01:23',
        "callerInfoB_name": j['displayName'],
        "callerInfoB_id": 'dummy'
    } for j in [{
        'id': "journal-journal1",
        'date': "2012-02-04<br />11:25:19",
        'type': 'busy',
        'direction': 'in',
        'displayName': 'Jens Jensen'
    }, {
        'id': "journal-journal2",
        'date': "2012-02-04<br />12:22:10",
        'type': 'ok',
        'direction': 'in',
        'displayName': 'Taro Yamada'
    }, {
        'id': "journal-journal3",
        'date': "2012-02-05<br />13:53:18",
        'type': 'busy',
        'direction': 'OU',
        'displayName': 'John Smith'
    }, {
        'id': "journal-journal4",
        'date': "2012-02-05<br />14:37:13",
        'type': 'NR',
        'direction': 'OU',
        'displayName': 'Juan Pérez'
    }, {
        'id': "journal-journal5",
        'date': "2012-02-06<br />15:16:16",
        'type': 'ok',
        'direction': 'OU',
        'displayName': 'Unknown'
    }]]

    return {"success": True, "journal": journal}


@need_authtoken()
@need_protocol(["POST"])
@wrap_json()
def v1_call_json(request):
    return {"success": True}


@need_authtoken()
@need_protocol(["GET", "POST"])
@wrap_json()
def v1_profiles_json(request):
    if request.method == "POST":
        action = request.POST["action"]
        current_device = cache.get('%s:preferred_device' % (request.session['username'],), None)
        current_presence = cache.get('%s:presence' % (request.session["username"],), 10)

        if action == "remember":
            if "id" in request.POST and request.POST["id"] != "":
                obj = get_object_or_404(Profile, id=request.POST["id"])
            else:
                obj = Profile()
            obj.owner = request.session["username"]
            obj.name = request.POST["name"]
            obj.latitude = request.POST["latitude"]
            obj.longitude = request.POST["longitude"]
            obj.accuracy = int(request.POST["accuracy"])
            obj.presence = current_presence if request.POST["presence_id"] == "current" else request.POST["presence_id"]
            obj.device = current_device if request.POST["device_id"] == "current" else request.POST["device_id"]
            obj.save()
        elif action == "delete":
            obj = get_object_or_404(Profile, id=request.POST["id"])
            obj.delete()

    PRESENCE_MAP = {
        1: "Do Not Disturb",
        2: "Be Right Back",
        3: "Unavailable",
        4: "Busy",
        5: "In A Meeting",
        10: "Available",
    }

    DEVICE_MAP = {
        'devices-device1': 'Home',
        'devices-device2': 'Work',
        'devices-device3': 'Meeting room',
        'devices-device4': 'Voicemail'
    }

    profiles = [{
        'id': p.id,
        'name': p.name,
        'latitude': float(p.latitude),
        'longitude': float(p.longitude),
        'accuracy': p.accuracy,
        'presence_id': p.presence,
        'presence_name': PRESENCE_MAP[int(p.presence)],
        'device_id': p.device,
        'device_name': DEVICE_MAP[p.device]
    } for p in Profile.objects.filter(owner=request.session["username"])]

    return {"success": True, "profiles": profiles}


@need_authtoken()
@need_protocol(["GET", "POST"])
@wrap_json()
def v1_location_json(request):
    if request.method == "POST":
        action = request.POST["action"]
        if action == "delete":
            cache.set('%s:location' % (request.session['username'],), None, 3600)
        elif action == "publish":
            latitude = request.POST["latitude"]
            longitude = request.POST["longitude"]
            name = request.POST["name"]
            cache.set('%s:location' % (request.session['username'],), json.dumps({"latitude": latitude, "longitude": longitude, "name": name}), 3600)
        return {"success": True}
    elif request.method == "GET":
        location = cache.get('%s:location' % (request.GET["id"],), None)
        if location is not None:
            location = json.loads(location)
        return {"success": True, "location": location}

    return {"success": False}
