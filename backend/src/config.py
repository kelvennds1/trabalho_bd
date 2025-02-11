from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_swagger_ui import get_swaggerui_blueprint
from pathlib import Path


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = r'postgresql://postgres:ticegpipp@localhost:5432/viagens'
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

BASE_PATH = Path(__file__).resolve().parent


SWAGGER_URL = '/api/docs'
API_URL = "/static/swagger.json"
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "Tourism API"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)
