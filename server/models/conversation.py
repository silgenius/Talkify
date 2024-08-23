#!/usr/bin/python3

from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

"""
Module: conversations

Defines the `Conversations` class, representing a conversation between two users.
Inherits from `BaseModel`.
"""


class Conversation(BaseModel, Base):
    """
    Represents a conversation between two users.
    """
    __tablename__ = 'conversations'

    name = Column(String(60), nullable=True)
    group = Column(Boolean, default=False)
    last_message_id = Column(String(60), nullable=True)
    messages = relationship('Message', backref='conversation', cascade='all, delete, delete-orphan')

    def __init__(self, *args, **kwargs):
        """initializes city"""
        super().__init__(*args, **kwargs)

    def update_last_message_id(self, message_id):
        self.last_message_id = message_id

    def is_group(self):
        self.group = True
