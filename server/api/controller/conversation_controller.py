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

@app_handler.route('/<string:user_id>/conversations', methods=['GET'])
def get_user_conversations(user_id):
    user = session.query(User).filter_by(id=user_id).one_or_none()
    if user:
        user_conversations = user.conversations
        convo_dict = {}
        convo_dict["conversations"] = []
        if not user_conversations:
            return jsonify(convo_dict), 200
        conversations = []
        for conv in user_conversations:
            cs = conv.users
            conversation_data = conv.to_dict()
            conversation_users = [user.mini_data() for user in cs if user.id != user_id]
            if conversation_data['users']:
                conversation_data.pop('users')
            conversation_data['user'] = user.mini_data()
            conversation_data['others'] = conversation_users
            conversations.append(conversation_data)
        conversations.sort(key=lambda x: x['updated_at'], reverse=True)

        convo_dict["conversations"] = conversations
        return jsonify(convo_dict), 200

    return jsonify({"error": "user not found"}), 400

@app_handler.route('conversation/<string:conversation_id>', methods=['GET'])
def get_conversation_by_id(conversation_id):
    conversation = session.query(Conversation).filter_by(id=conversation_id).one_or_none()
    if not conversation:
        return jsonify({"error": "conversation not found"}), 400
    
    conversation_users = conversation.users
    conversation_users = [user.mini_data() for user in conversation_users]
    conversation_data = conversation.to_dict()
    conversation_data['users'] = conversation_users
    return jsonify(conversation_data)
