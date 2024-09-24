#!/usr/bin/python3

from flask import Flask, request, jsonify, abort
from server.api.controller import app_handler
from server.models import storage
from server.models.conversation import Conversation
from server.models.user import User
from server.models.contact import Contact
from server.models.message import MessageType, Message
from sqlalchemy import and_
from server.api.auth import required


session = storage.get_session()

@app_handler.route('/conversations/create', methods=['POST'])
@required
def create_conversation(auth_email, sub):
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Invalid json"}), 400

    users = data.get("users")
    if not users or len(users) != 1:
        return jsonify({"error": "Invalid users list"}), 400

    created_by = data.get("created_by")
    if not created_by:
        return jsonify({"error": "created_by missing"}), 400

    user1 = session.query(User).filter_by(id=created_by).one_or_none()
    user2 = session.query(User).filter_by(id=users[0]).one_or_none()
    if user1 and user2:
        new_conversation = Conversation(created_by=user1.id)
        storage.new(new_conversation)
        user1.conversations.append(new_conversation)
        user2.conversations.append(new_conversation)
        storage.save()

    # check if user already have the other user in their contact
    # create if not or skip
    verify = session.query(Contact).filter(and_(Contact.user_id == user1.id, Contact.contact_id == user2.id)).one_or_none()
    if not verify:
        contact1 = Contact(user_id=user1.id, contact_id=user2.id, contact_name=user_2.username)
        conact1.status = Status.requested
        storage.new(contact1)
        contact2 = Contact(user_id=user2.id, contact_id=user1.id, contact_name=user_1.username)
        contact2.status = Status.pending
        storage.new(contact1)
        storage.save()

    return jsonify(new_conversation.to_dict()), 201

@app_handler.route('/conversations/create/group', methods=['POST'])
@required
def create_group(auth_email, sub):
    try:
        data = request.get_json()
    except Exception:
         return jsonify({"error": "Invalid json"}), 400

    users = data.get("users")
    if not users or len(users) < 1:
        return jsonify({"error": "Invalid user list"}), 400

    created_by = data.get("created_by")
    if not created_by:
        return jsonify({"error": "created_by missing"}), 400

    group_name = data.get("name")
    if not group_name:
        return jsonify({"error": "Missing group name"}), 400

    #add group creator to the group
    user = session.query(User).filter_by(id=created_by).one_or_none()
    if user:
        new_conversation = Conversation(name=group_name, created_by=created_by)
        new_conversation.is_group()
        storage.new(new_conversation)
        storage.save()
        user.conversations.append(new_conversation)
    else:
        storage.delete(new_conversation)
        abort(404)

    #add other members to the group
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
@required
def get_user_conversations(auth_email, sub, user_id):
    user = session.query(User).filter_by(id=user_id).one_or_none()
    if user:
        user.update_last_login()
        storage.save() # save user last login
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
@required
def get_conversation_by_id(auth_email, sub, conversation_id):
    conversation = session.query(Conversation).filter_by(id=conversation_id).one_or_none()
    if not conversation:
        return jsonify({"error": "conversation not found"}), 400
    
    conversation_users = conversation.users
    conversation_users = [user.mini_data() for user in conversation_users]
    conversation_data = conversation.to_dict()
    conversation_data['users'] = conversation_users
    return jsonify(conversation_data)


@app_handler.route('conversation/group/remove', methods=['PUT'])
@required
def leave_conversation(auth_email, sub):
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Invalid json"}), 400

    conversation_id = data.get("conversation_id")
    if not conversation_id:
        return jsonify({"error": "conversation id missing"}), 400

    conversation = session.query(Conversation).filter_by(id=conversation_id).one_or_none()
    if not conversation:
        return jsonify({"error": "conversation not found"}), 400

    if not conversation.group:
        return jsonify({"error": "conversation is not group"}), 403

    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user id missing"}), 400

    user = session.query(User).filter_by(id=user_id).one_or_none()
    if not user:
        return jsonify({"error": "user not found"}), 400

    # check if user in group
    conversation_users = conversation.users
    verify = False
    for usr in conversation_users:
        if usr.id == user_id:
            verify = True

    if not verify:
        return jsonify({"error": "user not in conversation"}), 400

    conversation.users.remove(user)

    # creatd a user exited message
    message = Message(conversation_id=conversation.id, sender_id=user_id)
    text = f'{user.username} left the group'
    message.update_text(text)
    message.message_type = MessageType.exit
    storage.new(message)
    storage.save()
    conversation.update_last_message_id(message.id)

    return jsonify(message.to_dict()), 201
