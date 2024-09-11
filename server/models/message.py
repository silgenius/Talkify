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


class MessageType:
    audio = 'audio call'
    text = 'text'


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
