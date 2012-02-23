# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'User'
        db.create_table('backend_user', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('symphonia_id', self.gf('django.db.models.fields.CharField')(unique=True, max_length=100)),
        ))
        db.send_create_signal('backend', ['User'])

        # Adding model 'Presence'
        db.create_table('backend_presence', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('openscape_id', self.gf('django.db.models.fields.IntegerField')(unique=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal('backend', ['Presence'])

        # Adding model 'Device'
        db.create_table('backend_device', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('openscape_id', self.gf('django.db.models.fields.CharField')(unique=True, max_length=100)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal('backend', ['Device'])

        # Adding model 'Profile'
        db.create_table('backend_profile', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('owner', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['backend.User'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('latitude', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=6)),
            ('longitude', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=6)),
            ('accuracy', self.gf('django.db.models.fields.IntegerField')()),
            ('presence', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['backend.Presence'], null=True, blank=True)),
            ('device', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['backend.Device'], null=True, blank=True)),
        ))
        db.send_create_signal('backend', ['Profile'])


    def backwards(self, orm):
        
        # Deleting model 'User'
        db.delete_table('backend_user')

        # Deleting model 'Presence'
        db.delete_table('backend_presence')

        # Deleting model 'Device'
        db.delete_table('backend_device')

        # Deleting model 'Profile'
        db.delete_table('backend_profile')


    models = {
        'backend.device': {
            'Meta': {'object_name': 'Device'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'openscape_id': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'})
        },
        'backend.presence': {
            'Meta': {'object_name': 'Presence'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'openscape_id': ('django.db.models.fields.IntegerField', [], {'unique': 'True'})
        },
        'backend.profile': {
            'Meta': {'object_name': 'Profile'},
            'accuracy': ('django.db.models.fields.IntegerField', [], {}),
            'device': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['backend.Device']", 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'latitude': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '6'}),
            'longitude': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '6'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'owner': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['backend.User']"}),
            'presence': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['backend.Presence']", 'null': 'True', 'blank': 'True'})
        },
        'backend.user': {
            'Meta': {'object_name': 'User'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'symphonia_id': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'})
        }
    }

    complete_apps = ['backend']
