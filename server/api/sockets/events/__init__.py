#!/usr/bin/python3

from flask import Flask
from flask_socketio import SocketIO
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') 
socketio = SocketIO(app)

CORS(app, resources={r"*": {
    "origins": "*"
    }})

from server.api.sockets.events.message_event import *
from server.api.sockets.events.connection_event import*
