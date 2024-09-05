from flask import Flask, redirect, url_for, session, jsonify
import jwt
import os
from server.models import storage
from server.models.user import User
from dotenv import load_dotenv
from flask import Blueprint


auth_handler = Blueprint('auth', __name__, url_prefix='/auth')

load_dotenv()


print(os.getenv('CLIENT_ID'))
print(os.getenv('CLIENT_SECRET'))

def required(f):
    def wrapper(*args, **kwargs):
        token = request.header.get("Authorization")
        if not token:
            return jsonify({"error": "token is missing"}), 403
        try:
            data = jwt.decode(token.split()[1], app.config['SECRET_KEY'], algorithms=["HS256"])
            user = data['email']
        except Exception:
            return jsonify({"error": "invalid token"}), 403

        return f(user, *args, **kwargs)
    return wrapper

@auth_handler.route('/login', methods=['GET'])
def login():
    from server.api.app import oauth
    redirect_uri = url_for('auth.login_callback', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@auth_handler.route('/signup')
def signup():
    from server.api.app import oauth
    redirect_uri = url_for('auth.signup_callback', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@auth_handler.route('/login/google-callback')
def login_callback():
    token = google.authorize_access_token()
    resp = google.get('https://www.googleapis.com/oauth2/v3/userinfo', token=token)
    user_info = resp.json()
    user = session.query(User).filter_by(email=user_info['email']).one_or_none()
    if not user:
        return jsonify({"error": "user does not exist"}), 404

    user_details = {}
    user_token = jwt.encode({
        'sub': user_id['id'],
        'email': user_info['email'],
        'profile_url': user_info['picture'],
        'user_name': user_info['name']
    }, app.config['SECRET_KEY'])

    user_details["email"] = user_info['email']
    user_details["token"] = user_token
    return jsonify(user_details), 200

@auth_handler.route('/signup//google-callback')
def signup_callback():
    token = google.authorize_access_token()
    resp = google.get('https://www.googleapis.com/oauth2/v3/userinfo', token=token)
    user_info = resp.json()
    user = session.query(User).filter_by(email=user_info['email']).one_or_none()
    if user:
        return jsonify({"error": "user already exist"}), 403

    user = User(email=user_info['email'], profile_url=user_info['picture'], username=user_info['name'])
    storage.new(user)
    storag.save()

    user_details = {}
    user_token = jwt.encode({
        'sub': user.id,
        'email': user_info['email'],
        'profile_url': user_info['picture'],
        'user_name': user_info['name']
        }, app.config['SECRET_KEY'])
    user_details["email"] = user_info['email']
    user_details["token"] = user_token

    return jsonify(user_details), 200
