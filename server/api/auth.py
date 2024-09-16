from flask import Flask, request, redirect, url_for, jsonify, render_template
import jwt
import os
from server.models import storage
from server.models.user import User
from dotenv import load_dotenv
from flask import Blueprint
from functools import wraps


auth_handler = Blueprint('auth', __name__, url_prefix='/auth')

load_dotenv()
session = storage.get_session()


def required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            token = request.headers.get("Authorization")
        except Exception:
            return jsonify({"error": "Authorization header missing"}), 401

        if not token:
            return jsonify({"error": "token is missing"}), 401
        try:
            print(token.split()[1])
            data = jwt.decode(token.split()[1], os.getenv('SECRET_KEY'), algorithms=["HS256"])
            auth_email = data['email']
            sub = data['sub']
        except Exception:
            return jsonify({"error": "invalid token"}), 401

        return f(auth_email, sub, *args, **kwargs)
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

@auth_handler.route('/login/google_callback')
def login_callback():
    from server.api.app import google
    from server.api.app import app

    token = google.authorize_access_token()
    resp = google.get('https://www.googleapis.com/oauth2/v3/userinfo', token=token)
    user_info = resp.json()
    user = session.query(User).filter_by(email=user_info['email']).one_or_none()
    if not user:
        error_details = {"error": "user does not exist"}
        return render_template('auth.html', user_details=error_details)

    user_details = {}
    user_token = jwt.encode({
        'sub': user.id,
        'email': user_info['email'],
        'profile_url': user_info['picture'],
        'username': user_info['name']
    }, app.config['SECRET_KEY'])
    user_details["email"] = user_info['email']
    user_details["token"] = user_token
    print(user_details) #debugging
    return render_template('auth.html', user_details=user_details)


@auth_handler.route('/signup/google_callback')
def signup_callback():
    from server.api.app import google
    from server.api.app import app

    token = google.authorize_access_token()
    resp = google.get('https://www.googleapis.com/oauth2/v3/userinfo', token=token)
    user_info = resp.json()
    user = session.query(User).filter_by(email=user_info['email']).one_or_none()
    if user:
        error_details = {"error": "user already exist"}
        return render_template('auth.html', user_details=error_details)

    user = User(email=user_info['email'], profile_url=user_info['picture'], username=user_info['name'])
    user.update_last_login()
    storage.new(user)
    storage.save()

    user_details = {}
    user_token = jwt.encode({
        'sub': user.id,
        'email': user_info['email'],
        'profile_url': user_info['picture'],
        'username': user_info['name']
        }, app.config['SECRET_KEY'])
    user_details["email"] = user_info['email']
    user_details["token"] = user_token
    return render_template('auth.html', user_details=user_details)
