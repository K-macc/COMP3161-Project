
from flask_wtf.csrf import generate_csrf
from flask import render_template, jsonify, send_from_directory, Blueprint  # Ensure 'request' is imported correctly
from werkzeug.utils import secure_filename
import os

api = Blueprint('api',__name__)

@api.route('/home', methods=['GET'])
def home():
    data = {
        "message": "Welcome to the Course Management System!",
        "featured_courses": [
            {"id": 1, "name": "Data Science 101", "description": "Introductory course to Data Science."},
            {"id": 2, "name": "Web Development", "description": "Learn full-stack web development."}
        ]
    }
    return jsonify(data)


    