#!/usr/bin/python3

from server.models.base_model import BaseModel, Base
from sqlalchemy import Column, String, DateTime, ForeignKey, Text

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


class Message(BaseModel, Base):
    __tablename__ = 'messages'
    
    conversation_id = Column(String(60), ForeignKey('conversations.id'), nullable=False)
    message_type = Column(String(60), default='Text', nullable=False)
    message_text = Column(Text, nullable=False)
    sender_id = Column(String(60), ForeignKey('users.id'), nullable=False)
    status = Column(String(60), default=MessageStatus.sent, nullable=False)

    def __init__(self, *args, **kwargs):
        """initializes city"""
        super().__init__(*args, **kwargs)

