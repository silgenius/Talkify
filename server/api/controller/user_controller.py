#!/usr/bin/python3

from flask import Flask, request, jsonify, abort
from server.api.controller import app_handler
from server.models import storage
from server.models.user import User
from server.api.auth import required

session = storage.get_session()

@app_handler.route("/user/id/<string:user_id>", methods=['GET'])
@required
def user_by_id(auth_email, sub, user_id):
    """
    Retrieves a user based on their unique user ID
    """

    user = session.query(User).filter_by(id=user_id).one_or_none()
    if user:
        return jsonify(user.to_dict())
    abort(404)

@app_handler.route("/user/email", methods=['POST'])
@required
def user_by_email(auth_email, sub):
    """
    Retrieves a user based on their email address.
    """

    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Not a JSON"}), 400

    user_email = data.get("email")
    if not user_email:
        return jsonify({"error": "Missing email"}), 400

    if user_email != auth_email:
        return jsonify({"error": "you cant access this page"}), 401

    user = session.query(User).filter_by(email=user_email).one_or_none()
    if user:
        user.update_last_login()
        storage.save()
        return jsonify(user.to_dict())
    abort(404)

@app_handler.route("/user", methods=['GET'])
@required
def search_by_username(auth_email, sub):
    username = request.args.get('search', '')
    pattern = f'%{username}%'
    users = session.query(User).filter(User.username.like(pattern)).all()
    result = [user.mini_data() for user in users]

    return jsonify(result), 200

@app_handler.route("/user/update", methods=['PUT'])
@required
def update_user_data(auth_email, sub):
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Not a JSON"}), 400

    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user id missing"}), 400

    if user_id != sub:
        return jsonify({"error": "you cant access this page"}), 401

    user = session.query(User).filter_by(id=user_id).one_or_none()
    if not user:
        return jsonify({"error": "user not found"}), 400

    username = data.get("username")
    if username:
        user.username = username

    bio = data.get("bio")
    if bio:
        user.bio = bio

    user.save()

    return jsonify({"success": "data updated"}), 200
