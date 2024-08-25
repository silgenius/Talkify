#!/usr/bin/python3

from flask import Flask, request, jsonify, abort
from server.api.controller import app_handler
from server.models import storage
from server.models.user import User


session = storage.get_session()

@app_handler.route("/user/id", methods=['GET'])
def user_by_id():
    """
    Retrieves a user based on their unique user ID
    """

    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Not a JSON"}), 400

    user_id = data.get("id")
    if not user_id:
        return jsonify({"error": "Missing id"}), 400

    user = session.query(User).filter_by(id=user_id).one_or_none()
    if user:
        return jsonify(user.to_dict())
    abort(404)

@app_handler.route("/user/email", methods=['GET'])
def user_by_email():
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

    user = session.query(User).filter_by(email=user_email).one_or_none()
    if user:
        return jsonify(user.to_dict())
    abort(404)
