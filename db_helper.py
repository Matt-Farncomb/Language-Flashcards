from app import db
from models import *

def some_db_shit():
    db.connect()
    db.create_tables([User])
    uncle_bob = User(name='Bob')
    uncle_bob.save()
    grandma = User.get(User.name =='Bob')
    print(grandma.name)
    db.close()
