#!/usr/bin/python3

from flask_socketio import emit
from server.api.sockets.events import socketio
from server.models import storage
from server.models.user import User


@socketio.on('connect_user')
def handle_user_conected(data):
    session = storage.get_session()
    try:
        if not isinstance(data, dict):
            emit('error', {'error': 'data must be dict obj'})
            return

        user_id = data.get("user_id")
        if not user_id:
            emit('error', {'error': 'user id not found'})
            return

        user = session.query(User).filter_by(id=user_id).one_or_none()
        if not user:
            emit('error', {'error': 'user does not exist'})
            return

        emit('user_connected', user.mini_data(), broadcast=True)
    finally:
        session.close()


@socketio.on('disconnect_user')
def handle_user_disconnected(data):
    session = storage.get_session()
    try:
        if not isinstance(data, dict):
            emit('error', {'error': 'data must be dict obj'})
            return

        user_id = data.get("user_id")
        if not user_id:
            emit('error', {'error': 'user id not found'})
            return

        user = session.query(User).filter_by(id=user_id).one_or_none()
        if not user:
            emit('error', {'error': 'user does not exist'})
            return

        emit('user_disconnected', user.mini_data(), broadcast=True)
    finally:
        session.close()
