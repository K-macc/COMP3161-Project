from flask import Blueprint, request, jsonify, current_app
import mysql
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename

grades_bp = Blueprint('grades', __name__)

def get_db_connection():
    """Create a new database connection."""
    return mysql.connector.connect(
        host="localhost",
        user="vle_admin",
        password="admin123",
        database="ourvle"
    )

@grades_bp.route('/<int:assignment_id>/<int:student_id>/grade', methods=['POST'])
@jwt_required()
def grade_assignment(assignment_id, student_id):
    current_user_id = get_jwt_identity()
    user_role = get_jwt().get('role')

    #Error Catching

    # Check if the user is logged in and has a valid role
    if not current_user_id:
        return jsonify({'message': 'User not found'}), 404
    
    if user_role not in ['lecturer', 'admin']:
        return jsonify({'message': 'Access denied. Only lecturers and admins can grade assignments.'}), 403

    conn = get_db_connection()
    cursor = conn.cursor()


    # Check if user is a lecturer and is authorized to grade this assignment
    if user_role == 'lecturer':
        cursor.execute("""
            SELECT 1 FROM Teaches
            WHERE LecturerID = (SELECT LecturerID FROM Lecturer WHERE UserID = %s)
            AND CourseID = (SELECT CourseID FROM Assignment WHERE AssignmentID = %s)
        """, (current_user_id, assignment_id))
        result = cursor.fetchone()
        if not result:  # Only return the error if the query result is empty
            return jsonify({'message': 'Not authorized to grade this assignment'}), 403

    # Check if the assignment exists
    cursor.execute("""
        SELECT 1 FROM Assignment
        WHERE AssignmentID = %s
    """, (assignment_id,))
    if not cursor.fetchone():
        return jsonify({'message': 'Assignment not found'}), 404

    # Check if the student exists
    cursor.execute("""
        SELECT 1 FROM Student
        WHERE StudentID = %s
    """, (student_id,))
    if not cursor.fetchone():
        return jsonify({'message': 'Student not found'}), 404

    data = request.get_json()

    # Check if the data is valid
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    # Check if required fields are present
    required_fields = ['grade']
    if not all(key in data for key in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if the grade is a valid number
    try:
        grade = float(data.get('grade'))
    except (TypeError, ValueError):
        return jsonify({'message': 'Grade must be a valid number'}), 400

    # Check if the grade is within the valid range
    if grade < 0 or grade > 100:
        return jsonify({'message': 'Grade must be between 0 and 100'}), 400
    
    # Check if the assignment has already been graded
    cursor.execute("""
        SELECT 1 FROM Grades
        WHERE AssignmentID = %s AND StudentID = %s AND Grade IS NOT NULL
    """, (assignment_id, student_id))
    if cursor.fetchone():
        return jsonify({'message': 'Assignment has already been graded'}), 400

    # Update the grade in the database
    try:
        cursor.execute("""
            UPDATE Submits
            SET Grade = %s
            WHERE AssignmentID = %s AND StudentID = %s
        """, (grade, assignment_id, student_id))
        conn.commit()
        return jsonify({'message': 'Grade updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Error updating grade: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()
        
    

@grades_bp.route('/<int:student_id>/final_average', methods=['GET'])
@jwt_required()
def get_final_average(student_id):
    current_user_id = get_jwt_identity()
    user_role = get_jwt().get('role')

    conn = get_db_connection()
    cursor = conn.cursor()

    # Error Catching

    # Check if the user is logged in and has a valid role
    if not current_user_id:
        return jsonify({'message': 'User not found'}), 404
    
    if user_role is None or user_role not in ['lecturer', 'admin', 'student']:
        return jsonify({'message': 'Access denied. Invalid user role.'}), 403

    if user_role == 'student' and current_user_id != student_id:
        return jsonify({'message': 'Access denied. Students can only view their own final average.'}), 403

    # Check if the student exists
    cursor.execute("""
        SELECT 1 FROM Student
        WHERE StudentID = %s
    """, (student_id,))
    if not cursor.fetchone():
        return jsonify({'message': 'Student not found'}), 404

    # Calculate the final average for the student
    cursor.execute("""
        SELECT AVG(Grade) AS FinalAverage FROM Grades
        WHERE StudentID = %s AND Grade IS NOT NULL
    """, (student_id,))

    result = cursor.fetchone()
    final_average = result[0] if result else None

    cursor.close()

    if final_average is None:
        return jsonify({'message': 'No grades found for this student', 'final_average': None}), 200

    return jsonify({'final_average': round(final_average, 2)}), 200

