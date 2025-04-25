import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from user import auth
from course import course
from db import db  
from calendar_events import calendar_bp
from forums import forum_bp
from discussion_threads import thread_bp
from course_content import content_bp  
from submissions import submissions_bp
from grades import grades_bp  
from flask_sqlalchemy import SQLAlchemy


class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://vle_admin:admin123@localhost/ourvle'
    SECRET_KEY = 'MAV3zvRcG7'  # This should be a secure key for session signing
    JWT_SECRET_KEY = 'cdf36175d0579edbf226f843803f7bf2afed2f7b9e09fb582ccfb677b5e71538a8c53372c27810ddca62d0691cfd419f20d7fd9a0e126cc3e1f1c0e92bc44ab1'  # Secret for signing JWT tokens


app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)  
jwt = JWTManager(app)  # Enable JWT authentication

# Register Blueprints
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(course, url_prefix='/course')
app.register_blueprint(calendar_bp, url_prefix='/api')
app.register_blueprint(forum_bp, url_prefix='/api')
app.register_blueprint(thread_bp, url_prefix='/api')
app.register_blueprint(content_bp, url_prefix='/api')
app.register_blueprint(submissions_bp, url_prefix='/api')
app.register_blueprint(grades_bp, url_prefix='/api')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(port=5500, debug=True)