#!/usr/bin/python3

from flask_socketio import emit
from server.api.sockets.events import socketio
from server.models import storage
from server.models.contact import Contact
from server.models.user import User


session = storage.get_session()

@socketio.on('send_contact_action')
def handle_request(data):
    if not isinstance(data, dict):
        emit('error', {'error': 'data must be dict obj'})
        return
    
    sender_id = data.get("sender_id")
    if not sender_id:
        emit ('error', {'error': "sender id missing"})
        return

    receiver_id = data.get("receiver_id")
    if not receiver_id:
        emit ('error', {'error': "receiver id missing"})
        return
    
    sender = session.query(User).filter_by(id=sender_id).one_or_none()
    receiver = session.query(User).filter_by(id=receiver_id).one_or_none()
    if not (sender or receiver):
        emit ('error', {'error': "user not found"})
        return

    contact = session.query(Contact).filter(and_(Contact.user_id == receiver.id, Contact.contact_id == sender.id)).one_or_none()
    if not contact:
        emit ('error', {'error': "contact not found"})
        return

    emit('contact_action_sent', contact.to_dict(), broadcast=True)
