from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from sqlalchemy import text

course = Blueprint('course', __name__)

@course.route('/create', methods=['POST'])
@jwt_required()  # Ensure user is authenticated
def create_course():    
    # Get the current user's role from the additional claims
    current_user_role = get_jwt().get('role')  # This retrieves the 'role' field from claims

    
    # Check if the current user is an admin
    if current_user_role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    # Get the data from the request (course details)
    data = request.get_json()
    if not data or 'CourseID' not in data or 'CourseName' not in data:
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if the course already exists
    sql = text("SELECT * FROM course WHERE CourseID = :courseid OR CourseName = :coursename")
    result = db.session.execute(sql, {'courseid': data['CourseID'], 'coursename': data['CourseName']})
    course = result.fetchone()

    if course:
        return jsonify({'message': 'Course already exists'}), 400

    # Insert the new course
    insert_sql = text("INSERT INTO course (CourseID, CourseName) VALUES (:courseid, :coursename)")
    try:
        db.session.execute(insert_sql, {'courseid': data['CourseID'], 'coursename': data['CourseName']})
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error creating course: {str(e)}'}), 500

    return jsonify({'message': 'Course created successfully'}), 201



@course.route('/register', methods=['POST'])
@jwt_required()
def register_student():
    current_user_id = get_jwt_identity()  # Get UserID from JWT

    if not current_user_id:
        return jsonify({'message': 'Invalid user identity format'}), 400

    try:
        # Retrieve the student's StudentID using UserID
        get_student_sql = text("SELECT StudentID FROM Student WHERE UserID = :userid")
        student_result = db.session.execute(get_student_sql, {'userid': current_user_id}).fetchone()

        if not student_result:
            return jsonify({'message': 'Student not found'}), 404  # Shouldn't happen if registration was done correctly

        student_id = student_result[0]  # Extract StudentID

        # Get CourseID from request
        data = request.get_json()
        if not data or 'CourseID' not in data:
            return jsonify({'message': 'Missing CourseID'}), 400
        course_id = data['CourseID']

        # Check if course exists
        check_course_sql = text("SELECT * FROM Course WHERE CourseID = :courseid")
        course_result = db.session.execute(check_course_sql, {'courseid': course_id}).fetchone()
        if not course_result:
            return jsonify({'message': 'Course not found'}), 404

        # Check if student is already enrolled
        check_enrolment_sql = text("SELECT * FROM Enrols WHERE StudentID = :studentid AND CourseID = :courseid")
        enrolment_result = db.session.execute(check_enrolment_sql, {'studentid': student_id, 'courseid': course_id}).fetchone()

        if enrolment_result:
            return jsonify({'message': 'Already enrolled in this course'}), 400

        # Register student in course
        insert_sql = text("INSERT INTO Enrols (StudentID, CourseID) VALUES (:studentid, :courseid)")
        db.session.execute(insert_sql, {'studentid': student_id, 'courseid': course_id})
        db.session.commit()

        return jsonify({'message': 'Successfully enrolled in the course'}), 201

    except Exception as e:
        db.session.rollback()  # Rollback in case of an error
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500


@course.route('/<string:course_id>', methods=['GET'])
def get_members(course_id):
    try:
        # Query the course by CourseID
        sql = text("SELECT s.StudentID, s.StudentName FROM student s JOIN enrols e ON s.StudentID = e.StudentID WHERE CourseID = :courseid")
        result = db.session.execute(sql, {'courseid': course_id})
        members = result.mappings().fetchall()  # Use mappings() to get a dictionary-like result
        member_list = []

        # Check if course exists or not
        if not members:
            return jsonify({'message': 'Members not found'}), 404

        for member in members:
            member_list.append({
                'StudentID': member['StudentID'],
                'StudentName': member['StudentName'],
            })
        return jsonify({"members": member_list}), 200
    except Exception as e:
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

