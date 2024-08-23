#!/usr/bin/python3

"""
    Module: db_storage

    This module implements the New engine DBStorage, which facilitates the
    stoorage of data into database.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from os import getenv
from models.base_model import BaseModel, Base
from models.conversation import Conversation
from models.message import Message
from models.user import User


class DBStorage:
    __session = None
    __engine = None

    def __init__(self):
        """
        Instantiate a DBStorage object
        """
        username = getenv('DB_USERNAME')
        password = getenv('DB_PASSWORD')
        database = getenv('DATABASE_NAME')
        host = getenv('HOST')

        db_url = 'mysql+mysqldb://{}:{}@{}/{}'.format(username, password, host, database)
        self.__engine = create_engine(db_url, pool_pre_ping=True)
    
    def reload(self):
        """
        Reloads data from the database and creates all tables in the database.
        """
        Base.metadata.create_all(self.__engine)
        Session = scoped_session(sessionmaker(bind=self.__engine, expire_on_commit=False))
        self.__session = Session

    def all(self, cls=None):
        """
        query on the current database session
        """
        tables = []
        obj_dict = {}
        if cls is None:
            tables = [Users, Messages, Conversations]
        else:
            tables.append(cls)

        for table in tables:
            objs = self.__session.query(table).all()
            for obj in objs:
                key = '{}.{}'.format(obj.__class__.__name__, obj.id)
                obj_dict[key] = obj
        return obj_dict

    def new(self, obj):
        """
        add the object to the current database session
        """
        self.__session.add(obj)

    def delete(self, obj):
        """
        Deletes the object from the current database session if not None.
        """
        self.__session.delete(obj)
        self.save()

    def save(self):
        """
        commit all changes of the current database session
        """
        self.__session.commit()
        
    def close(self):
        """
        call close() method on the private session attribute (self.__session)
        """
        self.__session.close()

    def get_session(self):
        """
        Get current session object
        """
        return self.__session
