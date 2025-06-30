import os
from flask import Blueprint, request, jsonify

file_bp = Blueprint('file', 'file')

@file_bp.route('/list_sql_files', methods=['POST'])
def list_sql_files():
    data = request.json
    path = data.get('path')

    if not path or not os.path.isdir(path):
        return jsonify({"error": "Ruta inválida"}), 400

    try:
        files = []
        for root, _, filenames in os.walk(path):
            for filename in filenames:
                if filename.endswith('.sql'):
                    files.append({
                        "name": filename,
                        "path": os.path.join(root, filename),
                        "relative": os.path.relpath(os.path.join(root, filename), path)
                    })
        return jsonify(files)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@file_bp.route('/save_sql_file', methods=['POST'])
def save_sql_file():
    data = request.json
    file_path = data.get('path')
    content = data.get('content')

    if not file_path or not content:
        return jsonify({"error": "Datos incompletos"}), 400

    try:
        with open(file_path, 'w') as f:
            f.write(content)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@file_bp.route('/get_sql_file', methods=['POST'])
def get_sql_file():
    data = request.json
    file_path = data.get('path')

    if not file_path or not os.path.isfile(file_path):
        return jsonify({"error": "Archivo no encontrado"}), 400

    try:
        with open(file_path, 'r') as f:
            content = f.read()
        return jsonify({ "content": content })
    except Exception as e:
        return jsonify({"error": str(e)}), 500