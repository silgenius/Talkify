#!/usr/bin/python3

from server.models import storage
from server.models.conversation import Conversation
from server.models.message import Message
from server.models.user import User

session = storage.get_session()
users = session.query(User).all()
for user in users:
    print("__________USER_____________________")
    print("___________________________________")
    print(user.to_dict())
