#!/usr/bin/python3

from flask import Flask, request, jsonify, abort
from server.api.controller import app_handler
from server.models import storage
from server.models.user import User
from  server.models.contact import Contact, Status
from sqlalchemy import and_
from server.api.auth import required


session = storage.get_session()

@app_handler.route("/request", methods=['POST'])
@required
def send_request(auth_email, sub):
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Invalid Json"}), 400

    sender_id = data.get("sender_id")
    if not sender_id:
        return jsonify({"error": "sender id missing"}), 400
    receiver_id = data.get("receiver_id")
    if not receiver_id:
        return jsonify({"error": "receiver id missing"}), 400

    sender = session.query(User).filter_by(id=sender_id).one_or_none()
    receiver = session.query(User).filter_by(id=receiver_id).one_or_none()
    if not (sender or receiver):
        abort(404)

    verify = session.query(Contact).filter(and_(Contact.user_id == receiver.id, Contact.contact_id == sender.id)).one_or_none()
    if not verify:
        contact1 = Contact(user_id=sender.id, contact_id=receiver.id, contact_name=receiver.username)
        storage.new(contact1)
        contact2 = Contact(user_id=receiver.id, contact_id=sender.id, contact_name=sender.username)
        storage.new(contact2)
        storage.save()
    else:
        return jsonify({"error": "contact already exist"}), 403

    rcv_rqt = session.query(Contact).filter(and_(Contact.user_id == receiver.id, Contact.contact_id == sender.id)).one_or_none()
    rcv_rqt.status = Status.requested
    send_rqt = session.query(Contact).filter(and_(Contact.user_id == sender.id, Contact.contact_id == receiver.id)).one_or_none()
    send_rqt.status = Status.pending
    storage.save()
    return jsonify({"success": "reqeust sent"}), 200


@app_handler.route("/accept", methods=['POST'])
@required
def accept_request(auth_email, sub):
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Invalid Json"}), 400

    sender_id = data.get("sender_id")
    if not sender_id:
        return jsonify({"error": "sender id missing"}), 400
    receiver_id = data.get("receiver_id")
    if not receiver_id:
        return jsonify({"error": "receiver id missing"}), 400

    sender = session.query(User).filter_by(id=sender_id).one_or_none()
    receiver = session.query(User).filter_by(id=receiver_id).one_or_none()
    if not (sender or receiver):
        abort(404)

    rcv_rqt = session.query(Contact).filter(and_(Contact.user_id == receiver.id, Contact.contact_id == sender.id)).one_or_none()
    rcv_rqt.status = Status.accepted
    send_rqt = session.query(Contact).filter(and_(Contact.user_id == sender.id, Contact.contact_id == receiver.id)).one_or_none()
    send_rqt.status = Status.accepted
    storage.save()
    return jsonify({"success": "reqeust accepted"}), 200


@app_handler.route('/block', methods=['POST'])
@required
def block_contact(auth_email, sub):
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Invalid Json"}), 400

    sender_id = data.get("sender_id")
    if not sender_id:
        return jsonify({"error": "sender id missing"}), 400
    receiver_id = data.get("receiver_id")
    if not receiver_id:
        return jsonify({"error": "receiver id missing"}), 400

    sender = session.query(User).filter_by(id=sender_id).one_or_none()
    receiver = session.query(User).filter_by(id=receiver_id).one_or_none()
    if not (sender or receiver):
        abort(404)

    rqt = session.query(Contact).filter(and_(Contact.user_id == sender.id, Contact.contact_id == receiver.id)).one_or_none()
    rqt.status = Status.blocked
    storage.save()
    return jsonify({"success": "user blocked"}), 200

@app_handler.route('/unblock', methods=['POST'])
@required
def unblock_contact(auth_email, sub):
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Invalid Json"}), 400

    sender_id = data.get("sender_id")
    if not sender_id:
        return jsonify({"error": "sender id missing"}), 400
    receiver_id = data.get("receiver_id")
    if not receiver_id:
        return jsonify({"error": "receiver id missing"}), 400

    sender = session.query(User).filter_by(id=sender_id).one_or_none()
    receiver = session.query(User).filter_by(id=receiver_id).one_or_none()
    if not (sender or receiver):
        abort(404)

    rqt = session.query(Contact).filter(and_(Contact.user_id == sender.id, Contact.contact_id == receiver.id)).one_or_none()
    rqt.status = Status.accepted
    storage.save()
    return jsonify({"success": "user unblocked"}), 200
