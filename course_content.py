from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from sqlalchemy import text
from werkzeug.utils import secure_filename
import os

content_bp = Blueprint('content', __name__)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'pptx', 'txt', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@content_bp.route('/section/<int:section_id>/content', methods=['POST'])
@jwt_required()
def upload_section_content(section_id):
    current_user_id = get_jwt_identity()
    user_role = get_jwt().get('role')

    if user_role not in ['lecturer', 'admin']:
        return jsonify({'message': 'Access denied. Only lecturers and admins can upload content.'}), 403

    content_type = request.form.get('content_type')
    title = request.form.get('title', 'Unnamed Content')
    file = request.files.get('file')
    link = request.form.get('link')

    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    update_column = None
    update_value = None

    if content_type == 'slides' and file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        update_column = 'LectureSlides'
        update_value = filepath

    elif content_type == 'file' and file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        update_column = 'Files'
        update_value = filepath

    elif content_type == 'link' and link:
        update_column = 'Links'
        update_value = link

    else:
        return jsonify({'message': 'Invalid content type or missing file/link'}), 400

    sql = text(f"""
        UPDATE Section SET {update_column} = :value
        WHERE SectionID = :section_id
    """)
    db.session.execute(sql, {'value': update_value, 'section_id': section_id})
    db.session.commit()

    return jsonify({'message': f'{content_type.capitalize()} uploaded to section {section_id}'}), 200

# Retrieves all content for a specific section
@content_bp.route('/section/<int:section_id>/content', methods=['GET'])
def get_section_content(section_id):
    sql = text("""
        SELECT LectureSlides, Files, Links
        FROM Section
        WHERE SectionID = :sid
    """)
    result = db.session.execute(sql, {'sid': section_id}).mappings().first()

    if not result:
        return jsonify({'message': 'Section not found'}), 404

    return jsonify(dict(result)), 200
