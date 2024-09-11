#!/usr/bin/python3

from server.models.base_model import BaseModel, Base
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer

"""
Module: messages

Defines the `Messages` class, representing a message between two users.
"""

class MessageStatus:
    sent = 'sent'
    delivered = 'delivered'
    seen = 'seen'
    edited = 'edited'
    unsent = 'unsent'
    # call messages
    rejected = 'rejected'
    missed = 'missed'
    answered = 'answered'
    failed = 'failed'


class MessageType:
    audio = 'audio call'
    text = 'text'
    exit = 'exited'


class Message(BaseModel, Base):
    __tablename__ = 'messages'
    
    conversation_id = Column(String(60), ForeignKey('conversations.id'), nullable=False)
    message_type = Column(String(60), default=MessageType.text, nullable=False)
    message_text = Column(Text, nullable=True)
    sender_id = Column(String(60), ForeignKey('users.id'), nullable=False)
    duration = Column(Integer, nullable=True) #available to call message
    status = Column(String(60), default=MessageStatus.sent, nullable=False)

    def __init__(self, *args, **kwargs):
        """initializes city"""
        super().__init__(*args, **kwargs)


    def is_audio(self):
        self.message_type = MessageType.audio

    def update_text(self, text):
        self.message_text = text

    def update_call_message(self, message_type):
        if message_type == "r":
            self.message_type = MessageStatus.rejected
        elif message_type == "m":
            self.message_type = MessageStatus.missed
        elif message_type == "a":
            self.message_type = MessageStatus.answered
        elif message_type == "f":
            self.message_type = MessageStatus.failed
        else:
            self.message_type = "unknown"
