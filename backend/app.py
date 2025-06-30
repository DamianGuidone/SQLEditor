from flask import Flask, jsonify
from flask_cors import CORS
from routes.file_routes import file_bp

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

app.register_blueprint(file_bp)

@app.route('/')
def home():
    return jsonify({"message": "Bienvenido al Debugger de Stored Procedures"})

if __name__ == '__main__':
    app.run(port=5006, debug=True)