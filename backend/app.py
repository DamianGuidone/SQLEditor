from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Bienvenido al Debugger de Stored Procedures"})

if __name__ == '__main__':
    app.run(port=5006, debug=True)