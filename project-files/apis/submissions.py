from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from sqlalchemy import text
from werkzeug.utils import secure_filename
import os

submissions_bp = Blueprint('submissions', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'pptx', 'txt', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def next_id():
    """Get the next available SubmissionID for a new submission."""
    result = db.session.execute(text("SELECT MAX(SubmissionID) FROM Submits"))
    max_id = result.scalar()
    return 1 if max_id is None else max_id + 1

@submissions_bp.route('/assignments/<int:assignment_id>/submit/', methods=['POST'])
@jwt_required()
def submit_assignment(assignment_id):
    current_user_id = get_jwt_identity()
    user_role = get_jwt().get('role')

    if not current_user_id:
        return jsonify({'message': 'User not found'}), 404
    
    if not assignment_id:
        return jsonify({'message': 'Assignment not found'}), 404

    if user_role not in ['student']:
        return jsonify({'message': 'Access denied. Only students can submit assignments.'}), 403

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

    if content_type=='file' and file and allowed_file(file.filename):
        filename = f"{current_user_id}_{secure_filename(file.filename)}"
        filepath = os.path.join(submissions_folder, filename)
        file.save(filepath)
        submission_file = filepath
    elif content_type == 'link' and link:
        submission_link = link
    else:
        return jsonify({'message': 'Invalid content type or missing file/link'}), 400

    sql = text("""
        INSERT INTO Submits (SubmissionID, StudentID, AssignmentID, SubmissionFile, SubmissionLink)
        VALUES (:submission_id, :student_id, :assignment_id, :submission_file, :submission_link)
    """)

    db.session.execute(sql, {
        'submission_id': submission_id,
        'student_id': current_user_id,
        'assignment_id': assignment_id,
        'submission_file': submission_file,
        'submission_link': submission_link
    })
    db.session.commit()

    return jsonify({'message': 'Assignment submitted successfully'}), 200
    