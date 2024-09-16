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

    if user_id != sub:
        return jsonify({"error": "you cant access this page"}), 401

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
