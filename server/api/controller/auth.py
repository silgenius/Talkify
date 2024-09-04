from flask import Flask, redirect, url_for, session, jsonify
from authlib.integrations.flask_client import OAuth
import jwt
import os
from server.models import storage
from server.models.user import User
from server.api.controller import auth_handler

app = Flask(__name__)
app.config['SECRET_KEY'] = "Change to a real secret key"

# Set up OAuth
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id="920202821222-enfe8o0kl50f2t6o1ouvp53mfu57dk56.apps.googleusercontent.com",
    client_secret="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",
    authorize_params=None,
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri='http://localhost:5000/authorized',
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'openid profile email'},
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration'
)

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

@app.route('/login')
def login():
    redirect_uri = url_for('login_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/signup')
def signup():
    redirect_uri = url_for('signup_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/login-callback')
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

@app.route('/signup-callback')
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
