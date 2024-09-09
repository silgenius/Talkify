#!/usr/bin/python3

from flask_socketio import emit
from server.api.sockets.events import socketio

@socketio.on('initiate_call')
def handle_call_init(data):
    emit('call_initiated', data, broadcast=True)

@socketio.on('accept_call')
def handle_call_accept(data):
    emit('call_accepted', data, broadcast=True)

@socketio.on('end_call')
def handle_call_end(data):
    emit('call_ended', data, broadcast=True)
