#!/usr/bin/python3

from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey

"""
Module: contact

Defines the `contacts` class, representing a contact between two users.
"""

class Status:
    """
    A class defining the status options for a contact.
    """

    requested = "requested"
    blocked = "blocked"
    accepted = "accepted"
    pending = "pending"


class Contact(BaseModel, Base):
    """
    A model representing a contact entry associated with a user.
    """
    __tablename__ = 'contacts'

    user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
    contact_id = Column(String(60), nullable=False)
    contact_name = Column(String(60), nullable=False)
    status = Column(String(60), default=Status.requested)

    def __init__(self, *args, **kwargs):
        """initializes city"""
        super().__init__(*args, **kwargs)

    def update_status(self, status):
        """
        update contact status
        """
        self.status = status
        self.save()
