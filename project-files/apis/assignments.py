from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from sqlalchemy import text
from werkzeug.utils import secure_filename
import os

assignments_bp = Blueprint('assignments', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'pptx', 'txt', 'png', 'jpg', 'jpeg'}   

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def next_id():
    """Get the next available AssignmentID for a new assignment."""
    result = db.session.execute(text("SELECT MAX(SubmissionID) FROM Submits"))
    max_id = result.scalar()
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

    sql = text("""
        INSERT INTO Assignments (AssignmentID, Title, Description, DueDate, CourseID, AssignmentFile, AssignmentLink)
        VALUES (:assignment_id, :title, :description, :due_date, :course_id, :assignment_file, :assignment_link)
    """)

    db.session.execute(sql, {
        'assignment_id': assignment_id,
        'title': data['title'],
        'description': data['description'],
        'due_date': data['due_date'],
        'course_id': course_id,
        'assignment_file': assignment_file,
        'assignment_link': assignment_link
    })

    db.session.commit()
    return jsonify({'message': 'Assignment created successfully', 'assignment_id': assignment_id}), 201