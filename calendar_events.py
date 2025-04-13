from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from sqlalchemy import text
import datetime

calendar_bp = Blueprint('calendar', __name__)

def standard_response(data=None, message="Success", status_code=200, success=True):
    """Standardized response format for all endpoints"""
    return jsonify({
        "success": success,
        "message": message,
        "data": data
    }), status_code

def validate_date(date_string):
    """Validate date format (YYYY-MM-DD)"""
    try:
        return datetime.datetime.strptime(date_string, '%Y-%m-%d').date()
    except ValueError:
        return None

@calendar_bp.route('/courses/<course_id>/events', methods=['POST'])
@jwt_required()
def create_event(course_id):
    current_user_id = get_jwt_identity()
    user_role = get_jwt().get('role')
    
    # Authorization check
    if user_role == 'lecturer':
        sql = text("""
            SELECT 1 FROM Teaches 
            WHERE LecturerID = (SELECT LecturerID FROM Lecturer WHERE UserID = :user_id)
            AND CourseID = :course_id
        """)
        result = db.session.execute(sql, {'user_id': current_user_id, 'course_id': course_id})
        if not result.fetchone():
            return jsonify({'message': 'Not authorized to create events for this course'}), 403
    elif user_role != 'admin':
        return jsonify({'message': 'Admin or lecturer access required'}), 403

    data = request.get_json()
    
    required_fields = ['title', 'description', 'event_date']
    if not all(key in data for key in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        max_id_result = db.session.execute(text("""
            SELECT COALESCE(MAX(CalendarID), 0) FROM CalendarEvent
        """))
        max_id = max_id_result.scalar()
        new_id = max_id + 1

        try:
            event_date = datetime.datetime.fromisoformat(data['event_date'])
        except ValueError:
            return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

        sql = text("""
            INSERT INTO CalendarEvent 
            (CalendarID, CourseID, EventTitle, EventDescription, EventDate)
            VALUES 
            (:calendar_id, :course_id, :title, :description, :event_date)
        """)
        db.session.execute(sql, {
            'calendar_id': new_id,
            'course_id': course_id,
            'title': data['title'],
            'description': data['description'],
            'event_date': event_date.date()
        })
        db.session.commit()
        
        return jsonify({
            'message': 'Event created successfully',
            'calendar_id': new_id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating event: {str(e)}")
        return jsonify({
            'message': 'Failed to create event',
            'error': str(e)
        }), 500

@calendar_bp.route('/courses/<course_id>/events', methods=['GET'])
@jwt_required()
def get_course_events(course_id):
    """
    Get all events for a specific course
    ---
    parameters:
      - name: course_id
        in: path
        type: string
        required: true
    """
    try:
        sql = text("""
            SELECT 
                CalendarID,
                CourseID,
                EventTitle as title,
                EventDescription as description,
                EventDate as event_date
            FROM CalendarEvent 
            WHERE CourseID = :course_id
            ORDER BY EventDate ASC
        """)
        result = db.session.execute(sql, {'course_id': course_id})
        
        events = []
        for row in result.mappings():
            event = dict(row)
            if event.get('event_date'):
                event['event_date'] = event['event_date'].isoformat()
            events.append(event)
        
        return standard_response(data=events)
        
    except Exception as e:
        return standard_response(
            message='Failed to fetch events',
            status_code=500,
            success=False
        )

@calendar_bp.route('/students/<int:student_id>/events', methods=['GET'])
@jwt_required()
def get_student_events(student_id):
    """
    Get events for a specific student on a specific date
    ---
    parameters:
      - name: student_id
        in: path
        type: integer
        required: true
      - name: date
        in: query
        type: string
        format: date
        required: true
    """
    date = request.args.get('date')

    if not date:
        return standard_response(
            message='Date parameter is required (YYYY-MM-DD)',
            status_code=400,
            success=False
        )
    
    if not validate_date(date):
        return standard_response(
            message='Invalid date format. Use YYYY-MM-DD',
            status_code=400,
            success=False
        )
    
    try:
        sql = text("""
            SELECT 
                ce.CalendarID,
                ce.CourseID,
                ce.EventTitle as title,
                ce.EventDescription as description,
                ce.EventDate as event_date
            FROM CalendarEvent ce
            JOIN Enrols e ON ce.CourseID = e.CourseID
            WHERE e.StudentID = :student_id
            AND DATE(ce.EventDate) = :date
            ORDER BY ce.EventDate ASC
        """)
        result = db.session.execute(sql, {
            'student_id': student_id,
            'date': date
        })
        
        events = []
        for row in result.mappings():
            event = dict(row)
            if event.get('event_date'):
                event['event_date'] = event['event_date'].isoformat()
            events.append(event)
        
        return standard_response(data=events)
        
    except Exception as e:
        return standard_response(
            message='Failed to fetch student events',
            status_code=500,
            success=False
        )
