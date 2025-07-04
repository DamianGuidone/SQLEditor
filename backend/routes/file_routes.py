import os
from flask import Blueprint, request, jsonify

file_bp = Blueprint('file', 'file')

@file_bp.route('/list_sql_files', methods=['POST'])
def list_sql_files():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se proporcionaron datos JSON"}), 400
            
        path = data.get('path', '~')  # Valor por defecto vacío si no se proporciona
        
        # Si no se especifica path, usar el directorio home del usuario
        if not path:
            path = os.path.expanduser('~')  # Esto devuelve el directorio home del usuario
            
        if path == '~':
            path = 'D:\\Damian\\ProyectoPuebasDGUIDONE\\Empresas'
            
        # Normalizar la ruta para Windows/Linux
        path = os.path.normpath(path)
        
        
        if not os.path.isdir(path):
            return jsonify({"error": f"Ruta inválida: {path}"}), 400

        files = []
        for root, _, filenames in os.walk(path):
            for filename in filenames:
                if filename.endswith('.sql'):
                    full_path = os.path.join(root, filename)
                    files.append({
                        "name": filename,
                        "path": full_path.replace('\\', '/'),  # Normalizar para respuesta
                        "relative": os.path.relpath(full_path, path).replace('\\', '/')
                    })
        
        return jsonify({
            "files": files,
            "current_path": path  # Devolver también el path usado para referencia
        })
        
    except Exception as e:
        return jsonify({
            "error": "Error en el servidor",
            "details": str(e)
        }), 500

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
    
    
    from flask import Flask, request, jsonify
import os

UPLOAD_FOLDER = 'uploads'
file_bp.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@file_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'files' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    files = request.files.getlist('files')
    for file in files:
        if file.filename == '':
            continue
        file.save(os.path.join(file_bp.config['UPLOAD_FOLDER'], file.filename))
    
    return jsonify({'message': 'Files uploaded successfully'}), 200

@file_bp.route('/files', methods=['GET'])
def list_files():
    files = []
    for filename in os.listdir(file_bp.config['UPLOAD_FOLDER']):
        path = os.path.join(file_bp.config['UPLOAD_FOLDER'], filename)
        if os.path.isfile(path):
            files.append({
                'name': filename,
                'size': os.path.getsize(path)
            })
    return jsonify(files)