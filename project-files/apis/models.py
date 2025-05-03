import mysql.connector
from flask import Flask, request, jsonify
import datetime

def get_db_connection():
    return mysql.connector.connect(
        host = "localhost",
        user = "vle_admin",
        password = "admin123",
        database = "ourvle"
    )

def create_user(userid, username, password, role):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO user (UserID, Username, Password, Role) VALUES (%s, %s, %s, %s)",
            (userid, username, password, role)
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def get_user_by_userid(userid):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT * FROM user WHERE UserID = %s",
            (userid,)
        )
        user = cursor.fetchone()
        return user
    finally:
        cursor.close()
        conn.close()

def update_user_password(userid, new_password):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE user SET Password = %s WHERE UserID = %s",
            (new_password, userid)
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def delete_user(userid):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "DELETE FROM user WHERE UserID = %s",
            (userid,)
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'pptx', 'txt', 'png', 'jpg', 'jpeg'}   

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def next_id():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT MAX(SubmissionID) FROM Submits")
        max_id = cursor.fetchone()[0]
        return 1 if max_id is None else max_id + 1
    finally:
        cursor.close()
        conn.close()

def next_id_assign():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT MAX(AssignmentID) FROM Assignment")
        max_id = cursor.fetchone()[0]
        return 1 if max_id is None else max_id + 1
    finally:
        cursor.close()
        conn.close()

def standard_response(data=None, message="Success", status_code=200, success=True):
    return jsonify({
        "success": success,
        "message": message,
        "data": data
    }), status_code

def validate_date(date_string):
    try:
        return datetime.datetime.strptime(date_string, '%Y-%m-%d').date()
    except ValueError:
        return None
    
def get_next_thread_id():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT MAX(ThreadID) FROM DiscussionThread")
        max_id = cursor.fetchone()[0]
        return 1 if max_id is None else max_id + 1
    finally:
        cursor.close()
        conn.close()