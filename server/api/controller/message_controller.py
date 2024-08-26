#!/usr/bin/python3

from flask import Flask, request, jsonify, abort
from server.api.controller import app_handler
from server.models import storage
from server.models.conversation import Conversation
from server.models.message import Message

session = storage.get_session()


@app_handler.route('/messages/', methods=['GET'])
def retrive_message_conv_id():
    """
    Retrieves all messages for a specific conversation.
    """
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400
    
    conversation_id = data.get("conversation_id")
    if conversation_id:
        conversation = session.query(Conversation).filter_by(id=conversation_id).one_or_none()
        if not conversation:
            abort(404)
        message = session.query(Message).filter_by(conversation_id=conversation.id).order_by(Message.created_at).all()
        messages = [mgs.to_dict() for mgs in message]
        return jsonify(messages), 200
    
    return jsonify({"error": "conversation_id missing"}), 400

@app_handler.route('/message/id', methods=['GET'])
def retrieve_message_id():
    """
    Retrieves message through it id
    """
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    message_id =  data.get("id")
    if message_id:
        message = session.query(Message).filter_by(id=message_id).one_or_none()
        if not message:
            abort(404)
        return jsonify(message.to_dict()), 200

    return jsonify({"error": "id missing"})
