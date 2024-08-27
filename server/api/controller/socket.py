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
    print("connected")

@socketio.connect('message')
def handle_message(data):
    convo_id = data.get("conversation_id")
    sender_id = data.get("sender_id")
    messag_type = data.get("messae_type")
    text = data.get("text")\
    \
    conversation = session.query(Conversation).filter_by(id=conversation_id).one_or_none()
    if not conversatin
    message = Message(
