#!/usr/bin/python3

from server.models.base_model import BaseModel, Base
from sqlalchemy import Column, String, DateTime, Table, ForeignKey, Boolean


"""
Module: notification

Defines the `Notification` class, representing a user notifications.
Inherits from `BaseModel`.
"""

class NotificationType:
    message = 'message'
    request = 'friend_request'
    call = 'call'


class Notification(BaseModel, Base):
    """
    Represents a user notifications
    """
    __tablename__ = 'notifications'

    user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
    notification_type = Column(String(60), default=NotificationType.message)
    source_id = Column(String(60), nullable=False)
    is_read = Column(Boolean, default=False)

    def __init__(self, *args, **kwargs):
        """initializes city"""
        super().__init__(*args, **kwargs)
