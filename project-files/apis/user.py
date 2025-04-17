from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, create_access_token, jwt_required
from sqlalchemy import text
from models import create_user, get_user_by_userid
from db import db

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or 'name' not in data or 'username' not in data or 'password' not in data or 'role' not in data:
        return jsonify({'message': 'Missing required fields'}), 400

    name = data['name']
    password = data['password']
    username = data['username']
    role = data['role']

    sql = text("SELECT MAX(UserID) FROM user")
    result = db.session.execute(sql)
    result_int = result.fetchone()[0].split("-")
    result_int[1] = int(result_int[1]) + 1
    result_int[1] = str(result_int[1])
    user_id = "-".join(result_int)

    # Determine email based on role
    email = ""
    if role == "student":
        email = f"{username}@mymona.uwi.edu"
    elif role == "lecturer":
        email = f"{username}@uwimona.edu"
    elif role == "admin":
        email = f"{username}@admin.uwi"

    try:
        existing_user = get_user_by_userid(user_id)
        if existing_user:
            return jsonify({'message': 'User already exists'}), 400

        create_user(user_id, username, password, role)

        if role == "student":
            check_student_sql = text("SELECT * FROM Student WHERE UserID = :userid")
            student_result = db.session.execute(check_student_sql, {'userid': user_id}).fetchone()

            if not student_result:
                last_student_id = db.session.execute(text("SELECT MAX(StudentID) FROM Student")).fetchone()[0] or 0
                new_student_id = last_student_id + 1

                insert_student_sql = text(
                    "INSERT INTO Student (StudentID, UserID, StudentName, Email) VALUES (:studentid, :userid, :studentname, :email)"
                )
                db.session.execute(insert_student_sql, {
                    'studentid': new_student_id,
                    'userid': user_id,
                    'studentname': name,
                    'email': email
                })
                db.session.commit()

        elif role == "lecturer":
            check_lecturer_sql = text("SELECT * FROM Lecturer WHERE UserID = :userid")
            lecturer_result = db.session.execute(check_lecturer_sql, {'userid': user_id}).fetchone()

            if not lecturer_result:
                last_lecturer_id = db.session.execute(text("SELECT MAX(LecturerID) FROM Lecturer")).fetchone()[0] or 0
                new_lecturer_id = last_lecturer_id + 1

                insert_lecturer_sql = text(
                    "INSERT INTO Lecturer (LecturerID, UserID, LecturerName, Email) VALUES (:lecturerid, :userid, :lecturername, :email)"
                )
                db.session.execute(insert_lecturer_sql, {
                    'lecturerid': new_lecturer_id,
                    'userid': user_id,
                    'lecturername': name,
                    'email': email
                })
                db.session.commit()

        else:
            check_admin_sql = text("SELECT * FROM Admin WHERE UserID = :userid")
            admin_result = db.session.execute(check_admin_sql, {'userid': user_id}).fetchone()

            if not admin_result:
                last_admin_id = db.session.execute(text("SELECT MAX(AdminID) FROM Admin")).fetchone()[0] or 0
                new_admin_id = last_admin_id + 1

                insert_admin_sql = text(
                    "INSERT INTO Admin (AdminID, UserID, AdminName, Email) VALUES (:adminid, :userid, :adminname, :email)"
                )
                db.session.execute(insert_admin_sql, {
                    'adminid': new_admin_id,
                    'userid': user_id,
                    'adminname': name,
                    'email': email
                })
                db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500


@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Check if both 'UserID' and 'Password' are present in the request
    if not data or 'user_id' not in data or 'password' not in data:
        return jsonify({'message': 'Missing required fields'}), 400
    
    sql = text("SELECT * FROM user WHERE UserID = :UserID")
    result = db.session.execute(sql, {'UserID': data['user_id']})
    
    user = result.fetchone()

    if not user:
        return jsonify({'message': 'Invalid User ID'}), 404

    # Convert the result to a dictionary using column names for easier access
    user_dict = dict(zip(result.keys(), user))

    # Check if the password matches
    if user_dict['Password'] != data['password']:
        return jsonify({'message': 'Invalid Password'}), 401

    access_token = create_access_token(identity=user_dict['UserID'], additional_claims={'role': user_dict['Role']})

    return jsonify({
        'message': 'Login successful',
        'access_token': access_token
    }), 200

@auth.route('/protected', methods=['GET'])
@jwt_required() 
def protected():
    user_id = get_jwt_identity()  
    claims = get_jwt()  
    user_role = claims.get('role')

    return jsonify({
        'user_id': user_id,
        'role': user_role
    })
    