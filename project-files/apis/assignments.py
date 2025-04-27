from flask import Blueprint, request, jsonify, current_app
import mysql
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
# from db import db
from werkzeug.utils import secure_filename
import os

assignments_bp = Blueprint('assignments', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'pptx', 'txt', 'png', 'jpg', 'jpeg'}   

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db_connection():
    """Create a new database connection."""
    return mysql.connector.connect(
        host="localhost",
        user="vle_admin",
        password="admin123",
        database="ourvle"
    )

def next_id():
    # Get the next available AssignmentID for a new assignment.
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT MAX(AssignmentID) FROM Assignments")
    max_id = cursor.fetchone()[0]
    conn.close()
    return 1 if max_id is None else max_id + 1

@assignments_bp.route('/<string:course_id>/assignments/', methods=['POST'])
@jwt_required()
def create_assignment(course_id):
    current_user_id = get_jwt_identity()
    user_role = get_jwt().get('role')

    if not current_user_id:
        return jsonify({'message': 'User not found'}), 404
    
    if user_role not in ['lecturer', 'admin']:
        return jsonify({'message': 'Access denied. Only lecturers and admins can create assignments.'}), 403

    conn= get_db_connection()
    cursor = conn.cursor()

    # Check if the course exists
    cursor.execute("""
        SELECT 1 FROM Course
        WHERE CourseID = %s
    """, (course_id,))
    course = cursor.fetchone()
    if not course:
        return jsonify({'message': 'Course not found'}), 404

    # Check if the user is a lecturer and teaches the course
    if user_role == 'lecturer':
        cursor.execute("""
            SELECT 1 FROM Teaches
            WHERE LecturerID = (SELECT LecturerID FROM Lecturer WHERE UserID = %s)
            AND CourseID = %s
        """, (current_user_id, course_id))
        teaches = cursor.fetchone()
        if not teaches:
            return jsonify({'message': 'You are not authorized to create assignments for this course'}), 403

    data = request.form
    file = request.files.get('file')
    assignment_id = next_id()

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        assignment_file = file_path
    else:
        assignment_file = None

    assignment_link = data.get('link')

    cursor.execute("""
        INSERT INTO Assignments (AssignmentID, Title, Description, DueDate, CourseID, AssignmentFile, AssignmentLink)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (assignment_id, data['title'], data['description'], data['due_date'], course_id, assignment_file, assignment_link))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Assignment created successfully', 'assignment_id': assignment_id}), 201
    