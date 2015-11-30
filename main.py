#!/usr/bin/env python
#
# Copyright 2015 Xinhong LIU.
#
from flask import Flask
from flask import render_template
from flask import jsonify
from flask import request
from google.appengine.ext import db
import os
import time


os.environ['TZ'] = 'Asia/Hong_Kong'
time.tzset()


class SecretItem(db.Model):
    """SecretItem"""
    content = db.StringProperty(required=True)
    time = db.DateTimeProperty(auto_now_add=True)
    name = db.StringProperty()
    ip = db.StringProperty()
    user_agent = db.StringProperty()
    blocked = db.BooleanProperty()
    blocked_reason = db.StringProperty()


index_html = '''<!DOCTYPE HTML>
<html>
<body>
<h1>Hall2 Secret</h1>
<p>hall2 magazine team</p>
</body>
</html>'''
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/all/')
def list_secret_items():
    secret_items_query = SecretItem.all()
    secret_items = []
    for secret_item in secret_items_query.run():
        d = dict()
        d['content'] = secret_item.content
        d['name'] = secret_item.name
        d['time'] = time.mktime(secret_item.time.timetuple())
        secret_items.append(d)
    return jsonify({'secret_items': secret_items})


@app.route('/post/', methods=['POST'])
def add_secret_item():
    try:
        secret_item = SecretItem(content=request.form['content'])
        if request.form['show_name'] == 'true':
            secret_item.name = request.form['name']
        secret_item.ip = request.remote_addr
        secret_item.user_agent = request.headers.get('User-Agent')
        secret_item.put()
        return jsonify({'success': 1})
    except Exception, e:
        return jsonify({'success': 0,
                        'error': e.message})


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, Nothing at this URL.', 404


@app.errorhandler(500)
def application_error(e):
    """Return a custom 500 error."""
    return 'Sorry, unexpected error: {}'.format(e), 500

if __name__ == '__main__':
    app.run()