@course.route('/get_courses', methods=['GET'])
def get_courses():

    sql = text("SELECT * FROM course ORDER BY CourseID")
    result = db.session.execute(sql)
    courses = result.mappings().fetchall()

    return jsonify([
        {
            'CourseID': course['CourseID'],
            'CourseName': course['CourseName'],
        }
        for course in courses
    ]), 200

@course.route('/student/<int:student_id>', methods=['GET'])
def get_student_courses(student_id):
    sql = text("""
        SELECT s.StudentID, s.StudentName, c.CourseID, c.CourseName
        FROM student s
        JOIN enrols e ON s.StudentID = e.StudentID
        JOIN course c ON e.CourseID = c.CourseID
        WHERE s.StudentID = :student_id
    """)
    result = db.session.execute(sql, {'student_id': student_id})
    courses = result.mappings().fetchall()

    if not courses:
        return jsonify({'message': 'No courses found for this student'}), 404
    
    

    student_info = {
        'StudentID': courses[0]['StudentID'],
        'StudentName': courses[0]['StudentName'],
        'Courses': [
            {
                'CourseID': course['CourseID'],
                'CourseName': course['CourseName']
            }
            for course in courses
        ]
    }

    return jsonify({"student_courses": student_info}), 200

@course.route('/lecturer/<int:lecturer_id>', methods=['GET'])
def get_lecturer_courses(lecturer_id):
    sql = text("""
        SELECT l.LecturerID, l.LecturerName, c.CourseID, c.CourseName
        FROM lecturer l
        JOIN teaches t ON l.LecturerID = t.LecturerID
        JOIN course c ON t.CourseID = c.CourseID
        WHERE l.LecturerID = :lecturer_id
    """)
    result = db.session.execute(sql, {'lecturer_id': lecturer_id})
    courses = result.mappings().fetchall()

    if not courses:
        return jsonify({'message': 'No courses found for this lecturer'}), 404

    lecturer_info = {
        'LecturerID': courses[0]['LecturerID'],
        'LecturerName': courses[0]['LecturerName'],
        'Courses': [
            {
                'CourseID': course['CourseID'],
                'CourseName': course['CourseName']
            }
            for course in courses
        ]
    }

    return jsonify({"lecturer_info": lecturer_info}), 200

@course.route('/specific-courses', methods=['GET'])
@jwt_required()
def get_lecturer_login_courses():
    current_user_id = get_jwt_identity()  # Get UserID from JWT
    current_user_role = get_jwt().get('role')  # Get role from JWT
    
    
    if current_user_role == 'lecturer':
        sql = text("""
        SELECT l.LecturerID, l.LecturerName, c.CourseID, c.CourseName
        FROM lecturer l
        JOIN teaches t ON l.LecturerID = t.LecturerID
        JOIN course c ON t.CourseID = c.CourseID
        WHERE l.UserID = :user_id
        """)
        result = db.session.execute(sql, {'user_id': current_user_id})
        courses = result.mappings().fetchall()

        if not courses:
            return jsonify({'courses': 'No courses found for this lecturer.'})

        lecturer_courses = [
            {
                'CourseID': course['CourseID'],
                'CourseName': course['CourseName']
            }
            for course in courses
        ]

        return jsonify({"courses": lecturer_courses}), 200
    elif current_user_role == 'student':
        sql = text("""
        SELECT s.StudentID, s.StudentName, c.CourseID, c.CourseName
        FROM student s
        JOIN enrols e ON s.StudentID = e.StudentID
        JOIN course c ON e.CourseID = c.CourseID
        WHERE s.UserID = :user_id
        """)
        result = db.session.execute(sql, {'user_id': current_user_id})
        courses = result.mappings().fetchall()

        if not courses:
            return jsonify({'courses': 'No courses found for this student.'})

        student_courses = [
            {
                'CourseID': course['CourseID'],
                'CourseName': course['CourseName']
            }
            for course in courses
        ]

        return jsonify({"courses": student_courses}), 200
    else:
        return jsonify({'courses': 'No courses found.'})

