#!/usr/bin/python3

from server.models.base_model import BaseModel, Base
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Table, ForeignKey
from sqlalchemy.orm import relationship


"""
Module: users

Defines the `Users` class, which represents a user with attributes for username, email, profile URL, 
and last login time.
"""

user_conversation = Table('user_conversation',
                        Base.metadata,
                        Column('user_id',
                            String(60),
                            ForeignKey('users.id',
                                ondelete='CASCADE'),
                            primary_key=True),
                        Column('conversation_id',
                            String(60),
                            ForeignKey('conversations.id',
                                ondelete='CASCADE'),
                            primary_key=True))

class User(BaseModel, Base):
    """
    Represents a user in the system.
    """
    __tablename__ = 'users'

    username = Column(String(60), nullable=False)
    email = Column(String(60), nullable=False)
    profile_url = Column(String(200), nullable=True)
    last_login= Column(DateTime, nullable=False)
    bio = Column(String(300), nullable=True)
    conversations = relationship('Conversation', secondary=user_conversation, back_populates='users', viewonly=False)
    messages = relationship('Message', backref='user', cascade='all, delete, delete-orphan')
    contacts = relationship('Contact', backref='user', cascade='all, delete, delete-orphan')
    notifications = relationship('Notification', backref='user', cascade='all, delete, delete-orphan')

    def __init__(self, *args, **kwargs):
        """initializes city"""
        super().__init__(*args, **kwargs)

    def update_last_login(self):
        """
        Updates the last_login attribute to the current date and time.
        """
        self.last_login = datetime.now()

    def mini_data(self, bio=False):
        """
        Get user data
        """
        user_data = {}
        user_data['id'] = self.id
        if bio:
            if not self.bio:
                user_data['bio'] = ""
            else:
                user_data['bio'] = self.bio
        user_data['username'] = self.username
        user_data['last_login'] = self.last_login.isoformat()
        user_data['profile_url'] = self.profile_url

        return user_data

    def set_bio(self, bio):
        """
        set user's bio
        """
        self.bio = bio
