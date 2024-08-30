#!/usr/bin/python3

from flask_socketio import emit
from server.api.sockets.events import socketio
from server.models.conversation import Conversation
from server.models.message import Message
from server.models import storage
from server.models.user import User

@socketio.on('send_message')
def handle_message(data):
    if not isinstance(data, dict):
        emit('error', {'error': 'data must be dict obj'})
        return

    message_id = data.get("message_id")
    if not message_id:
        emit('error', {'error': 'message_id missing'})
        return

    message = session.query(Message).filter_by(id=message_id).one_or_none()
    if not message:
        emit('error', {'error': 'message missing'})
        return

    emit('message_sent', message.to_dict(), broadcast=True)

@socketio.on('start_typing')
def handle_typing(data):
    if not isinstance(data, dict):
        emit('error', {'error': 'data must be dict obj'})
        return

    convo_id = data.get("conversation_id")
    if not convo_id:
        emit('error', {'error': 'conversatio_id missing'})
        return

    sender_id = data.get("sender_id")
    if not sender_id:
        emit('error', {'error': 'sender_id missing'})
        return

    user = session.query(User).filter_by(id=sender_id).one_or_none()
    if not user:
        emit('error', {'error': 'user does not exist'})
        return

    emit('typing_started', {'username': user.username, 'conversation_id': convo_id}, broadcast=True)

@socketio.on('stop_typing')
def handle_stop_typing(data):
    if not isinstance(data, dict):
        emit('error', {'error': 'data must be dict obj'})
        return

    convo_id = data.get("conversation_id")
    if not convo_id:
        emit('error', {'error': 'conversatio_id missing'})
        return

    sender_id = data.get("sender_id")
    if not sender_id:
        emit('error', {'error': 'sender_id missing'})
        return

    user = session.query(User).filter_by(id=sender_id).one_or_none()
    if not user:
        emit('error', {'error': 'user does not exist'})
        return

    emit('typing_stopped', {'username': user.username, 'conversation_id': convo_id}, broadcast=True)
