#!/usr/bin/python3

from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
CORS(app, resources={r"*": {
    "origins": "*"
    }})

socketio = SocketIO(app, cors_allowed_origins="*")

from server.api.sockets.events.message_event import *
from server.api.sockets.events.connection_event import*
from server.api.sockets.events.call_event import *
from server.api.sockets.events.conversation_event import *
from server.api.sockets.events.contact_event import *
