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


@app_handler.route('/message/create', methods=['POST'])
def create_message():
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Not a JSON"}), 400

    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user id missing"}), 400
    user = session.query(User).filter_by(id=user_id).one_or_none()
    if not user:
        return jsonify({"error": "user not found"}), 400

    convo_id = data.get("conversation_id")
    if not convo_id:
        return jsonify({"error": "conversation id missing"}), 400
    conversation = session.query(Conversation).filter_by(id=conversation_id).one_or_none()
    if not conversation:
        return jsonify({"error": "conversation not found"}), 400

    text = data.get("message_text")
    if not text:
        return jsonify({"error": "message cannot be null"}), 400

    message = Message(conversation_id=conversation.id, message_text=text, sender_id=user.id)
    storage.new(message)
    storage.save()
    conversation.update_last_message_id(message.id)

    return jsonify(message.to_dict()), 201
