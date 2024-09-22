#!/usr/bin/python3

from flask import Flask, request, jsonify, abort
from server.api.controller import app_handler
from server.models import storage
from server.models.user import User
from server.models.contact import Contact
from server.api.auth import required


session = storage.get_session()

@app_handler.route("/<string:user_id>/contacts")
@required
def get_user_contact(auth_email, sub, user_id):
    """
    This endpoint retrieves the contacts associated with a specified user
    """
    user = session.query(User).filter_by(id=user_id).one_or_none()
    if not user:
        abort(404)

    contacts = session.query(Contact).filter_by(user_id=user.id).all()
    contact_dict = {}

    contact_dict["user_id"] = user.id
    contact_dict["contacts"] = []
    if not contacts:
        return jsonify(contact_dict), 200

    contact_details = []
    for contact in contacts:
        cd = contact.to_dict()
        cd.pop('user_id')
        user = session.query(User).filter_by(id=cd['contact_id']).one_or_none()
        cd['contact'] = user.mini_data()
        cd.pop('contact_id')
        cd.pop("contact_name")
        cd.pop("updated_at")
        cd.pop("id")
        contact_details.append(cd)
    contact_dict["contacts"] = contact_details

    return jsonify(contact_dict), 200
