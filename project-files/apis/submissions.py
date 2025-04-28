from flask import Blueprint, request, jsonify, current_app
import mysql
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
import os

submissions_bp = Blueprint('submissions', __name__)

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
    # Get the next available SubmissionID for a new submission.
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT MAX(SubmissionID) FROM Submits")
    max_id = cursor.fetchone()[0]
    conn.close()
    return 1 if max_id is None else max_id + 1

@submissions_bp.route('/assignments/<int:assignment_id>/submit', methods=['POST'])
@jwt_required()
def submit_assignment(assignment_id):
    current_user_id = get_jwt_identity()  # This is the UserID (e.g., 'USER-100061')
    user_role = get_jwt().get('role')

    if not current_user_id:
        return jsonify({'message': 'User missing'}), 404

    if not assignment_id:
        return jsonify({'message': 'Assignment Missing'}), 404

    if user_role not in ['student']:
        return jsonify({'message': 'Access denied. Only students can submit assignments.'}), 403

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if the assignment exists
    cursor.execute("SELECT AssignmentID FROM Assignment WHERE AssignmentID = %s", (assignment_id,))
    assignment = cursor.fetchone()
    if not assignment:
        return jsonify({'message': 'Assignment not found'}), 404
    
    # Fetch the CourseID from the assignment
    cursor.execute("SELECT AssignmentID, CourseID FROM Assignment WHERE AssignmentID = %s", (assignment_id,))
    assignment = cursor.fetchone()
    if not assignment:
        return jsonify({'message': 'Assignment not found'}), 404
    course_id = assignment[1]

    # Fetch the StudentID using the UserID
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT StudentID FROM Student WHERE UserID = %s", (current_user_id,))
    result = cursor.fetchone()
    if not result:
        return jsonify({'message': 'Student not found'}), 404
    student_id = result[0]  # This is the integer StudentID

    # Check if the student is enrolled in the course
    cursor.execute("SELECT * FROM Enrols WHERE StudentID = %s AND CourseID = %s", (student_id, course_id))
    enrollment = cursor.fetchone()
    if not enrollment:
        return jsonify({'message': 'Student is not enrolled in the course for this assignment'}), 403


    content_type = request.form.get('content_type')
    file = request.files.get('file')
    link = request.form.get('link')

    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    submissions_folder = os.path.join(upload_folder, 'submissions')
    if not os.path.exists(submissions_folder):
        os.makedirs(submissions_folder)

    submission_file = None
    submission_link = None
    submission_id = next_id()

    if content_type == 'file' and file and allowed_file(file.filename):
        filename = f"{student_id}_{secure_filename(file.filename)}"
        filepath = os.path.join(submissions_folder, filename)
        file.save(filepath)
        submission_file = filepath
    if content_type == 'link' and link:
        submission_link = link
    if not submission_file and not submission_link:
        return jsonify({'message': 'No file or link provided'}), 400

    try:
        cursor.execute(
            """
            INSERT INTO Submits 
                (SubmissionID, StudentID, AssignmentID, SubmissionFile, SubmissionLink)
            VALUES 
                (%s, %s, %s, %s, %s)
            """,
            (submission_id, student_id, assignment_id, submission_file, submission_link)
        )
        conn.commit()
        return jsonify({'message': 'Assignment submitted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()
