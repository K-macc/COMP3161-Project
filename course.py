from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from sqlalchemy import text

course = Blueprint('course', __name__)

@course.route('/create', methods=['POST'])
@jwt_required()  # Ensure user is authenticated
def create_course():
    # Get the current user's identity (UserID) from 'sub'
    current_user_id = get_jwt_identity()  # This returns the 'sub' field (UserID)
    
    # Get the current user's role from the additional claims
    current_user_role = get_jwt().get('role')  # This retrieves the 'role' field from claims

    # Debugging: print current_user_id and current_user_role
    print("Current User ID:", current_user_id)
    print("Current User Role:", current_user_role)
    
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
    db.session.execute(insert_sql, {'courseid': data['CourseID'], 'coursename': data['CourseName']})
    db.session.commit()

    return jsonify({'message': 'Course created successfully'}), 201

@course.route('/<string:course_id>', methods=['GET'])
def get_course(course_id):
    # Query the course by CourseID
    sql = text("SELECT * FROM course WHERE CourseID = :courseid")
    result = db.session.execute(sql, {'courseid': course_id})
    course = result.mappings().fetchone()  # Use mappings() to get a dictionary-like result

    # Check if course exists or not
    if not course:
        return jsonify({'message': 'Course not found'}), 404

    return jsonify({
        'CourseID': course['CourseID'],
        'CourseName': course['CourseName'],
    }), 200

@course.route('/register', methods=['POST'])
@jwt_required()
def register_student():
    current_user_id = get_jwt_identity()  # Get UserID from JWT
    print("Current User ID:", current_user_id)  # Debugging

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
