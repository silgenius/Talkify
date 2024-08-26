#!/usr/bin/python3

from flask import Flask, request, jsonify, abort
from server.api.controller import app_handler
from server.models import storage
from server.models.conversation import Conversation
from server.models.user import User

session = storage.get_session()

@app_handler.route('/conversations/create', methods=['POST'])
def create_conversation():
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Invalid json"}), 400
    users = data.get("users")
    if not users or len(users) != 2:
        return jsonify({"error": "Invalid user list"}), 400

    new_conversation = Conversation()
    storage.new(new_conversation)
    storage.save()

    for user_id in users:
       user = session.query(User).filter_by(id=user_id).one_or_none()
       if user:
            user.conversations.append(new_conversation)
       else:
            storage.delete(new_conversation)
            abort(404)
    storage.save()

    return jsonify(new_conversation.to_dict()), 201

@app_handler.route('/conversations/create/group', methods=['POST'])
def create_group():
    try:
        data = request.get_json()
    except Exception:
         return jsonify({"error": "Invalid json"}), 400

    users = data.get("users")
    if not users or len(users) < 2:
        return jsonify({"error": "Invalid user list"}), 400

    group_name = data.get("name")
    if not group_name:
        return jsonify({"error": "Missing group name"}), 400

    new_conversation = Conversation(name=group_name)
    new_conversation.is_group()
    storage.new(new_conversation)
    storage.save()

    for user_id in users:
        user = session.query(User).filter_by(id=user_id).one_or_none()
        if user:
            user.conversations.append(new_conversation)
        else:
            storage.delete(new_conversation)
            abort(404)
    storage.save()

    return jsonify(new_conversation.to_dict()), 201

@app_handler.route('/<string:user_id>/conversation', methods=['GET'])
def get_user_conversations(user_id):
    user = session.query(User).filter_by(id=user_id).one_or_none()
    if user:
        conversations = [conv.to_dict() for conv in user.conversations]
        return jsonify(conversations)

    abort(404)