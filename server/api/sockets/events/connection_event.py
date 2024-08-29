#!/usr/bin/python3

from flask_socketio import emit
from server.api.sockets.events import socketio


@socketio.on('conect_user')
def handle_user_conected(data):
    if not isinstace(data, dict):
        emit('error', {'error': 'data must be dict obj'})

    user_id = data.get("user_id")
    user = session.query(User).filter_by(id=user_id).one_or_none() 
    print("connected") #debugging
    emit('user_connected', {'username': user.username, 'status': 'online'})

@socketio.on('disconnect_user')
def handle_user_disconnected(data):
    if not isinstace(data, dict):
        emit('error', {'error': 'data must be dict obj'})

    user_id = data.get("user_id")
    user = session.query(User).filter_by(id=user_id).one_or_none()
    print("{} disconnected".format(user.username)) #debugging
    emit('user_disconnected', {'username': user.username, 'status': 'offline'})
