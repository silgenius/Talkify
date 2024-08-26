#!/usr/bin/python3

"""
 a script that starts a Flask web application
"""

from flask import Flask, make_response, jsonify
from flask_cors import CORS
from server.models import storage
from server.api.controller import app_handler
from os import getenv


app = Flask(__name__)
app.register_blueprint(app_handler)

CORS(app, resources={r"/*": {
    "origins": "0.0.0.0"
    }})

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
