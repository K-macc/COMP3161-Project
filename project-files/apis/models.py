import mysql.connector

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
