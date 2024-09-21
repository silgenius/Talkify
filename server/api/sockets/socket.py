#!/usr/bin/python3

"""
 a script that starts a Flask web application
"""

from server.api.sockets.events import app, socketio
from server.models import storage
from flask import make_response, jsonify


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

if __name__ == '__main__':
    socketio.run(app, port=5001, host = '0.0.0.0')
