#!/usr/bin/python3

from flask import Flask, request, jsonify, abort
from server.api.controller import app_handler
from server.models import storage
from server.models.conversation import Conversation
from server.models.message import Message

session = storage.get_session()


@app_handler.route('/<string:conversation_id>/messages', methods=['GET'])
def retrive_message_conv_id(conversation_id):
    """
    Retrieves all messages for a specific conversation.
    """
    conversation = session.query(Conversation).filter_by(id=conversation_id).one_or_none()
    if not conversation:
        return jsonify({"error": "conversation not found"}), 400
    message = session.query(Message).filter_by(conversation_id=conversation.id).order_by(Message.created_at).all()
    msgs_dict = {}
    msgs_dict["messages"] = []
    if not message:
         return jsonify(msgs_dict), 200

    messages = [mgs.to_dict() for mgs in message]
    msgs_dict["messages"] = messages
    return jsonify(msgs_dict), 200


@app_handler.route('/message/<string:message_id>', methods=['GET'])
def retrieve_message_id(message_id):
    """
    Retrieves message through it id
    """
    message = session.query(Message).filter_by(id=message_id).one_or_none()
    if not message:
        return jsonify({"error": "message not found"}), 400
    return jsonify(message.to_dict()), 200
