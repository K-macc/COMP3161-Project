from flask import Flask, request, jsonify, current_app
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, get_jwt, jwt_required
import mysql.connector
from models import create_user, get_user_by_userid
import os
from config import Config
from werkzeug.utils import secure_filename
import datetime

app = Flask(__name__)

jwt = JWTManager(app)

app.config.from_object(Config)

def get_db_connection():
    return mysql.connector.connect(
        host = "localhost",
        user = "vle_admin",
        password = "admin123",
        database = "ourvle"
    )

def get_user_by_userid(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM user WHERE UserID = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

def create_user(user_id, username, password, role):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO user (UserID, Username, Password, Role) VALUES (%s, %s, %s, %s)",
        (user_id, username, password, role)
    )
    conn.commit()
    cursor.close()
    conn.close()

# USER REGISTRATION AND LOGIN
@app.route('/register', methods=['POST'])
def register():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        data = request.get_json()

        if not data or 'name' not in data or 'username' not in data or 'password' not in data or 'role' not in data:
            return jsonify({'message': 'Missing required fields'}), 400

        name = data['name']
        username = data['username']
        password = data['password']
        role = data['role']

        cursor.execute("SELECT MAX(UserID) FROM user")
        max_userid = cursor.fetchone()[0]

        if max_userid:
            parts = max_userid.split("-")
            parts[1] = str(int(parts[1]) + 1)
            user_id = "-".join(parts)
        else:
            user_id = "U-1"  # First user if table is empty

        email = ""
        if role == "student":
            email = f"{username}@mymona.uwi.edu"
        elif role == "lecturer":
            email = f"{username}@uwimona.edu"
        elif role == "admin":
            email = f"{username}@admin.uwi"

        existing_user = get_user_by_userid(user_id)
        if existing_user:
            return jsonify({'message': 'User already exists'}), 400

        create_user(user_id, username, password, role)

        if role == "student":
            cursor.execute("SELECT MAX(StudentID) FROM Student")
            last_id = cursor.fetchone()[0] or 0
            new_id = last_id + 1

            cursor.execute(
                "INSERT INTO Student (StudentID, UserID, StudentName, Email) VALUES (%s, %s, %s, %s)",
                (new_id, user_id, name, email)
            )
            conn.commit()

        elif role == "lecturer":
            cursor.execute("SELECT MAX(LecturerID) FROM Lecturer")
            last_id = cursor.fetchone()[0] or 0
            new_id = last_id + 1

            cursor.execute(
                "INSERT INTO Lecturer (LecturerID, UserID, LecturerName, Email) VALUES (%s, %s, %s, %s)",
                (new_id, user_id, name, email)
            )
            conn.commit()

        elif role == "admin":
            cursor.execute("SELECT MAX(AdminID) FROM Admin")
            last_id = cursor.fetchone()[0] or 0
            new_id = last_id + 1

            cursor.execute(
                "INSERT INTO Admin (AdminID, UserID, AdminName, Email) VALUES (%s, %s, %s, %s)",
                (new_id, user_id, name, email)
            )
            conn.commit()

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        data = request.get_json()

        if not data or 'user_id' not in data or 'password' not in data:
            return jsonify({'message': 'Missing required fields'}), 400

        cursor.execute("SELECT * FROM user WHERE UserID = %s", (data['user_id'],))
        user = cursor.fetchone()

        if not user:
            return jsonify({'message': 'Invalid User ID'}), 404

        if user['Password'] != data['password']:
            return jsonify({'message': 'Invalid Password'}), 401

        access_token = create_access_token(identity=user['UserID'], additional_claims={'role': user['Role']})

        return jsonify({
            'message': 'Login successful',
            'access_token': access_token
        }), 200

    except Exception as e:
        return jsonify({'message': f'Login failed: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')

    return jsonify({
        'user_id': user_id,
        'role': role
    }), 200

@app.route('/search_user', methods=['GET'])
def search_user():
    user_id = request.args.get('user_id')
    role = request.args.get('role')

    if not user_id or not role:
        return jsonify({'message': 'Missing user_id or role in query parameters'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM user WHERE UserID = %s AND Role = %s", (user_id, role))
        user = cursor.fetchone()

        if not user:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({'user': user}), 200

    except Exception as e:
        return jsonify({'message': f'Error searching user: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()



@app.route('/create_course', methods=['POST'])
@jwt_required()
def create_course():
    current_user_role = get_jwt().get('role')
    if current_user_role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403

    data = request.get_json()
    if not data or 'CourseID' not in data or 'CourseName' not in data:
        return jsonify({'message': 'Missing required fields'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Check if course already exists
        cursor.execute("SELECT * FROM course WHERE CourseID = %s OR CourseName = %s", (data['CourseID'], data['CourseName']))
        course = cursor.fetchone()
        if course:
            return jsonify({'message': 'Course already exists'}), 400

        # Insert new course
        cursor.execute("INSERT INTO course (CourseID, CourseName) VALUES (%s, %s)", (data['CourseID'], data['CourseName']))
        conn.commit()

        return jsonify({'message': 'Course created successfully'}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Error creating course: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/register_student', methods=['POST'])
@jwt_required()
def register_student():
    current_user_id = get_jwt_identity()

    if not current_user_id:
        return jsonify({'message': 'Invalid user identity format'}), 400

    data = request.get_json()
    if not data or 'CourseID' not in data:
        return jsonify({'message': 'Missing CourseID'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Get student ID
        cursor.execute("SELECT StudentID FROM Student WHERE UserID = %s", (current_user_id,))
        student = cursor.fetchone()

        if not student:
            return jsonify({'message': 'Student not found'}), 404

        student_id = student['StudentID']

        # Check if course exists
        cursor.execute("SELECT * FROM Course WHERE CourseID = %s", (data['CourseID'],))
        course = cursor.fetchone()
        if not course:
            return jsonify({'message': 'Course not found'}), 404

        # Check if already enrolled
        cursor.execute("SELECT * FROM Enrols WHERE StudentID = %s AND CourseID = %s", (student_id, data['CourseID']))
        enrolment = cursor.fetchone()
        if enrolment:
            return jsonify({'message': 'Already enrolled in this course'}), 400

        # Enroll student
        cursor.execute("INSERT INTO Enrols (StudentID, CourseID) VALUES (%s, %s)", (student_id, data['CourseID']))
        conn.commit()

        return jsonify({'message': 'Successfully enrolled in the course'}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/course_members/<string:course_id>', methods=['GET'])
def get_members(course_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT s.StudentID, s.StudentName
            FROM student s
            JOIN enrols e ON s.StudentID = e.StudentID
            WHERE e.CourseID = %s
        """, (course_id,))

        members = cursor.fetchall()
        if not members:
            return jsonify({'message': 'Members not found'}), 404

        return jsonify({'members': members}), 200

    except Exception as e:
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/get_course/<course_id>', methods=['GET'])
def get_course(course_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM Course WHERE CourseID = %s", (course_id,))
        course = cursor.fetchone()

        if not course:
            return jsonify({'message': 'Course not found'}), 404

        return jsonify(course), 200

    except Exception as e:
        return jsonify({'message': f'Error fetching course: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/get_courses', methods=['GET'])
def get_courses():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM course ORDER BY CourseID")
        courses = cursor.fetchall()

        return jsonify(courses), 200

    except Exception as e:
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/student_courses/<int:student_id>', methods=['GET'])
def get_student_courses(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT s.StudentID, s.StudentName, c.CourseID, c.CourseName
            FROM student s
            JOIN enrols e ON s.StudentID = e.StudentID
            JOIN course c ON e.CourseID = c.CourseID
            WHERE s.StudentID = %s
        """, (student_id,))

        courses = cursor.fetchall()
        if not courses:
            return jsonify({'message': 'No courses found for this student'}), 404

        student_info = {
            'StudentID': courses[0]['StudentID'],
            'StudentName': courses[0]['StudentName'],
            'Courses': [
                {'CourseID': course['CourseID'], 'CourseName': course['CourseName']}
                for course in courses
            ]
        } 

        return jsonify({'student_courses': student_info}), 200

    except Exception as e:
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/lecturer_courses/<int:lecturer_id>', methods=['GET'])
def get_lecturer_courses(lecturer_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT l.LecturerID, l.LecturerName, c.CourseID, c.CourseName
            FROM lecturer l
            JOIN teaches t ON l.LecturerID = t.LecturerID
            JOIN course c ON t.CourseID = c.CourseID
            WHERE l.LecturerID = %s
        """, (lecturer_id,))

        courses = cursor.fetchall()
        if not courses:
            return jsonify({'message': 'No courses found for this lecturer'}), 404

        lecturer_info = {
            'LecturerID': courses[0]['LecturerID'],
            'LecturerName': courses[0]['LecturerName'],
            'Courses': [
                {'CourseID': course['CourseID'], 'CourseName': course['CourseName']}
                for course in courses
            ]
        }

        return jsonify({'lecturer_info': lecturer_info}), 200

    except Exception as e:
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/specific_courses', methods=['GET'])
@jwt_required()
def get_lecturer_login_courses():
    current_user_id = get_jwt_identity()
    current_user_role = get_jwt().get('role')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        if current_user_role == 'lecturer':
            cursor.execute("""
                SELECT l.LecturerID, l.LecturerName, c.CourseID, c.CourseName
                FROM lecturer l
                JOIN teaches t ON l.LecturerID = t.LecturerID
                JOIN course c ON t.CourseID = c.CourseID
                WHERE l.UserID = %s
            """, (current_user_id,))
            courses = cursor.fetchall()

            if not courses:
                return jsonify({'courses': 'No courses found for this lecturer.'}), 404

            lecturer_courses = [
                {'CourseID': course['CourseID'], 'CourseName': course['CourseName']}
                for course in courses
            ]

            return jsonify({'courses': lecturer_courses}), 200

        elif current_user_role == 'student':
            cursor.execute("""
                SELECT s.StudentID, s.StudentName, c.CourseID, c.CourseName
                FROM student s
                JOIN enrols e ON s.StudentID = e.StudentID
                JOIN course c ON e.CourseID = c.CourseID
                WHERE s.UserID = %s
            """, (current_user_id,))
            courses = cursor.fetchall()

            if not courses:
                return jsonify({'courses': 'No courses found for this student.'}), 404

            student_courses = [
                {'CourseID': course['CourseID'], 'CourseName': course['CourseName']}
                for course in courses
            ]

            return jsonify({'courses': student_courses}), 200

        else:
            return jsonify({'courses': 'No courses found.'}), 404

    except Exception as e:
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

# FORUMS
@app.route('/courses/<string:course_id>/forums', methods=['POST'])
@jwt_required()
def create_forum(course_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        current_user_id = get_jwt_identity()
        current_user_role = get_jwt().get('role')

        if not current_user_role:
            return jsonify({'message': 'Invalid user role'}), 400

        if current_user_role == 'lecturer':
            query = """
                SELECT 1 
                FROM teaches 
                WHERE LecturerID = (SELECT LecturerID FROM lecturer WHERE UserID = %s)
                AND CourseID = %s
            """
            cursor.execute(query, (current_user_id, course_id))
            result = cursor.fetchone()
            if not result:
                return jsonify({'message': 'Not authorized to create forums for this course'}), 403
        elif current_user_role != 'admin':
            return jsonify({'message': 'Admin or lecturer access required'}), 403

        data = request.get_json()
        if not data or 'subject' not in data or not data['subject'].strip():
            return jsonify({'message': 'Forum subject is required'}), 400

        cursor.execute("SELECT COALESCE(MAX(ForumID), 0) + 1 AS NextForumID FROM DiscussionForum")
        next_id_result = cursor.fetchone()
        next_id = next_id_result['NextForumID']

        insert_query = """
            INSERT INTO DiscussionForum (ForumID, CourseID, Subject)
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_query, (next_id, course_id, data['subject'].strip()))
        conn.commit()

        return jsonify({'message': 'Forum created successfully', 'ForumID': next_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Error creating forum: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/courses/<string:course_id>/forums', methods=['GET'])
def get_course_forums(course_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT ForumID, CourseID, Subject, DateCreated 
            FROM DiscussionForum
            WHERE CourseID = %s
            ORDER BY DateCreated DESC
        """
        cursor.execute(query, (course_id,))
        forums = cursor.fetchall()

        if not forums:
            return jsonify({'message': 'No forums found for this course'}), 404

        forum_list = [
            {
                'ForumID': forum['ForumID'],
                'CourseID': forum['CourseID'],
                'Subject': forum['Subject'],
                'DateCreated': forum['DateCreated']
            }
            for forum in forums
        ]

        return jsonify({'forums': forum_list}), 200

    except Exception as e:
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

def get_next_thread_id():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT MAX(ThreadID) FROM DiscussionThread")
        max_id = cursor.fetchone()[0]
        return 1 if max_id is None else max_id + 1
    finally:
        cursor.close()
        conn.close()

@app.route('/forums/<int:forum_id>/threads', methods=['POST'])
@jwt_required()
def create_thread(forum_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        data = request.get_json()
        if not data or 'title' not in data or 'post' not in data:
            return jsonify({'message': 'Title and post are required'}), 400

        thread_id = get_next_thread_id()

        insert_query = """
            INSERT INTO DiscussionThread (ThreadID, ForumID, Title, Post)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (thread_id, forum_id, data['title'], data['post']))
        conn.commit()

        return jsonify({'message': 'Thread created successfully', 'thread_id': thread_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Error creating thread: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/forums/<int:forum_id>/threads', methods=['GET'])
def get_forum_threads(forum_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT * FROM DiscussionThread 
            WHERE ForumID = %s
            ORDER BY CreationDate DESC
        """
        cursor.execute(query, (forum_id,))
        threads = cursor.fetchall()

        return jsonify(threads), 200

    except Exception as e:
        return jsonify({'message': f'Error fetching threads: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/threads/<int:thread_id>/replies', methods=['POST'])
@jwt_required()
def add_reply(thread_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        data = request.get_json()
        if not data or 'reply' not in data:
            return jsonify({'message': 'Reply text is required'}), 400

        cursor.execute("SELECT COALESCE(MAX(ReplyID), 0) + 1 FROM Reply")
        next_id = cursor.fetchone()[0]

        insert_query = """
            INSERT INTO Reply (ReplyID, ThreadID, Reply, ReplyTo)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (next_id, thread_id, data['reply'], data.get('reply_to')))
        conn.commit()

        return jsonify({'message': 'Reply added successfully', 'reply_id': next_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Error adding reply: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/threads/<int:thread_id>/replies', methods=['GET'])
def get_thread_replies(thread_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT * FROM Reply
            WHERE ThreadID = %s
            ORDER BY ReplyID
        """
        cursor.execute(query, (thread_id,))
        replies = cursor.fetchall()

        return jsonify(replies), 200

    except Exception as e:
        return jsonify({'message': f'Error fetching replies: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()


def standard_response(data=None, message="Success", status_code=200, success=True):
    return jsonify({
        "success": success,
        "message": message,
        "data": data
    }), status_code

def validate_date(date_string):
    try:
        return datetime.datetime.strptime(date_string, '%Y-%m-%d').date()
    except ValueError:
        return None

# CALENDAR EVENT
@app.route('/courses/<string:course_id>/events', methods=['POST'])
@jwt_required()
def create_event(course_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        current_user_id = get_jwt_identity()
        user_role = get_jwt().get('role')

        if user_role == 'lecturer':
            auth_query = """
                SELECT 1 FROM Teaches 
                WHERE LecturerID = (SELECT LecturerID FROM Lecturer WHERE UserID = %s)
                AND CourseID = %s
            """
            cursor.execute(auth_query, (current_user_id, course_id))
            if not cursor.fetchone():
                return jsonify({'message': 'Not authorized to create events for this course'}), 403
        elif user_role != 'admin':
            return jsonify({'message': 'Admin or lecturer access required'}), 403

        data = request.get_json()

        required_fields = ['title', 'description', 'event_date']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400

        cursor.execute("SELECT COALESCE(MAX(CalendarID), 0) FROM CalendarEvent")
        max_id = cursor.fetchone()['COALESCE(MAX(CalendarID), 0)']
        new_id = max_id + 1

        try:
            event_date = datetime.datetime.fromisoformat(data['event_date']).date()
        except ValueError:
            return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

        insert_query = """
            INSERT INTO CalendarEvent 
            (CalendarID, CourseID, EventTitle, EventDescription, EventDate)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            new_id,
            course_id,
            data['title'],
            data['description'],
            event_date
        ))
        conn.commit()

        return jsonify({'message': 'Event created successfully', 'calendar_id': new_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Failed to create event', 'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/courses/<string:course_id>/events', methods=['GET'])
@jwt_required()
def get_course_events(course_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT 
                CalendarID,
                CourseID,
                EventTitle AS title,
                EventDescription AS description,
                EventDate AS event_date
            FROM CalendarEvent 
            WHERE CourseID = %s
            ORDER BY EventDate ASC
        """
        cursor.execute(query, (course_id,))
        events = cursor.fetchall()

        for event in events:
            if event.get('event_date'):
                event['event_date'] = event['event_date'].isoformat()

        return standard_response(data=events)

    except Exception as e:
        return standard_response(
            message='Failed to fetch events',
            status_code=500,
            success=False
        )

    finally:
        cursor.close()
        conn.close()

@app.route('/students/<int:student_id>/events', methods=['GET'])
@jwt_required()
def get_student_events(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
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

        query = """
            SELECT 
                ce.CalendarID,
                ce.CourseID,
                ce.EventTitle AS title,
                ce.EventDescription AS description,
                ce.EventDate AS event_date
            FROM CalendarEvent ce
            JOIN Enrols e ON ce.CourseID = e.CourseID
            WHERE e.StudentID = %s
            AND DATE(ce.EventDate) = %s
            ORDER BY ce.EventDate ASC
        """
        cursor.execute(query, (student_id, date))
        events = cursor.fetchall()

        for event in events:
            if event.get('event_date'):
                event['event_date'] = event['event_date'].isoformat()

        return standard_response(data=events)

    except Exception as e:
        return standard_response(
            message='Failed to fetch student events',
            status_code=500,
            success=False
        )

    finally:
        cursor.close()
        conn.close()

def allowed_file(filename):
    return '.' in filename and '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS # type: ignore

# COURSE SECTIONS
@app.route('/section/<int:section_id>/content', methods=['POST'])
@jwt_required()
def upload_section_content(section_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
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

        update_query = f"""
            UPDATE Section SET {update_column} = %s
            WHERE SectionID = %s
        """
        cursor.execute(update_query, (update_value, section_id))
        conn.commit()

        return jsonify({'message': f'{content_type.capitalize()} uploaded to section {section_id}'}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Failed to upload content', 'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Get section content
@app.route('/section/<int:section_id>/content', methods=['GET'])
def get_section_content(section_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT LectureSlides, Files, Links
            FROM Section
            WHERE SectionID = %s
        """
        cursor.execute(query, (section_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({'message': 'Section not found'}), 404

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'message': 'Failed to fetch section content', 'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(port=5000)
