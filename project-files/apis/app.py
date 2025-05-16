import os
from flask import Flask, request, jsonify, current_app
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, get_jwt, jwt_required
import mysql.connector
from models import create_user, get_user_by_userid, allowed_file, next_id, next_id_assign, standard_response, validate_date, get_next_thread_id
from config import Config
from werkzeug.utils import secure_filename
import datetime

app = Flask(__name__)
jwt = JWTManager(app)
app.config.from_object(Config)
upload_folder = r"C:\Users\mkesh\OneDrive\Documents\UWI\Year 3\Semester 2\COMP3161\COMP3161-Project\ourvle-frontend\uploads"

def get_db_connection():
    return mysql.connector.connect(
        host = "localhost",
        user = "vle_admin",
        password = "admin123",
        database = "ourvle"
    )

@app.route('/')
def index():
    return "Hello, World!"

# USER
@app.route('/api/register', methods=['POST'])
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

@app.route('/api/login', methods=['POST'])
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
        
        if user['Role'] == "student":
            cursor.execute("SELECT * FROM student WHERE UserID = %s", (data['user_id'],))
            student = cursor.fetchone()
            access_token = create_access_token(identity=user['UserID'], additional_claims={'role': user['Role'], 'name': student['StudentName'], 'email': student['Email'], 'id': student['StudentID']})
        elif user['Role'] == 'lecturer':
            cursor.execute("SELECT * FROM lecturer WHERE UserID = %s", (data['user_id'],))
            lecturer = cursor.fetchone()
            access_token = create_access_token(identity=user['UserID'], additional_claims={'role': user['Role'], 'name': lecturer['LecturerName'], 'email': lecturer['Email'], 'id': lecturer['LecturerID']})
        else:
            cursor.execute("SELECT * FROM admin WHERE UserID = %s", (data['user_id'],))
            admin = cursor.fetchone()
            access_token = create_access_token(identity=user['UserID'], additional_claims={'role': user['Role'], 'name': admin['AdminName'], 'email': admin['Email'], 'id': admin['AdminID']}) 
            
            
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token
        }), 200

    except Exception as e:
        return jsonify({'message': f'Login failed: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')

    return jsonify({
        'user_id': user_id,
        'role': role
    }), 200

@app.route('/api/search_user', methods=['GET'])
@jwt_required()
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


# COURSES
@app.route('/api/create_course', methods=['POST'])
@jwt_required()
def create_course():
    current_user_role = get_jwt().get('role')
    if current_user_role != 'admin':
        return jsonify({'message': 'Admin access required!'}), 403

    data = request.get_json()
    if not data or 'CourseID' not in data or 'CourseName' not in data:
        return jsonify({'message': 'Missing required fields!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Check if course already exists
        cursor.execute("SELECT * FROM course WHERE CourseID = %s OR CourseName = %s", (data['CourseID'], data['CourseName']))
        course = cursor.fetchone()
        if course:
            return jsonify({'message': 'Course already exists!'}), 400

        # Insert new course
        cursor.execute("INSERT INTO course (CourseID, CourseName) VALUES (%s, %s)", (data['CourseID'], data['CourseName']))
        conn.commit()

        return jsonify({'message': 'Course created successfully!'}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Error creating course: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/register_student', methods=['POST'])
@jwt_required()
def register_student():
    current_user_id = get_jwt_identity()

    if not current_user_id:
        return jsonify({'message': 'Invalid user identity format!'}), 400

    data = request.get_json()
    if not data or 'CourseID' not in data:
        return jsonify({'message': 'Missing CourseID!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Get student ID
        cursor.execute("SELECT StudentID FROM Student WHERE UserID = %s", (current_user_id,))
        student = cursor.fetchone()

        if not student:
            return jsonify({'message': 'Student not found!'}), 404

        student_id = student['StudentID']

        # Check if course exists
        cursor.execute("SELECT * FROM Course WHERE CourseID = %s", (data['CourseID'],))
        course = cursor.fetchone()
        if not course:
            return jsonify({'message': 'Course not found!'}), 404

        # Check if already enrolled
        cursor.execute("SELECT * FROM Enrols WHERE StudentID = %s AND CourseID = %s", (student_id, data['CourseID']))
        enrolment = cursor.fetchone()
        if enrolment:
            return jsonify({'message': 'Already enrolled in this course!'}), 400

        # Enroll student
        cursor.execute("INSERT INTO Enrols (StudentID, CourseID) VALUES (%s, %s)", (student_id, data['CourseID']))
        conn.commit()

        return jsonify({'message': 'Successfully enrolled in the course!'}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/course_members/<string:course_id>', methods=['GET'])
@jwt_required()
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

@app.route('/api/get_course/<course_id>', methods=['GET'])
@jwt_required()
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

@app.route('/api/get_courses', methods=['GET'])
@jwt_required()
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

@app.route('/api/student_courses/<int:student_id>', methods=['GET'])
@jwt_required()
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

@app.route('/api/lecturer_courses/<int:lecturer_id>', methods=['GET'])
@jwt_required()
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

@app.route('/api/specific_courses', methods=['GET'])
@jwt_required()
def get_specific_courses():
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
@app.route('/api/courses/<string:course_id>/forums', methods=['POST'])
@jwt_required()
def create_forum(course_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        current_user_id = get_jwt_identity()
        current_user_role = get_jwt().get('role')

        if not current_user_role:
            return jsonify({'message': 'Invalid user role!'}), 400

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
                return jsonify({'message': 'Not authorized to create forums for this course!'}), 403
        elif current_user_role != 'admin':
            return jsonify({'message': 'Admin or lecturer access required!'}), 403

        data = request.get_json()
        if not data or 'subject' not in data or not data['subject'].strip():
            return jsonify({'message': 'Forum subject is required!'}), 400

        cursor.execute("SELECT COALESCE(MAX(ForumID), 0) + 1 AS NextForumID FROM DiscussionForum")
        next_id_result = cursor.fetchone()
        next_id = next_id_result['NextForumID']

        insert_query = """
            INSERT INTO DiscussionForum (ForumID, CourseID, Subject)
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_query, (next_id, course_id, data['subject'].strip()))
        conn.commit()

        return jsonify({'message': 'Forum created successfully!', 'ForumID': next_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Error creating forum: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/courses/<string:course_id>/forums', methods=['GET'])
@jwt_required()
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

@app.route('/api/forums/<int:forum_id>/threads', methods=['POST'])
@jwt_required()
def create_thread(forum_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        data = request.get_json()
        if not data or 'title' not in data or 'post' not in data:
            return jsonify({'message': 'Title and post are required!'}), 400

        thread_id = get_next_thread_id()

        insert_query = """
            INSERT INTO DiscussionThread (ThreadID, ForumID, Title, Post)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (thread_id, forum_id, data['title'], data['post']))
        conn.commit()

        return jsonify({'message': 'Thread created successfully!', 'thread_id': thread_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Error creating thread: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/forums/<int:forum_id>/threads', methods=['GET'])
@jwt_required()
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

@app.route('/api/threads/<int:thread_id>/replies', methods=['POST'])
@jwt_required()
def add_reply(thread_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        data = request.get_json()
        if not data or 'reply' not in data:
            return jsonify({'message': 'Reply is required!'}), 400

        cursor.execute("SELECT COALESCE(MAX(ReplyID), 0) + 1 FROM Reply")
        next_id = cursor.fetchone()[0]

        insert_query = """
            INSERT INTO Reply (ReplyID, ThreadID, Reply, ReplyTo)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (next_id, thread_id, data['reply'], data.get('reply_to')))
        conn.commit()

        return jsonify({'message': 'Reply added successfully!', 'reply_id': next_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Error adding reply: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/threads/<int:thread_id>/replies', methods=['GET'])
@jwt_required()
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


# CALENDAR EVENT
@app.route('/api/courses/<string:course_id>/events', methods=['POST'])
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
                return jsonify({'message': 'Not authorized to create events for this course!'}), 403
        elif user_role != 'admin':
            return jsonify({'message': 'Admin or lecturer access required!'}), 403

        data = request.get_json()

        if data['title'] == "" or data['description'] == "" or data['event_date'] == "":
            return jsonify({'message': 'Missing required fields!'}), 400

        cursor.execute("SELECT COALESCE(MAX(CalendarID), 0) FROM CalendarEvent")
        max_id = cursor.fetchone()['COALESCE(MAX(CalendarID), 0)']
        new_id = max_id + 1

        try:
            event_date = datetime.datetime.fromisoformat(data['event_date']).date()
        except ValueError:
            return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD!'}), 400

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

        return jsonify({'message': 'Event created successfully!', 'calendar_id': new_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': 'Failed to create event', 'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/courses/<string:course_id>/events', methods=['GET'])
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

    except Exception:
        return standard_response(
            message='Failed to fetch events',
            status_code=500,
            success=False
        )

    finally:
        cursor.close()
        conn.close()

@app.route('/api/students/<int:student_id>/events', methods=['GET'])
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

    except Exception:
        return standard_response(
            message='Failed to fetch student events',
            status_code=500,
            success=False
        )

    finally:
        cursor.close()
        conn.close()


# COURSE SECTIONS
@app.route('/api/section/<string:course_id>/content', methods=['POST'])
@jwt_required()
def create_section_content(course_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        user_role = get_jwt().get('role')

        if user_role not in ['lecturer', 'admin']:
            return jsonify({'message': 'Access denied. Only lecturers and admins can upload content!'}), 403

        slide = request.files.get('slides')
        file = request.files.get('file')
        link = request.form.get('link')

        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        if not slide:
            return jsonify({'message': 'Upload a slide'}), 400        
        slidename = secure_filename(slide.filename)
        filepath = os.path.join(upload_folder, slidename)
        slide.save(filepath)
        
        if not file:
            return jsonify({'message': 'Upload a file'}), 400
        filename = secure_filename(file.filename)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        if not link:
            return jsonify({'message': 'Upload a link!'}),400
        cursor.execute("SELECT COALESCE(MAX(SectionID), 0) FROM Section")
        max_id = cursor.fetchone()[0]
        new_id = max_id + 1

        query = """
            INSERT INTO Section (SectionID, CourseID, LectureSlides, Files, Links) 
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (new_id, course_id, slidename, filename, link))
        conn.commit()

        return jsonify({'message': 'Section created successfully!'}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({'message': str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/section/<string:course_id>/content', methods=['GET'])
@jwt_required()
def get_section_content(course_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT LectureSlides, Files, Links
            FROM Section
            WHERE CourseID = %s
        """
        cursor.execute(query, (course_id,))
        result = cursor.fetchall()

        if not result:
            return jsonify({'message': 'Section not found'}), 404

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'message': 'Failed to fetch section content', 'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# ASSIGNMENTS
@app.route('/api/<string:course_id>/create_assignment', methods=['POST'])
@jwt_required()
def create_assignment(course_id):
    current_user_id = get_jwt_identity()
    user_role = get_jwt().get('role')

    if not current_user_id:
        return jsonify({'message': 'User not found!'}), 404

    if user_role not in ['lecturer', 'admin']:
        return jsonify({'message': 'Access denied. Only lecturers and admins can create assignments!'}), 403

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if the course exists
        cursor.execute("SELECT 1 FROM Course WHERE CourseID = %s", (course_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Course not found!'}), 404

        # If lecturer, check if they teach the course
        if user_role == 'lecturer':
            cursor.execute("""
                SELECT 1 FROM Teaches
                WHERE LecturerID = (SELECT LecturerID FROM Lecturer WHERE UserID = %s)
                AND CourseID = %s
            """, (current_user_id, course_id))
            if not cursor.fetchone():
                return jsonify({'message': 'You are not authorized to create assignments for this course!'}), 403

        data = request.form
        file = request.files.get('file')
        link = request.form.get('link')

        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        assignments_folder = os.path.join(upload_folder, 'assignments')
        if not os.path.exists(assignments_folder):
            os.makedirs(assignments_folder)

        assignment_file = None
        assignment_link = None
        assignment_id = next_id_assign()

        # Handle file upload
        if file and allowed_file(file.filename):
            filename = f"{assignment_id}_{secure_filename(file.filename)}"
            filepath = os.path.join(assignments_folder, filename)
            file.save(filepath)
            assignment_file = filepath

        if link:
            assignment_link = link
            

        if not assignment_file and not assignment_link:
            return jsonify({'message': 'Either a file or a link must be provided!'}), 400

        # Insert the assignment
        cursor.execute("""
            INSERT INTO Assignment (AssignmentID, AssignmentName, DueDate, CourseID, AssignmentFile, AssignmentLink)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            assignment_id,
            data.get('assignment_name'),
            data.get('due_date'),
            course_id,
            assignment_file,
            assignment_link
        ))
        
        conn.commit()

        return jsonify({'message': 'Assignment created successfully!', 'assignment_id': assignment_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': 'Error creating assignment', 'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()
        
@app.route('/api/courses/<string:course_id>/assignments', methods=['GET'])
@jwt_required()
def get_assignments(course_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute('''
            SELECT *
            FROM assignment
            WHERE CourseID = %s
        ''', (course_id,))

        assignments = cursor.fetchall()

        if not assignments:
            return jsonify({'message': 'No assignments found for this course'}), 404

        return jsonify(assignments), 200

    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            
@app.route('/api/assignments/<int:assignment_id>/submissions', methods=['GET'])
@jwt_required()
def get_submissions(assignment_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT *
            FROM submits s
            WHERE AssignmentID = %s
            ORDER BY SubmissionDate DESC
        """, (assignment_id,))

        submissions = cursor.fetchall()
        return jsonify(submissions), 200

    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/assignments/<int:assignment_id>/submit', methods=['POST'])
@jwt_required()
def submit_assignment(assignment_id):
    current_user_id = get_jwt_identity()
    user_role = get_jwt().get('role')

    if not current_user_id:
        return jsonify({'message': 'User missing!'}), 404

    if not assignment_id:
        return jsonify({'message': 'Assignment missing!'}), 404

    if user_role != 'student':
        return jsonify({'message': 'Access denied. Only students can submit assignments!'}), 403

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT AssignmentID, CourseID FROM Assignment WHERE AssignmentID = %s", (assignment_id,))
        assignment = cursor.fetchone()
        if not assignment:
            return jsonify({'message': 'Assignment not found!'}), 404
        course_id = assignment[1]

        cursor.execute("SELECT StudentID FROM Student WHERE UserID = %s", (current_user_id,))
        result = cursor.fetchone()
        if not result:
            return jsonify({'message': 'Student not found!'}), 404
        student_id = result[0]

        cursor.execute("SELECT 1 FROM Enrols WHERE StudentID = %s AND CourseID = %s", (student_id, course_id))
        if not cursor.fetchone():
            return jsonify({'message': 'Student is not enrolled in the course for this assignment!'}), 403

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
            return jsonify({'message': 'No file or link provided!'}), 400

        cursor.execute("""
            INSERT INTO Submits 
                (SubmissionID, StudentID, AssignmentID, SubmissionFile, SubmissionLink)
            VALUES 
                (%s, %s, %s, %s, %s)
        """, (submission_id, student_id, assignment_id, submission_file, submission_link))

        conn.commit()

        return jsonify({'message': 'Assignment submitted successfully!'}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Database error: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/<int:assignment_id>/<int:student_id>/grade', methods=['POST'])
@jwt_required()
def grade_assignment(assignment_id, student_id):
    current_user_id = get_jwt_identity()
    user_role = get_jwt().get('role')

    if not current_user_id:
        return jsonify({'message': 'User not found!'}), 404

    if user_role not in ['lecturer', 'admin']:
        return jsonify({'message': 'Access denied. Only lecturers and admins can grade assignments!'}), 403

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        if user_role == 'lecturer':
            cursor.execute("""
                SELECT 1 FROM Teaches
                WHERE LecturerID = (SELECT LecturerID FROM Lecturer WHERE UserID = %s)
                AND CourseID = (SELECT CourseID FROM Assignment WHERE AssignmentID = %s)
            """, (current_user_id, assignment_id))
            if not cursor.fetchone():
                return jsonify({'message': 'Not authorized to grade this assignment!'}), 403

        # Check assignment exists
        cursor.execute("SELECT 1 FROM Assignment WHERE AssignmentID = %s", (assignment_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Assignment not found!'}), 404

        # Check student exists
        cursor.execute("SELECT 1 FROM Student WHERE StudentID = %s", (student_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Student not found!'}), 404

        data = request.get_json()

        if not data or 'grade' not in data:
            return jsonify({'message': 'Missing required fields!'}), 400

        try:
            grade = float(data['grade'])
        except (TypeError, ValueError):
            return jsonify({'message': 'Grade must be a valid number!'}), 400

        if grade < 0 or grade > 100:
            return jsonify({'message': 'Grade must be between 0 and 100!'}), 400

        # Check if already graded
        cursor.execute("""
            SELECT 1 FROM Grades
            WHERE AssignmentID = %s AND StudentID = %s AND Grade IS NOT NULL
        """, (assignment_id, student_id))
        if cursor.fetchone():
            return jsonify({'message': 'Assignment has already been graded!'}), 400

        # Update grade
        cursor.execute("""
            INSERT INTO Grades (AssignmentID, StudentID, Grade)
            VALUES (%s, %s, %s)""", (assignment_id, student_id, grade))
        conn.commit()

        return jsonify({'message': 'Grade submitted successfully!'}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Error updating grade: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/<int:student_id>/final_average', methods=['GET'])
@jwt_required()
def get_final_average(student_id):
    current_user_id = get_jwt_identity()
    user_role = get_jwt().get('role')
    
    conn = get_db_connection()
    cursor = conn.cursor()

    if not current_user_id:
        return jsonify({'message': 'User not found'}), 404

    if user_role not in ['lecturer', 'admin', 'student']:
        return jsonify({'message': 'Access denied. Invalid user role.'}), 403
    
    cursor.execute("SELECT UserID FROM student WHERE StudentID = %s", (student_id, ))
    load_user = cursor.fetchone()[0]

    if user_role == 'student' and current_user_id != load_user:
        return jsonify({'message': 'Access denied. Students can only view their own final average.'}), 403


    try:
        # Check student exists
        cursor.execute("SELECT 1 FROM Student WHERE StudentID = %s", (student_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Student not found'}), 404

        # Calculate final average
        cursor.execute("""
            SELECT AVG(Grade) AS FinalAverage
            FROM Grades
            WHERE StudentID = %s AND Grade IS NOT NULL
        """, (student_id,))
        result = cursor.fetchone()

        final_average = result[0] if result else None

        if final_average is None:
            return jsonify({'message': 'No grades found for this student', 'final_average': None}), 200

        return jsonify({'final_average': round(final_average, 2)}), 200

    except Exception as e:
        return jsonify({'message': f'Error retrieving final average: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()
        
@app.route('/api/reports/<string:report_name>', methods=['GET'])
@jwt_required()
def get_view_report(report_name):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if report_name == "courses_with_50_or_more_students":
            cursor.execute("SELECT * FROM courses_with_50_or_more_students")
        elif report_name == "lecturers_teaching_3_or_more_courses":
            cursor.execute("SELECT * FROM lecturers_teaching_3_or_more_courses")
        elif report_name == "students_with_5_or_more_courses":
            cursor.execute("SELECT * FROM students_with_5_or_more_courses")
        elif report_name == "top_10_most_enrolled_courses":
            cursor.execute("SELECT * FROM top_10_most_enrolled_courses")
        else:
            cursor.execute("SELECT * FROM top_10_students_by_average_grade")
    
    
        report_info = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        
        if not report_info:
            return jsonify({'message':'Report information not found!'}),404
        
        
        return jsonify({
            'headers': column_names,
            'rows': report_info
        }),200
        
    except Exception as e:
        return jsonify({'message': f'Error retrieving report: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()
        
    

if __name__ == '__main__':
    app.run(port=5000)
