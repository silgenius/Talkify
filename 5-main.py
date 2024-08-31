#!/usr/bin/python3

import time
from server.models import *
from server.models.base_model import BaseModel
from server.models.user import User
from server.models.conversation import Conversation
from server.models.message import Message

"""
Dummy Data Script
"""

def sleep_after_operation(seconds=1):
    """Pause execution for a specified number of seconds."""
    time.sleep(seconds)

# Create users
user1 = User(username="alice", email="alice@example.com", profile_url="alice_profile")
user1.update_last_login()
storage.new(user1)
sleep_after_operation()

user2 = User(username="bob", email="bob@example.com", profile_url="bob_profile")
user2.update_last_login()
storage.new(user2)
sleep_after_operation()

user3 = User(username="carol", email="carol@example.com", profile_url="carol_profile")
user3.update_last_login()
storage.new(user3)
sleep_after_operation()

user4 = User(username="dave", email="dave@example.com", profile_url="dave_profile")
user4.update_last_login()
storage.new(user4)
sleep_after_operation()

user5 = User(username="eve", email="eve@example.com", profile_url="eve_profile")
user5.update_last_login()
storage.new(user5)
sleep_after_operation()

storage.save()
sleep_after_operation()

# Create individual conversations
# Conversation between alice and bob
convo_ab = Conversation()
storage.new(convo_ab)
storage.save()
sleep_after_operation(3)

user1.conversations.append(convo_ab)
user2.conversations.append(convo_ab)
storage.save()
sleep_after_operation(3)

message_ab1 = Message(message_text="Hey Bob, how are you?", sender_id=user1.id, conversation_id=convo_ab.id)
storage.new(message_ab1)
storage.save()
sleep_after_operation(3)

convo_ab.update_last_message_id(message_ab1.id)
convo_ab.save()
sleep_after_operation(3)

message_ab2 = Message(message_text="Hi Alice, I'm good! How about you?", sender_id=user2.id, conversation_id=convo_ab.id)
storage.new(message_ab2)
storage.save()
sleep_after_operation(3)

convo_ab.update_last_message_id(message_ab2.id)
convo_ab.save()
sleep_after_operation(3)

# Conversation between carol and dave
convo_cd = Conversation()
storage.new(convo_cd)
storage.save()
sleep_after_operation(3)

user3.conversations.append(convo_cd)
user4.conversations.append(convo_cd)
storage.save()
sleep_after_operation(3)

message_cd1 = Message(message_text="Hello Dave, are you free for a chat?", sender_id=user3.id, conversation_id=convo_cd.id)
storage.new(message_cd1)
storage.save()
sleep_after_operation(3)

convo_cd.update_last_message_id(message_cd1.id)
convo_cd.save()
sleep_after_operation(3)

message_cd2 = Message(message_text="Hi Carol! Yes, I'm available now.", sender_id=user4.id, conversation_id=convo_cd.id)
storage.new(message_cd2)
storage.save()
sleep_after_operation(3)

convo_cd.update_last_message_id(message_cd2.id)
convo_cd.save()
sleep_after_operation()

# Conversation between alice and carol
convo_ac = Conversation()
storage.new(convo_ac)
storage.save()
sleep_after_operation(3)

user1.conversations.append(convo_ac)
user3.conversations.append(convo_ac)
storage.save()
sleep_after_operation(3)

message_ac1 = Message(message_text="Hi Carol! I wanted to check in with you.", sender_id=user1.id, conversation_id=convo_ac.id)
storage.new(message_ac1)
storage.save()
sleep_after_operation(3)

convo_ac.update_last_message_id(message_ac1.id)
convo_ac.save()
sleep_after_operation(3)

message_ac2 = Message(message_text="Hey Alice! Everything is going great.", sender_id=user3.id, conversation_id=convo_ac.id)
storage.new(message_ac2)
storage.save()
sleep_after_operation(3)

convo_ac.update_last_message_id(message_ac2.id)
convo_ac.save()
sleep_after_operation(3)

# Create group conversations
# Group conversation with alice, bob, and carol
convo_abc = Conversation(name="Friends Chat")
convo_abc.is_group()
storage.new(convo_abc)
storage.save()
sleep_after_operation(3)

user1.conversations.append(convo_abc)
user2.conversations.append(convo_abc)
user3.conversations.append(convo_abc)
storage.save()
sleep_after_operation(3)

message_abc1 = Message(message_text="Hi everyone, how's it going?", sender_id=user1.id, conversation_id=convo_abc.id)
storage.new(message_abc1)
storage.save()
sleep_after_operation(3)

convo_abc.update_last_message_id(message_abc1.id)
convo_abc.save()
sleep_after_operation(3)

message_abc2 = Message(message_text="Hello Alice! All good here.", sender_id=user2.id, conversation_id=convo_abc.id)
storage.new(message_abc2)
storage.save()
sleep_after_operation(3)

convo_abc.update_last_message_id(message_abc2.id)
convo_abc.save()
sleep_after_operation(3)

message_abc3 = Message(message_text="Hey, I'm doing well too!", sender_id=user3.id, conversation_id=convo_abc.id)
storage.new(message_abc3)
storage.save()
sleep_after_operation(3)

convo_abc.update_last_message_id(message_abc3.id)
convo_abc.save()
sleep_after_operation(3)

# Group conversation with dave, eve, and alice
convo_ade = Conversation(name="Work Team")
convo_ade.is_group()
storage.new(convo_ade)
storage.save()
sleep_after_operation(3)

user1.conversations.append(convo_ade)
user4.conversations.append(convo_ade)
user5.conversations.append(convo_ade)
storage.save()
sleep_after_operation(3)

message_ade1 = Message(message_text="Hi team, let's discuss the new project.", sender_id=user1.id, conversation_id=convo_ade.id)
storage.new(message_ade1)
storage.save()
sleep_after_operation(3)

convo_ade.update_last_message_id(message_ade1.id)
convo_ade.save()
sleep_after_operation(3)

message_ade2 = Message(message_text="Sure Alice, I have some ideas.", sender_id=user4.id, conversation_id=convo_ade.id)
storage.new(message_ade2)
storage.save()
sleep_after_operation(3)

convo_ade.update_last_message_id(message_ade2.id)
convo_ade.save()
sleep_after_operation(3)

message_ade3 = Message(message_text="I'm in as well😎. Looking forward to it!", sender_id=user5.id, conversation_id=convo_ade.id)
storage.new(message_ade3)
storage.save()
sleep_after_operation(3)

convo_ade.update_last_message_id(message_ade3.id)
convo_ade.save()
sleep_after_operation(3)