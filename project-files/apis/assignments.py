from flask import Blueprint, request, jsonify, current_app
import mysql
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
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
    cursor.execute("SELECT MAX(AssignmentID) FROM Assignment")
    max_id = cursor.fetchone()[0]
    conn.close()
    return 1 if max_id is None else max_id + 1

@assignments_bp.route('/<string:course_id>/assignments', methods=['POST'])
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
    link = request.form.get('link')

    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    assignments_folder = os.path.join(upload_folder, 'assignments')
    if not os.path.exists(assignments_folder):
        os.makedirs(assignments_folder)

    assignment_file = None
    assignment_link = None
    assignment_id = next_id()


    # Handle file upload if provided
    if file and allowed_file(file.filename):
        filename = f"{assignment_id}_{secure_filename(file.filename)}"
        filepath = os.path.join(assignments_folder, filename)
        file.save(filepath)
        assignment_file = filepath
    # Handle link if provided
    if link:
        assignment_link = link
    
    if not assignment_file and not assignment_link:
        return jsonify({'message': 'Either a file or a link must be provided.'}), 400

    try:
        cursor.execute("""
            INSERT INTO Assignment (AssignmentID, AssignmentName, DueDate, CourseID, AssignmentFile, AssignmentLink)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (assignment_id, data['assignment_name'], data['due_date'], course_id, assignment_file, assignment_link))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Assignment created successfully', 'assignment_id': assignment_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'message': 'Error creating assignment', 'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()