#!/usr/bin/python3

from flask import Blueprint


app_handler = Blueprint('app_handler', __name__, url_prefix='/api')
