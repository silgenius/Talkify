#!/usr/bin/python3

"""
 a script that starts a Flask web application
"""

from flask import Flask, make_response, jsonify
from flask_cors import CORS
from server.models import storage
from server.api.controller import app_handler
from os import getenv
from server.api.auth import auth_handler
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os 

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

app.register_blueprint(app_handler)
app.register_blueprint(auth_handler)

CORS(app, resources={r"/*": {
    "origins": "*"
    }})

#setup OAuth
oauth = OAuth(app)
google = oauth.register(
        name='google',
        client_id=os.getenv('CLIENT_ID'),
        client_secret=os.getenv('CLIENT_SECRET'),
        authorize_params=None,
        access_token_params=None,
        refresh_token_url=None,
        redirect_uri=["https://talkify.techerudites.tech/auth/login/google_callback",
        "https://talkify.techerudites.tech/auth/signup/google_callback"],
        api_base_url='https://www.googleapis.com/oauth2/v3/',
        client_kwargs={'scope': 'openid profile email'},
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration'
)

@app.teardown_appcontext
def storage_close(exception):
    """
    Closes the storage connection at the end of the application context.
    """
    storage.close()

@app.errorhandler(404)
def non_found(error):
    """
    Handles 404 Not Found errors.
    """
    return make_response(jsonify({"error": "Not found"}), 404)


if __name__ == "__main__":
    api_host = getenv('HBNB_API_HOST')
    api_port = getenv('HBNB_API_PORT')

    if not api_host:
        api_host = "0.0.0.0"

    if not api_port:
        api_port = 5000

    app.run(host=api_host, port=api_port)
