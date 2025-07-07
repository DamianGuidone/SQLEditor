import os
from flask import Blueprint, request, jsonify
import tkinter as tk
import shutil
from tkinter import filedialog

file_bp = Blueprint('file', 'file')
BASE_DIR = 'D:/Damian/ProyectoPuebasDGUIDONE/Empresas'
# Configuración de rutas permitidas
ALLOWED_BASE_PATHS = {
    'projects': 'D:/Damian/ProyectoPuebasDGUIDONE/Empresas',
    'shared': 'D:/Damian/ProyectoPuebasDGUIDONE/Empresas',
    'uploads': 'D:/Damian/ProyectoPuebasDGUIDONE/Empresas'
}


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

    
@file_bp.route('/api/files', methods=['GET'])
def get_files():
    path = request.args.get('path', '')
    full_path = os.path.join(BASE_DIR, path)
    
    if not os.path.exists(full_path):
        return jsonify({'error': 'Directory not found'}), 404
    
    try:
        items = []
        for item in os.listdir(full_path):
            item_path = os.path.join(full_path, item)
            items.append({
                'name': item,
                'path': os.path.relpath(item_path, BASE_DIR),
                'isDirectory': os.path.isdir(item_path),
                'type': 'sql' if item.endswith('.sql') else 'sqlg' if item.endswith('.sqlg') else None
            })
        return jsonify({'files': items, 'currentPath': path})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_bp.route('/api/operations', methods=['POST'])
def handle_operations():
    data = request.json
    operation = data.get('operation')
    path = data.get('path')
    new_name = data.get('new_name')
    
    try:
        full_path = os.path.join(BASE_DIR, path)
        
        if operation == 'delete':
            if os.path.isdir(full_path):
                shutil.rmtree(full_path)
            else:
                os.remove(full_path)
        elif operation == 'rename':
            new_path = os.path.join(os.path.dirname(full_path), new_name)
            os.rename(full_path, new_path)
        elif operation == 'create_dir':
            os.makedirs(full_path, exist_ok=True)
        elif operation == 'create_file':
            with open(full_path, 'w') as f:
                f.write('')
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_bp.route('/api/select-directory', methods=['GET'])
def select_directory():
    # Esto sería para administradores configurar el BASE_DIR
    # En producción usaría autenticación aquí
    return jsonify({
        'available_directories': ['/projects', '/shared', '/user-uploads']
    })


@file_bp.route('/api/directories', methods=['GET'])
def list_root_directories():
    print("Solicitud de directorios raíz recibida")
    try:
        # Estructura consistente con axios/React expectations
        return jsonify({
            'data': {
                'directories': list(ALLOWED_BASE_PATHS.keys())
            }
        })
    except Exception as e:
        print("Error en list_root_directories:", str(e))
        return jsonify({
            'error': str(e)
        }), 500

@file_bp.route('/api/directories/<base_path>', methods=['GET'])
def list_subdirectories(base_path):
    if base_path not in ALLOWED_BASE_PATHS:
        return jsonify({'error': 'Base path not allowed'}), 400
    
    path = request.args.get('path', '')
    full_path = os.path.join(ALLOWED_BASE_PATHS[base_path], path)
    
    try:
        items = [{
            'name': d,
            'path': os.path.join(path, d),
            'isDirectory': True
        } for d in os.listdir(full_path) if os.path.isdir(os.path.join(full_path, d))]
        
        return jsonify({'directories': items})
    except Exception as e:
        return jsonify({'error': str(e)}), 500