from fastapi import FastAPI
from peewee import * # type: ignore

print("running app")
app = FastAPI()


db = SqliteDatabase('words.db') # type: ignore

# This hook ensures that a connection is opened to handle any queries
# generated by the request.
@app.on_event("startup")
def startup():
    db.connect()


# This hook ensures that the connection is closed when we've finished
# processing the request.
@app.on_event("shutdown")
def shutdown():
    if not db.is_closed():
        db.close()