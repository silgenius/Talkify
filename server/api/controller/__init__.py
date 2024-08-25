#!/usr/bin/python3

from flask import Blueprint


app_handler = Blueprint('app_handler', __name__, url_prefix='/api')

from server.api.controller.conversation_controller import *
from server.api.controller.user_controller import *
