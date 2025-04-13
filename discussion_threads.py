from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db
from sqlalchemy import text

thread_bp = Blueprint('thread', __name__)

def get_next_thread_id():
    """Get the next available ThreadID for a new thread."""
    result = db.session.execute(text("SELECT MAX(ThreadID) FROM DiscussionThread"))
    max_id = result.scalar()
    
    return 1 if max_id is None else max_id + 1

@thread_bp.route('/forums/<int:forum_id>/threads', methods=['POST'])
@jwt_required()
def create_thread(forum_id):
    data = request.get_json()

    thread_id = get_next_thread_id()
    
    sql = text("""
        INSERT INTO DiscussionThread (ThreadID, ForumID, Title, Post)
        VALUES (:thread_id, :forum_id, :title, :post)
    """)
    
    db.session.execute(sql, {
        'thread_id': thread_id,
        'forum_id': forum_id,
        'title': data['title'],
        'post': data['post']
    })
    
    db.session.commit()
    return jsonify({'message': 'Thread created successfully', 'thread_id': thread_id}), 201

@thread_bp.route('/forums/<int:forum_id>/threads', methods=['GET'])
def get_forum_threads(forum_id):
    sql = text("""
        SELECT * FROM DiscussionThread 
        WHERE ForumID = :forum_id
        ORDER BY CreationDate DESC
    """)
    result = db.session.execute(sql, {'forum_id': forum_id})
    threads = result.mappings().all()
    return jsonify([dict(thread) for thread in threads]), 200

@thread_bp.route('/threads/<int:thread_id>/replies', methods=['POST'])
@jwt_required()
def add_reply(thread_id):
    data = request.get_json()

    result = db.session.execute(text("SELECT COALESCE(MAX(ReplyID), 0) + 1 FROM Reply"))
    next_id = result.scalar()

    sql = text("""
        INSERT INTO Reply (ReplyID, ThreadID, Reply, ReplyTo)
        VALUES (:reply_id, :thread_id, :reply, :reply_to)
    """)
    
    db.session.execute(sql, {
        'reply_id': next_id,
        'thread_id': thread_id,
        'reply': data['reply'],
        'reply_to': data.get('reply_to')
    })
    
    db.session.commit()
    return jsonify({
        'message': 'Reply added successfully',
        'reply_id': next_id}), 201

@thread_bp.route('/threads/<int:thread_id>/replies', methods=['GET'])
def get_thread_replies(thread_id):
    sql = text("""
        SELECT * FROM Reply
        WHERE ThreadID = :thread_id
        ORDER BY ReplyID
    """)
    result = db.session.execute(sql, {'thread_id': thread_id})
    replies = result.mappings().all()
    return jsonify([dict(reply) for reply in replies]), 200