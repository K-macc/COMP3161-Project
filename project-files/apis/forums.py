from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from sqlalchemy import text

forum_bp = Blueprint('forum', __name__)

@forum_bp.route('/courses/<course_id>/forums', methods=['POST'])
@jwt_required()
def create_forum(course_id):
    current_user_id = get_jwt_identity()
    user_role = get_jwt().get('role')
    
    if user_role == 'lecturer':
        sql = text("""
            SELECT 1 FROM Teaches 
            WHERE LecturerID = (SELECT LecturerID FROM Lecturer WHERE UserID = :user_id)
            AND CourseID = :course_id
        """)
        result = db.session.execute(sql, {'user_id': current_user_id, 'course_id': course_id})
        if not result.fetchone():
            return jsonify({'message': 'Not authorized to create forums for this course'}), 403
    elif user_role != 'admin':
        return jsonify({'message': 'Admin or lecturer access required'}), 403

    data = request.get_json()
    if not data or 'subject' not in data or not data['subject'].strip():
        return jsonify({'message': 'Forum subject is required'}), 400

    try:
        result = db.session.execute(
            text("SELECT COALESCE(MAX(ForumID), 0) + 1 FROM DiscussionForum")
        )
        next_id = result.scalar()

        sql = text("""
            INSERT INTO DiscussionForum (ForumID, CourseID, Subject)
            VALUES (:forum_id, :course_id, :subject)
        """)
        
        db.session.execute(sql, {
            'forum_id': next_id,
            'course_id': course_id,
            'subject': data['subject'].strip()
        })
        
        db.session.commit()
        return jsonify({'message': 'Forum created successfully', 'forum_id': next_id}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error creating forum: {str(e)}'}), 500

@forum_bp.route('/courses/<course_id>/forums', methods=['GET'])
def get_course_forums(course_id):
    sql = text("""
        SELECT * FROM DiscussionForum 
        WHERE CourseID = :course_id
        ORDER BY DateCreated DESC
    """)
    result = db.session.execute(sql, {'course_id': course_id})
    forums = result.mappings().all()
    return jsonify([dict(forum) for forum in forums]), 200