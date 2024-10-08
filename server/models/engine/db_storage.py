#!/usr/bin/python3

"""
    Module: db_storage

    This module implements the New engine DBStorage, which facilitates the
    stoorage of data into database.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from os import getenv
from server.models.base_model import BaseModel, Base
from server.models.conversation import Conversation
from server.models.message import Message
from server.models.user import User
from server.models.contact import Contact
from server.models.notification import Notification
from dotenv import load_dotenv

load_dotenv()

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

        db_url = 'mysql+mysqldb://{}:{}@{}/{}?charset=utf8mb4'.format(username, password, host, database)
        self.__engine = create_engine(
                db_url,
                pool_size=20,
                max_overflow=40,
                pool_timeout=60,
                pool_recycle=1800,
                pool_pre_ping=True)
    
    def reload(self):
        """
        Reloads data from the database and creates all tables in the database.
        """
        Base.metadata.create_all(self.__engine)
        Session = scoped_session(sessionmaker(bind=self.__engine, expire_on_commit=False))
        self.__session = Session

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
        try:
            self.__session.commit()
        except Exception as e:
            self.__sesson.rollback()
            raise e
        
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
