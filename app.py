from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from config import Config
from db import db  
from new_user_registration import auth
from course import course
from calendar_events import calendar_bp
from forums import forum_bp
from discussion_threads import thread_bp
from course_content import content_bp  

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

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(port=5500, debug=True)
