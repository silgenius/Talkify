#!/usr/bin/python3

"""
    Module: BaseModel

    This module contains the BaseModel class, which serves as a
    foundation for other classes by defining common attributes
    and methods.
"""

import uuid
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, DateTime


Base = declarative_base()

class BaseModel:
    """
    BaseModel class defines common attributes/methods for other classes.
    """
    id = Column(String(60), primary_key=True, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __init__(self, *args, **kwargs):
        if kwargs:
            for key, value in kwargs.items():
                setattr(self, key, value)
                
        self.id = str(uuid.uuid4())
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def __str__(self):
       """
       Returns a string representation of the BaseModel instance.
       """

       return "[{}] ({}) {}".format(self.__class__.__name__,
                                    self.id, self.__dict__)
       
    def to_dict(self):
       """
       Returns a dictionary containing all keys/values of the instance.
       """
       new_dict = self.__dict__.copy()
       new_dict.update({"__class__": self.__class__.__name__})
       new_dict['created_at'] = self.created_at.isoformat()
       new_dict['updated_at'] = self.updated_at.isoformat()
       if new_dict.get('last_login'):
           new_dict['last_login'] = self.last_login.isoformat()
       if new_dict.get('_sa_instance_state'):
           new_dict.pop('_sa_instance_state')
       if new_dict.get('messages'):
            new_dict.pop('messages')
       return new_dict

    def save(self):
        from . import storage

        updated_at = datetime.now()
        storage.save()
