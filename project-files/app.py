from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from config import Config
from db import db  
from new_user_registration import auth
from course import course  
from views import api
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)


db.init_app(app)  
jwt = JWTManager(app)  # Enable JWT authentication

# Register Blueprints
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(course, url_prefix='/course')
app.register_blueprint(api, url_prefix='/api')

