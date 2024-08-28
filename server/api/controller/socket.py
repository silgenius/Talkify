#!/usr/bin/python3

from flask_socketio import SocketIO, emit
from server.api.controller import app_handler
from server.models.conversation import Conversation
from server.models.message import Message
from server.models.user import User
from server.models.contact import Contact
from server.models.notification import Notification


app_handler.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
socketio = SocketIO(app_handler)

@socketio.on('connect')
def handle_user_conected(data):
    print("connected") #debugging

@socketio.connect('message')
def handle_message(data):
    convo_id = data.get("conversation_id")
    sender_id = data.get("sender_id")
    messag_type = data.get("messae_type")
    text = data.get("text")
    conversation = session.query(Conversation).filter_by(id=conversation_id).one_or_none()
    message = Message(conversation_id=convo_id, sender_id=sender_id, message_text=text)
    storage.new(message)
    storage.save()
    conversation.update_last_message_id(message.id)
    emit('new_message', conversation.to_dict())

@socketio.connect('typing')
def handle_typing(data):
    convo_id = data.get("conversation_id")
    sender_id = data.get("sender_id")
    user = session.query(User).filter_by(id=sender_id).one_or_none()
    emit('user_typing', {'username': user.username, 'conversation_id': convo_id}, broadcast=True)

@socket.connect('stop_typing')
def handle_stop_typing(data):
    convo_id = data.get("conversation_id")
    sender_id = data.get("sender_id")
    user = session.query(User).filter_by(id=sender_id).one_or_none()
    emit('user_stop_typing', {'username': user.username, 'conversation_id': convo_id}, broadcast=True)
