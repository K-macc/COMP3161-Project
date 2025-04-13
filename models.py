from db import db  # Import db instance from db.py
from sqlalchemy import text

def create_user(userid, username, password, role):
    sql = text("INSERT INTO user (UserID, Username, Password, Role) VALUES (:userid, :username, :password, :role)")
    db.session.execute(sql, {'userid': userid, 'username': username, 'password': password, 'role': role})
    db.session.commit()

def get_user_by_userid(userid):
    sql = text("SELECT * FROM user WHERE UserID = :userid")
    result = db.session.execute(sql, {'userid': userid})
    user = result.fetchone()  # Fetch the first matching record
    return user

def update_user_password(userid, new_password):
    sql = text("UPDATE user SET Password = :password WHERE UserID = :userid")
    db.session.execute(sql, {'userid': userid, 'password': new_password})
    db.session.commit()

def delete_user(userid):
    sql = text("DELETE FROM user WHERE UserID = :userid")
    db.session.execute(sql, {'userid': userid})
    db.session.commit()
