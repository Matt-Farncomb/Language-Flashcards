from fastapi import FastAPI
from peewee import * # type: ignore
import os

app = FastAPI()

db = SqliteDatabase('people.db') # type: ignore
