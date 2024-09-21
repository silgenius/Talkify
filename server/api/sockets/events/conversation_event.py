#!/usr/bin/python3

from flask_socketio import emit
from server.api.sockets.events import socketio
from server.models import storage
from server.models.conversation import Conversation


session = storage.get_session()

@socketio.on('create_conversation')
def handle_conversation(data):
    if not isinstance(data, dict):
        emit('error', {'error': 'data must be dict obj'})
        return

    conversation_id = data.get("conversation_id")
    if not conversation_id:
        emit('error', {'error': 'conversation id missing'})
        return

    conversation = session.query(Conversation).filter_by(id=conversation_id).one_or_none()
    if not conversation:
        emit('error', {'error': 'conversation missing'})
        return

    conv = conversation.to_dict()
    conv.pop("last_message_id")
    emit('conversation_created', conv, broadcast=True)
