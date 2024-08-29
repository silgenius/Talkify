#!/usr/bin/python3

"""
 a script that starts a Flask web application
"""

from flask_cors import CORS
from server.api.sockets.events import app, socketio
import os


if __name__ == '__main__':
    socketio.run(app, port=5001, host = '0.0.0.0')
