#!/usr/bin/python3

from flask_socketio import emit
from server.api.sockets.events import socketio
from server.models.conversation import Conversation
from server.models.message import Message


@socketio.on('send_message')
def handle_message(data):
    if not isinstace(data, dict):
        emit('error', {'error': 'data must be dict obj'})
    convo_id = data.get("conversation_id")
    if not convo_id:
        emit('error', {'error': 'conversatio_id missing'})
    sender_id = data.get("sender_id")
    if not sender_id:
        emit('error', {'error': 'sender_id missing'})
    message_type = data.get("message_type")
    text = data.get("text")
    conversation = session.query(Conversation).filter_by(id=conversation_id).one_or_none()
    message = Message(conversation_id=conversation.id, sender_id=sender_id, message_text=text)
    storage.new(message)
    storage.save()
    conversation.update_last_message_id(message.id)
    emit('message_sent', conversation.to_dict(), broadcast=True)

@socketio.on('start_typing')
def handle_typing(data):
    if not isinstace(data, dict):
        emit('error', {'error': 'data must be dict obj'})
    convo_id = data.get("conversation_id")
    if not convo_id:
        emit('error', {'error': 'conversatio_id missing'})
    sender_id = data.get("sender_id")
    if not sender_id:
        emit('error', {'error': 'sender_id missing'})

    user = session.query(User).filter_by(id=sender_id).one_or_none()
    emit('typing_started', {'username': user.username, 'conversation_id': convo_id}, broadcast=True)

@socketio.on('stop_typing')
def handle_stop_typing(data):
    if not isinstace(data, dict):
        emit('error', {'error': 'data must be dict obj'})
    convo_id = data.get("conversation_id")
    if not convo_id:
        emit('error', {'error': 'conversatio_id missing'})
    sender_id = data.get("sender_id")
    if not sender_id:
        emit('error', {'error': 'sender_id missing'})

    user = session.query(User).filter_by(id=sender_id).one_or_none()
    emit('typing_stopped', {'username': user.username, 'conversation_id': convo_id}, broadcast=True)
