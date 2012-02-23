# -*- coding: utf-8 -*-

import sys
import os
import os.path

PROJECT_PATH = os.path.abspath(os.path.split(__file__)[0])

# Debugging
DEBUG = True
TEMPLATE_DEBUG = DEBUG
if TEMPLATE_DEBUG:
    TEMPLATE_STRING_IF_INVALID = 'TEMPLATE_INVALID'

# Administrators
ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)
MANAGERS = ADMINS

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(PROJECT_PATH, "osucweb.db"),
        "USER": "",
        "PASSWORD": "",
        "HOST": "",
        "PORT": "",
    }
}

# Caches
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'cache',
    }
}

# URL Canonicalization and Configuration
APPEND_SLASH = True
PREPEND_WWW = False
ROOT_URLCONF = 'urls'

# Multiple Sites Handling
SITE_ID = 1

# Internationalization
_ = lambda s: s
LANGUAGE_CODE = 'en-us'
LANGUAGES = (
    ('en', _('English'))
)
USE_I18N = True
USE_L10N = True
TIME_ZONE = 'Asia/Tokyo'

# Session Handling
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

# Uploads
MEDIA_ROOT = os.path.join(PROJECT_PATH, 'media')
MEDIA_URL = '/media/'

# Static files
STATIC_ROOT = os.path.join(PROJECT_PATH, 'static')
STATIC_URL = '/static/'

# Admin static files
ADMIN_MEDIA_ROOT = os.path.join(PROJECT_PATH, 'deploy/lib/python%s.%s/site-packages/django/contrib/admin/media/' % (sys.version_info[0], sys.version_info[1],))
ADMIN_MEDIA_PREFIX = STATIC_URL + 'admin/'

# Make this unique, and don't share it with anybody.
SECRET_KEY = '@!p&djm0$6=3ipbp%vwi2=fj=u73p3=37-j&$vu33+u8l605-j'

# Increase Cookie Security
SESSION_COOKIE_HTTPONLY = True
if not DEBUG:
    SESSION_COOKIE_SECURE = True

# Security - Prevent Clickjacking
X_FRAME_OPTIONS = 'DENY'

# HTTP Optimization
USE_ETAGS = True

# Middleware
MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.transaction.TransactionMiddleware',
    'django.middleware.doc.XViewMiddleware',
    #'django.middleware.clickjacking.XFrameOptionsMiddleware',
    #'debug_toolbar.middleware.DebugToolbarMiddleware',
)

# Static Files
STATICFILES_DIRS = (
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# Template - Context Processors
TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.request",
    "django.core.context_processors.static",
    "django.contrib.messages.context_processors.messages",
)

# Template - Loaders
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader'
)

# Template - Directories
TEMPLATE_DIRS = (
    os.path.join(PROJECT_PATH, "templates"),
)

# Applications
OUR_APPS = (
    'backend',
)
INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.humanize',
    'django.contrib.markup',
    'django.contrib.flatpages',
    'django_extensions',
    'gunicorn',
    'devserver',
) + OUR_APPS

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
